import { Tuple } from '../type/tuple.type.js';

/**
 * Shape of CharaChorder device layout data.
 * CharaChorder 3D input device: 90 keys x 3-4 layers
 * CharaChorder Lite and X: 67 keys x 3-4 layers
 */
export interface DeviceLayout {
  id: string;
  name: string;
  layout:
    | Tuple<Tuple<number, 90>, 3>
    | Tuple<Tuple<number, 90>, 4>
    | Tuple<Tuple<number, 67>, 3>
    | Tuple<Tuple<number, 67>, 4>;
  profile?: Profile;
}

export enum Layer {
  Primary = '1',
  Secondary = '2' /* Numeric */,
  Tertiary = '3' /* Functional */,
  Quaternary = '4' /* Flag */,
}

export enum Profile {
  A = 'A',
  B = 'B',
  C = 'C',
}

export type ProfileLayoutMap = Partial<Record<Profile, DeviceLayout['layout']>>;
