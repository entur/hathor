// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import i18n from 'i18next';
import { afterEach, describe, expect, it } from 'vitest';
import en from '../locales/en/translation.json';
import nb from '../locales/nb/translation.json';
import { useCollectionLabels } from './useCollectionLabels.ts';

const collectionKeys = (bundle: Record<string, string>) =>
  Object.keys(bundle).filter(k => k.startsWith('collection.'));

/** Every label as text — the counted ones with sample numbers. */
const asText = () => {
  const l = renderHook(() => useCollectionLabels('vehicleType.field')).result.current;
  return JSON.stringify({
    ...l,
    field: l.field('totalCapacity'),
    moreFilters: [l.moreFilters(1), l.moreFilters(2)],
    showingRows: l.showingRows(1, 25, 120),
    rowsPerPageMenu: l.rowsPerPageMenu(25),
    goToPage: l.goToPage(3),
  });
};

describe('useCollectionLabels', () => {
  afterEach(() => i18n.changeLanguage('en'));

  it('has every collection key in nb, so nothing falls back to English', () => {
    expect(collectionKeys(nb)).toEqual(collectionKeys(en));
  });

  it('resolves every label in nb — no raw key, counts interpolated', async () => {
    await i18n.changeLanguage('nb');
    const text = asText();

    expect(text).not.toMatch(/collection\.|\{\{/);
    expect(text).toContain('Viser rad 1–25 av 120');
    expect(text).toContain('2 filtre til');
    expect(text).toContain('Total kapasitet');
  });
});
