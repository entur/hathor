import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
import i18n from '../i18n';
import en from './en/translation.json';
import nb from './nb/translation.json';

/**
 * Key-coverage guard (#176): every statically-known `t('…')` key in `src/`
 * must resolve in both `en` and `nb`.
 *
 * This is the check the old inline `t('key', 'Default')` defaults pretended to
 * be — they hid misses instead of failing on them. Bundles are flat dotted
 * maps, so lookup is a direct `in` plus plural-suffix probing (`_one`,
 * `_other`, …), never a nested `split('.')` walk.
 *
 * Scope: `t(...)` / `x.t(...)` whose first arg is a string literal, or an
 * identifier bound to a same-file `const X = '…'`. Keys built at runtime
 * (template literals, config-driven `labelKey` fields) are out of reach and
 * rely on the dev-time `parseMissingKeyHandler` in `src/i18n.ts`.
 */

const SRC = join(import.meta.dirname, '..');
const SRC_RE = /\.tsx?$/,
  SKIP_RE = /\.(test|stories)\.tsx?$|\.d\.ts$/;
const PLURAL_SFX = ['zero', 'one', 'two', 'few', 'many', 'other'];
// Floor on scanned keys, so a broken scanner can't pass vacuously.
const MIN_KEYS = 150;

type Bundle = Record<string, string>;
type Hit = { key: string; at: string };

const isStr = (n: ts.Node): n is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral =>
  ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);

const isT = (c: ts.Expression) =>
  (ts.isIdentifier(c) && c.text === 't') ||
  (ts.isPropertyAccessExpression(c) && c.name.text === 't');

/**
 * Collect statically-resolvable `t()` keys from one source file.
 *
 * @param {string} f - Absolute path to a `.ts`/`.tsx` file.
 * @returns {Hit[]} Each key with its `file:line`.
 */
const scan = (f: string): Hit[] => {
  const sf = ts.createSourceFile(f, readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
  const consts = new Map<string, string>();
  const calls: ts.CallExpression[] = [];
  const visit = (n: ts.Node): void => {
    if (
      ts.isVariableDeclaration(n) &&
      ts.isIdentifier(n.name) &&
      n.initializer &&
      isStr(n.initializer)
    )
      consts.set(n.name.text, n.initializer.text);
    if (ts.isCallExpression(n) && isT(n.expression) && n.arguments.length) calls.push(n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return calls.flatMap(c => {
    const a = c.arguments[0];
    const key = isStr(a) ? a.text : ts.isIdentifier(a) ? consts.get(a.text) : undefined;
    const line = sf.getLineAndCharacterOfPosition(c.getStart(sf)).line + 1;
    return key ? [{ key, at: `${f.slice(SRC.length + 1)}:${line}` }] : [];
  });
};

/**
 * @param {Bundle} b - Flat translation bundle.
 * @param {string} k - Key as passed to `t()`.
 * @returns {boolean} Whether `k` resolves directly or via a plural suffix.
 */
const has = (b: Bundle, k: string) => k in b || PLURAL_SFX.some(s => `${k}_${s}` in b);

const hits = (readdirSync(SRC, { recursive: true }) as string[])
  .filter(p => SRC_RE.test(p) && !SKIP_RE.test(p))
  .flatMap(p => scan(join(SRC, p)));

const missing = (b: Bundle) => hits.filter(h => !has(b, h.key)).map(h => `${h.at}  ${h.key}`);

describe('i18n key coverage', () => {
  it('finds a plausible number of t() keys', () => {
    expect(hits.length).toBeGreaterThanOrEqual(MIN_KEYS);
  });

  it.each([
    ['en', en as Bundle],
    ['nb', nb as Bundle],
  ])('every t() key resolves in %s', (_, b) => {
    expect(missing(b)).toEqual([]);
  });
});

describe('parseMissingKeyHandler', () => {
  it('logs a key absent from every bundle and returns it unchanged', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(i18n.t('no.such.key')).toBe('no.such.key');
    expect(spy).toHaveBeenCalledWith('i18n: missing key "no.such.key"');
    spy.mockRestore();
  });
});
