import {
  concatMap,
  filter,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  Observable,
  Subject,
  tap,
  toArray,
} from 'rxjs';
import {
  Chord,
  ChordInNumberListForm,
  ChordLibraryLoadStatus,
} from '../model/chord.models.js';
import { DeviceLayout, Layer } from '../model/device-layout.models.js';
import {
  SerialCommand,
  SerialCommandArgMap,
} from '../type/serial-command.type.js';
import { convertChordInNumberListFormToChord } from '../util/chord.utils.js';
import { parseChordActions, parsePhrase } from '../util/raw-chord.utils.js';
import { LineBreakTransformer } from './line-break-transformer.js';
import { SerialPortHandler } from './serial-port-handler.js';

export class SerialHandler {
  private port!: SerialPort;
  private readonly webSerialDataSubject = new Subject<string>();
  private readonly webSerialData$ = this.webSerialDataSubject.asObservable();
  private writer!: WritableStreamDefaultWriter<string>;
  private reader!: ReadableStreamDefaultReader<string>;
  private readableStreamClosed!: Promise<void>;
  private writableStreamClosed!: Promise<void>;
  public version: string | null = null;
  public id: string | null = null;

  constructor(private readonly serialPortHandler: SerialPortHandler) {}

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
    return { version, id };
  }

  public async loadLayout(): Promise<DeviceLayout['layout']> {
    if (!this.id) {
      throw new Error('Device ID is not available');
    }
    const device = this.id.split(' ')[1];
    const keyCount = device === 'LITE' || device === 'X' ? 67 : 90;
    const layout = await lastValueFrom(
      from([
        Layer.Primary,
        Layer.Secondary,
        Layer.Tertiary,
        Layer.Quaternary,
      ]).pipe(
        concatMap(
          (layer) =>
            from(Array.from({ length: keyCount }, (_, i) => i)).pipe(
              concatMap((keyIndex) =>
                from(this.send(SerialCommand.GetKeyMap, layer, keyIndex)).pipe(
                  map((data) => Number.parseInt(data, 10)),
                ),
              ),
              toArray(),
            ) as Observable<DeviceLayout['layout'][number]>,
        ),
        toArray(),
      ) as Observable<DeviceLayout['layout']>,
    );
    if (layout[3]?.every((action) => action === 0)) {
      return layout.slice(0, 3) as DeviceLayout['layout'];
    }
    return layout;
  }

  public loadChords(): Observable<
    ChordLibraryLoadStatus & {
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
              observer.next(result);
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
    return firstValueFrom(
      this.webSerialData$.pipe(
        filter((d) => d.startsWith(data)),
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
