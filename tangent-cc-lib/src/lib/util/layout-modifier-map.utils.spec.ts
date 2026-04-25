describe('modifier position utilities', () => {
  const loadModuleWithActionConstants = async ({
    ACTIONS = [],
    SHIFT_ACTION_CODES = ['SHIFT1', 'SHIFT2'],
    NUM_SHIFT_ACTION_CODES = ['NUM1', 'NUM2'],
    FN_SHIFT_ACTION_CODES = ['FN1', 'FN2'],
    FLAG_SHIFT_ACTION_CODES = ['FLAG1', 'FLAG2'],
    ALT_GRAPH_ACTION_CODE = 'ALT',
  }: Partial<Record<string, unknown>> = {}) => {
    vi.resetModules();
    vi.doMock('../data/actions.js', () => ({
      ACTIONS,
      SHIFT_ACTION_CODES,
      NUM_SHIFT_ACTION_CODES,
      FN_SHIFT_ACTION_CODES,
      FLAG_SHIFT_ACTION_CODES,
      ALT_GRAPH_ACTION_CODE,
    }));
    return import('./layout-modifier-map.utils.js');
  };

  afterEach(() => {
    vi.doUnmock('../data/actions.js');
    vi.resetModules();
  });

  it('getNumShiftKeyPositionCodes returns matching positions from primary/secondary layers', async () => {
    const { getNumShiftKeyPositionCodes } =
      await loadModuleWithActionConstants();
    const deviceLayout = {
      layout: [
        ['FN1', 'NUM1', 'SHIFT1', 'NUM2', 'FLAG1'],
        ['FN2', 'NUM2', 'SHIFT2', 'NUM1', 'FLAG2'],
        ['FN2', 'X', 'SHIFT1', 'Y', 'FLAG1'],
        ['FLAG2', 'ALT', 'Q', 'SHIFT2', 'FLAG1'],
      ],
    } as any;

    expect(getNumShiftKeyPositionCodes(deviceLayout)).toEqual([1, 3]);
  });

  it('getFnShiftKeyPositionCodes returns matching positions from primary/tertiary layers', async () => {
    const { getFnShiftKeyPositionCodes } =
      await loadModuleWithActionConstants();
    const deviceLayout = {
      layout: [
        ['FN1', 'NUM1', 'SHIFT1', 'NUM2', 'FLAG1'],
        ['FN2', 'NUM2', 'SHIFT2', 'NUM1', 'FLAG2'],
        ['FN2', 'X', 'SHIFT1', 'Y', 'FLAG1'],
      ],
    } as any;

    expect(getFnShiftKeyPositionCodes(deviceLayout)).toEqual([0]);
  });

  it('getFlagShiftKeyPositionCodes returns empty array when quaternary layer is missing', async () => {
    const { getFlagShiftKeyPositionCodes } =
      await loadModuleWithActionConstants();
    const deviceLayout = {
      layout: [
        ['FLAG1', 'A'],
        ['B', 'C'],
        ['FLAG2', 'D'],
      ],
    } as any;

    expect(getFlagShiftKeyPositionCodes(deviceLayout)).toEqual([]);
  });

  it('getFlagShiftKeyPositionCodes returns matching positions from primary/quaternary layers', async () => {
    const { getFlagShiftKeyPositionCodes } =
      await loadModuleWithActionConstants();
    const deviceLayout = {
      layout: [
        ['FN1', 'NUM1', 'SHIFT1', 'NUM2', 'FLAG1'],
        ['FN2', 'NUM2', 'SHIFT2', 'NUM1', 'FLAG2'],
        ['FN2', 'X', 'SHIFT1', 'Y', 'FLAG1'],
        ['FLAG2', 'ALT', 'Q', 'SHIFT2', 'FLAG1'],
      ],
    } as any;

    expect(getFlagShiftKeyPositionCodes(deviceLayout)).toEqual([4]);
  });

  it('getModifierKeyPositionCodeMap returns combined modifier positions', async () => {
    const { getLayerShiftPositionCodeMap: getModifierKeyPositionCodeMap } =
      await loadModuleWithActionConstants();
    const deviceLayout = {
      layout: [
        ['FN1', 'NUM1', 'SHIFT1', 'NUM2', 'FLAG1'],
        ['FN2', 'NUM2', 'SHIFT2', 'NUM1', 'FLAG2'],
        ['FN2', 'X', 'SHIFT1', 'Y', 'FLAG1'],
        ['FLAG2', 'ALT', 'Q', 'SHIFT2', 'FLAG1'],
      ],
    } as any;

    expect(getModifierKeyPositionCodeMap(deviceLayout)).toEqual({
      shift: [2, 2, 2, 3],
      numShift: [1, 3],
      fnShift: [0],
      flagShift: [4],
      altGraph: [1],
    });
  });
});

describe('getKeyCombinationsFromActionCodes', () => {
  it('returns null when deviceLayout is null', async () => {
    const { getKeyCombinationsFromActionCodes } = await import(
      './layout-modifier-map.utils.js'
    );

    expect(
      getKeyCombinationsFromActionCodes(
        [{ actionCode: 200, shiftKey: false, altGraphKey: false }],
        null,
      ),
    ).toBeNull();
  });

  it('returns flattened key combinations across layers with correct layer mapping and modifiers', async () => {
    const { getKeyCombinationsFromActionCodes } = await import(
      './layout-modifier-map.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    const deviceLayout = {
      layout: [
        [1, 2],
        [3, 1],
        [1, 4],
        [5, 1],
      ],
    } as any;

    expect(
      getKeyCombinationsFromActionCodes(
        [
          { actionCode: 1, shiftKey: true, altGraphKey: false },
          { actionCode: 5, shiftKey: false, altGraphKey: true },
        ],
        deviceLayout,
      ),
    ).toEqual([
      {
        characterKeyPositionCode: 0,
        layer: Layer.Primary,
        shiftKey: true,
        altGraphKey: false,
      },
      {
        characterKeyPositionCode: 1,
        layer: Layer.Secondary,
        shiftKey: true,
        altGraphKey: false,
      },
      {
        characterKeyPositionCode: 0,
        layer: Layer.Tertiary,
        shiftKey: true,
        altGraphKey: false,
      },
      {
        characterKeyPositionCode: 1,
        layer: Layer.Quaternary,
        shiftKey: true,
        altGraphKey: false,
      },
      {
        characterKeyPositionCode: 0,
        layer: Layer.Quaternary,
        shiftKey: false,
        altGraphKey: true,
      },
    ]);
  });

  it('returns an empty array when action codes are not present in any layer', async () => {
    const { getKeyCombinationsFromActionCodes } = await import(
      './layout-modifier-map.utils.js'
    );
    const deviceLayout = {
      layout: [[1], [2], [3]],
    } as any;

    expect(
      getKeyCombinationsFromActionCodes(
        [{ actionCode: 26, shiftKey: false, altGraphKey: false }],
        deviceLayout,
      ),
    ).toEqual([]);
  });
});
