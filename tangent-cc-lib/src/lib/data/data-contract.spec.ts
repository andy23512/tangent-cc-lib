import {
  ACTIONS,
  ALT_GRAPH_ACTION_CODE,
  CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
  CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
  CCLITE_DEFAULT_DEVICE_LAYOUT,
  CHARACHORDER_3D_INPUT_DEVICE_PORTS,
  CHARACHORDER_3D_INPUT_DEVICES,
  CHARACHORDER_DEVICE_PORTS,
  CHARACHORDER_DEVICES,
  CHARACHORDER_LITE_DEVICE_PORTS,
  CHARACHORDER_LITE_DEVICES,
  CHARACTER_NAME_MAP,
  CHINESE_KEYBOARD_LAYOUTS,
  DEFAULT_DEVICE_LAYOUT,
  FLAG_SHIFT_ACTION_CODES,
  FN_SHIFT_ACTION_CODES,
  KEYBOARD_LAYOUTS_FROM_KBDLAYOUT,
  KEYBOARD_LAYOUTS_FROM_XKEYBOARD,
  LANGUAGE_TREE_FROM_KBDLAYOUT,
  LANGUAGE_TREE_FROM_XKEYBOARD,
  M4G_DEFAULT_DEVICE_LAYOUT,
  NO_ACTION_ACTION_CODES,
  NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP,
  NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
  NON_KEY_ACTIONS,
  NON_WSK_ACTIONS,
  NON_WSK_CODE_2_KEY_NAMES_MAP,
  NON_WSK_CODE_2_RAW_KEY_LABEL_MAP,
  NUM_SHIFT_ACTION_CODES,
  OS_2_ALT_KEY_LABEL_MAP,
  OS_2_META_KEY_LABEL_MAP,
  POSITION_CODE_LAYOUT,
  SHIFT_ACTION_CODES,
  WINDOWS_ALT_CODE_ACTIONS,
  WSK_ACTIONS,
} from '../tangent-cc-lib.js';
import * as publicApi from '../../index.js';
import { LAYERS } from './layers.js';
import { ActionType } from '../model/action.models.js';
import { DeviceLayout, Layer, Profile } from '../model/device-layout.models.js';
import { KeyLabelType } from '../model/key-label.models.js';
import type { KeyboardLayout } from '../model/keyboard-layout.models.js';
import type { LanguageTreeNode } from '../model/language-tree.models.js';
import { FontLogo } from '../type/font-logo.type.js';
import { SerialCommand } from '../type/serial-command.type.js';

const ALL_KEYBOARD_LAYOUTS: KeyboardLayout[] = [
  ...KEYBOARD_LAYOUTS_FROM_KBDLAYOUT,
  ...KEYBOARD_LAYOUTS_FROM_XKEYBOARD,
  ...CHINESE_KEYBOARD_LAYOUTS,
];

const DEVICE_LAYOUTS: [string, DeviceLayout, string, string, number, number][] = [
  ['default', DEFAULT_DEVICE_LAYOUT, 'default', 'cc1-cc2-default', 3, 90],
  ['m4g', M4G_DEFAULT_DEVICE_LAYOUT, 'm4g-default', 'm4g-default', 3, 90],
  ['right hand only', CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT, 'cc1-cc2-right-hand-only', 'cc1-cc2-right-hand-only', 3, 90],
  ['left hand only', CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT, 'cc1-cc2-left-hand-only', 'cc1-cc2-left-hand-only', 3, 90],
  ['lite', CCLITE_DEFAULT_DEVICE_LAYOUT, 'cclite-default', 'cclite-default', 4, 67],
];

