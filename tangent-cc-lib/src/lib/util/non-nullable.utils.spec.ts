import { nonNullable } from './non-nullable.utils.js';

describe('nonNullable', () => {
  it('is false for null and undefined only', () => {
    expect(nonNullable(null)).toBe(false);
    expect(nonNullable(undefined)).toBe(false);
  });

  it.each([0, '', false, NaN, [], {}, -0])('is true for the falsy-looking value %j', (value) => {
    expect(nonNullable(value)).toBe(true);
  });

  it('removes null and undefined when used as a filter', () => {
    const list: (number | null | undefined)[] = [1, null, 0, undefined, 2];
    const result: number[] = list.filter(nonNullable);
    expect(result).toEqual([1, 0, 2]);
  });
});
