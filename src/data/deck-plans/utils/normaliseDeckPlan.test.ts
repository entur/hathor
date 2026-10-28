import { describe, it, expect } from 'vitest';
import { createFormState } from '../../../hooks/useFormState.ts';
import { normaliseDeckPlan } from './normaliseDeckPlan.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

/** Sobek re-pads `<Text>` on serialize, so GQL rows arrive whitespace-wrapped. */
const PADDED: DeckPlan = {
  id: 'NMR:DeckPlan:1',
  version: 2,
  name: { value: '\n                Enetasjes lavgulvbuss\n              ' },
  description: { value: '\n                MAN Lion’s City\n              ' },
};

/** The editor's form state: `toForm` trims, the dirty compare normalises. */
const fs = createFormState<DeckPlan, DeckPlan>({
  blank: normaliseDeckPlan({ id: '' }),
  formFromSource: src => normaliseDeckPlan(src ?? { id: '' }),
  normalise: normaliseDeckPlan,
});
const hydrated = (dp: DeckPlan) => fs.hydrate(fs.initial, dp);

describe('normaliseDeckPlan', () => {
  it('trims padded values', () => {
    const n = normaliseDeckPlan(PADDED);
    expect(n.name?.value).toBe('Enetasjes lavgulvbuss');
    expect(n.description?.value).toBe('MAN Lion’s City');
  });

  it('preserves the lang tag', () => {
    expect(normaliseDeckPlan({ ...PADDED, name: { value: ' Navn ', lang: 'nb' } }).name).toEqual({
      value: 'Navn',
      lang: 'nb',
    });
  });

  it('is not dirty immediately after hydrating a padded row', () => {
    // The bug this guards: hydrating from the padded GQL row while comparing
    // against trimmed XML made the editor dirty on open with no user edit.
    expect(fs.isDirty(hydrated(PADDED))).toBe(false);
  });

  it('is dirty once the name actually changes', () => {
    const s = fs.edit(hydrated(PADDED), { ...PADDED, name: { value: 'Changed' } });
    expect(fs.isDirty(s)).toBe(true);
  });

  it('ignores pure whitespace edits', () => {
    const s = fs.edit(hydrated(PADDED), {
      ...PADDED,
      name: { value: '   Enetasjes lavgulvbuss   ' },
    });
    expect(fs.isDirty(s)).toBe(false);
  });

  it('ignores key order: a form whose description was set before its name', () => {
    const base: DeckPlan = { id: 'NMR:DeckPlan:1' };
    const reordered: DeckPlan = { id: base.id, description: { value: ' ' }, name: { value: '' } };
    expect(fs.isDirty(fs.edit(hydrated(base), reordered))).toBe(false);
  });

  it('treats a blank name as a real change from a populated baseline', () => {
    const s = fs.edit(hydrated(PADDED), { ...PADDED, name: { value: '  ' } });
    expect(fs.isDirty(s)).toBe(true);
  });

  it('is dirty when only the description lang tag changes', () => {
    // Reachable by clearing then retyping: mergeNameText returns {value} with
    // no lang, so a real lang drop must register — as it already does for name.
    const base = { ...PADDED, description: { value: 'Beskrivelse', lang: 'nb' } };
    const s = fs.edit(hydrated(base), { ...base, description: { value: 'Beskrivelse' } });
    expect(fs.isDirty(s)).toBe(true);
  });

  it('is dirty when only the name lang tag changes', () => {
    const base = { ...PADDED, name: { value: 'Navn', lang: 'nb' } };
    const s = fs.edit(hydrated(base), { ...base, name: { value: 'Navn' } });
    expect(fs.isDirty(s)).toBe(true);
  });

  it('hydrating a blank create factory yields a non-dirty empty form', () => {
    expect(fs.isDirty(hydrated({ id: '', name: { value: '' } }))).toBe(false);
  });
});
