import {
  ACTIONS,
  ALT_GRAPH_ACTION_CODE,
  FLAG_SHIFT_ACTION_CODES,
  FN_SHIFT_ACTION_CODES,
  NUM_SHIFT_ACTION_CODES,
  SHIFT_ACTION_CODES,
} from '../data/actions.js';
import { ActionType } from '../model/action.models.js';
import { DeviceLayout, Layer } from '../model/device-layout.models.js';
import { WSKCode } from '../model/key-code.models.js';
import { KeyCombination } from '../model/key-combination.models.js';
import {
  CharacterActionCode,
  CharacterKeyCode,
  CharacterKeyCodeMap,
  KeyboardLayout,
  KeyboardLayoutKey,
} from '../model/keyboard-layout.models.js';
import { nonNullable } from './non-nullable.utils.js';

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

export function getCharacterActionCodesFromCharacterKeyCode({
  keyCode,
  shiftKey,
  altGraphKey,
}: CharacterKeyCode): CharacterActionCode[] {
  const characterActionCodes: CharacterActionCode[] = [];

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

function getLayerFromIndex(layerIndex: number): Layer {
  switch (layerIndex) {
    case 0:
      return Layer.Primary;
    case 1:
      return Layer.Secondary;
    case 2:
      return Layer.Tertiary;
    case 3:
      return Layer.Quaternary;
    default:
      return Layer.Primary;
  }
}

function getLayerShiftKeyPositionCodes(
  deviceLayout: DeviceLayout,
  shiftActionCodes: readonly number[],
  targetLayerIndex: number,
): number[] {
  const primaryLayer = deviceLayout.layout[0];
  const targetLayer = deviceLayout.layout[targetLayerIndex];

  if (!primaryLayer || !targetLayer) {
    return [];
  }

  return primaryLayer
    .map((actionCode, index) =>
      shiftActionCodes.includes(actionCode) ? index : -1,
    )
    .filter(
      (positionCode) =>
        positionCode !== -1 &&
        shiftActionCodes.includes(targetLayer[positionCode]),
    );
}

export function getNumShiftKeyPositionCodes(
  deviceLayout: DeviceLayout,
): number[] {
  return getLayerShiftKeyPositionCodes(deviceLayout, NUM_SHIFT_ACTION_CODES, 1);
}

export function getFnShiftKeyPositionCodes(
  deviceLayout: DeviceLayout,
): number[] {
  return getLayerShiftKeyPositionCodes(deviceLayout, FN_SHIFT_ACTION_CODES, 2);
}

export function getFlagShiftKeyPositionCodes(
  deviceLayout: DeviceLayout,
): number[] {
  return getLayerShiftKeyPositionCodes(
    deviceLayout,
    FLAG_SHIFT_ACTION_CODES,
    3,
  );
}

function getPositionCodesForActionCodes(
  actionCodes: readonly number[],
  deviceLayout: DeviceLayout,
): number[] {
  return actionCodes
    .map((actionCode) =>
      getKeyCombinationsFromActionCodes(
        [{ actionCode, shiftKey: false, altGraphKey: false }],
        deviceLayout,
      )?.map((combination) => combination.characterKeyPositionCode),
    )
    .filter(nonNullable)
    .flat();
}

export function getModifierKeyPositionCodeMap(deviceLayout: DeviceLayout) {
  return {
    shift: getPositionCodesForActionCodes(SHIFT_ACTION_CODES, deviceLayout),
    numShift: getNumShiftKeyPositionCodes(deviceLayout),
    fnShift: getFnShiftKeyPositionCodes(deviceLayout),
    flagShift: getFlagShiftKeyPositionCodes(deviceLayout),
    altGraph: getPositionCodesForActionCodes(
      [ALT_GRAPH_ACTION_CODE],
      deviceLayout,
    ),
  };
}

export function getKeyCombinationsFromActionCodes(
  characterActionCodes: CharacterActionCode[],
  deviceLayout: DeviceLayout | null,
): KeyCombination[] | null {
  if (!deviceLayout) {
    return null;
  }

  return characterActionCodes
    .flatMap(({ actionCode, shiftKey, altGraphKey }) =>
      deviceLayout.layout.flatMap((layer, layerIndex) => {
        const matchedPositionCodes = layer
          .map((currentActionCode, index) =>
            currentActionCode === actionCode ? index : -1,
          )
          .filter((positionCode) => positionCode !== -1);

        if (matchedPositionCodes.length === 0) {
          return [];
        }

        const mappedLayer = getLayerFromIndex(layerIndex);
        return matchedPositionCodes.map((positionCode) => ({
          characterKeyPositionCode: positionCode,
          layer: mappedLayer,
          shiftKey,
          altGraphKey,
        }));
      }),
    )
    .filter(nonNullable);
}
