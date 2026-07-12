import { PreferSides } from '../model/highlight-setting.models.js';
import { LayoutType } from '../model/layout-type.models.js';

const LITE_LEFT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0, 5],
  [12, 17],
  [26, 31],
  [39, 44],
  [53, 59],
];

function isLiteLeftPosition(positionCode: number) {
  return LITE_LEFT_RANGES.some(
    ([start, end]) => positionCode >= start && positionCode <= end,
  );
}

export function getPositionSide(
  positionCode: number,
  layoutType: LayoutType = '3d',
) {
  if (layoutType === 'lite') {
    return isLiteLeftPosition(positionCode) ? 'left' : 'right';
  }

  return positionCode < 45 ? 'left' : 'right';
}

export function isPositionAtSide(
  positionCode: number,
  side: 'left' | 'right',
  layoutType: LayoutType = '3d',
) {
  return getPositionSide(positionCode, layoutType) === side;
}

export function meetPreferSides(
  positionCode1: number,
  positionCode2: number,
  preferSides: PreferSides,
  layoutType: LayoutType = '3d',
) {
  if (preferSides === 'both') {
    return (
      getPositionSide(positionCode1, layoutType) !==
      getPositionSide(positionCode2, layoutType)
    );
  } else {
    return (
      getPositionSide(positionCode1, layoutType) ===
      getPositionSide(positionCode2, layoutType)
    );
  }
}
