import { Layer } from '../model/device-layout.models.js';
import {
  HighlightSetting,
  PreferSides,
} from '../model/highlight-setting.models.js';
import {
  HighlightKeyCombination,
  KeyCombination,
} from '../model/key-combination.models.js';
import {
  isPositionAtSide,
  meetPreferSides,
} from './layout-side.utils.js';
import { ModifierKeyPositionCodeMap } from './layout-modifier-map.utils.js';

function buildShiftWithLayerModifierCombinations(
  keyCombination: KeyCombination,
  shiftPositionCodes: number[],
  layerModifierPositionCodes: number[],
  preferCharacterKeySide: 'left' | 'right',
  preferShiftSide: 'left' | 'right',
): HighlightKeyCombination[] {
  const result: HighlightKeyCombination[] = [];

  for (const shiftPositionCode of shiftPositionCodes) {
    for (const layerModifierPositionCode of layerModifierPositionCodes) {
      let score = 0;
      if (
        isPositionAtSide(
          keyCombination.characterKeyPositionCode,
          preferCharacterKeySide,
        )
      ) {
        score += 1;
      }
      if (isPositionAtSide(shiftPositionCode, preferShiftSide)) {
        score += 1;
      }
      if (!isPositionAtSide(layerModifierPositionCode, preferShiftSide)) {
        score += 1;
      }

      result.push({
        ...keyCombination,
        positionCodes: [
          keyCombination.characterKeyPositionCode,
          shiftPositionCode,
          layerModifierPositionCode,
        ],
        score,
      });
    }
  }

  return result;
}

function buildLayerModifierCombinations(
  keyCombination: KeyCombination,
  modifierPositionCodes: number[],
  preferModifierSide: 'left' | 'right',
  preferSides: PreferSides,
): HighlightKeyCombination[] {
  const result: HighlightKeyCombination[] = [];

  for (const modifierPositionCode of modifierPositionCodes) {
    let score = 0;
    if (
      meetPreferSides(
        keyCombination.characterKeyPositionCode,
        modifierPositionCode,
        preferSides,
      )
    ) {
      score += 2;
    }
    if (isPositionAtSide(modifierPositionCode, preferModifierSide)) {
      score += 1;
    }

    result.push({
      ...keyCombination,
      positionCodes: [
        keyCombination.characterKeyPositionCode,
        modifierPositionCode,
      ],
      score,
    });
  }

  return result;
}

export function getHighlightKeyCombinationFromKeyCombinations(
  keyCombinations: KeyCombination[],
  modifierKeyPositionCodeMap: ModifierKeyPositionCodeMap,
  highlightSetting: HighlightSetting,
) {
  return keyCombinations
    .flatMap((k) => {
      let result: HighlightKeyCombination[] = [];

      if (k.shiftKey) {
        switch (k.layer) {
          case Layer.Secondary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndNumShiftLayer;
            result = buildShiftWithLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.shift,
              modifierKeyPositionCodeMap.numShift,
              preferCharacterKeySide,
              preferShiftSide,
            );
            break;
          }
          case Layer.Tertiary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndFnShiftLayer;
            result = buildShiftWithLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.shift,
              modifierKeyPositionCodeMap.fnShift,
              preferCharacterKeySide,
              preferShiftSide,
            );
            break;
          }
          case Layer.Quaternary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndFlagShiftLayer;
            result = buildShiftWithLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.shift,
              modifierKeyPositionCodeMap.flagShift,
              preferCharacterKeySide,
              preferShiftSide,
            );
            break;
          }
          default: {
            const { preferShiftSide, preferSides } =
              highlightSetting.shiftLayer;
            result = buildLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.shift,
              preferShiftSide,
              preferSides,
            );
            break;
          }
        }
      } else {
        switch (k.layer) {
          case Layer.Secondary: {
            const { preferNumShiftSide, preferSides } =
              highlightSetting.numShiftLayer;
            result = buildLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.numShift,
              preferNumShiftSide,
              preferSides,
            );
            break;
          }
          case Layer.Tertiary: {
            const { preferFnShiftSide, preferSides } =
              highlightSetting.fnShiftLayer;
            result = buildLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.fnShift,
              preferFnShiftSide,
              preferSides,
            );
            break;
          }
          case Layer.Quaternary: {
            const { preferFlagShiftSide, preferSides } =
              highlightSetting.flagShiftLayer;
            result = buildLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.flagShift,
              preferFlagShiftSide,
              preferSides,
            );
            break;
          }
          default:
            result = [
              {
                ...k,
                positionCodes: [k.characterKeyPositionCode],
                score: 0,
              },
            ];
        }
      }

      if (!k.altGraphKey) {
        return result;
      }

      return result.map((r) => ({
        ...r,
        positionCodes: [
          ...r.positionCodes,
          ...modifierKeyPositionCodeMap.altGraph,
        ],
      }));
    })
    .sort((a, b) => {
      if (a.positionCodes.length !== b.positionCodes.length) {
        return a.positionCodes.length - b.positionCodes.length;
      }
      if (a.layer !== b.layer) {
        return a.layer.localeCompare(b.layer);
      }
      return b.score - a.score;
    })[0];
}
