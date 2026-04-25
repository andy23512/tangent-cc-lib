import {
  ALT_GRAPH_ACTION_CODE,
  FLAG_SHIFT_ACTION_CODES,
  FN_SHIFT_ACTION_CODES,
  NUM_SHIFT_ACTION_CODES,
  SHIFT_ACTION_CODES,
} from '../data/actions.js';
import { LAYERS } from '../data/keyboard-layout/layers.js';
import { DeviceLayout, Layer } from '../model/device-layout.models.js';
import { KeyCombination } from '../model/key-combination.models.js';
import { CharacterActionCode } from '../model/keyboard-layout.models.js';
import { nonNullable } from './non-nullable.utils.js';

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
  layer: Layer,
): number[] {
  return actionCodes
    .map((actionCode) =>
      getKeyCombinationsFromActionCodes(
        [{ actionCode, shiftKey: false, altGraphKey: false }],
        deviceLayout,
      )
        ?.filter((combination) => combination.layer === layer)
        .map((combination) => combination.characterKeyPositionCode),
    )
    .filter(nonNullable)
    .flat();
}

export type LayerShiftPositionCodeMap = {
  numShift: number[];
  fnShift: number[];
  flagShift: number[];
};

export interface ModifierKeyPositionCodeMap {
  shift: Record<Layer, number[]>;
  altGraph: Record<Layer, number[]>;
}

export function getLayerShiftPositionCodeMap(
  deviceLayout: DeviceLayout,
): LayerShiftPositionCodeMap {
  return {
    numShift: getNumShiftKeyPositionCodes(deviceLayout),
    fnShift: getFnShiftKeyPositionCodes(deviceLayout),
    flagShift: getFlagShiftKeyPositionCodes(deviceLayout),
  };
}

export function getModifierKeyPositionCodeMap(
  deviceLayout: DeviceLayout,
): ModifierKeyPositionCodeMap {
  return {
    shift: Object.fromEntries(
      LAYERS.map((layer) => [
        layer,
        getPositionCodesForActionCodes(SHIFT_ACTION_CODES, deviceLayout, layer),
      ]),
    ) as Record<Layer, number[]>,
    altGraph: Object.fromEntries(
      LAYERS.map((layer) => [
        layer,
        getPositionCodesForActionCodes(
          [ALT_GRAPH_ACTION_CODE],
          deviceLayout,
          layer,
        ),
      ]),
    ) as Record<Layer, number[]>,
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
