import { describe, expect, it } from 'vitest';
import {
  DEF_RATIO,
  MAX_RATIO,
  MIN_W,
  RATIO_KEY,
  clampRatio,
  readRatio,
  writeRatio,
} from './useResizableSidebar.ts';

const VW = 1000;

/** Minimal in-memory Storage; `throws` simulates blocked site data. */
const mkStore = (init: Record<string, string> = {}, throws = false): Storage => {
  const m = new Map(Object.entries(init));
  const guard = () => {
    if (throws) throw new Error('SecurityError');
  };
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    key: i => [...m.keys()][i] ?? null,
    getItem: k => (guard(), m.get(k) ?? null),
    setItem: (k, v) => (guard(), void m.set(k, v)),
    removeItem: k => void m.delete(k),
  };
};

describe('clampRatio', () => {
  it('caps at MAX_RATIO and floors at MIN_W px', () => {
    expect(clampRatio(0.95, VW)).toBe(MAX_RATIO);
    expect(clampRatio(0.01, VW)).toBe(MIN_W / VW);
    expect(clampRatio(0.5, VW)).toBe(0.5);
  });
});

describe('readRatio', () => {
  it.each([
    ['absent', {}],
    ['garbage', { [RATIO_KEY]: 'wide' }],
    ['non-positive', { [RATIO_KEY]: '0' }],
  ])('falls back to DEF_RATIO when %s', (_, init) => {
    expect(readRatio(mkStore(init), VW)).toBe(DEF_RATIO);
  });

  it('returns the stored ratio, clamped', () => {
    expect(readRatio(mkStore({ [RATIO_KEY]: '0.55' }), VW)).toBe(0.55);
    expect(readRatio(mkStore({ [RATIO_KEY]: '0.99' }), VW)).toBe(MAX_RATIO);
  });

  it('survives throwing or missing storage', () => {
    expect(readRatio(mkStore({}, true), VW)).toBe(DEF_RATIO);
    expect(readRatio(undefined, VW)).toBe(DEF_RATIO);
  });
});

describe('writeRatio', () => {
  it('round-trips through readRatio', () => {
    const s = mkStore();
    writeRatio(s, 0.33);
    expect(readRatio(s, VW)).toBe(0.33);
  });

  it('swallows storage errors', () => {
    expect(() => writeRatio(mkStore({}, true), 0.3)).not.toThrow();
  });
});
