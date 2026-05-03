import {
	ChordInNumberListForm,
	convertChordInNumberListFormToChord,
	convertChordsToChordTreeNodes,
	parseChordActions,
	parsePhrase,
} from '../tangent-cc-lib.js';

describe('chord process flow testing', () => {
  const sampleRawChords: { chordActions: string; phrase: string }[] = [
    {
      chordActions: '001C86C0000000000000000000000000',
      phrase: '022E6C696231023E',
    },
    {
      chordActions: '001C861000000000000000002068836F',
      phrase: '61726D',
    },
  ];
  const chordsInNumberListForm: ChordInNumberListForm[] = sampleRawChords.map(
    ({ chordActions, phrase }) => [
      parseChordActions(chordActions),
      parsePhrase(phrase),
    ],
  );
  const chords = chordsInNumberListForm.map(
    convertChordInNumberListFormToChord,
  );
  const chordTreeNodes = convertChordsToChordTreeNodes(chords);

  it('should chords into number list form be converted correctly', () => {
    expect(chordsInNumberListForm).toEqual([
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 114],
        [558, 108, 105, 98, 49, 574],
      ],
      [
        [879, 544, 518, 0, 0, 0, 0, 0, 0, 0, 97, 114],
        [97, 114, 109],
      ],
    ]);
  });

  it('should chord tree nodes be converted correctly', () => {
    expect(chordTreeNodes.length).toBe(1);
    expect(chordTreeNodes[0].id).toBe(543720303);
    expect(chordTreeNodes[0].children.length).toBe(1);
    expect(chordTreeNodes[0].children[0].id).toBe(216631165);
    expect(chordTreeNodes[0].children[0].ancestors[0]).toBe(chordTreeNodes[0]);
  });
});
