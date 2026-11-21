import { compressActions, decompressActions } from './chord-action.utils.js';

/** Small seeded generator, so the property tests are the same on every run. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('compressActions', () => {
  it('turns an empty list into an empty array', () => {
    expect([...compressActions([])]).toEqual([]);
  });

  it('writes a code of 255 or less as one byte', () => {
    expect([...compressActions([32, 97, 255])]).toEqual([32, 97, 255]);
  });

  it('writes a code above 255 as two bytes, high byte first', () => {
    expect([...compressActions([0x100])]).toEqual([0x01, 0x00]);
    expect([...compressActions([558])]).toEqual([0x02, 0x2e]);
    expect([...compressActions([0x1fff])]).toEqual([0x1f, 0xff]);
  });

  it('puts 255 and 256 on different sides of the one-byte limit', () => {
    expect(compressActions([255]).length).toBe(1);
    expect(compressActions([256]).length).toBe(2);
  });

  it('mixes one-byte and two-byte codes in order', () => {
    expect([...compressActions([558, 108, 105, 98, 49, 574])]).toEqual([
      0x02, 0x2e, 0x6c, 0x69, 0x62, 0x31, 0x02, 0x3e,
    ]);
  });

  it('returns exactly the bytes used (no padding)', () => {
    const out = compressActions([1000, 40, 2000]);
    expect(out).toBeInstanceOf(Uint8Array);
    expect(out.length).toBe(5);
  });

  it('keeps only the low byte of a code that does not fit 13 bits (high bits are lost)', () => {
    // 0x2000 >>> 8 is 0x20, written as a high byte; that is the documented limit of the format.
    expect([...compressActions([0x2000])]).toEqual([0x20, 0x00]);
  });
});

describe('decompressActions', () => {
  it('turns an empty array into an empty list', () => {
    expect(decompressActions(new Uint8Array([]))).toEqual([]);
  });

  it('reads bytes of 32 or more as whole codes', () => {
    expect(decompressActions(Uint8Array.from([32, 97, 255]))).toEqual([32, 97, 255]);
  });

  it('joins a byte from 1 to 31 with the next byte into one code', () => {
    expect(decompressActions(Uint8Array.from([0x02, 0x2e, 0x6c]))).toEqual([558, 108]);
    expect(decompressActions(Uint8Array.from([0x1f, 0xff]))).toEqual([0x1fff]);
    expect(decompressActions(Uint8Array.from([0x01, 0x00]))).toEqual([0x100]);
  });

  it('keeps 0 as 0 and does not join it with the next byte', () => {
    expect(decompressActions(Uint8Array.from([0, 97]))).toEqual([0, 97]);
  });

  it('treats the boundary at 31 and 32 correctly', () => {
    expect(decompressActions(Uint8Array.from([31, 1]))).toEqual([(31 << 8) | 1]);
    expect(decompressActions(Uint8Array.from([32, 1]))).toEqual([32, 1]);
  });

  it('leaves a trailing byte of 1 to 31 as it is, since nothing follows it', () => {
    expect(decompressActions(Uint8Array.from([97, 5]))).toEqual([97, 5]);
  });

  it('reads a code below 32 as the start of a two-byte code when something follows (such codes are invalid)', () => {
    expect([...compressActions([5, 7])]).toEqual([5, 7]);
    expect(decompressActions(compressActions([5, 7]))).toEqual([0x507]);
  });
});

describe('compress and decompress together', () => {
  it('give back the same list for valid codes (32 to 0x1fff)', () => {
    const random = mulberry32(20240607);
    for (let n = 0; n < 300; n++) {
      const length = Math.floor(random() * 20);
      const actions = Array.from({ length }, () => 32 + Math.floor(random() * (0x1fff - 32 + 1)));
      expect(decompressActions(compressActions(actions)), JSON.stringify(actions)).toEqual(actions);
    }
  });

  it('give back the boundary codes', () => {
    const edges = [32, 33, 255, 256, 257, 0x1fff, 0x20 * 8, 558, 574];
    expect(decompressActions(compressActions(edges))).toEqual(edges);
  });

  it('give back zeros too (the codes of unused slots)', () => {
    expect(decompressActions(compressActions([0, 97, 0, 0, 98]))).toEqual([0, 97, 0, 0, 98]);
  });

  it('do not give back a code above 0x1fff', () => {
    // The high byte 0x20 is itself a whole code, so the pair splits apart.
    expect(decompressActions(compressActions([0x2000]))).toEqual([32, 0]);
    expect(decompressActions(compressActions([0x2001, 40]))).toEqual([32, (1 << 8) | 40]);
  });
});
