import { ACTIONS } from '../data/actions.js';
import { ActionType } from '../model/action.models.js';
import { WSKCodeWithSpace } from '../model/key-code.models.js';
import {
  CharacterActionCode,
  CharacterKeyCode,
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

  const entries = (
    Object.entries(keyboardLayout.layout) as Array<
      [WSKCodeWithSpace, Partial<KeyboardLayoutKey>]
    >
  ).concat([['Space', { unmodified: { type: 'text', value: ' ' } }]]);

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

export function getCharacterActionCodesFromCharacterKeyCode({
  keyCode,
  shiftKey,
  altGraphKey,
}: CharacterKeyCode): CharacterActionCode[] {
  const characterActionCodes: CharacterActionCode[] = [];

  if (keyCode === 'Space') {
    const spaceActions = ACTIONS.filter(
      (action) =>
        action.type === ActionType.NonWSK && action.keyCode === 'Space',
    );
    spaceActions.forEach((action) => {
      characterActionCodes.push({
        actionCode: action.codeId,
        shiftKey,
        altGraphKey,
      });
    });
    return characterActionCodes;
  }

  const getWSKAction = (withShift: boolean) =>
    ACTIONS.find(
      (action) =>
        action.type === ActionType.WSK &&
        action.keyCode === keyCode &&
        action.withShift === withShift,
    );

  const baseAction = getWSKAction(false);
  if (baseAction) {
    characterActionCodes.push({
      actionCode: baseAction.codeId,
      shiftKey,
      altGraphKey,
    });
  }

  if (!shiftKey) {
    return characterActionCodes;
  }

  const shiftedAction = getWSKAction(true);
  if (shiftedAction) {
    characterActionCodes.push({
      actionCode: shiftedAction.codeId,
      shiftKey: false,
      altGraphKey,
    });
  }

  return characterActionCodes;
}
