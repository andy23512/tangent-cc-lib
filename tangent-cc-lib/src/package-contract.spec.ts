import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as publicApi from './index.js';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(PACKAGE_ROOT, 'src');
const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const SOURCE_FILES = walk(SRC).filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
const read = (file: string) => readFileSync(file, 'utf8');

/** Every module specifier in an import or export-from statement, with the statement's file. */
function specifiers(file: string): string[] {
  return [...read(file).matchAll(/(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*'([^']+)'/g)].map((m) => m[1]);
}

describe('package.json', () => {
  it('is an ES module package named tangent-cc-lib', () => {
    expect(pkg.name).toBe('tangent-cc-lib');
    expect(pkg.type).toBe('module');
    expect(pkg.license).toBe('MIT');
  });

  it('has a version number', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('points main, module and types at the built entry, in dist', () => {
    expect(pkg.main).toBe('./dist/index.js');
    expect(pkg.module).toBe('./dist/index.js');
    expect(pkg.types).toBe('./dist/index.d.ts');
  });

  it('exports the root and package.json, with a source condition for linked consumers', () => {
    expect(pkg.exports).toEqual({
      './package.json': './package.json',
      '.': {
        '@tangent-cc-lib/source': './src/index.ts',
        types: './dist/index.d.ts',
        import: './dist/index.js',
        default: './dist/index.js',
      },
    });
  });

  it('has a source condition that points at a file that exists', () => {
    expect(existsSync(join(PACKAGE_ROOT, pkg.exports['.']['@tangent-cc-lib/source']))).toBe(true);
  });

  it('lists the source condition before the built ones (the first matching condition wins)', () => {
    expect(Object.keys(pkg.exports['.'])[0]).toBe('@tangent-cc-lib/source');
  });

  it('publishes only dist, without the build info files', () => {
    expect(pkg.files).toEqual(['dist', '!**/*.tsbuildinfo']);
  });

  it('asks consumers to bring eventemitter2, rxjs and semver, and ships web-serial-polyfill itself', () => {
    expect(Object.keys(pkg.peerDependencies).sort()).toEqual(['eventemitter2', 'rxjs', 'semver']);
    expect(Object.keys(pkg.dependencies).sort()).toEqual(['tslib', 'web-serial-polyfill']);
  });

  it('is at the same version as the newest CHANGELOG entry', () => {
    const changelog = readFileSync(join(PACKAGE_ROOT, '..', 'CHANGELOG.md'), 'utf8');
    const newest = /^## \[(\d+\.\d+\.\d+)\]/m.exec(changelog)?.[1];
    expect(newest).toBe(pkg.version);
  });
});

describe('what the source imports', () => {
  const external = (file: string) => specifiers(file).filter((s) => !s.startsWith('.'));

  it('finds the source files and their imports (guards the scan below against matching nothing)', () => {
    expect(SOURCE_FILES.length).toBe(54);
    expect(SOURCE_FILES.flatMap(specifiers).length).toBeGreaterThan(100);
  });

  it('uses only the four packages it declares, and no Node modules (it runs in the browser)', () => {
    const used = new Set(SOURCE_FILES.flatMap(external));
    expect([...used].sort()).toEqual(['eventemitter2', 'rxjs', 'semver', 'web-serial-polyfill']);
  });

  it('declares every package it imports, as a dependency or a peer', () => {
    const declared = new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]);
    for (const file of SOURCE_FILES) {
      for (const spec of external(file)) expect(declared.has(spec), `${relative(SRC, file)} imports ${spec}`).toBe(true);
    }
  });

  it('imports each declared peer somewhere, so none is declared for nothing', () => {
    const used = new Set(SOURCE_FILES.flatMap(external));
    for (const peer of Object.keys(pkg.peerDependencies)) expect(used.has(peer), peer).toBe(true);
  });

  it('keeps the packages the consumer must bring out of the data files (only the classes use them)', () => {
    const users = SOURCE_FILES.filter((f) => external(f).length > 0).map((f) => relative(SRC, f)).sort();
    expect(users).toEqual(['lib/class/serial-handler.ts', 'lib/class/serial-port-handler.ts']);
  });

  it('writes every relative import with the .js ending that ES modules need, and the file exists', () => {
    for (const file of SOURCE_FILES) {
      for (const spec of specifiers(file).filter((s) => s.startsWith('.'))) {
        const where = `${relative(SRC, file)} imports ${spec}`;
        expect(spec.endsWith('.js'), where).toBe(true);
        expect(existsSync(resolve(dirname(file), spec.replace(/\.js$/, '.ts'))), where).toBe(true);
      }
    }
  });

  it('has no spec file reachable from the entry point', () => {
    for (const file of SOURCE_FILES) {
      for (const spec of specifiers(file)) expect(spec).not.toMatch(/\.spec\.js$/);
    }
  });
});

