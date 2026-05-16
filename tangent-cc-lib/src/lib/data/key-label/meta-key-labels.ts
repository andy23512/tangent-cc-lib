import { KeyLabelType, RawKeyLabel } from '../../model/key-label.models.js';
import { FontLogo } from '../../type/font-logo.type.js';
import { OperatingSystemName } from '../../type/operating-system-name.type.js';

type MetaKeyLabelMap = Record<'MetaLeft' | 'MetaRight', RawKeyLabel>;

const APPLE_META_KEY_LABEL_MAP: MetaKeyLabelMap = {
  MetaLeft: {
    type: KeyLabelType.Icon,
    c: 'keyboard_command_key',
    title: 'key-label.apple-meta-left',
  },
  MetaRight: {
    type: KeyLabelType.Icon,
    c: 'keyboard_command_key',
    title: 'key-label.apple-meta-right',
  },
};

const WINDOWS_META_KEY_LABEL_MAP: MetaKeyLabelMap = {
  MetaLeft: {
    type: KeyLabelType.Icon,
    c: 'window',
    title: 'key-label.windows-meta-left',
  },
  MetaRight: {
    type: KeyLabelType.Icon,
    c: 'window',
    title: 'key-label.windows-meta-right',
  },
};

function getUnixMetaKeyLabelMap(fontLogo: FontLogo): MetaKeyLabelMap {
  return {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: fontLogo,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: fontLogo,
      title: 'key-label.unix-meta-right',
    },
  };
}

export const OS_2_META_KEY_LABEL_MAP: Partial<
  Record<OperatingSystemName, MetaKeyLabelMap>
> = {
  macOS: APPLE_META_KEY_LABEL_MAP,
  iOS: APPLE_META_KEY_LABEL_MAP,
  Windows: WINDOWS_META_KEY_LABEL_MAP,
  'Windows Mobile': WINDOWS_META_KEY_LABEL_MAP,
  'Windows Phone': WINDOWS_META_KEY_LABEL_MAP,
  Ubuntu: getUnixMetaKeyLabelMap(FontLogo.Ubuntu),
  Arch: getUnixMetaKeyLabelMap(FontLogo.ArchLinux),
  CentOS: getUnixMetaKeyLabelMap(FontLogo.CentOS),
  Debian: getUnixMetaKeyLabelMap(FontLogo.Debian),
  'elementary OS': getUnixMetaKeyLabelMap(FontLogo.Elementary),
  Fedora: getUnixMetaKeyLabelMap(FontLogo.Fedora),
  FreeBSD: getUnixMetaKeyLabelMap(FontLogo.FreeBSD),
  Gentoo: getUnixMetaKeyLabelMap(FontLogo.Gentoo),
  Mageia: getUnixMetaKeyLabelMap(FontLogo.Mageia),
  Mandriva: getUnixMetaKeyLabelMap(FontLogo.Mandriva),
  Manjaro: getUnixMetaKeyLabelMap(FontLogo.Manjaro),
  Mint: getUnixMetaKeyLabelMap(FontLogo.LinuxMint),
  OpenBSD: getUnixMetaKeyLabelMap(FontLogo.OpenBSD),
  Raspbian: getUnixMetaKeyLabelMap(FontLogo.RaspberryPi),
  RedHat: getUnixMetaKeyLabelMap(FontLogo.RedHat),
  Sabayon: getUnixMetaKeyLabelMap(FontLogo.Sabayon),
  Linux: getUnixMetaKeyLabelMap(FontLogo.Tux),
};
