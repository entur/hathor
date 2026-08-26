import { describe, it, expect } from 'vitest';
import { hydrate, edit, isDirty, initialFormState } from './deckPlanFormState.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Sobek re-pads `<Text>` on serialize, so GQL rows arrive whitespace-wrapped. */
const PADDED: DeckPlan = {
  id: 'NMR:DeckPlan:1',
  version: 2,
  name: { value: '\n                Enetasjes lavgulvbuss\n              ' },
  description: { value: '\n                MAN Lion’s City\n              ' },
};

describe('deckPlanFormState', () => {
  it('trims padded values on hydrate', () => {
    const s = hydrate(initialFormState, PADDED);
    expect(s.form.name?.value).toBe('Enetasjes lavgulvbuss');
    expect(s.form.description?.value).toBe('MAN Lion’s City');
  });

  it('is not dirty immediately after hydrating a padded row', () => {
    // The bug this guards: hydrating from the padded GQL row while comparing
    // against trimmed XML made the editor dirty on open with no user edit.
    expect(isDirty(hydrate(initialFormState, PADDED))).toBe(false);
  });

  it('is dirty once the name actually changes', () => {
    const s = edit(hydrate(initialFormState, PADDED), { ...PADDED, name: { value: 'Changed' } });
    expect(isDirty(s)).toBe(true);
  });

  it('ignores pure whitespace edits', () => {
    const s = edit(hydrate(initialFormState, PADDED), {
      ...PADDED,
      name: { value: '   Enetasjes lavgulvbuss   ' },
    });
    expect(isDirty(s)).toBe(false);
  });

  it('treats a blank name as a real change from a populated baseline', () => {
    const s = edit(hydrate(initialFormState, PADDED), { ...PADDED, name: { value: '  ' } });
    expect(isDirty(s)).toBe(true);
  });

  it('is dirty when only the description lang tag changes', () => {
    // Reachable by clearing then retyping: mergeNameText returns {value} with
    // no lang, so a real lang drop must register — as it already does for name.
    const base = { ...PADDED, description: { value: 'Beskrivelse', lang: 'nb' } };
    const s = edit(hydrate(initialFormState, base), {
      ...base,
      description: { value: 'Beskrivelse' },
    });
    expect(isDirty(s)).toBe(true);
  });

  it('is dirty when only the name lang tag changes', () => {
    const base = { ...PADDED, name: { value: 'Navn', lang: 'nb' } };
    const s = edit(hydrate(initialFormState, base), { ...base, name: { value: 'Navn' } });
    expect(isDirty(s)).toBe(true);
  });

  it('preserves the lang tag through hydrate', () => {
    const s = hydrate(initialFormState, { ...PADDED, name: { value: ' Navn ', lang: 'nb' } });
    expect(s.form.name).toEqual({ value: 'Navn', lang: 'nb' });
  });

  it('hydrating a blank create factory yields a non-dirty empty form', () => {
    const s = hydrate(initialFormState, { id: '', name: { value: '' } });
    expect(isDirty(s)).toBe(false);
  });
});
