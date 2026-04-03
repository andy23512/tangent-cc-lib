import { FontLogo } from '../type/font-logo.type.js';
import { KeyLabelIcon } from '../type/key-label-icon.type.js';
import { Layer } from './device-layout.models.js';

export type RawKeyLabel =
  | {
      type: KeyLabelType.String;
      c: string;
      title: string;
      isDeadKey?: boolean;
    }
  | { type: KeyLabelType.Icon; c: KeyLabelIcon; title: string }
  | { type: KeyLabelType.Logo; c: FontLogo; title: string }
  | { type: KeyLabelType.ActionCode; c: number; title: string };

/*
 * Label of a physical key, which records the corresponding character when the key is triggered under certain layer and modifiers
 */
export type KeyLabel = RawKeyLabel & {
  layer: Layer | null;
  shiftKey: boolean | null;
  altGraphKey: boolean | null;
};

export enum KeyLabelType {
  String = 'string',
  Icon = 'icon',
  Logo = 'logo',
  ActionCode = 'action-code',
}
