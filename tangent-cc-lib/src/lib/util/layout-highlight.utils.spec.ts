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

  // ModifierKeyPositionCodeMap 的 shift / altGraph 是依 layer 分組的 Record，
  // 未指定的 layer 以空陣列補齊。
  const layerRecord = (
    Layer: Record<string, string>,
    values: Record<string, number[]> = {},
  ) =>
    Object.fromEntries(
      Object.values(Layer).map((layer) => [layer, values[layer] ?? []]),
    );

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
        { numShift: [], fnShift: [], flagShift: [] },
        {
          shift: layerRecord(Layer, { [Layer.Primary]: [20, 50] }),
          altGraph: layerRecord(Layer),
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
      useLayerLock: false,
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
        { numShift: [21, 51], fnShift: [], flagShift: [] },
        {
          shift: layerRecord(Layer, { [Layer.Secondary]: [20, 50] }),
          altGraph: layerRecord(Layer),
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
      useLayerLock: false,
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
        { numShift: [], fnShift: [], flagShift: [] },
        {
          shift: layerRecord(Layer),
          altGraph: layerRecord(Layer, { [Layer.Primary]: [70, 71] }),
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
      useLayerLock: false,
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
        { numShift: [], fnShift: [], flagShift: [] },
        {
          shift: layerRecord(Layer, { [Layer.Primary]: [50] }),
          altGraph: layerRecord(Layer),
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
      useLayerLock: false,
    });
  });

  it('falls back to layer lock when no layer-shift key exists for the layer', async () => {
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
        { numShift: [], fnShift: [], flagShift: [] },
        { shift: layerRecord(Layer), altGraph: layerRecord(Layer) },
        highlightSetting,
      ),
    ).toEqual({
      characterKeyPositionCode: 10,
      layer: Layer.Secondary,
      shiftKey: false,
      altGraphKey: false,
      positionCodes: [10],
      score: 0,
      useLayerLock: true,
    });
  });

  it('returns undefined when shift is required but no shift key exists for the layer', async () => {
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
        { numShift: [21], fnShift: [], flagShift: [] },
        { shift: layerRecord(Layer), altGraph: layerRecord(Layer) },
        highlightSetting,
      ),
    ).toBeUndefined();
  });
});
