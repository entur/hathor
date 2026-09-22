import { beforeAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { deduplicateEntries } from '../regNumbersTextTransformer';
import type { ImportEntry } from '../types';
import en from '../../../locales/en/translation.json';

// `buildStatus` resolves through i18next — initialise so the plural forms
// are exercised rather than the uninitialised fallback.
beforeAll(async () => {
  if (!i18next.isInitialized) {
    await i18next.init({ lng: 'en', fallbackLng: 'en', resources: { en: { translation: en } } });
  }
});

describe('deduplicateEntries', () => {
  it('returns empty result for empty input', () => {
    const result = deduplicateEntries([]);
    expect(result.entries).toEqual([]);
    expect(result.status.uniqueCount).toBe(0);
    expect(result.status.warnLevel).toBe('error');
  });

  it('passes through unique entries unchanged', () => {
    const entries: ImportEntry[] = [{ queryRegNumber: 'AB1234' }, { queryRegNumber: 'CD5678' }];
    const result = deduplicateEntries(entries);
    expect(result.entries).toEqual(entries);
    expect(result.status.uniqueCount).toBe(2);
    expect(result.status.warnLevel).toBe('success');
  });

  it('removes duplicates and reports warning', () => {
    const entries: ImportEntry[] = [
      { queryRegNumber: 'AB1234', operationalRef: 'OP-001' },
      { queryRegNumber: 'CD5678' },
      { queryRegNumber: 'AB1234', operationalRef: 'OP-999' },
    ];
    const result = deduplicateEntries(entries);
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]).toEqual({ queryRegNumber: 'AB1234', operationalRef: 'OP-001' });
    expect(result.entries[1]).toEqual({ queryRegNumber: 'CD5678' });
    expect(result.status.uniqueCount).toBe(2);
    expect(result.status.warnLevel).toBe('warning');
    expect(result.status.message).toBe('2 unique registration numbers (1 duplicate removed)');
  });

  it('preserves first occurrence when deduplicating', () => {
    const entries: ImportEntry[] = [
      { queryRegNumber: 'ZZ999', operationalRef: 'first' },
      { queryRegNumber: 'AA111' },
      { queryRegNumber: 'ZZ999', operationalRef: 'second' },
    ];
    const result = deduplicateEntries(entries);
    expect(result.entries[0].operationalRef).toBe('first');
  });

  it('returns success for a single entry', () => {
    const result = deduplicateEntries([{ queryRegNumber: 'AB1234' }]);
    expect(result.status.uniqueCount).toBe(1);
    expect(result.status.warnLevel).toBe('success');
  });
});
