import { Layer } from '../model/device-layout.models.js';

// Reference: https://docs.charachorder.com/SerialAPI.html
export enum SerialCommand {
  Id = 'ID',
  Version = 'VERSION',
  GetChordMapCount = 'CML C0',
  GetChordMapByIndex = 'CML C1',
  GetKeyMap = 'VAR B3',
}

export type SerialCommandArgMap = {
  [SerialCommand.Id]: [];
  [SerialCommand.Version]: [];
  [SerialCommand.GetChordMapCount]: [];
  [SerialCommand.GetChordMapByIndex]: [number];
  [SerialCommand.GetKeyMap]: [Layer, number];
};
