import {
  deserializeActions,
  hashChord,
  parseChordActions,
  parsePhrase,
  serializeActions,
  stringifyChordActions,
  stringifyPhrase,
} from './raw-chord.utils.js';

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Chord actions as the device stores them: 12 slots of 10 bits. */
function randomChord(random: () => number, length = 12) {
  const used = 1 + Math.floor(random() * length);
  return [...Array.from({ length: length - used }, () => 0), ...Array.from({ length: used }, () => 1 + Math.floor(random() * 1023))];
}

describe('parsePhrase and stringifyPhrase', () => {
  it('reads the hex text of a phrase into action codes', () => {
    expect(parsePhrase('022E6C696231023E')).toEqual([558, 108, 105, 98, 49, 574]);
    expect(parsePhrase('61726D')).toEqual([97, 114, 109]);
  });

  it('writes action codes as upper-case hex, two digits per byte', () => {
    expect(stringifyPhrase([558, 108, 105, 98, 49, 574])).toBe('022E6C696231023E');
    expect(stringifyPhrase([97, 114, 109])).toBe('61726D');
    expect(stringifyPhrase([32])).toBe('20');
  });

  it('reads an empty phrase as no codes, and writes no codes as empty text', () => {
    expect(parsePhrase('')).toEqual([]);
    expect(stringifyPhrase([])).toBe('');
  });

  it('reads lower-case hex as well', () => {
    expect(parsePhrase('022e6c')).toEqual([558, 108]);
  });

  it('gives back the same text for what it wrote', () => {
    const random = mulberry32(7);
    for (let n = 0; n < 200; n++) {
      const phrase = Array.from({ length: Math.floor(random() * 16) }, () => 32 + Math.floor(random() * (0x1fff - 31)));
      expect(parsePhrase(stringifyPhrase(phrase))).toEqual(phrase);
    }
  });

  it('ignores a dangling half byte at the end of the text', () => {
    expect(parsePhrase('61726')).toEqual([97, 114]);
  });
});

describe('serializeActions and deserializeActions', () => {
  it('always read back 12 slots', () => {
    expect(deserializeActions(0n)).toEqual(Array.from({ length: 12 }, () => 0));
    expect(deserializeActions(serializeActions([5])).length).toBe(12);
  });

  it('store the last action in the top slot, so a short list is padded with zeros in front', () => {
    expect(deserializeActions(serializeActions([108, 114]))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 114]);
    expect(deserializeActions(serializeActions([7]))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]);
  });

  it('keep a full list of 12 as it is', () => {
    const full = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(deserializeActions(serializeActions(full))).toEqual(full);
  });

  it('keep only 10 bits of each code', () => {
    expect(deserializeActions(serializeActions([1023]))[11]).toBe(1023);
    expect(deserializeActions(serializeActions([1024]))[11]).toBe(0);
    expect(deserializeActions(serializeActions([1025]))[11]).toBe(1);
  });

  it('serialize to 0 for an empty list', () => {
    expect(serializeActions([])).toBe(0n);
  });

  it('put the last action in the top 10 bits of the 120-bit value, the one before it just below', () => {
    expect(serializeActions([1])).toBe(1n << 110n);
    expect(serializeActions([1, 1])).toBe((1n << 110n) | (1n << 100n));
  });

  it('are inverse of each other for 12 slots', () => {
    const random = mulberry32(11);
    for (let n = 0; n < 300; n++) {
      const chord = randomChord(random);
      expect(deserializeActions(serializeActions(chord))).toEqual(chord);
    }
  });
});

describe('parseChordActions and stringifyChordActions', () => {
  it('read the 32 hex digits the device sends', () => {
    expect(parseChordActions('001C86C0000000000000000000000000')).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 114]);
    expect(parseChordActions('001C861000000000000000002068836F')).toEqual([879, 544, 518, 0, 0, 0, 0, 0, 0, 0, 97, 114]);
  });

  it('write 32 upper-case hex digits, padded with zeros', () => {
    expect(stringifyChordActions([108, 114])).toBe('001C86C0000000000000000000000000');
    expect(stringifyChordActions([])).toBe('00000000000000000000000000000000');
    expect(stringifyChordActions([1])).toHaveLength(32);
  });

  it('give back the same text for what they read', () => {
    for (const text of ['001C86C0000000000000000000000000', '001C861000000000000000002068836F']) {
      expect(stringifyChordActions(parseChordActions(text))).toBe(text);
    }
  });

  it('read lower-case digits', () => {
    expect(parseChordActions('001c86c0000000000000000000000000')).toEqual(parseChordActions('001C86C0000000000000000000000000'));
  });

  it('reject text that is not hex', () => {
    expect(() => parseChordActions('xyz')).toThrow();
  });

  it('read and write the same way for random chords', () => {
    const random = mulberry32(13);
    for (let n = 0; n < 200; n++) {
      const chord = randomChord(random);
      expect(parseChordActions(stringifyChordActions(chord))).toEqual(chord);
    }
  });
});

describe('hashChord', () => {
  it('matches the ids the device assigns (the sample chords from the library tests)', () => {
    expect(hashChord(parseChordActions('001C86C0000000000000000000000000'))).toBe(543720303);
    expect(hashChord(parseChordActions('001C861000000000000000002068836F'))).toBe(216631165);
  });

  it('is the same for the same chord', () => {
    expect(hashChord([1, 2, 3])).toBe(hashChord([1, 2, 3]));
  });

  it('does not depend on leading zeros, since the chord is stored right-aligned', () => {
    expect(hashChord([108, 114])).toBe(hashChord([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 114]));
  });

  it('depends on the order of the actions', () => {
    expect(hashChord([108, 114])).not.toBe(hashChord([114, 108]));
  });

  it('always fits in 30 bits', () => {
    const random = mulberry32(17);
    for (let n = 0; n < 500; n++) {
      const hash = hashChord(randomChord(random));
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(2 ** 30);
      expect(Number.isInteger(hash)).toBe(true);
    }
  });

  it.each([
    [[32, 192], 197351424],
    [[33, 130], 902653952],
    [[34, 67], 205477376],
  ])('clears the reserved 0xff low byte by flipping it to 0x00: %j -> %i', (actions, expected) => {
    // The plain hash of these inputs ends in 0xff (197351679, 902654207, 205477631).
    expect(hashChord(actions)).toBe(expected);
    expect(hashChord(actions) & 0xff).toBe(0);
  });

  it('never ends in the byte 0xff (that value is reserved)', () => {
    const random = mulberry32(19);
    for (let n = 0; n < 2000; n++) {
      expect(hashChord(randomChord(random)) & 0xff).not.toBe(0xff);
    }
  });

  it('rarely collides for different random chords', () => {
    const random = mulberry32(23);
    const seen = new Map<number, string>();
    let collisions = 0;
    for (let n = 0; n < 2000; n++) {
      const chord = randomChord(random);
      const key = chord.join(',');
      const hash = hashChord(chord);
      if (seen.has(hash) && seen.get(hash) !== key) collisions++;
      seen.set(hash, key);
    }
    expect(collisions).toBeLessThanOrEqual(2);
  });

  it('gives a fixed value for no actions', () => {
    expect(hashChord([])).toBe(hashChord([0]));
    expect(hashChord([])).toBe(hashChord(new Array(12).fill(0)));
  });
});
