import { Chord } from '../model/chord.models.js';
import {
  convertChordInNumberListFormToChord,
  convertChordsToChordTreeNodes,
  getInputFromChordAction,
  getParentHashFromChordAction,
} from './chord.utils.js';
import { hashChord, parseChordActions, parsePhrase } from './raw-chord.utils.js';

const PARENT = parseChordActions('001C86C0000000000000000000000000');
const CHILD = parseChordActions('001C861000000000000000002068836F');

/** A chord with only the fields the tree code looks at. */
function chord(id: number, parentId: number | null): Chord {
  return { id, parentId, input: [], actions: [], output: [], actionAndPhraseHash: String(id), isDynamicLibraryChord: false };
}

describe('getParentHashFromChordAction', () => {
  it('is null for a chord with no parent (its first three slots are empty)', () => {
    expect(getParentHashFromChordAction(PARENT)).toBeNull();
  });

  it('is the parent chord id for a child chord (three 10-bit slots joined, first slot lowest)', () => {
    expect(getParentHashFromChordAction(CHILD)).toBe(879 | (544 << 10) | (518 << 20));
    expect(getParentHashFromChordAction(CHILD)).toBe(hashChord(PARENT));
  });

  it('is null when the fourth slot is in use, whatever the first three hold', () => {
    expect(getParentHashFromChordAction([1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0])).toBeNull();
  });

  it('is null when the three parent slots are all zero', () => {
    expect(getParentHashFromChordAction([0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 0, 0])).toBeNull();
  });

  it('is not null when only one of the three slots is set', () => {
    expect(getParentHashFromChordAction([7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(7);
    expect(getParentHashFromChordAction([0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(7 << 10);
    expect(getParentHashFromChordAction([0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(7 << 20);
  });
});

describe('getInputFromChordAction', () => {
  it('drops the parent slots when the chord has a parent hash', () => {
    expect(getInputFromChordAction(CHILD)).toEqual(CHILD.slice(3));
  });

  it('keeps the whole list when the fourth slot is in use', () => {
    const full = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(getInputFromChordAction(full)).toBe(full);
  });

  it('drops the first three slots of a chord without a parent as well, when its fourth slot is empty', () => {
    expect(getInputFromChordAction(PARENT)).toEqual(PARENT.slice(3));
    expect(getInputFromChordAction(PARENT)).toHaveLength(9);
  });
});

describe('convertChordInNumberListFormToChord', () => {
  it('fills every field of a chord from its actions and phrase', () => {
    const chord = convertChordInNumberListFormToChord([PARENT, parsePhrase('022E6C696231023E')]);
    expect(chord).toEqual({
      id: 543720303,
      parentId: null,
      input: PARENT.slice(3),
      actions: PARENT,
      output: [558, 108, 105, 98, 49, 574],
      actionAndPhraseHash: '0,0,0,0,0,0,0,0,0,0,108,114|558,108,105,98,49,574',
      isDynamicLibraryChord: true,
    });
  });

  it('links a child to its parent through parentId', () => {
    const parent = convertChordInNumberListFormToChord([PARENT, [97]]);
    const child = convertChordInNumberListFormToChord([CHILD, [97, 114, 109]]);
    expect(child.parentId).toBe(parent.id);
    expect(child.id).toBe(216631165);
    expect(child.isDynamicLibraryChord).toBe(false);
  });

  it('marks a chord as a dynamic library chord only when its output holds action 558', () => {
    const flag = (phrase: number[]) => convertChordInNumberListFormToChord([PARENT, phrase]).isDynamicLibraryChord;
    expect(flag([558])).toBe(true);
    expect(flag([97, 558, 98])).toBe(true);
    expect(flag([557, 559, 97])).toBe(false);
    expect(flag([])).toBe(false);
  });

  it('joins actions and phrase with a comma and a bar', () => {
    const c = convertChordInNumberListFormToChord([[1, 2], [3, 4]]);
    expect(c.actionAndPhraseHash).toBe('1,2|3,4');
    expect(convertChordInNumberListFormToChord([[1], []]).actionAndPhraseHash).toBe('1|');
  });
});

describe('convertChordsToChordTreeNodes', () => {
  it('returns no nodes for no chords', () => {
    expect(convertChordsToChordTreeNodes([])).toEqual([]);
  });

  it('puts chords without a parent at the root, level 0, with no ancestors', () => {
    const [a, b] = convertChordsToChordTreeNodes([chord(1, null), chord(2, null)]);
    expect([a.id, b.id]).toEqual([1, 2]);
    expect([a.level, b.level]).toEqual([0, 0]);
    expect(a.ancestors).toEqual([]);
    expect(a.children).toEqual([]);
  });

  it('builds a chain of three, each node knowing its level and ancestors', () => {
    const [root] = convertChordsToChordTreeNodes([chord(3, 2), chord(1, null), chord(2, 1)]);
    expect(root.id).toBe(1);
    const mid = root.children[0];
    const leaf = mid.children[0];
    expect([mid.id, mid.level, leaf.id, leaf.level]).toEqual([2, 1, 3, 2]);
    expect(mid.ancestors).toEqual([root]);
    expect(leaf.ancestors).toHaveLength(2);
    expect(leaf.ancestors[0]).toBe(root);
    expect(leaf.ancestors[1]).toBe(mid);
  });

  it('keeps siblings in the order they were given', () => {
    const [root] = convertChordsToChordTreeNodes([chord(1, null), chord(30, 1), chord(20, 1), chord(10, 1)]);
    expect(root.children.map((c) => c.id)).toEqual([30, 20, 10]);
  });

  it('keeps several roots, each with its own children', () => {
    const roots = convertChordsToChordTreeNodes([chord(1, null), chord(2, null), chord(11, 1), chord(22, 2)]);
    expect(roots.map((r) => [r.id, r.children.map((c) => c.id)])).toEqual([
      [1, [11]],
      [2, [22]],
    ]);
  });

  it('leaves out a chord whose parent is not in the list', () => {
    const roots = convertChordsToChordTreeNodes([chord(1, null), chord(5, 99)]);
    expect(roots.map((r) => r.id)).toEqual([1]);
    expect(roots[0].children).toEqual([]);
  });

  it('copies every chord field onto its node', () => {
    const original: Chord = { ...chord(1, null), input: [9], actions: [8], output: [7], isDynamicLibraryChord: true };
    const [node] = convertChordsToChordTreeNodes([original]);
    expect(node).toMatchObject(original);
    expect(node).not.toBe(original);
  });

  it('does not change the chords it was given', () => {
    const list = [chord(1, null), chord(2, 1)];
    const copy = JSON.parse(JSON.stringify(list));
    convertChordsToChordTreeNodes(list);
    expect(list).toEqual(copy);
  });

  it('builds a wide and deep tree from real chords', () => {
    const rows: [string, string][] = [
      ['001C86C0000000000000000000000000', '61'],
      ['001C861000000000000000002068836F', '62'],
    ];
    const chords = rows.map(([a, p]) => convertChordInNumberListFormToChord([parseChordActions(a), parsePhrase(p)]));
    const [root] = convertChordsToChordTreeNodes(chords);
    expect(root.children).toHaveLength(1);
    expect(root.children[0].output).toEqual([98]);
  });
});
