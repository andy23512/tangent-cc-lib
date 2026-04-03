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
