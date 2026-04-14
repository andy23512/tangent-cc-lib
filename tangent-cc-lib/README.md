# Tangent CC Lib

[![NPM](https://nodei.co/npm/tangent-cc-lib.png)](https://npmjs.org/package/tangent-cc-lib)

A shared TypeScript library that collects reusable data models, datasets, and utilities across Tangent's CharaChorder side projects.

This repository is an Nx workspace that builds and publishes the `tangent-cc-lib` package from `tangent-cc-lib/`.

## What this library provides

- Action datasets for WSK, non-WSK, and non-key CharaChorder device actions.
- Device layout data, key label data, and keyboard layout catalogs.
- Strongly typed models for actions, layouts, key codes, and combinations.
- Utility functions to:
  - map keyboard layouts to character key maps,
  - convert action codes into key combinations,
  - compute modifier key positions,
  - derive highlight combinations.

## Install

```bash
npm install tangent-cc-lib
```

## Basic usage

```ts
import {
  ACTIONS,
  KEYBOARD_LAYOUTS_FROM_KBDLAYOUT,
  DEFAULT_DEVICE_LAYOUT,
  convertKeyboardLayoutToCharacterKeyCodeMap,
  getModifierKeyPositionCodeMap,
} from 'tangent-cc-lib';

const usKeyboardLayout =
  KEYBOARD_LAYOUTS_FROM_KBDLAYOUT.find((layout) => layout.id === 'en-US') ??
  null;
const keyMap = convertKeyboardLayoutToCharacterKeyCodeMap(usKeyboardLayout);

const modifierMap = getModifierKeyPositionCodeMap(DEFAULT_DEVICE_LAYOUT);

console.log(ACTIONS.length, keyMap.size, modifierMap?.shift.length ?? 0);
```

## Build and test (workspace)

From the repository root:

```bash
npm run build
npm run test
npm run lint
```

Equivalent Nx commands:

```bash
npx nx build tangent-cc-lib
npx nx test tangent-cc-lib
npx nx lint tangent-cc-lib
```

## License

MIT
