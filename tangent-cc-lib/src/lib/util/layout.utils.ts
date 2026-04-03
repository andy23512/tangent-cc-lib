import { WSKCode } from '../model/key-code.models.js';
import {
  CharacterKeyCodeMap,
  KeyboardLayout,
  KeyboardLayoutKey,
} from '../model/keyboard-layout.models.js';

export function convertKeyboardLayoutToCharacterKeyCodeMap(
  keyboardLayout: KeyboardLayout | null,
): CharacterKeyCodeMap {
  if (!keyboardLayout) {
    return new Map();
  }

  const hasShift = new Set(['withShift', 'withShiftAltGraph']);
  const hasAltGraph = new Set(['withAltGraph', 'withShiftAltGraph']);

  const entries = Object.entries(keyboardLayout.layout) as Array<
    [WSKCode, Partial<KeyboardLayoutKey>]
  >;

  return new Map(
    entries.flatMap(([keyCode, layoutKey]) => {
      if (!layoutKey) {
        return [];
      }
      return Object.entries(layoutKey)
        .filter(([, output]) => output?.type === 'text')
        .map(
          ([modifier, output]) =>
            [
              output.value,
              {
                keyCode,
                shiftKey: hasShift.has(modifier),
                altGraphKey: hasAltGraph.has(modifier),
              },
            ] as const,
        );
    }),
  );
}
