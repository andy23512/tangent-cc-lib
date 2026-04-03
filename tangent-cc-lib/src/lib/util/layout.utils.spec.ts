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
