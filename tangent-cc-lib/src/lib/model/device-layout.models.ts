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
}

export enum Layer {
  Primary = 'A1',
  Secondary = 'A2' /* Numeric */,
  Tertiary = 'A3' /* Functional */,
  Quaternary = 'A4' /* Flag */,
}
