import { firstValueFrom, lastValueFrom, toArray } from 'rxjs';
import { Chord } from '../model/chord.models.js';
import { SerialLoadStatus } from '../model/serial-load-status.models.js';
import { SerialCommand } from '../type/serial-command.type.js';
import { convertChordInNumberListFormToChord } from '../util/chord.utils.js';
import { parseChordActions, parsePhrase } from '../util/raw-chord.utils.js';
import { SerialHandler } from './serial-handler.js';
import type { SerialPortHandler, SupportedSerialPort } from './serial-port-handler.js';

type Respond = (line: string) => string[] | undefined;

interface FakeDeviceOptions {
  version?: string;
  id?: string;
  keyValue?: (profileAndLayer: string, keyIndex: number) => string;
  chords?: string[];
  /** Runs first; return lines to answer a request in a special way. */
  respond?: Respond;
  writable?: boolean;
}

/**
 * An in-memory serial port with a device behind it. It speaks the same line protocol as the
 * firmware: each request line is answered by a line that starts with the request.
 */
function createFakeDevice(options: FakeDeviceOptions = {}) {
  const {
    version = '2.2.0',
    id = 'CHARACHORDER TWO S3',
    keyValue = (_profileAndLayer, keyIndex) => String(keyIndex),
    chords = [],
    respond,
    writable = true,
  } = options;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const requests: string[] = [];
  const openCalls: unknown[] = [];
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  let open = false;
  let cancelled = false;
  let readableStream: ReadableStream<Uint8Array> | null = null;
  let writableStream: WritableStream<Uint8Array> | null = null;
  let pending = '';
  let writableClosed = false;

  function emit(text: string) {
    if (cancelled) return;
    try {
      controller?.enqueue(encoder.encode(text));
    } catch {
      /* the stream was closed by the handler */
    }
  }

  function answer(line: string): string[] | undefined {
    const custom = respond?.(line);
    if (custom) return custom;
    if (line === 'VERSION') return [`VERSION ${version}`];
    if (line === 'ID') return [`ID ${id}`];
    if (line === 'CML C0') return [`CML C0 ${chords.length}`];
    const chord = /^CML C1 (\d+)$/.exec(line);
    if (chord) return [`CML C1 ${chord[1]} ${chords[Number(chord[1])]}`];
    const key = /^VAR B3 (\S+) (\d+)$/.exec(line);
    if (key) return [`VAR B3 ${key[1]} ${key[2]} ${keyValue(key[1], Number(key[2]))}`];
    return undefined;
  }

  const port = {
    open: vi.fn(async (opts: unknown) => {
      openCalls.push(opts);
      open = true;
      cancelled = false;
      readableStream = new ReadableStream<Uint8Array>({
        start: (c) => {
          controller = c;
        },
        cancel: () => {
          cancelled = true;
        },
      });
      writableStream = new WritableStream<Uint8Array>({
        write: (chunk) => {
          pending += decoder.decode(chunk, { stream: true });
          const lines = pending.split('\r\n');
          pending = lines.pop() as string;
          for (const line of lines) {
            requests.push(line);
            const reply = answer(line);
            if (reply) setTimeout(() => emit(reply.map((r) => r + '\r\n').join('')), 0);
          }
        },
        close: () => {
          writableClosed = true;
        },
      });
    }),
    close: vi.fn(async () => {
      open = false;
      readableStream = null;
      writableStream = null;
    }),
    getInfo: () => ({}),
    get readable() {
      return open ? readableStream : null;
    },
    get writable() {
      return open && writable ? writableStream : null;
    },
  };

  const portHandler = { getPort: vi.fn(async () => port as unknown as SupportedSerialPort) } as unknown as SerialPortHandler;
  return {
    port,
    portHandler,
    requests,
    openCalls,
    emit,
    get writableClosed() {
      return writableClosed;
    },
    get cancelled() {
      return cancelled;
    },
  };
}

const handlers: SerialHandler[] = [];
async function connected(options: FakeDeviceOptions = {}) {
  const device = createFakeDevice(options);
  const handler = new SerialHandler(device.portHandler);
  handlers.push(handler);
  await handler.connect();
  return { device, handler };
}

afterEach(async () => {
  for (const handler of handlers.splice(0)) {
    // disconnect() clears the id; calling it a second time would leave unhandled rejections behind.
    if (handler.id) await handler.disconnect();
  }
});

/** Collect every status an Observable emits, copying each so later changes to a shared object do not show. */
async function collect<T extends object>(source: import('rxjs').Observable<T>): Promise<T[]> {
  const all: T[] = [];
  await new Promise<void>((resolve, reject) =>
    source.subscribe({ next: (v) => all.push({ ...v }), error: reject, complete: resolve }),
  );
  return all;
}

