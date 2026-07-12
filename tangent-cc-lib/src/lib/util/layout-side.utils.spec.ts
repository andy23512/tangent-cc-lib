describe('layout side utilities', () => {
  it('getPositionSide keeps existing 3d boundary behavior', async () => {
    const { getPositionSide } = await import('./layout-side.utils.js');

    expect(getPositionSide(44)).toBe('left');
    expect(getPositionSide(45)).toBe('right');
  });

  it('getPositionSide uses lite left-hand ranges', async () => {
    const { getPositionSide } = await import('./layout-side.utils.js');

    expect(getPositionSide(0, 'lite')).toBe('left');
    expect(getPositionSide(5, 'lite')).toBe('left');
    expect(getPositionSide(6, 'lite')).toBe('right');

    expect(getPositionSide(12, 'lite')).toBe('left');
    expect(getPositionSide(17, 'lite')).toBe('left');
    expect(getPositionSide(18, 'lite')).toBe('right');

    expect(getPositionSide(53, 'lite')).toBe('left');
    expect(getPositionSide(59, 'lite')).toBe('left');
    expect(getPositionSide(60, 'lite')).toBe('right');
  });

  it('isPositionAtSide uses the given layout type', async () => {
    const { isPositionAtSide } = await import('./layout-side.utils.js');

    expect(isPositionAtSide(6, 'right', 'lite')).toBe(true);
    expect(isPositionAtSide(6, 'left', 'lite')).toBe(false);
  });

  it('meetPreferSides honors both/same by layout type', async () => {
    const { meetPreferSides } = await import('./layout-side.utils.js');

    expect(meetPreferSides(5, 6, 'both', 'lite')).toBe(true);
    expect(meetPreferSides(5, 17, 'same', 'lite')).toBe(true);
    expect(meetPreferSides(44, 45, 'both')).toBe(true);
  });
});
