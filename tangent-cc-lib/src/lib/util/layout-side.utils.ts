import { PreferSides } from '../model/highlight-setting.models.js';

export function getPositionSide(positionCode: number) {
  return positionCode < 45 ? 'left' : 'right';
}

export function isPositionAtSide(positionCode: number, side: 'left' | 'right') {
  return getPositionSide(positionCode) === side;
}

export function meetPreferSides(
  positionCode1: number,
  positionCode2: number,
  preferSides: PreferSides,
) {
  if (preferSides === 'both') {
    return getPositionSide(positionCode1) !== getPositionSide(positionCode2);
  } else {
    return getPositionSide(positionCode1) === getPositionSide(positionCode2);
  }
}
