import { Layer } from '../model/device-layout.models.js';
import {
    HighlightSetting,
    PreferSides,
} from '../model/highlight-setting.models.js';
import {
    HighlightKeyCombination,
    KeyCombination,
} from '../model/key-combination.models.js';
import { LayoutType } from '../model/layout-type.models.js';
import {
    LayerShiftPositionCodeMap,
    ModifierKeyPositionCodeMap,
} from './layout-modifier-map.utils.js';
import { isPositionAtSide, meetPreferSides } from './layout-side.utils.js';

function buildShiftWithLayerModifierCombinations(
  keyCombination: KeyCombination,
  shiftPositionCodes: number[],
  layerModifierPositionCodes: number[],
  preferCharacterKeySide: 'left' | 'right',
  preferShiftSide: 'left' | 'right',
  layoutType: LayoutType,
): HighlightKeyCombination[] {
  const result: HighlightKeyCombination[] = [];

  for (const shiftPositionCode of shiftPositionCodes) {
    for (const layerModifierPositionCode of layerModifierPositionCodes) {
      let score = 0;
      if (
        isPositionAtSide(
          keyCombination.characterKeyPositionCode,
          preferCharacterKeySide,
          layoutType,
        )
      ) {
        score += 1;
      }
      if (isPositionAtSide(shiftPositionCode, preferShiftSide, layoutType)) {
        score += 1;
      }
      if (
        !isPositionAtSide(
          layerModifierPositionCode,
          preferShiftSide,
          layoutType,
        )
      ) {
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
  layoutType: LayoutType,
): HighlightKeyCombination[] {
  const result: HighlightKeyCombination[] = [];

  for (const modifierPositionCode of modifierPositionCodes) {
    let score = 0;
    if (
      meetPreferSides(
        keyCombination.characterKeyPositionCode,
        modifierPositionCode,
        preferSides,
        layoutType,
      )
    ) {
      score += 2;
    }
    if (
      isPositionAtSide(modifierPositionCode, preferModifierSide, layoutType)
    ) {
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
  layerShiftPositionCodeMap: LayerShiftPositionCodeMap,
  modifierKeyPositionCodeMap: ModifierKeyPositionCodeMap,
  highlightSetting: HighlightSetting,
  layoutType: LayoutType = '3d',
) {
  return keyCombinations
    .flatMap((k) => {
      let result: HighlightKeyCombination[] = [];

      if (k.shiftKey) {
        switch (k.layer) {
          case Layer.Secondary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndNumShiftLayer;
            if (modifierKeyPositionCodeMap.shift[Layer.Secondary].length > 0) {
              result = buildShiftWithLayerModifierCombinations(
                k,
                modifierKeyPositionCodeMap.shift[Layer.Secondary],
                layerShiftPositionCodeMap.numShift,
                preferCharacterKeySide,
                preferShiftSide,
                layoutType,
              );
            }
            break;
          }
          case Layer.Tertiary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndFnShiftLayer;
            if (modifierKeyPositionCodeMap.shift[Layer.Tertiary].length > 0) {
              result = buildShiftWithLayerModifierCombinations(
                k,
                modifierKeyPositionCodeMap.shift[Layer.Tertiary],
                layerShiftPositionCodeMap.fnShift,
                preferCharacterKeySide,
                preferShiftSide,
                layoutType,
              );
            }
            break;
          }
          case Layer.Quaternary: {
            const { preferCharacterKeySide, preferShiftSide } =
              highlightSetting.shiftAndFlagShiftLayer;
            if (modifierKeyPositionCodeMap.shift[Layer.Quaternary].length > 0) {
              result = buildShiftWithLayerModifierCombinations(
                k,
                modifierKeyPositionCodeMap.shift[Layer.Quaternary],
                layerShiftPositionCodeMap.flagShift,
                preferCharacterKeySide,
                preferShiftSide,
                layoutType,
              );
            }
            break;
          }
          default: {
            const { preferShiftSide, preferSides } =
              highlightSetting.shiftLayer;
            if (modifierKeyPositionCodeMap.shift[Layer.Primary].length > 0) {
              result = buildLayerModifierCombinations(
                k,
                modifierKeyPositionCodeMap.shift[Layer.Primary],
                preferShiftSide,
                preferSides,
                layoutType,
              );
            }
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
              layerShiftPositionCodeMap.numShift,
              preferNumShiftSide,
              preferSides,
              layoutType,
            );
            break;
          }
          case Layer.Tertiary: {
            const { preferFnShiftSide, preferSides } =
              highlightSetting.fnShiftLayer;
            result = buildLayerModifierCombinations(
              k,
              layerShiftPositionCodeMap.fnShift,
              preferFnShiftSide,
              preferSides,
              layoutType,
            );
            break;
          }
          case Layer.Quaternary: {
            const { preferFlagShiftSide, preferSides } =
              highlightSetting.flagShiftLayer;
            result = buildLayerModifierCombinations(
              k,
              layerShiftPositionCodeMap.flagShift,
              preferFlagShiftSide,
              preferSides,
              layoutType,
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

      return result
        .filter((r) => modifierKeyPositionCodeMap.altGraph[r.layer])
        .map((r) => ({
          ...r,
          positionCodes: [
            ...r.positionCodes,
            ...modifierKeyPositionCodeMap.altGraph[r.layer],
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
