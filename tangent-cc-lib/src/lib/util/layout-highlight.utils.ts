import { Layer } from '../model/device-layout.models.js';
import {
  HighlightSetting,
  PreferKeySide,
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

type ShiftedLayer = Layer.Secondary | Layer.Tertiary | Layer.Quaternary;

/*
 * Secondary/Tertiary/Quaternary layers behave identically apart from which
 * fields of `layerShiftPositionCodeMap`/`highlightSetting` they read.
 */
function getShiftedLayerConfig(
  layer: ShiftedLayer,
  layerShiftPositionCodeMap: LayerShiftPositionCodeMap,
  highlightSetting: HighlightSetting,
): {
  layerModifierPositionCodes: number[];
  shiftAndLayerSetting: {
    preferShiftSide: PreferKeySide;
    preferCharacterKeySide: PreferKeySide;
  };
  layerSetting: { preferSides: PreferSides; preferLayerSide: PreferKeySide };
} {
  switch (layer) {
    case Layer.Secondary:
      return {
        layerModifierPositionCodes: layerShiftPositionCodeMap.numShift,
        shiftAndLayerSetting: highlightSetting.shiftAndNumShiftLayer,
        layerSetting: {
          preferSides: highlightSetting.numShiftLayer.preferSides,
          preferLayerSide: highlightSetting.numShiftLayer.preferNumShiftSide,
        },
      };
    case Layer.Tertiary:
      return {
        layerModifierPositionCodes: layerShiftPositionCodeMap.fnShift,
        shiftAndLayerSetting: highlightSetting.shiftAndFnShiftLayer,
        layerSetting: {
          preferSides: highlightSetting.fnShiftLayer.preferSides,
          preferLayerSide: highlightSetting.fnShiftLayer.preferFnShiftSide,
        },
      };
    case Layer.Quaternary:
      return {
        layerModifierPositionCodes: layerShiftPositionCodeMap.flagShift,
        shiftAndLayerSetting: highlightSetting.shiftAndFlagShiftLayer,
        layerSetting: {
          preferSides: highlightSetting.flagShiftLayer.preferSides,
          preferLayerSide: highlightSetting.flagShiftLayer.preferFlagShiftSide,
        },
      };
  }
}

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
        useLayerLock: false,
      });
    }

    // handle lock
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

    result.push({
      ...keyCombination,
      positionCodes: [
        keyCombination.characterKeyPositionCode,
        shiftPositionCode,
      ],
      score,
      useLayerLock: true,
    });
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
      useLayerLock: false,
    });
  }

  // handle lock
  let score = 0;
  const preferKeySide =
    preferSides === 'both'
      ? preferModifierSide === 'left'
        ? 'right'
        : 'left'
      : preferModifierSide;
  if (
    isPositionAtSide(
      keyCombination.characterKeyPositionCode,
      preferKeySide,
      layoutType,
    )
  ) {
    score += 1;
  }

  result.push({
    ...keyCombination,
    positionCodes: [keyCombination.characterKeyPositionCode],
    score: score,
    useLayerLock: true,
  });

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

      if (k.layer === Layer.Primary) {
        if (k.shiftKey) {
          const { preferShiftSide, preferSides } = highlightSetting.shiftLayer;
          if (modifierKeyPositionCodeMap.shift[Layer.Primary].length > 0) {
            result = buildLayerModifierCombinations(
              k,
              modifierKeyPositionCodeMap.shift[Layer.Primary],
              preferShiftSide,
              preferSides,
              layoutType,
            );
          }
        } else {
          result = [
            {
              ...k,
              positionCodes: [k.characterKeyPositionCode],
              score: 0,
              useLayerLock: false,
            },
          ];
        }
      } else {
        const {
          layerModifierPositionCodes,
          shiftAndLayerSetting,
          layerSetting,
        } = getShiftedLayerConfig(
          k.layer,
          layerShiftPositionCodeMap,
          highlightSetting,
        );

        if (k.shiftKey) {
          result = buildShiftWithLayerModifierCombinations(
            k,
            modifierKeyPositionCodeMap.shift[k.layer],
            layerModifierPositionCodes,
            shiftAndLayerSetting.preferCharacterKeySide,
            shiftAndLayerSetting.preferShiftSide,
            layoutType,
          );
        } else {
          result = buildLayerModifierCombinations(
            k,
            layerModifierPositionCodes,
            layerSetting.preferLayerSide,
            layerSetting.preferSides,
            layoutType,
          );
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
      if (a.useLayerLock !== b.useLayerLock) {
        return a.useLayerLock ? 1 : -1;
      }
      if (
        a.useLayerLock === b.useLayerLock &&
        a.positionCodes.length !== b.positionCodes.length
      ) {
        return a.positionCodes.length - b.positionCodes.length;
      }
      if (a.layer !== b.layer) {
        return a.layer.localeCompare(b.layer);
      }
      return b.score - a.score;
    })[0];
}
