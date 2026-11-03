import { describe, it, expect } from 'vitest';
import { createFormState } from './useFormState.ts';

interface Row {
  id: string;
  name?: string;
  flag?: boolean;
}

const BLANK: Row = { id: '' };
const A: Row = { id: 'NMR:Vehicle:1', name: 'a' };

const plain = createFormState<Row, Row>({ blank: BLANK, formFromSource: r => r ?? BLANK });

describe('createFormState', () => {
  it('restore drops the edit', () => {
    const loaded = plain.hydrate(plain.initial, A);
    const edited = plain.edit(loaded, { ...A, name: 'b' });
    expect(plain.restore(edited).form).toEqual(loaded.form);
  });

  it('restore keeps rebased id', () => {
    const rebased = plain.rebase(plain.initial, { ...A, id: 'NMR:Vehicle:9' });
    const edited = plain.edit(rebased, { ...A, id: 'NMR:Vehicle:9', name: 'typed' });
    expect(plain.restore(edited).form.id).toBe('NMR:Vehicle:9');
  });

  it('rebase is not dirty', () => {
    const edited = plain.edit(plain.hydrate(plain.initial, A), { ...A, name: 'b' });
    expect(plain.isDirty(plain.rebase(edited, edited.form))).toBe(false);
  });

  it('normalise applies to both sides', () => {
    const flags = createFormState<Row, Row>({
      blank: BLANK,
      formFromSource: r => r ?? BLANK,
      normalise: v => ({ ...v, flag: v.flag || undefined }),
    });
    const loaded = flags.hydrate(flags.initial, { id: 'x', flag: undefined });
    expect(flags.isDirty(flags.edit(loaded, { id: 'x', flag: false }))).toBe(false);
    expect(flags.isDirty(flags.edit(loaded, { id: 'x', flag: true }))).toBe(true);
  });
});
