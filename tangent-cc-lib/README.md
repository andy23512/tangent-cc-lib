# Tangent CC Lib

[![NPM](https://nodei.co/npm/tangent-cc-lib.png)](https://npmjs.org/package/tangent-cc-lib)

A shared TypeScript library that collect the shared things across Tangent's several CharaChorder side projects.

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