describe('SerialHandler.connect', () => {
  it('asks the handler for a port and opens it at 115200 baud', async () => {
    const { device } = await connected();
    expect(device.portHandler.getPort).toHaveBeenCalledTimes(1);
    expect(device.openCalls).toEqual([{ baudRate: 115200 }]);
  });

  it('asks for the version first and then the id', async () => {
    const { device } = await connected();
    expect(device.requests).toEqual(['VERSION', 'ID']);
  });

  it('returns and stores the version and id the device answered', async () => {
    const device = createFakeDevice({ version: '2.2.0', id: 'CHARACHORDER TWO S3' });
    const handler = new SerialHandler(device.portHandler);
    handlers.push(handler);
    expect(await handler.connect()).toEqual({ version: '2.2.0', id: 'CHARACHORDER TWO S3' });
    expect(handler.version).toBe('2.2.0');
    expect(handler.id).toBe('CHARACHORDER TWO S3');
  });

  it('takes the device name and chipset from the second and third word of the id', async () => {
    const { handler } = await connected({ id: 'CHARACHORDER LITE S2' });
    expect(handler.device).toBe('LITE');
    expect(handler.chipset).toBe('S2');
  });

  it.each([
    ['ONE', 90],
    ['TWO', 90],
    ['LITE', 67],
    ['X', 256],
    ['ENGINE', 256],
    ['M4G', 90],
    ['M4GR', 90],
    ['T4G', 7],
    ['CCB', 7],
    ['ZERO', 256],
  ])('knows that %s has %i keys', async (device, count) => {
    const { handler } = await connected({ id: `CHARACHORDER ${device} S3` });
    expect(handler.keyCount).toBe(count);
  });

  it('leaves the key count undefined for a device it does not know', async () => {
    const { handler } = await connected({ id: 'CHARACHORDER MYSTERY S3' });
    expect(handler.keyCount).toBeUndefined();
  });

  it.each([
    ['2.1.9', 'S3', 1, 3],
    ['2.2.0-beta.3', 'S3', 1, 3],
    ['2.2.0-beta.4', 'S3', 3, 3],
    ['2.2.0-beta.19', 'S3', 3, 3],
    ['2.2.0-beta.20', 'S3', 3, 4],
    ['2.2.0', 'S3', 3, 4],
    ['3.0.0', 'S2', 3, 4],
    ['2.2.0', 'M0', 1, 3],
    ['3.0.0', 'M0', 1, 3],
  ])('with firmware %s on chipset %s has %i profile(s) and %i layers', async (version, chipset, profiles, layers) => {
    const { handler } = await connected({ version, id: `CHARACHORDER TWO ${chipset}` });
    expect(handler.profileCount).toBe(profiles);
    expect(handler.layerCount).toBe(layers);
  });

  it('fails when the port has nothing to write to, before sending anything', async () => {
    const device = createFakeDevice({ writable: false });
    const handler = new SerialHandler(device.portHandler);
    await expect(handler.connect()).rejects.toThrow('Port is not writable');
    expect(device.requests).toEqual([]);
  });

  it('fails when the firmware version is not a version number', async () => {
    const device = createFakeDevice({ version: 'not-a-version' });
    const handler = new SerialHandler(device.portHandler);
    await expect(handler.connect()).rejects.toThrow();
  });

  it('tells listeners what was sent and what came back, in order', async () => {
    const device = createFakeDevice();
    const handler = new SerialHandler(device.portHandler);
    handlers.push(handler);
    const log: string[] = [];
    handler.on('sendSerialData', (d: string) => log.push(`send ${d}`));
    handler.on('receiveSerialData', (d: string) => log.push(`receive ${d}`));
    await handler.connect();
    expect(log).toEqual(['send VERSION', 'receive VERSION 2.2.0', 'send ID', 'receive ID CHARACHORDER TWO S3']);
  });
});