describe('barrel files', () => {
  const barrels = SOURCE_FILES.filter((f) => f.endsWith('/index.ts'));

  it('finds the index files', () => {
    expect(barrels.map((f) => relative(SRC, f)).sort()).toEqual([
      'index.ts',
      'lib/class/index.ts',
      'lib/data/index.ts',
      'lib/data/key-label/index.ts',
      'lib/data/keyboard-layout/index.ts',
      'lib/data/language-tree/index.ts',
      'lib/model/index.ts',
      'lib/type/index.ts',
      'lib/util/index.ts',
    ]);
  });

  it('re-exports every module next to it, except two used only inside the library', () => {
    const missing: string[] = [];
    for (const barrel of barrels) {
      const dir = dirname(barrel);
      if (dir === SRC) continue;
      const exported = new Set(specifiers(barrel).map((s) => resolve(dir, s.replace(/\.js$/, '.ts'))));
      const siblings = readdirSync(dir)
        .filter((n) => n.endsWith('.ts') && !n.endsWith('.spec.ts') && n !== 'index.ts')
        .map((n) => join(dir, n));
      const directories = readdirSync(dir)
        .filter((n) => statSync(join(dir, n)).isDirectory())
        .map((n) => join(dir, n, 'index.ts'));
      for (const target of [...siblings, ...directories]) {
        if (!exported.has(target)) missing.push(relative(SRC, target));
      }
    }
    expect(missing.sort()).toEqual(['lib/class/line-break-transformer.ts', 'lib/data/layers.ts']);
  });

  it('re-exports nothing that is not there', () => {
    for (const barrel of barrels) {
      for (const spec of specifiers(barrel)) {
        expect(existsSync(resolve(dirname(barrel), spec.replace(/\.js$/, '.ts'))), spec).toBe(true);
      }
    }
  });

  it('starts the package from lib/tangent-cc-lib, which in turn exports the folders', () => {
    expect(specifiers(join(SRC, 'index.ts'))).toEqual(['./lib/tangent-cc-lib.js']);
    expect(specifiers(join(SRC, 'lib', 'tangent-cc-lib.ts'))).toEqual([
      './class/index.js',
      './data/index.js',
      './model/index.js',
      './type/index.js',
      './util/index.js',
    ]);
  });
});

describe('public API', () => {
  const EXPECTED = [
  'ACTIONS', 'ALT_GRAPH_ACTION_CODE', 'ALT_GRAPH_KEY_LABEL', 'ActionType',
  'ActionVariant', 'CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT', 'CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT', 'CCLITE_DEFAULT_DEVICE_LAYOUT',
  'CHARACHORDER_3D_INPUT_DEVICES', 'CHARACHORDER_3D_INPUT_DEVICE_PORTS', 'CHARACHORDER_DEVICES', 'CHARACHORDER_DEVICE_PORTS',
  'CHARACHORDER_LITE_DEVICES', 'CHARACHORDER_LITE_DEVICE_PORTS', 'CHARACTER_NAME_MAP', 'CHINESE_KEYBOARD_LAYOUTS',
  'CharaChorderDevice', 'DEFAULT_DEVICE_LAYOUT', 'FLAG_SHIFT_ACTION_CODES', 'FLAG_SHIFT_KEY_LABEL',
  'FN_SHIFT_ACTION_CODES', 'FN_SHIFT_KEY_LABEL', 'FontLogo', 'KEYBOARD_LAYOUTS_FROM_KBDLAYOUT',
  'KEYBOARD_LAYOUTS_FROM_XKEYBOARD', 'KeyLabelType', 'LANGUAGE_TREE_FROM_KBDLAYOUT', 'LANGUAGE_TREE_FROM_XKEYBOARD',
  'Layer', 'M4G_DEFAULT_DEVICE_LAYOUT', 'NON_KEY_ACTIONS', 'NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP',
  'NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP', 'NON_WSK_ACTIONS', 'NON_WSK_CODE_2_KEY_NAMES_MAP', 'NON_WSK_CODE_2_RAW_KEY_LABEL_MAP',
  'NO_ACTION_ACTION_CODES', 'NUM_SHIFT_ACTION_CODES', 'NUM_SHIFT_KEY_LABEL', 'OS_2_ALT_KEY_LABEL_MAP',
  'OS_2_META_KEY_LABEL_MAP', 'POSITION_CODE_LAYOUT', 'Profile', 'SHIFT_ACTION_CODES',
  'SHIFT_KEY_LABEL', 'SerialCommand', 'SerialHandler', 'SerialPortHandler',
  'WINDOWS_ALT_CODE_ACTIONS', 'WSK_ACTIONS', 'compressActions', 'convertChordInNumberListFormToChord',
  'convertChordsToChordTreeNodes', 'convertKeyboardLayoutToCharacterKeyCodeMap', 'decompressActions', 'deserializeActions',
  'downloadDeviceLayout', 'getCharacterActionCodesFromCharacterKeyCode', 'getFlagShiftKeyPositionCodes', 'getFnShiftKeyPositionCodes',
  'getHighlightKeyCombinationFromKeyCombinations', 'getInputFromChordAction', 'getKeyCombinationsFromActionCodes', 'getLayerShiftPositionCodeMap',
  'getModifierKeyPositionCodeMap', 'getNumShiftKeyPositionCodes', 'getParentHashFromChordAction', 'getPositionSide',
  'hashChord', 'isPositionAtSide', 'meetPreferSides', 'nonNullable',
  'parseChordActions', 'parsePhrase', 'serializeActions', 'stringifyChordActions',
  'stringifyPhrase',
  ];

  it('exports exactly these names (a change here is a change for every project that uses the package)', () => {
    expect(Object.keys(publicApi).sort()).toEqual([...EXPECTED].sort());
  });

  it('exports 77 runtime names', () => {
    expect(EXPECTED).toHaveLength(77);
  });

  it('keeps the library internals out of it', () => {
    expect(publicApi).not.toHaveProperty('LineBreakTransformer');
    expect(publicApi).not.toHaveProperty('LAYERS');
  });

  it('exports classes and enums as real values', () => {
    expect(typeof publicApi.SerialHandler).toBe('function');
    expect(typeof publicApi.SerialPortHandler).toBe('function');
    for (const e of ['ActionType', 'ActionVariant', 'CharaChorderDevice', 'FontLogo', 'KeyLabelType', 'Layer', 'Profile', 'SerialCommand'] as const) {
      expect(typeof publicApi[e], e).toBe('object');
    }
  });
});