describe('actions', () => {
  it('has 230 actions: 96 key, 70 non-WSK key, 62 non-key and 2 Windows Alt code', () => {
    expect(ACTIONS).toHaveLength(230);
    expect(WSK_ACTIONS).toHaveLength(96);
    expect(NON_WSK_ACTIONS).toHaveLength(70);
    expect(NON_KEY_ACTIONS).toHaveLength(62);
    expect(WINDOWS_ALT_CODE_ACTIONS).toHaveLength(2);
  });

  it('lists the four kinds in that order, each tagged with its type', () => {
    const types = ACTIONS.map((a) => a.type);
    const order = [...new Set(types)];
    expect(order).toEqual([ActionType.WSK, ActionType.NonWSK, ActionType.NonKey, ActionType.WindowsAltCode]);
    expect(types.filter((t) => t === ActionType.WSK)).toHaveLength(96);
    expect(types.filter((t) => t === ActionType.NonWSK)).toHaveLength(70);
    expect(types.filter((t) => t === ActionType.NonKey)).toHaveLength(62);
    expect(types.filter((t) => t === ActionType.WindowsAltCode)).toHaveLength(2);
    expect(types).toEqual([...types].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  });

  it('gives every action its own code', () => {
    expect(new Set(ACTIONS.map((a) => a.codeId)).size).toBe(ACTIONS.length);
  });

  it('keeps every code in the range the device can store: 32 to 1023 (10 bits, and below 32 is reserved)', () => {
    for (const { codeId } of ACTIONS) {
      expect(codeId).toBeGreaterThanOrEqual(32);
      expect(codeId).toBeLessThanOrEqual(0x3ff);
      expect(Number.isInteger(codeId)).toBe(true);
    }
  });

  it('keeps the no-action code out of the list', () => {
    expect(NO_ACTION_ACTION_CODES).toEqual([0]);
    expect(ACTIONS.some((a) => a.codeId === 0)).toBe(false);
  });

  it('gives every kind the fields it needs', () => {
    for (const a of ACTIONS) {
      if (a.type === ActionType.WSK) expect(typeof a.keyCode).toBe('string');
      if (a.type === ActionType.NonWSK) expect(typeof a.keyCode).toBe('string');
      if (a.type === ActionType.NonKey) expect(typeof a.actionName).toBe('string');
      if (a.type === ActionType.WindowsAltCode) expect(typeof a.character).toBe('string');
    }
  });

  it('has each key once per shift state among the key actions, except IntlBackslash (two codes, 356 and 796)', () => {
    const codesFor = new Map<string, number[]>();
    for (const a of ACTIONS) {
      if (a.type !== ActionType.WSK) continue;
      const key = `${a.keyCode}|${a.withShift ?? 'any'}`;
      codesFor.set(key, [...(codesFor.get(key) ?? []), a.codeId]);
    }
    const repeated = [...codesFor].filter(([, codes]) => codes.length > 1);
    expect(repeated).toEqual([['IntlBackslash|false', [356, 796]]]);
  });

  it('puts the modifier codes among the real actions, and in the right group', () => {
    const byCode = new Map(ACTIONS.map((a) => [a.codeId, a]));
    for (const code of [...SHIFT_ACTION_CODES, ALT_GRAPH_ACTION_CODE]) {
      expect(byCode.get(code)?.type, String(code)).toBe(ActionType.NonWSK);
    }
    for (const code of [...NUM_SHIFT_ACTION_CODES, ...FN_SHIFT_ACTION_CODES, ...FLAG_SHIFT_ACTION_CODES]) {
      expect(byCode.get(code)?.type, String(code)).toBe(ActionType.NonKey);
    }
  });

  it('has left and right codes for each shift, in that order', () => {
    const byCode = new Map(ACTIONS.map((a) => [a.codeId, a as { variant?: string }]));
    for (const pair of [SHIFT_ACTION_CODES, NUM_SHIFT_ACTION_CODES, FN_SHIFT_ACTION_CODES, FLAG_SHIFT_ACTION_CODES]) {
      expect(pair).toHaveLength(2);
      expect(byCode.get(pair[0])?.variant).toBe('left');
      expect(byCode.get(pair[1])?.variant).toBe('right');
    }
  });

  it('uses four different groups for the four kinds of shift', () => {
    const all = [...SHIFT_ACTION_CODES, ...NUM_SHIFT_ACTION_CODES, ...FN_SHIFT_ACTION_CODES, ...FLAG_SHIFT_ACTION_CODES, ALT_GRAPH_ACTION_CODE];
    expect(new Set(all).size).toBe(9);
  });
});

describe('labels and key names for the actions', () => {
  const nonWskKeyCodes = [...new Set(NON_WSK_ACTIONS.map((a) => (a as { keyCode: string }).keyCode))];
  const nonKeyNames = [...new Set(NON_KEY_ACTIONS.map((a) => (a as { actionName: string }).actionName))];

  it('has a label and key names for every non-WSK key, and for nothing else', () => {
    expect(nonWskKeyCodes).toHaveLength(67);
    expect(Object.keys(NON_WSK_CODE_2_RAW_KEY_LABEL_MAP).sort()).toEqual([...nonWskKeyCodes].sort());
    expect(Object.keys(NON_WSK_CODE_2_KEY_NAMES_MAP).sort()).toEqual([...nonWskKeyCodes].sort());
  });

  it('has a label and key names for every non-key action, and for nothing else', () => {
    expect(nonKeyNames).toHaveLength(62);
    expect(Object.keys(NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP).sort()).toEqual([...nonKeyNames].sort());
    expect(Object.keys(NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP).sort()).toEqual([...nonKeyNames].sort());
  });

  it('gives each label a title, a type and a symbol', () => {
    for (const label of [...Object.values(NON_WSK_CODE_2_RAW_KEY_LABEL_MAP), ...Object.values(NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP)]) {
      expect(Object.values(KeyLabelType)).toContain(label.type);
      expect(label.title).toMatch(/^[a-z0-9.-]+$/);
      expect(String(label.c).length).toBeGreaterThan(0);
    }
  });

  it('gives each key a name, except four non-key actions that cannot be typed (they have none)', () => {
    const noName: string[] = [];
    for (const [key, names] of Object.entries(NON_WSK_CODE_2_KEY_NAMES_MAP)) {
      if (names.length === 0) noName.push(key);
      names.forEach((n) => expect(n.trim().length, key).toBeGreaterThan(0));
    }
    for (const [key, names] of Object.entries(NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP)) {
      if (names.length === 0) noName.push(key);
      names.forEach((n) => expect(n.trim().length, key).toBeGreaterThan(0));
    }
    expect(noName.sort()).toEqual(['Delay1Ms', 'HoldCompound', 'Join', 'ReleaseCompound']);
  });

  it('uses only icon names it knows for icon labels, and numbers for action-code labels', () => {
    for (const label of [...Object.values(NON_WSK_CODE_2_RAW_KEY_LABEL_MAP), ...Object.values(NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP)]) {
      if (label.type === KeyLabelType.Icon) expect(label.c).toMatch(/^[a-z0-9_]+$/);
      if (label.type === KeyLabelType.ActionCode) expect(typeof label.c).toBe('number');
      if (label.type === KeyLabelType.Logo) expect(Object.values(FontLogo)).toContain(label.c);
    }
  });

  it('labels the Apple Alt keys with an icon and a title of their own', () => {
    expect(Object.keys(OS_2_ALT_KEY_LABEL_MAP).sort()).toEqual(['iOS', 'macOS']);
    for (const map of Object.values(OS_2_ALT_KEY_LABEL_MAP)) {
      expect(map.AltLeft).toMatchObject({ type: KeyLabelType.Icon, c: 'keyboard_option_key', title: 'key-label.apple-alt-left' });
      expect(map.AltRight).toMatchObject({ type: KeyLabelType.Icon, c: 'keyboard_option_key', title: 'key-label.apple-alt-right' });
    }
  });

  it('labels the Meta key by system: command, window or a distribution logo', () => {
    const maps = OS_2_META_KEY_LABEL_MAP;
    expect(Object.keys(maps)).toHaveLength(22);
    expect(maps.macOS?.MetaLeft).toEqual({ type: KeyLabelType.Icon, c: 'keyboard_command_key', title: 'key-label.apple-meta-left' });
    expect(maps.iOS).toBe(maps.macOS);
    expect(maps.Windows?.MetaRight).toEqual({ type: KeyLabelType.Icon, c: 'window', title: 'key-label.windows-meta-right' });
    expect(maps['Windows Phone']).toBe(maps.Windows);
    expect(maps['Windows Mobile']).toBe(maps.Windows);
    expect(maps.Linux?.MetaLeft).toEqual({ type: KeyLabelType.Logo, c: FontLogo.Tux, title: 'key-label.unix-meta-left' });
    expect(maps.Ubuntu?.MetaRight).toEqual({ type: KeyLabelType.Logo, c: FontLogo.Ubuntu, title: 'key-label.unix-meta-right' });
  });

  it('gives each Unix-like system its own logo', () => {
    const unix = Object.entries(OS_2_META_KEY_LABEL_MAP).filter(([, m]) => m?.MetaLeft.type === KeyLabelType.Logo);
    expect(unix).toHaveLength(17);
    const logos = unix.map(([, m]) => m?.MetaLeft.c);
    expect(new Set(logos).size).toBe(17);
    expect(new Set(logos)).toEqual(new Set(Object.values(FontLogo)));
  });

  it('keeps left and right Meta labels on the same symbol', () => {
    for (const map of Object.values(OS_2_META_KEY_LABEL_MAP)) {
      expect(map?.MetaLeft.c).toBe(map?.MetaRight.c);
    }
  });
});

describe('device layouts', () => {
  it.each(DEVICE_LAYOUTS)('%s has the id and name it is known by, and the right size', (_label, layout, id, name, layers, keys) => {
    expect(layout.id).toBe(id);
    expect(layout.name).toBe(name);
    expect(layout.layout).toHaveLength(layers);
    layout.layout.forEach((layer) => expect(layer).toHaveLength(keys));
  });

  it.each(DEVICE_LAYOUTS)('%s uses only real action codes or 0 (no action)', (_label, layout) => {
    const codes = new Set(ACTIONS.map((a) => a.codeId));
    for (const code of layout.layout.flat()) {
      expect(code === 0 || codes.has(code), String(code)).toBe(true);
    }
  });

  it('gives each layout its own id', () => {
    const ids = DEVICE_LAYOUTS.map(([, l]) => l.id);
    expect(new Set(ids).size).toBe(5);
  });

  const used = (layout: DeviceLayout, from: number, to: number) => layout.layout.map((layer) => layer.slice(from, to).filter((c) => c !== 0).length);

  it('fills 45 keys on each of the first two layers of the hand in use, and leaves its third layer empty (hand-only layouts)', () => {
    expect(used(CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT, 45, 90)).toEqual([45, 45, 0]);
    expect(used(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT, 0, 45)).toEqual([45, 45, 0]);
  });

  it('leaves every key of the other hand empty (hand-only layouts)', () => {
    expect(used(CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT, 0, 45)).toEqual([0, 0, 0]);
    expect(used(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT, 45, 90)).toEqual([0, 0, 0]);
  });

  it('fills 45 keys on the first layer of each hand, and 36 on the other layers, in the default layouts', () => {
    expect(used(DEFAULT_DEVICE_LAYOUT, 0, 45)).toEqual([45, 36, 36]);
    expect(used(DEFAULT_DEVICE_LAYOUT, 45, 90)).toEqual([45, 36, 36]);
  });

  it('puts something on the main layer of every layout', () => {
    for (const [, layout] of DEVICE_LAYOUTS) {
      expect(layout.layout[0].some((c) => c !== 0)).toBe(true);
    }
  });
});

describe('position codes', () => {
  const sides = ['left', 'right'] as const;

  it('number the 90 keys from 0 to 89, each once', () => {
    const codes = sides.flatMap((side) => Object.values(POSITION_CODE_LAYOUT[side]).flatMap((f) => Object.values(f)));
    expect(codes).toHaveLength(90);
    expect([...codes].sort((a, b) => a - b)).toEqual(Array.from({ length: 90 }, (_, i) => i));
  });

  it('give the left hand 0 to 44 and the right hand 45 to 89', () => {
    const range = (side: 'left' | 'right') => Object.values(POSITION_CODE_LAYOUT[side]).flatMap((f) => Object.values(f));
    expect(Math.min(...range('left'))).toBe(0);
    expect(Math.max(...range('left'))).toBe(44);
    expect(Math.min(...range('right'))).toBe(45);
    expect(Math.max(...range('right'))).toBe(89);
  });

  it('go finger by finger, five keys a finger, centre first', () => {
    const fingers = ['thumbEnd', 'thumbMid', 'thumbTip', 'index', 'middle', 'ring', 'little', 'middleMid', 'ringMid'] as const;
    fingers.forEach((finger, i) => {
      expect(POSITION_CODE_LAYOUT.left[finger].c).toBe(i * 5);
      expect(POSITION_CODE_LAYOUT.right[finger].c).toBe(45 + i * 5);
    });
  });

  it('order the four directions as mirror images between the hands', () => {
    // Left: e, n, w, s after the centre. Right: w, n, e, s (east and west swap).
    const left = POSITION_CODE_LAYOUT.left.index;
    const right = POSITION_CODE_LAYOUT.right.index;
    expect([left.c, left.e, left.n, left.w, left.s]).toEqual([15, 16, 17, 18, 19]);
    expect([right.c, right.w, right.n, right.e, right.s]).toEqual([60, 61, 62, 63, 64]);
  });

  it('lists the four layers in order (LAYERS is used inside the library and is not part of the public API)', () => {
    expect(LAYERS).toEqual([Layer.Primary, Layer.Secondary, Layer.Tertiary, Layer.Quaternary]);
    expect(LAYERS).toEqual(['1', '2', '3', '4']);
    expect('LAYERS' in publicApi).toBe(false);
  });
});

describe('devices', () => {
  it('knows nine devices, each with a USB id', () => {
    expect(CHARACHORDER_DEVICES).toHaveLength(9);
    expect(CHARACHORDER_DEVICE_PORTS.size).toBe(9);
    expect([...CHARACHORDER_DEVICE_PORTS.keys()]).toEqual(CHARACHORDER_DEVICES);
    for (const filter of CHARACHORDER_DEVICE_PORTS.values()) {
      expect(Number.isInteger(filter.usbVendorId)).toBe(true);
      expect(Number.isInteger(filter.usbProductId)).toBe(true);
    }
  });

  it('gives every device its own vendor and product pair', () => {
    const pairs = [...CHARACHORDER_DEVICE_PORTS.values()].map((f) => `${f.usbVendorId}:${f.usbProductId}`);
    expect(new Set(pairs).size).toBe(9);
  });

  it('uses the two vendor ids of the chip makers: 0x303a (Espressif) and 9114 (Adafruit)', () => {
    const vendors = new Set([...CHARACHORDER_DEVICE_PORTS.values()].map((f) => f.usbVendorId));
    expect(vendors).toEqual(new Set([0x303a, 9114]));
  });

  it('splits the devices into 3D input devices and Lite devices, without overlap', () => {
    expect(CHARACHORDER_3D_INPUT_DEVICES).toEqual(['ONE M0', 'TWO S3 (pre-production)', 'TWO S3', 'M4G S3 (pre-production)', 'M4G S3']);
    expect(CHARACHORDER_LITE_DEVICES).toEqual(['LITE S2', 'LITE M0']);
    expect(CHARACHORDER_3D_INPUT_DEVICES.filter((d) => CHARACHORDER_LITE_DEVICES.includes(d))).toEqual([]);
    for (const d of [...CHARACHORDER_3D_INPUT_DEVICES, ...CHARACHORDER_LITE_DEVICES]) expect(CHARACHORDER_DEVICES).toContain(d);
  });

  it('leaves X and T4G out of both groups', () => {
    const grouped = [...CHARACHORDER_3D_INPUT_DEVICES, ...CHARACHORDER_LITE_DEVICES] as string[];
    expect(grouped).not.toContain('X');
    expect(grouped).not.toContain('T4G S2');
  });

  it('gives each group the same USB ids as the full list', () => {
    for (const [group, ports] of [
      [CHARACHORDER_3D_INPUT_DEVICES, CHARACHORDER_3D_INPUT_DEVICE_PORTS],
      [CHARACHORDER_LITE_DEVICES, CHARACHORDER_LITE_DEVICE_PORTS],
    ] as const) {
      expect([...ports.keys()]).toEqual(group);
      for (const [device, filter] of ports) expect(filter).toBe(CHARACHORDER_DEVICE_PORTS.get(device));
    }
  });
});

describe('serial commands and enums', () => {
  it('uses the command text the firmware understands', () => {
    expect(SerialCommand).toEqual({
      Id: 'ID',
      Version: 'VERSION',
      GetChordMapCount: 'CML C0',
      GetChordMapByIndex: 'CML C1',
      GetKeyMap: 'VAR B3',
    });
  });

  it('names the profiles and layers as the firmware does', () => {
    expect(Profile).toEqual({ A: 'A', B: 'B', C: 'C' });
    expect(Layer).toEqual({ Primary: '1', Secondary: '2', Tertiary: '3', Quaternary: '4' });
  });

  it('uses 17 different private-use characters for the distribution logos', () => {
    const values = Object.values(FontLogo);
    expect(values).toHaveLength(17);
    expect(new Set(values).size).toBe(17);
    for (const v of values) {
      expect(v).toHaveLength(1);
      const code = v.codePointAt(0) as number;
      expect(code).toBeGreaterThanOrEqual(0xe000);
      expect(code).toBeLessThanOrEqual(0xf8ff);
    }
  });
});

describe('character names', () => {
  it('has 42 characters, each with at least one English and one Chinese name', () => {
    expect(CHARACTER_NAME_MAP.size).toBe(42);
    for (const [char, names] of CHARACTER_NAME_MAP) {
      expect(char).toHaveLength(1);
      expect(names.length).toBeGreaterThanOrEqual(2);
      expect(names.some((n) => /^[a-z ]+$/.test(n)), char).toBe(true);
      expect(names.some((n) => /[一-鿿]/.test(n)), char).toBe(true);
    }
  });

  it('names each character in its own words', () => {
    expect(CHARACTER_NAME_MAP.get('`')).toEqual(['backtick', 'backquote', 'grave', 'grave accent', 'grave mark', '重音符', '抑音符', '反引號']);
    expect(CHARACTER_NAME_MAP.get('1')).toEqual(['one', '一']);
  });
});

describe('keyboard layouts', () => {
  it('has 217 from kbdlayout, 1 from xkeyboard and 3 Chinese ones, all with different ids', () => {
    expect(KEYBOARD_LAYOUTS_FROM_KBDLAYOUT).toHaveLength(217);
    expect(KEYBOARD_LAYOUTS_FROM_XKEYBOARD).toHaveLength(1);
    expect(CHINESE_KEYBOARD_LAYOUTS).toHaveLength(3);
    expect(new Set(ALL_KEYBOARD_LAYOUTS.map((k) => k.id)).size).toBe(221);
  });

  it('gives each one an id, a name, a reference and a layout, and nothing else', () => {
    for (const k of ALL_KEYBOARD_LAYOUTS) {
      expect(Object.keys(k).sort()).toEqual(['id', 'layout', 'name', 'reference']);
      expect(k.id.length).toBeGreaterThan(0);
      expect(k.name.length).toBeGreaterThan(0);
      expect(Object.keys(k.layout).length).toBeGreaterThan(0);
    }
  });

  it('points each one at where its data came from', () => {
    for (const k of KEYBOARD_LAYOUTS_FROM_KBDLAYOUT) expect(k.reference).toMatch(/^https:\/\/kbdlayout\.info\/[0-9a-f]+\/?/);
    for (const k of KEYBOARD_LAYOUTS_FROM_XKEYBOARD) expect(k.reference).toMatch(/^https:\/\/xkeyboard-config\.freedesktop\.org\//);
  });

  it('names the layouts from xkeyboard with an @xkeyboard suffix and leaves it off the others', () => {
    expect(KEYBOARD_LAYOUTS_FROM_XKEYBOARD.map((k) => k.id)).toEqual(['fr-bre@xkeyboard']);
    for (const k of KEYBOARD_LAYOUTS_FROM_KBDLAYOUT) expect(k.id).not.toContain('@');
  });

  it('lists the first kbdlayout layout as ADLaM', () => {
    expect(KEYBOARD_LAYOUTS_FROM_KBDLAYOUT[0]).toMatchObject({ id: 'adlam', name: 'ADLaM', reference: 'https://kbdlayout.info/00140c00/' });
  });

  it('has the three Chinese layouts with their names', () => {
    expect(CHINESE_KEYBOARD_LAYOUTS.map((k) => [k.id, k.name])).toEqual([
      ['cangjie', '倉頡 (Cangjie)'],
      ['standard-bopomofo', '標準注音 (Standard Bopomofo)'],
      ['tanchord-36-v2', '天弦 36 鍵 V2 (TanChord 36 V2)'],
    ]);
  });

  it('writes every key output as text or a dead key, with a string value', () => {
    for (const k of ALL_KEYBOARD_LAYOUTS) {
      for (const [code, key] of Object.entries(k.layout)) {
        if (!key) continue;
        for (const [state, output] of Object.entries(key)) {
          const where = `${k.id} ${code} ${state}`;
          expect(['unmodified', 'withShift', 'withAltGraph', 'withShiftAltGraph'], where).toContain(state);
          expect(['text', 'dead-key'], where).toContain(output.type);
          expect(typeof output.value, where).toBe('string');
          expect(output.value.length, where).toBeGreaterThan(0);
        }
      }
    }
  });

  it('uses only key codes of a physical keyboard (at most 50 different ones)', () => {
    const codes = new Set(ALL_KEYBOARD_LAYOUTS.flatMap((k) => Object.keys(k.layout)));
    expect(codes.size).toBe(50);
    for (const code of codes) expect(code).toMatch(/^(Key[A-Z]|Digit\d|Backquote|Minus|Equal|Bracket(Left|Right)|Backslash|Semicolon|Quote|Comma|Period|Slash|Intl(Backslash|Ro|Yen))$/);
  });

  // The three hand-written Chinese layouts list the three international keys with no value.
  it('lists IntlYen, IntlBackslash and IntlRo as present but undefined in the Chinese layouts (current behaviour)', () => {
    for (const k of CHINESE_KEYBOARD_LAYOUTS) {
      for (const code of ['IntlYen', 'IntlBackslash', 'IntlRo']) {
        expect(Object.prototype.hasOwnProperty.call(k.layout, code), `${k.id} ${code}`).toBe(true);
        expect((k.layout as Record<string, unknown>)[code]).toBeUndefined();
      }
    }
    const undefinedEntries = ALL_KEYBOARD_LAYOUTS.flatMap((k) => Object.entries(k.layout).filter(([, v]) => v == null).map(([code]) => `${k.id}:${code}`));
    expect(undefinedEntries).toHaveLength(9);
  });

  it('types the US Q key as q and Q', () => {
    const us = ALL_KEYBOARD_LAYOUTS.find((k) => k.id === 'us');
    expect(us?.name).toBe('US');
    expect(us?.layout.KeyQ?.unmodified).toEqual({ type: 'text', value: 'q' });
    expect(us?.layout.KeyQ?.withShift).toEqual({ type: 'text', value: 'Q' });
  });
});

describe('language tree', () => {
  const nodes = (tree: LanguageTreeNode[]): LanguageTreeNode[] => tree.flatMap((n) => [n, ...(n.kind === 'group' ? nodes(n.children) : [])]);
  const all = nodes([...LANGUAGE_TREE_FROM_KBDLAYOUT, ...LANGUAGE_TREE_FROM_XKEYBOARD]);
  const refs = all.flatMap((n) => n.layouts.map((l) => l.id));

  it('has 152 languages and groups at the top from kbdlayout, and Breton from xkeyboard', () => {
    expect(LANGUAGE_TREE_FROM_KBDLAYOUT).toHaveLength(152);
    expect(LANGUAGE_TREE_FROM_XKEYBOARD).toHaveLength(1);
    expect(LANGUAGE_TREE_FROM_XKEYBOARD[0]).toEqual({
      kind: 'language',
      code: 'br',
      name: 'Breton',
      layouts: [{ id: 'fr-bre@xkeyboard', name: 'Breton (France)', isDefault: true, isDefaultFromOtherLanguage: false }],
    });
  });

  it('starts with Afrikaans, Albanian and the Alsatian group', () => {
    expect(LANGUAGE_TREE_FROM_KBDLAYOUT.slice(0, 3).map((n) => [n.kind, n.code, n.name])).toEqual([
      ['language', 'af', 'Afrikaans'],
      ['language', 'sq', 'Albanian'],
      ['group', 'gsw', 'Alsatian'],
    ]);
  });

  it('is only made of language nodes and group nodes, a group having children', () => {
    for (const n of all) {
      expect(['group', 'language']).toContain(n.kind);
      expect(n.code.length).toBeGreaterThan(0);
      expect(n.name.length).toBeGreaterThan(0);
      if (n.kind === 'group') expect(n.children.length).toBeGreaterThan(0);
      else expect('children' in n).toBe(false);
    }
  });

  it('only refers to keyboard layouts that exist', () => {
    const ids = new Set(ALL_KEYBOARD_LAYOUTS.map((k) => k.id));
    for (const ref of refs) expect(ids.has(ref), ref).toBe(true);
  });

  it('refers to every keyboard layout except the three hand-written Chinese ones', () => {
    const referred = new Set(refs);
    const missing = ALL_KEYBOARD_LAYOUTS.map((k) => k.id).filter((id) => !referred.has(id));
    expect(missing.sort()).toEqual(['cangjie', 'standard-bopomofo', 'tanchord-36-v2']);
    expect(referred.size).toBe(218);
  });

  it('lists a layout under more than one language where several languages use it', () => {
    expect(refs.length).toBe(316);
    expect(refs.length).toBeGreaterThan(new Set(refs).size);
  });

  it('gives each layout reference an id, a name and two flags', () => {
    for (const n of all) {
      for (const l of n.layouts) {
        expect(Object.keys(l).sort()).toEqual(['id', 'isDefault', 'isDefaultFromOtherLanguage', 'name']);
        expect(typeof l.isDefault).toBe('boolean');
        expect(typeof l.isDefaultFromOtherLanguage).toBe('boolean');
      }
    }
  });

  it('lists at least one layout for every language, and a group with none of its own has them in its children', () => {
    const layoutsBelow = (n: LanguageTreeNode): number => n.layouts.length + (n.kind === 'group' ? n.children.reduce((sum, c) => sum + layoutsBelow(c), 0) : 0);
    for (const n of all) {
      if (n.kind === 'language') expect(n.layouts.length, n.code).toBeGreaterThan(0);
      else expect(layoutsBelow(n), n.code).toBeGreaterThan(0);
    }
  });

  it('gives each language node its own code within the same list', () => {
    const codes = LANGUAGE_TREE_FROM_KBDLAYOUT.map((n) => n.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
