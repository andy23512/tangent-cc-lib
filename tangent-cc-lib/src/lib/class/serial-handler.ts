import { EventEmitter2 } from 'eventemitter2';
import {
  concatMap,
  filter,
  firstValueFrom,
  from,
  map,
  Observable,
  Subject,
  tap,
  toArray,
} from 'rxjs';
import * as semver from 'semver';
import { Chord, ChordInNumberListForm } from '../model/chord.models.js';
import {
  DeviceLayout,
  Layer,
  Profile,
  ProfileLayoutMap,
} from '../model/device-layout.models.js';
import { SerialLoadStatus } from '../tangent-cc-lib.js';
import {
  SerialCommand,
  SerialCommandArgMap,
} from '../type/serial-command.type.js';
import { convertChordInNumberListFormToChord } from '../util/chord.utils.js';
import { parseChordActions, parsePhrase } from '../util/raw-chord.utils.js';
import { LineBreakTransformer } from './line-break-transformer.js';
import {
  SerialPortHandler,
  type SupportedSerialPort,
} from './serial-port-handler.js';

const KEY_COUNTS: Record<string, number> = {
  ONE: 90,
  TWO: 90,
  LITE: 67,
  X: 256,
  ENGINE: 256,
  M4G: 90,
  M4GR: 90,
  T4G: 7,
  CCB: 7,
  ZERO: 256,
};

export class SerialHandler extends EventEmitter2 {
  private port!: SupportedSerialPort;
  private readonly webSerialDataSubject = new Subject<string>();
  private readonly webSerialData$ = this.webSerialDataSubject.asObservable();
  private writer!: WritableStreamDefaultWriter<string>;
  private reader!: ReadableStreamDefaultReader<string>;
  private readableStreamClosed!: Promise<void>;
  private writableStreamClosed!: Promise<void>;
  public version!: string | null;
  public id!: string | null;
  public device!: string | null;
  public chipset!: string | null;
  public keyCount!: number | null;
  public profileCount!: number | null;
  public layerCount!: number | null;

  constructor(private readonly serialPortHandler: SerialPortHandler) {
    super();
  }

  public async connect() {
    this.port = await this.serialPortHandler.getPort();
    await this.port.open({ baudRate: 115200 });
    const textEncoder = new TextEncoderStream();
    if (!this.port.writable) {
      throw new Error('Port is not writable');
    }

    this.writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    this.writer = textEncoder.writable.getWriter();

    this.startReadLoop();

    const version = await this.send(SerialCommand.Version);
    const id = await this.send(SerialCommand.Id);
    this.version = version;
    this.id = id;
    this.device = this.id.split(' ')[1];
    this.chipset = this.id.split(' ')[2];
    this.keyCount = KEY_COUNTS[this.device];
    this.profileCount =
      semver.gte(this.version, '2.2.0-beta.4') && this.chipset !== 'M0' ? 3 : 1;
    this.layerCount =
      semver.gte(this.version, '2.2.0-beta.20') && this.chipset !== 'M0'
        ? 4
        : 3;
    return { version, id };
  }

  public loadProfileLayoutMap(): Observable<
    SerialLoadStatus & { profileLayoutMap?: ProfileLayoutMap }
  > {
    return new Observable((observer) => {
      const layerCount = this.layerCount;
      const profileCount = this.profileCount;
      const keyCount = this.keyCount;
      if (!layerCount || !profileCount || !keyCount) {
        throw new Error('Either layerCount or profileCount not defined.');
      }
      const total = keyCount * profileCount * layerCount;
      const result = {
        complete: false,
        loaded: 0,
        total,
      };
      observer.next(result);
      from([Profile.A, Profile.B, Profile.C].slice(0, profileCount))
        .pipe(
          concatMap(
            (profile) =>
              from(
                [
                  Layer.Primary,
                  Layer.Secondary,
                  Layer.Tertiary,
                  Layer.Quaternary,
                ].slice(0, layerCount),
              ).pipe(
                concatMap(
                  (layer) =>
                    from(Array.from({ length: keyCount }, (_, i) => i)).pipe(
                      concatMap((keyIndex) =>
                        from(
                          this.send(
                            SerialCommand.GetKeyMap,
                            profile + layer,
                            keyIndex,
                          ),
                        ).pipe(
                          map((data) => Number.parseInt(data, 10)),
                          tap(() => {
                            result.loaded++;
                            observer.next({ ...result });
                          }),
                        ),
                      ),
                      toArray(),
                    ) as Observable<DeviceLayout['layout'][number]>,
                ),
                toArray(),
                map((layout) => [profile, layout]),
              ) as Observable<[Profile, DeviceLayout['layout']]>,
          ),
          toArray(),
          map((d) => Object.fromEntries(d)),
        )
        .subscribe((profileLayoutMap) => {
          result.complete = true;
          observer.next({ ...result, profileLayoutMap });
          observer.complete();
        });
    });
  }

