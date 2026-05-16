import { KeyLabelType, RawKeyLabel } from '../../model/key-label.models.js';
import { OperatingSystemName } from '../../type/operating-system-name.type.js';

type AltKeyLabelMap = Record<'AltLeft' | 'AltRight', RawKeyLabel>;

const APPLE_ALT_KEY_LABEL_MAP: AltKeyLabelMap = {
  AltLeft: {
    type: KeyLabelType.Icon,
    c: 'keyboard_option_key',
    title: 'key-label.apple-alt-left',
  },
  AltRight: {
    type: KeyLabelType.Icon,
    c: 'keyboard_option_key',
    title: 'key-label.apple-alt-right',
  },
};

export const OS_2_ALT_KEY_LABEL_MAP: Partial<
  Record<OperatingSystemName, AltKeyLabelMap>
> = {
  macOS: APPLE_ALT_KEY_LABEL_MAP,
  iOS: APPLE_ALT_KEY_LABEL_MAP,
};