describe('SerialHandler.send', () => {
  it('writes the command and its arguments on one line ending in CR LF', async () => {
    const { device, handler } = await connected({ id: 'CHARACHORDER T4G S3' });
    await handler.send(SerialCommand.GetKeyMap, 'A1', 5);
    expect(device.requests.at(-1)).toBe('VAR B3 A1 5');
  });

  it('writes a command without arguments as it is', async () => {
    const { device, handler } = await connected();
    await handler.send(SerialCommand.GetChordMapCount);
    expect(device.requests.at(-1)).toBe('CML C0');
  });

  it('gives back the answer without the echoed request, trimmed', async () => {
    const { handler } = await connected({ chords: ['AAAA BBBB'] });
    expect(await handler.send(SerialCommand.GetChordMapByIndex, 0)).toBe('AAAA BBBB');
    expect(await handler.send(SerialCommand.GetChordMapCount)).toBe('1');
  });

  it('skips lines that are not the answer', async () => {
    const { handler } = await connected({
      respond: (line) => (line === 'CML C0' ? ['LOG something happened', 'DEBUG 123', 'CML C0 7'] : undefined),
    });
    expect(await handler.send(SerialCommand.GetChordMapCount)).toBe('7');
  });

  it('puts together an answer that arrives in pieces', async () => {
    const { device, handler } = await connected({ respond: (line) => (line === 'CML C0' ? [] : undefined) });
    const pending = handler.send(SerialCommand.GetChordMapCount);
    await new Promise((r) => setTimeout(r, 5));
    device.emit('CML ');
    await new Promise((r) => setTimeout(r, 5));
    device.emit('C0 4');
    await new Promise((r) => setTimeout(r, 5));
    device.emit('2\r\n');
    expect(await pending).toBe('42');
  });

  it('reads several lines that arrive together', async () => {
    const { handler } = await connected({
      respond: (line) => (line === 'CML C0' ? ['NOISE 1', 'NOISE 2', 'CML C0 3'] : undefined),
    });
    expect(await handler.send(SerialCommand.GetChordMapCount)).toBe('3');
  });

  it('ignores blank lines', async () => {
    const { handler } = await connected({
      respond: (line) => (line === 'CML C0' ? ['', '   ', 'CML C0 9'] : undefined),
    });
    expect(await handler.send(SerialCommand.GetChordMapCount)).toBe('9');
  });

  it('reports the answer line it took to listeners, and only that line', async () => {
    const { device, handler } = await connected({
      respond: (line) => (line === 'CML C0' ? ['NOISE', 'CML C0 5'] : undefined),
    });
    const received: string[] = [];
    handler.on('receiveSerialData', (d: string) => received.push(d));
    await handler.send(SerialCommand.GetChordMapCount);
    expect(received).toEqual(['CML C0 5']);
    expect(device.requests.at(-1)).toBe('CML C0');
  });

  it('answers several requests one after another', async () => {
    const { handler } = await connected({ chords: ['A1 B1', 'A2 B2'] });
    const first = await handler.send(SerialCommand.GetChordMapByIndex, 0);
    const second = await handler.send(SerialCommand.GetChordMapByIndex, 1);
    expect([first, second]).toEqual(['A1 B1', 'A2 B2']);
  });

  // The match is "starts with the request", so for request "CML C1 1" an answer to "CML C1 10" would be taken
  // too if it came first. Requests are sent one at a time, so the right answer normally comes first.
  it('takes any line that starts with the request as its answer (current behaviour)', async () => {
    const { handler } = await connected({
      respond: (line) => (line === 'CML C1 1' ? ['CML C1 10 WRONG ANSWER', 'CML C1 1 RIGHT ANSWER'] : undefined),
    });
    expect(await handler.send(SerialCommand.GetChordMapByIndex, 1)).toBe('WRONG ANSWER');
  });
});