  public loadChords(): Observable<
    SerialLoadStatus & {
      chords?: Chord[];
    }
  > {
    return new Observable((observer) => {
      (async () => {
        const chordNumber = +(await this.send(SerialCommand.GetChordMapCount));
        const result = {
          complete: false,
          loaded: 0,
          total: chordNumber,
        };
        observer.next(result);
        const indices = Array.from({ length: chordNumber }).map((_, i) => i);
        from(indices)
          .pipe(
            concatMap((i) =>
              from(this.send(SerialCommand.GetChordMapByIndex, i)).pipe(
                map((r) => {
                  const [chordActions, phrase] = r.split(' ');
                  const chordInNumberListForm: ChordInNumberListForm = [
                    parseChordActions(chordActions),
                    parsePhrase(phrase),
                  ];
                  return convertChordInNumberListFormToChord(
                    chordInNumberListForm,
                  );
                }),
              ),
            ),
            tap(() => {
              result.loaded++;
              observer.next({ ...result });
            }),
            toArray(),
          )
          .subscribe((chords) => {
            result.complete = true;
            observer.next({ ...result, chords });
            observer.complete();
          });
      })();
    });
  }

  public batchSend(
    dataList: string[],
  ): Observable<{ complete: boolean; sent: number; total: number }> {
    const result = {
      complete: false,
      sent: 0,
      total: dataList.length,
    };
    return new Observable((observer) => {
      from(dataList)
        .pipe(
          concatMap((data) => from(this.sendData(data))),
          tap(() => {
            result.sent++;
            observer.next(result);
          }),
          toArray(),
        )
        .subscribe(() => {
          result.complete = true;
          observer.next(result);
          observer.complete();
        });
    });
  }

  public async send<T extends SerialCommand>(
    command: T,
    ...args: SerialCommandArgMap[T]
  ) {
    const data = args ? [command, ...args].join(' ') : command;
    return this.sendData(data);
  }

  private async sendData(data: string) {
    await this.writer.write(data + '\r\n');
    this.emit('sendSerialData', data);
    return firstValueFrom(
      this.webSerialData$.pipe(
        filter((d) => d.startsWith(data)),
        tap((d) => this.emit('receiveSerialData', d)),
        map((d) => d.substring(data.length + 1).trim()),
      ),
    );
  }

  public async disconnect() {
    this.reader.cancel();
    await this.readableStreamClosed.catch(() => {
      /* empty */
    });
    this.writer.close();
    await this.writableStreamClosed;
    await this.port.close();
    this.id = null;
    this.version = null;
  }

  private async startReadLoop() {
    while (this.port.readable) {
      const textDecoder = new TextDecoderStream();
      if (this.port.readable.locked) {
        break;
      }
      this.readableStreamClosed = this.port.readable.pipeTo(
        textDecoder.writable as unknown as WritableStream<
          Uint8Array<ArrayBufferLike>
        >,
      );
      this.reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer('\n')))
        .getReader();
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          this.reader.releaseLock();
          break;
        }
        if (value) {
          this.webSerialDataSubject.next(value.trim());
        }
      }
    }
  }
}
