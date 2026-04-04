import {
  ALT_GRAPH_ACTION_CODE,
  FLAG_SHIFT_ACTION_CODES,
  FN_SHIFT_ACTION_CODES,
  NUM_SHIFT_ACTION_CODES,
  SHIFT_ACTION_CODES,
} from './actions.js';
describe('Modifier action codes', () => {
  it('modifier action codes should be correct', async () => {
    expect(NUM_SHIFT_ACTION_CODES).toEqual([550, 551]);
    expect(FN_SHIFT_ACTION_CODES).toEqual([552, 553]);
    expect(FLAG_SHIFT_ACTION_CODES).toEqual([554, 555]);
    expect(SHIFT_ACTION_CODES).toEqual([513, 517]);
    expect(ALT_GRAPH_ACTION_CODE).toEqual(518);
  });
});