describe('SerialHandler.loadProfileLayoutMap', () => {
  const T4G_M0 = { id: 'CHARACHORDER T4G M0', version: '2.2.0' } as const; // 7 keys, 1 profile, 3 layers
  const T4G_S3 = { id: 'CHARACHORDER T4G S3', version: '2.2.0' } as const; // 7 keys, 3 profiles, 4 layers

  it('reports a start of 0 loaded out of keys x profiles x layers', async () => {
    const { handler } = await connected(T4G_M0);
    const [first] = await collect(handler.loadProfileLayoutMap());
    expect(first).toEqual({ complete: false, loaded: 0, total: 21 });
  });

  it('counts every key it reads, then finishes with the whole map', async () => {
    const { handler } = await connected({ ...T4G_M0, keyValue: (pl, i) => `${Number(pl.slice(1)) * 100 + i}` });
    const all = await collect(handler.loadProfileLayoutMap());
    expect(all).toHaveLength(21 + 2);
    expect(all.slice(0, 22).map((s) => s.loaded)).toEqual(Array.from({ length: 22 }, (_, i) => (i === 0 ? 0 : i)));
    const last = all.at(-1) as SerialLoadStatus & { profileLayoutMap?: Record<string, number[][]> };
    expect(last.complete).toBe(true);
    expect(last.loaded).toBe(21);
    expect(last.total).toBe(21);
    expect(last.profileLayoutMap).toEqual({
      A: [
        [100, 101, 102, 103, 104, 105, 106],
        [200, 201, 202, 203, 204, 205, 206],
        [300, 301, 302, 303, 304, 305, 306],
      ],
    });
  });

  it('is not complete until the last key was read', async () => {
    const { handler } = await connected(T4G_M0);
    const all = await collect(handler.loadProfileLayoutMap());
    expect(all.slice(0, -1).every((s) => s.complete === false)).toBe(true);
    expect(all.slice(0, -1).every((s) => !('profileLayoutMap' in s))).toBe(true);
  });

  it('asks for each key in order: profile, then layer, then key', async () => {
    const { device, handler } = await connected(T4G_M0);
    const before = device.requests.length;
    await collect(handler.loadProfileLayoutMap());
    const asked = device.requests.slice(before);
    expect(asked).toHaveLength(21);
    expect(asked.slice(0, 3)).toEqual(['VAR B3 A1 0', 'VAR B3 A1 1', 'VAR B3 A1 2']);
    expect(asked[7]).toBe('VAR B3 A2 0');
    expect(asked[14]).toBe('VAR B3 A3 0');
    expect(asked.at(-1)).toBe('VAR B3 A3 6');
  });

  it('reads three profiles of four layers on newer firmware and chipsets', async () => {
    const { device, handler } = await connected(T4G_S3);
    const before = device.requests.length;
    const all = await collect(handler.loadProfileLayoutMap());
    expect(all[0].total).toBe(7 * 3 * 4);
    const map = (all.at(-1) as { profileLayoutMap?: Record<string, number[][]> }).profileLayoutMap!;
    expect(Object.keys(map)).toEqual(['A', 'B', 'C']);
    for (const profile of ['A', 'B', 'C']) {
      expect(map[profile]).toHaveLength(4);
      map[profile].forEach((layer) => expect(layer).toHaveLength(7));
    }
    const asked = device.requests.slice(before);
    expect(asked[0]).toBe('VAR B3 A1 0');
    expect(asked[28]).toBe('VAR B3 B1 0'); // 4 layers x 7 keys later
    expect(asked[56]).toBe('VAR B3 C1 0');
    expect(asked.at(-1)).toBe('VAR B3 C4 6');
  });

  it('reads each key as a base-10 number', async () => {
    const { handler } = await connected({ ...T4G_M0, keyValue: () => '0042' });
    const all = await collect(handler.loadProfileLayoutMap());
    const map = (all.at(-1) as { profileLayoutMap?: Record<string, number[][]> }).profileLayoutMap!;
    expect(map.A[0][0]).toBe(42);
  });

  it('keeps zero as a value', async () => {
    const { handler } = await connected({ ...T4G_M0, keyValue: () => '0' });
    const map = ((await collect(handler.loadProfileLayoutMap())).at(-1) as { profileLayoutMap?: Record<string, number[][]> }).profileLayoutMap!;
    expect(map.A[1][3]).toBe(0);
  });

  it('fails when it is not connected yet', async () => {
    const handler = new SerialHandler(createFakeDevice().portHandler);
    await expect(firstValueFrom(handler.loadProfileLayoutMap())).rejects.toThrow('Either layerCount or profileCount not defined.');
  });

  it('fails when the device is one whose key count it does not know', async () => {
    const { handler } = await connected({ id: 'CHARACHORDER MYSTERY S3' });
    await expect(firstValueFrom(handler.loadProfileLayoutMap())).rejects.toThrow('Either layerCount or profileCount not defined.');
  });
});

