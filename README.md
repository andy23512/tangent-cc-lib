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

## Workspace layout

```text
.
├─ tangent-cc-lib/           # Publishable package
│  ├─ src/
│  └─ package.json
├─ packages/                 # Reserved workspace packages
├─ nx.json
└─ package.json
```

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+

## Install dependencies

```bash
npm install
```

## Build, test, and lint

From the workspace root:

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

## Using the library

Install in another project:

```bash
npm install tangent-cc-lib
```

## Publishing

The root workspace includes a convenience script:

```bash
npm run build-and-publish
```

This script:

1. Builds the library.
2. Publishes from `tangent-cc-lib/dist`.

Before publishing, make sure:

- package version in `tangent-cc-lib/package.json` is updated.
- you are authenticated (`npm login`).
- publish access is correct for your registry.

## Development notes

- The workspace uses Nx plugins for TypeScript build, ESLint, and Vitest.
- Tests live alongside source files as `*.spec.ts`.
- The package entry point is `tangent-cc-lib/src/index.ts`.

## License

MIT
