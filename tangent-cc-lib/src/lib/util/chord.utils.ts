import {
  Chord,
  ChordInNumberListForm,
  ChordTreeNode,
} from '../model/chord.models.js';
import { hashChord } from './raw-chord.utils.js';

export function getParentHashFromChordAction(
  chordAction: number[],
): number | null {
  if (chordAction[3] !== 0) {
    return null;
  }
  const parentHash = chordAction
    .slice(0, 3)
    .reduce((a, b, i) => a | (b << (i * 10)));
  if (parentHash === 0) return null;
  return parentHash;
}

export function getInputFromChordAction(chordAction: number[]): number[] {
  if (chordAction[3] !== 0) {
    return chordAction;
  }
  return chordAction.slice(3);
}

export function convertChordInNumberListFormToChord([
  action,
  phrase,
]: ChordInNumberListForm): Chord {
  return {
    id: hashChord(action),
    parentId: getParentHashFromChordAction(action),
    input: getInputFromChordAction(action),
    actions: action,
    output: phrase,
  };
}

export function convertChordsToChordTreeNodes(
  chords: Chord[],
  parentHash: number | null = null,
  level = 0,
): ChordTreeNode[] {
  return chords
    .filter((chord) => chord.parentId === parentHash)
    .map((chord) => ({
      ...chord,
      level,
      children: convertChordsToChordTreeNodes(chords, chord.id, level + 1),
    }));
}