describe('SerialHandler.loadChords', () => {
  const CHORDS = ['001C86C0000000000000000000000000 022E6C696231023E', '001C861000000000000000002068836F 61726D'];

  it('reads the chord count first, then every chord', async () => {
    const { device, handler } = await connected({ chords: CHORDS });
    const before = device.requests.length;
    await collect(handler.loadChords());
    expect(device.requests.slice(before)).toEqual(['CML C0', 'CML C1 0', 'CML C1 1']);
  });

  it('reports 0 of the chord count at the start', async () => {
    const { handler } = await connected({ chords: CHORDS });
    const [first] = await collect(handler.loadChords());
    expect(first).toEqual({ complete: false, loaded: 0, total: 2 });
  });

  it('counts each chord and ends with all of them, converted', async () => {
    const { handler } = await connected({ chords: CHORDS });
    const all = await collect(handler.loadChords());
    expect(all.map((s) => [s.complete, s.loaded])).toEqual([
      [false, 0],
      [false, 1],
      [false, 2],
      [true, 2],
    ]);
    const expected: Chord[] = CHORDS.map((c) => {
      const [actions, phrase] = c.split(' ');
      return convertChordInNumberListFormToChord([parseChordActions(actions), parsePhrase(phrase)]);
    });
    expect((all.at(-1) as { chords?: Chord[] }).chords).toEqual(expected);
  });

  it('finishes straight away when the device has no chords', async () => {
    const { device, handler } = await connected({ chords: [] });
    const before = device.requests.length;
    const all = await collect(handler.loadChords());
    expect(all).toEqual([
      { complete: false, loaded: 0, total: 0 },
      { complete: true, loaded: 0, total: 0, chords: [] },
    ]);
    expect(device.requests.slice(before)).toEqual(['CML C0']);
  });

  it('keeps the chords in the order the device lists them', async () => {
    const { handler } = await connected({ chords: [...CHORDS].reverse() });
    const chords = ((await collect(handler.loadChords())).at(-1) as { chords?: Chord[] }).chords!;
    expect(chords.map((c) => c.output)).toEqual([[97, 114, 109], [558, 108, 105, 98, 49, 574]]);
  });
});

describe('SerialHandler.batchSend', () => {
  /** Answers every line after the handshake with the line and an OK. */
  const echo: Respond = (line) => (line === 'VERSION' || line === 'ID' ? undefined : [`${line} OK`]);

  it('sends the lines as they are, one after another', async () => {
    const { device, handler } = await connected({ respond: echo });
    const before = device.requests.length;
    await collect(handler.batchSend(['CML C2 AAA BBB', 'VAR B2 A1 5 4']));
    expect(device.requests.slice(before)).toEqual(['CML C2 AAA BBB', 'VAR B2 A1 5 4']);
  });

  it('counts each line sent and ends complete', async () => {
    const { handler } = await connected({ respond: echo });
    const all = await collect(handler.batchSend(['A', 'B', 'C']));
    expect(all.map((s) => [s.complete, s.sent, s.total])).toEqual([
      [false, 1, 3],
      [false, 2, 3],
      [false, 3, 3],
      [true, 3, 3],
    ]);
  });

  it('completes at once for an empty list', async () => {
    const { handler } = await connected({ respond: echo });
    expect(await collect(handler.batchSend([]))).toEqual([{ complete: true, sent: 0, total: 0 }]);
  });

  it('waits for each answer before sending the next line', async () => {
    const order: string[] = [];
    const { device, handler } = await connected({
      respond: (line) => {
        if (line === 'VERSION' || line === 'ID') return undefined;
        order.push(`got ${line}`);
        return [`${line} OK`];
      },
    });
    const before = device.requests.length;
    await collect(handler.batchSend(['A', 'B']));
    expect(order.slice(-2)).toEqual(['got A', 'got B']);
    expect(device.requests.slice(before)).toEqual(['A', 'B']);
  });

  it('reports each line to listeners as it goes', async () => {
    const { handler } = await connected({ respond: echo });
    const sent: string[] = [];
    handler.on('sendSerialData', (d: string) => sent.push(d));
    await collect(handler.batchSend(['X', 'Y']));
    expect(sent).toEqual(['X', 'Y']);
  });

  // The same status object is handed out each time and updated in place, so a consumer that keeps the
  // emissions sees only the final state in all of them.
  it('hands out one shared status object that changes over time (current behaviour)', async () => {
    const { handler } = await connected({ respond: echo });
    const kept = await lastValueFrom(handler.batchSend(['A', 'B']).pipe(toArray()));
    expect(kept).toHaveLength(3);
    expect(kept[0]).toBe(kept[2]);
    expect(kept[0]).toEqual({ complete: true, sent: 2, total: 2 });
  });
});

describe('SerialHandler.disconnect', () => {
  it('stops reading, closes the write side and the port, and forgets the id and version', async () => {
    const { device, handler } = await connected();
    await handler.disconnect();
    expect(device.cancelled).toBe(true);
    expect(device.writableClosed).toBe(true);
    expect(device.port.close).toHaveBeenCalledTimes(1);
    expect(handler.id).toBeNull();
    expect(handler.version).toBeNull();
  });

  // Current behaviour: only the id and version are cleared.
  it('keeps the device, chipset and counts from the last connection', async () => {
    const { handler } = await connected({ id: 'CHARACHORDER T4G S3' });
    await handler.disconnect();
    expect([handler.device, handler.chipset, handler.keyCount, handler.profileCount, handler.layerCount]).toEqual(['T4G', 'S3', 7, 3, 4]);
  });
});
