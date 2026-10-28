import { describe, it, expect, vi, afterEach } from 'vitest';
import { createFormState } from './useFormState';

interface F {
  name: string;
  lowFloor?: boolean;
}

const make = (normalise?: (f: F) => F) =>
  createFormState<F, F>({ blank: { name: '' }, formFromSource: s => s ?? { name: '' }, normalise });

afterEach(() => vi.restoreAllMocks());

describe('createFormState', () => {
  it('restore returns the last baseline value', () => {
    const fs = make();
    const hydrated = fs.hydrate(fs.initial, { name: 'a' });
    const edited = fs.edit(hydrated, { name: 'b' });
    expect(fs.restore(edited).form).toEqual({ name: 'a' });
    expect(fs.isDirty(fs.restore(edited))).toBe(false);
  });

  it('commit makes the form clean and the new baseline', () => {
    const fs = make();
    const edited = fs.edit(fs.hydrate(fs.initial, { name: 'a' }), { name: 'b' });
    expect(fs.isDirty(edited)).toBe(true);
    const committed = fs.commit(edited, { name: 'b' });
    expect(fs.isDirty(committed)).toBe(false);
    expect(fs.restore(committed).form).toEqual({ name: 'b' });
  });

  it('normalise: a toggled-on-then-off flag is not dirty', () => {
    const fs = make(f => ({ ...f, lowFloor: f.lowFloor || undefined }));
    const base = fs.hydrate(fs.initial, { name: 'a' });
    const on = fs.edit(base, { name: 'a', lowFloor: true });
    expect(fs.isDirty(on)).toBe(true);
    expect(fs.isDirty(fs.edit(on, { name: 'a', lowFloor: false }))).toBe(false);
  });

  it('isDirty does not stringify on every call when nothing changed', () => {
    const fs = make();
    const state = fs.edit(fs.hydrate(fs.initial, { name: 'a' }), { name: 'b' });
    fs.isDirty(state);
    const spy = vi.spyOn(JSON, 'stringify');
    fs.isDirty(state);
    fs.isDirty(state);
    expect(spy).not.toHaveBeenCalled();
  });
});
