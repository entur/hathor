import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG_KEYS, SANDBOX_FEATURE_KEYS } from '../contexts/configContext.ts';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const CONFIG_DIRS = ['.github/environments', 'e2e-tests/fixtures'];

const configFiles = CONFIG_DIRS.flatMap(dir =>
  readdirSync(join(ROOT, dir))
    .filter(f => /^config-.*\.json$/.test(f))
    .map(f => join(dir, f))
);

/** `[file, parsed config]` pairs, read once for every test below. */
const configs = configFiles.map(f => [f, JSON.parse(readFileSync(join(ROOT, f), 'utf8'))]);

const unknownKeys = (obj: object, known: object) =>
  Object.keys(obj).filter(k => !Object.hasOwn(known, k));

// A misspelt flag (`deckPlans`, `enableDeckplanRefs`) reads as missing, i.e. off,
// with no error anywhere — so reject keys `Config` does not declare.
describe('config-*.json keys', () => {
  it('finds config files in every directory', () => {
    CONFIG_DIRS.forEach(dir => expect(configFiles.some(f => f.startsWith(dir))).toBe(true));
  });

  it.each(configs)('%s has only known keys', (_, config) => {
    expect(unknownKeys(config, CONFIG_KEYS)).toEqual([]);
    expect(unknownKeys(config.sandboxFeatures ?? {}, SANDBOX_FEATURE_KEYS)).toEqual([]);
  });

  it.each(configs)('%s sets flags as booleans', (_, config) => {
    const flags = [
      ...Object.values(config.sandboxFeatures ?? {}),
      ...Object.entries(config)
        .filter(([k]) => k.startsWith('enable'))
        .map(([, v]) => v),
    ];
    flags.forEach(v => expect(typeof v).toBe('boolean'));
  });
});
