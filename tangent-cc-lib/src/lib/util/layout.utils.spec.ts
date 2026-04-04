import { KeyboardLayout } from '../model/keyboard-layout.models.js';
import { convertKeyboardLayoutToCharacterKeyCodeMap } from './layout.utils.js';

describe('convertKeyboardLayoutToCharacterKeyCodeMap', () => {
  it('returns an empty map when keyboardLayout is null', () => {
    expect(convertKeyboardLayoutToCharacterKeyCodeMap(null)).toEqual(new Map());
  });

  it('converts text outputs into character to key code mappings with modifier flags', () => {
    const keyboardLayout: KeyboardLayout = {
      id: 'test-layout',
      name: 'Test Layout',
      reference: 'test-layout-ref',
      layout: {
        KeyA: {
          unmodified: { type: 'text', value: 'a' },
          withShift: { type: 'text', value: 'A' },
          withAltGraph: { type: 'text', value: '@' },
          withShiftAltGraph: { type: 'text', value: 'Å' },
        },
        KeyB: {
          unmodified: { type: 'text', value: 'b' },
        },
      },
    };

    expect(convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout)).toEqual(
      new Map([
        ['a', { keyCode: 'KeyA', shiftKey: false, altGraphKey: false }],
        ['A', { keyCode: 'KeyA', shiftKey: true, altGraphKey: false }],
        ['@', { keyCode: 'KeyA', shiftKey: false, altGraphKey: true }],
        ['Å', { keyCode: 'KeyA', shiftKey: true, altGraphKey: true }],
        ['b', { keyCode: 'KeyB', shiftKey: false, altGraphKey: false }],
      ]),
    );
  });

  it('ignores falsy layout entries and non-text outputs', () => {
    const keyboardLayout: KeyboardLayout = {
      id: 'test-layout',
      name: 'Test Layout',
      reference: 'test-layout-ref',
      layout: {
        KeyA: undefined,
        KeyB: {
          unmodified: { type: 'dead-key', value: '`' },
          withShift: { type: 'text', value: 'B' },
        },
      },
    };

    expect(convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout)).toEqual(
      new Map([['B', { keyCode: 'KeyB', shiftKey: true, altGraphKey: false }]]),
    );
  });

  it('keeps the last mapping when the same character appears multiple times', () => {
    const keyboardLayout: KeyboardLayout = {
      id: 'test-layout',
      name: 'Test Layout',
      reference: 'test-layout-ref',
      layout: {
        KeyA: {
          unmodified: { type: 'text', value: 'x' },
        },
        KeyB: {
          unmodified: { type: 'text', value: 'x' },
        },
      },
    };

    expect(convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout)).toEqual(
      new Map([
        ['x', { keyCode: 'KeyB', shiftKey: false, altGraphKey: false }],
      ]),
    );
  });
});

describe('getCharacterActionCodesFromCharacterKeyCode', () => {
  const loadModuleWithActions = async (
    actions: Array<Record<string, unknown>>,
  ) => {
    vi.resetModules();
    vi.doMock('../data/actions.js', () => ({
      ACTIONS: actions,
    }));
    return import('./layout.utils.js');
  };

  afterEach(() => {
    vi.doUnmock('../data/actions.js');
    vi.resetModules();
  });

  it('returns an empty array when no matching WSK action exists for the key code', async () => {
    const { ActionType } = await import('../model/action.models.js');
    const { getCharacterActionCodesFromCharacterKeyCode } =
      await loadModuleWithActions([
        {
          type: ActionType.WSK,
          keyCode: 'KeyZ',
          withShift: false,
          codeId: 'z-base',
        },
      ]);

    expect(
      getCharacterActionCodesFromCharacterKeyCode({
        keyCode: 'KeyA',
        shiftKey: false,
        altGraphKey: false,
      }),
    ).toEqual([]);
  });

  it('returns the base action with the incoming modifier flags when shiftKey is false', async () => {
    const { ActionType } = await import('../model/action.models.js');
    const { getCharacterActionCodesFromCharacterKeyCode } =
      await loadModuleWithActions([
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: false,
          codeId: 'a-base',
        },
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: true,
          codeId: 'a-shift',
        },
      ]);

    expect(
      getCharacterActionCodesFromCharacterKeyCode({
        keyCode: 'KeyA',
        shiftKey: false,
        altGraphKey: true,
      }),
    ).toEqual([{ actionCode: 'a-base', shiftKey: false, altGraphKey: true }]);
  });

  it('returns base action and hold-shift action when shiftKey is true and both actions exist', async () => {
    const { ActionType } = await import('../model/action.models.js');
    const { getCharacterActionCodesFromCharacterKeyCode } =
      await loadModuleWithActions([
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: false,
          codeId: 'a-base',
        },
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: true,
          codeId: 'a-shift',
        },
      ]);

    expect(
      getCharacterActionCodesFromCharacterKeyCode({
        keyCode: 'KeyA',
        shiftKey: true,
        altGraphKey: true,
      }),
    ).toEqual([
      { actionCode: 'a-base', shiftKey: true, altGraphKey: true },
      { actionCode: 'a-shift', shiftKey: false, altGraphKey: true },
    ]);
  });

  it('returns only the base action when shiftKey is true but no hold-shift action exists', async () => {
    const { ActionType } = await import('../model/action.models.js');
    const { getCharacterActionCodesFromCharacterKeyCode } =
      await loadModuleWithActions([
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: false,
          codeId: 'a-base',
        },
      ]);

    expect(
      getCharacterActionCodesFromCharacterKeyCode({
        keyCode: 'KeyA',
        shiftKey: true,
        altGraphKey: false,
      }),
    ).toEqual([{ actionCode: 'a-base', shiftKey: true, altGraphKey: false }]);
  });

  it('returns only the hold-shift action when shiftKey is true and base action is missing', async () => {
    const { ActionType } = await import('../model/action.models.js');
    const { getCharacterActionCodesFromCharacterKeyCode } =
      await loadModuleWithActions([
        {
          type: ActionType.WSK,
          keyCode: 'KeyA',
          withShift: true,
          codeId: 'a-shift',
        },
      ]);

    expect(
      getCharacterActionCodesFromCharacterKeyCode({
        keyCode: 'KeyA',
        shiftKey: true,
        altGraphKey: false,
      }),
    ).toEqual([{ actionCode: 'a-shift', shiftKey: false, altGraphKey: false }]);
  });
});

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
    return import('./layout.utils.js');
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
    const { getModifierKeyPositionCodeMap } =
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
      './layout.utils.js'
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
      './layout.utils.js'
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
      './layout.utils.js'
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
