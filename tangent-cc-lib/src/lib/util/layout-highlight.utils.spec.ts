describe('getHighlightKeyCombinationFromKeyCombinations', () => {
  const highlightSetting = {
    shiftAndNumShiftLayer: {
      preferCharacterKeySide: 'left',
      preferShiftSide: 'right',
    },
    shiftAndFnShiftLayer: {
      preferCharacterKeySide: 'left',
      preferShiftSide: 'right',
    },
    shiftAndFlagShiftLayer: {
      preferCharacterKeySide: 'left',
      preferShiftSide: 'right',
    },
    shiftLayer: {
      preferShiftSide: 'right',
      preferSides: 'both',
    },
    numShiftLayer: {
      preferNumShiftSide: 'left',
      preferSides: 'both',
    },
    fnShiftLayer: {
      preferFnShiftSide: 'left',
      preferSides: 'both',
    },
    flagShiftLayer: {
      preferFlagShiftSide: 'left',
      preferSides: 'both',
    },
  } as any;

  it('picks the highest-scoring shift-layer combination on primary layer', async () => {
    const { getHighlightKeyCombinationFromKeyCombinations } = await import(
      './layout-highlight.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    expect(
      getHighlightKeyCombinationFromKeyCombinations(
        [
          {
            characterKeyPositionCode: 10,
            layer: Layer.Primary,
            shiftKey: true,
            altGraphKey: false,
          },
        ],
        {
          shift: [20, 50],
          numShift: [],
          fnShift: [],
          flagShift: [],
          altGraph: [],
        },
        highlightSetting,
      ),
    ).toEqual({
      characterKeyPositionCode: 10,
      layer: Layer.Primary,
      shiftKey: true,
      altGraphKey: false,
      positionCodes: [10, 50],
      score: 3,
    });
  });

  it('builds shift+numShift combinations on secondary layer and selects best score', async () => {
    const { getHighlightKeyCombinationFromKeyCombinations } = await import(
      './layout-highlight.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    expect(
      getHighlightKeyCombinationFromKeyCombinations(
        [
          {
            characterKeyPositionCode: 10,
            layer: Layer.Secondary,
            shiftKey: true,
            altGraphKey: false,
          },
        ],
        {
          shift: [20, 50],
          numShift: [21, 51],
          fnShift: [],
          flagShift: [],
          altGraph: [],
        },
        highlightSetting,
      ),
    ).toEqual({
      characterKeyPositionCode: 10,
      layer: Layer.Secondary,
      shiftKey: true,
      altGraphKey: false,
      positionCodes: [10, 50, 21],
      score: 3,
    });
  });

  it('appends alt-graph position codes when altGraphKey is true', async () => {
    const { getHighlightKeyCombinationFromKeyCombinations } = await import(
      './layout-highlight.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    expect(
      getHighlightKeyCombinationFromKeyCombinations(
        [
          {
            characterKeyPositionCode: 12,
            layer: Layer.Primary,
            shiftKey: false,
            altGraphKey: true,
          },
        ],
        {
          shift: [],
          numShift: [],
          fnShift: [],
          flagShift: [],
          altGraph: [70, 71],
        },
        highlightSetting,
      ),
    ).toEqual({
      characterKeyPositionCode: 12,
      layer: Layer.Primary,
      shiftKey: false,
      altGraphKey: true,
      positionCodes: [12, 70, 71],
      score: 0,
    });
  });

  it('prefers fewer pressed keys before score during final selection', async () => {
    const { getHighlightKeyCombinationFromKeyCombinations } = await import(
      './layout-highlight.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    expect(
      getHighlightKeyCombinationFromKeyCombinations(
        [
          {
            characterKeyPositionCode: 10,
            layer: Layer.Primary,
            shiftKey: true,
            altGraphKey: false,
          },
          {
            characterKeyPositionCode: 11,
            layer: Layer.Primary,
            shiftKey: false,
            altGraphKey: false,
          },
        ],
        {
          shift: [50],
          numShift: [],
          fnShift: [],
          flagShift: [],
          altGraph: [],
        },
        highlightSetting,
      ),
    ).toEqual({
      characterKeyPositionCode: 11,
      layer: Layer.Primary,
      shiftKey: false,
      altGraphKey: false,
      positionCodes: [11],
      score: 0,
    });
  });

  it('returns undefined when no valid modifier combinations can be built', async () => {
    const { getHighlightKeyCombinationFromKeyCombinations } = await import(
      './layout-highlight.utils.js'
    );
    const { Layer } = await import('../model/device-layout.models.js');

    expect(
      getHighlightKeyCombinationFromKeyCombinations(
        [
          {
            characterKeyPositionCode: 10,
            layer: Layer.Secondary,
            shiftKey: false,
            altGraphKey: false,
          },
        ],
        {
          shift: [],
          numShift: [],
          fnShift: [],
          flagShift: [],
          altGraph: [],
        },
        highlightSetting,
      ),
    ).toBeUndefined();
  });
});
