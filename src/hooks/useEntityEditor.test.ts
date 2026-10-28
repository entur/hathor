// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEntityEditor, type EntityEditorOptions } from './useEntityEditor';
import type { EntityRecord } from './useEntityRecord';
import { NEW_SELECTION } from './useUrlEditorSelection';

const mocks = vi.hoisted(() => ({ org: { id: 'ORG:1' } as { id: string } | null }));

vi.mock('../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: mocks.org }),
}));

interface Rec {
  id: string;
  name: string;
  flag?: boolean;
}

const A = 'ORG:Rec:1',
  B = 'ORG:Rec:2',
  NEW_ID = 'ORG:Rec:9';
const BLANK: Rec = { id: '', name: '' };
const recA: Rec = { id: A, name: 'alpha' };
const recB: Rec = { id: B, name: 'beta' };

const NO_ID = i18next.t('common.saveNoIdReturned');
const STALE = i18next.t('common.saveRecordStale');

const deferred = <T>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const fakeRecord = (over: Partial<EntityRecord<Rec>> = {}): EntityRecord<Rec> => ({
  data: null,
  loading: false,
  error: null,
  notFound: false,
  refetch: vi.fn(async () => null),
  ...over,
});

type Opts = EntityEditorOptions<Rec, Rec>;

const setup = (over: Partial<Opts> = {}) => {
  const spies = {
    save: vi.fn<Opts['save']>(async () => ({ newId: null, error: null })),
    deactivate: vi.fn<NonNullable<Opts['deactivate']>>(async () => ({ error: null })),
    onClose: vi.fn(),
    onCreated: vi.fn(),
    onWritten: vi.fn(),
  };
  const base: Opts = {
    id: A,
    record: fakeRecord({ data: recA }),
    toForm: r => r ?? BLANK,
    withNewId: (f, newId) => ({ ...f, id: newId }),
    ...spies,
    ...over,
  };
  const hook = renderHook((p: Opts) => useEntityEditor(p), { initialProps: base });
  const rerender = (next: Partial<Opts>) => {
    const props = { ...base, ...next };
    Object.assign(base, props);
    hook.rerender(props);
  };
  return { ...hook, spies, rerender };
};

const editTo = async (h: ReturnType<typeof setup>, name: string) => {
  act(() => h.result.current.enterEdit?.());
  act(() => h.result.current.setForm({ ...h.result.current.form, name }));
};

describe('useEntityEditor', () => {
  beforeEach(() => {
    mocks.org = { id: 'ORG:1' };
  });

  // ── Brief tests ───────────────────────────────────────────────────────────

  it('hydrates from record.data and starts clean in view mode', () => {
    const h = setup();
    expect(h.result.current.form).toEqual(recA);
    expect(h.result.current.isDirty).toBe(false);
    expect(h.result.current.mode).toBe('view');
  });

  it('selectionKey follows the org + id', () => {
    const h = setup();
    const keyA = h.result.current.selectionKey;
    h.rerender({ id: B, record: fakeRecord({ data: recB }) });
    const keyB = h.result.current.selectionKey;
    mocks.org = { id: 'ORG:2' };
    h.rerender({});
    expect(new Set([keyA, keyB, h.result.current.selectionKey]).size).toBe(3);
  });

  it('Q1/Q2 save (existing id): save → view + clean → refetch → savedOpen → onWritten', async () => {
    const fresh: Rec = { id: A, name: 'stored' };
    const refetch = deferred<Rec | null>();
    const record = fakeRecord({ data: recA, refetch: vi.fn(() => refetch.promise) });
    const h = setup({ record, save: vi.fn(async () => ({ error: null })) });
    await editTo(h, 'typed');
    expect(h.result.current.isDirty).toBe(true);

    await act(async () => {
      void h.result.current.save();
    });
    expect(record.refetch).toHaveBeenCalledTimes(1);
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.isDirty).toBe(false);
    expect(h.result.current.form.name).toBe('typed'); // bridge
    expect(h.result.current.savedOpen).toBe(false);
    expect(h.spies.onWritten).not.toHaveBeenCalled();

    await act(async () => refetch.resolve(fresh));
    expect(h.result.current.savedOpen).toBe(true);
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'saved',
      id: A,
      record: fresh,
    });
    expect(h.spies.onClose).not.toHaveBeenCalled();
    expect(h.spies.onCreated).not.toHaveBeenCalled();
  });

  it('passes the form to save and tracks saving across the mutation only', async () => {
    const pending = deferred<{ error: null }>();
    const save = vi.fn(() => pending.promise);
    const h = setup({ save });
    await editTo(h, 'typed');
    await act(async () => {
      void h.result.current.save();
    });
    expect(save).toHaveBeenCalledWith({ id: A, name: 'typed' });
    expect(h.result.current.saving).toBe(true);
    await act(async () => pending.resolve({ error: null }));
    expect(h.result.current.saving).toBe(false);
  });

  it('save error → saveError set, mode stays edit, no onWritten', async () => {
    const h = setup({ save: vi.fn(async () => ({ error: 'boom' })) });
    await editTo(h, 'typed');
    await act(() => h.result.current.save());
    expect(h.result.current.saveError).toBe('boom');
    expect(h.result.current.mode).toBe('edit');
    expect(h.result.current.isDirty).toBe(true);
    expect(h.spies.onWritten).not.toHaveBeenCalled();
    act(() => h.result.current.clearSaveError());
    expect(h.result.current.saveError).toBeNull();
  });

  it('a throwing save is reported as a save error', async () => {
    const h = setup({ save: vi.fn(async () => Promise.reject(new Error('net down'))) });
    await editTo(h, 'typed');
    await act(() => h.result.current.save());
    expect(h.result.current.saveError).toBe('net down');
    expect(h.result.current.mode).toBe('edit');
  });

  it('invariant 7: create without newId → warning saveNoIdReturned, no onCreated', async () => {
    const h = setup({
      id: NEW_SELECTION,
      record: fakeRecord(),
      initialMode: 'edit',
      save: vi.fn(async () => ({ newId: null })),
    });
    act(() => h.result.current.setForm({ id: '', name: 'n' }));
    await act(() => h.result.current.save());
    expect(h.result.current.warning).toBe(NO_ID);
    expect(h.spies.onCreated).not.toHaveBeenCalled();
    expect(h.spies.onWritten).not.toHaveBeenCalled();
    expect(h.result.current.savedOpen).toBe(false);
    expect(h.result.current.mode).toBe('edit');
    act(() => h.result.current.clearWarning());
    expect(h.result.current.warning).toBeNull();
  });

  it('create → onCreated(newId); the advance keeps form + success; onWritten once on landing', async () => {
    const h = setup({
      id: NEW_SELECTION,
      record: fakeRecord(),
      initialMode: 'edit',
      save: vi.fn(async () => ({ newId: NEW_ID })),
    });
    act(() => h.result.current.setForm({ id: '', name: 'n' }));
    await act(() => h.result.current.save());
    expect(h.spies.onCreated).toHaveBeenCalledExactlyOnceWith(NEW_ID);
    expect(h.result.current.savedOpen).toBe(true);
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.form).toEqual({ id: NEW_ID, name: 'n' });
    expect(h.result.current.isDirty).toBe(false);
    expect(h.spies.onWritten).not.toHaveBeenCalled();

    // The host advances; the new id's record is loading.
    h.rerender({ id: NEW_ID, record: fakeRecord({ loading: true }), initialMode: 'view' });
    expect(h.result.current.form).toEqual({ id: NEW_ID, name: 'n' });
    expect(h.result.current.savedOpen).toBe(true);
    expect(h.spies.onWritten).not.toHaveBeenCalled();

    const landed: Rec = { id: NEW_ID, name: 'n ' };
    h.rerender({ record: fakeRecord({ data: landed }) });
    expect(h.result.current.savedOpen).toBe(true);
    expect(h.result.current.form).toEqual(landed);
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'created',
      id: NEW_ID,
      record: landed,
    });

    h.rerender({ record: fakeRecord({ data: { ...landed } }) });
    expect(h.spies.onWritten).toHaveBeenCalledTimes(1);
  });

  it('record reload fails after save → stale warning, no success, clean, view, onWritten(null)', async () => {
    const record = fakeRecord({
      data: recA,
      refetch: vi.fn(async () => Promise.reject(new Error('500'))),
    });
    const h = setup({ record, save: vi.fn(async () => ({})) });
    await editTo(h, 'typed');
    await act(() => h.result.current.save());
    expect(h.result.current.warning).toBe(STALE);
    expect(h.result.current.savedOpen).toBe(false);
    expect(h.result.current.isDirty).toBe(false);
    expect(h.result.current.mode).toBe('view');
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'saved',
      id: A,
      record: null,
    });
  });

  it('a reload that resolves null (record gone) is a failed reload: stale warning, onWritten(null)', async () => {
    const record = fakeRecord({ data: recA, refetch: vi.fn(async () => null) });
    const h = setup({ record, save: vi.fn(async () => ({})) });
    await editTo(h, 'typed');
    await act(() => h.result.current.save());
    expect(h.result.current.warning).toBe(STALE);
    expect(h.result.current.savedOpen).toBe(false);
    expect(h.result.current.isDirty).toBe(false);
    expect(h.result.current.mode).toBe('view');
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'saved',
      id: A,
      record: null,
    });
  });

  describe('hasRecord', () => {
    it('is true when creating', () => {
      expect(setup({ id: NEW_SELECTION, record: fakeRecord() }).result.current.hasRecord).toBe(
        true
      );
    });

    it('is true during the post-create bridge before the record lands', async () => {
      const h = setup({
        id: NEW_SELECTION,
        record: fakeRecord(),
        save: vi.fn(async () => ({ newId: NEW_ID })),
      });
      await act(() => h.result.current.save());
      h.rerender({ id: NEW_ID, record: fakeRecord({ loading: true }) });
      expect(h.result.current.hasRecord).toBe(true);
      h.rerender({ record: fakeRecord({ error: 'load failed' }) });
      expect(h.result.current.hasRecord).toBe(true);
    });

    it('is false on a loading, not-found or failed first load of an existing id', () => {
      const h = setup({ record: fakeRecord({ loading: true }) });
      expect(h.result.current.hasRecord).toBe(false);
      h.rerender({ record: fakeRecord({ notFound: true }) });
      expect(h.result.current.hasRecord).toBe(false);
      h.rerender({ record: fakeRecord({ error: 'load failed' }) });
      expect(h.result.current.hasRecord).toBe(false);
      h.rerender({ record: fakeRecord({ data: recA }) });
      expect(h.result.current.hasRecord).toBe(true);
    });
  });

  describe('without a record, Edit and Save are withheld', () => {
    it('not-found → enterEdit undefined', () => {
      const h = setup({ record: fakeRecord({ notFound: true }) });
      expect(h.result.current.hasRecord).toBe(false);
      expect(h.result.current.enterEdit).toBeUndefined();
    });

    it('load error → enterEdit undefined', () => {
      const h = setup({ record: fakeRecord({ error: 'boom' }) });
      expect(h.result.current.hasRecord).toBe(false);
      expect(h.result.current.enterEdit).toBeUndefined();
    });

    it('save while !hasRecord (even opened in edit) does not call the feature save', async () => {
      const h = setup({ record: fakeRecord({ notFound: true }), initialMode: 'edit' });
      await act(() => h.result.current.save());
      expect(h.spies.save).not.toHaveBeenCalled();
      expect(h.result.current.saving).toBe(false);
      expect(h.spies.onWritten).not.toHaveBeenCalled();
    });
  });

  it('Q3 cancel restores the last baseline — after a save, the saved values', async () => {
    const fresh: Rec = { id: A, name: 'saved' };
    const record = fakeRecord({ data: recA, refetch: vi.fn(async () => fresh) });
    const h = setup({ record, save: vi.fn(async () => ({})) });
    await editTo(h, 'saved');
    await act(() => h.result.current.save());
    h.rerender({ record: fakeRecord({ data: fresh }) });

    await editTo(h, 'discard me');
    expect(h.result.current.isDirty).toBe(true);
    act(() => h.result.current.cancel());
    expect(h.result.current.form).toEqual(fresh);
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.isDirty).toBe(false);
  });

  it('Q4 an id change resets mode, savedOpen and warning, and drops the form', async () => {
    const record = fakeRecord({ data: recA, refetch: vi.fn(async () => recA) });
    const h = setup({ record, save: vi.fn(async () => ({})) });
    await editTo(h, 'x');
    await act(() => h.result.current.save());
    expect(h.result.current.savedOpen).toBe(true);
    act(() => h.result.current.enterEdit?.());
    expect(h.result.current.mode).toBe('edit');

    h.rerender({ id: B, record: fakeRecord({ loading: true }) });
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.savedOpen).toBe(false);
    expect(h.result.current.warning).toBeNull();
    expect(h.result.current.form).toEqual(BLANK);
    expect(h.result.current.isDirty).toBe(false);

    h.rerender({ record: fakeRecord({ data: recB }) });
    expect(h.result.current.form).toEqual(recB);
  });

  it('Q4 an id change clears a warning and a save error', async () => {
    const h = setup({ save: vi.fn(async () => ({ error: 'boom' })) });
    await editTo(h, 'x');
    await act(() => h.result.current.save());
    expect(h.result.current.saveError).toBe('boom');
    h.rerender({ id: B, record: fakeRecord({ data: recB }) });
    expect(h.result.current.saveError).toBeNull();

    const h2 = setup({
      id: NEW_SELECTION,
      record: fakeRecord(),
      save: vi.fn(async () => ({ newId: null })),
    });
    await act(() => h2.result.current.save());
    expect(h2.result.current.warning).toBe(NO_ID);
    h2.rerender({ id: A, record: fakeRecord({ data: recA }) });
    expect(h2.result.current.warning).toBeNull();
  });

  it('Q9 deactivate: no refetch, deactivatedOpen, read-only, onWritten, closeDeactivated → onClose', async () => {
    const record = fakeRecord({ data: recA });
    const h = setup({ record });
    await act(() => h.result.current.deactivate!());
    expect(h.spies.deactivate).toHaveBeenCalledExactlyOnceWith(recA);
    expect(record.refetch).not.toHaveBeenCalled();
    expect(h.result.current.deactivatedOpen).toBe(true);
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.enterEdit).toBeUndefined();
    expect(h.result.current.deactivate).toBeUndefined();
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'deactivated',
      id: A,
      record: null,
    });
    expect(h.spies.onClose).not.toHaveBeenCalled();
    act(() => h.result.current.closeDeactivated());
    expect(h.spies.onClose).toHaveBeenCalledTimes(1);
  });

  it('deactivate error → warning = error, nothing else changes', async () => {
    const h = setup({ deactivate: vi.fn(async () => ({ error: 'nope' })) });
    const before = h.result.current;
    await act(() => h.result.current.deactivate!());
    expect(h.result.current.warning).toBe('nope');
    expect(h.result.current.deactivatedOpen).toBe(false);
    expect(h.result.current.deactivate).toBeDefined();
    expect(h.result.current.enterEdit).toBeDefined();
    expect(h.result.current.mode).toBe(before.mode);
    expect(h.result.current.form).toBe(before.form);
    expect(h.spies.onWritten).not.toHaveBeenCalled();
  });

  it('deactivate is undefined when creating, without a record, or without a deactivate option', () => {
    expect(
      setup({ id: NEW_SELECTION, record: fakeRecord() }).result.current.deactivate
    ).toBeUndefined();
    expect(setup({ record: fakeRecord({ loading: true }) }).result.current.deactivate).toBe(
      undefined
    );
    expect(setup({ deactivate: undefined }).result.current.deactivate).toBeUndefined();
  });

  it('deactivate is withheld while editing, saving or refreshing', async () => {
    const pending = deferred<{ error: null }>();
    const refetch = deferred<Rec | null>();
    const record = fakeRecord({ data: recA, refetch: vi.fn(() => refetch.promise) });
    const h = setup({ record, save: vi.fn(() => pending.promise) });
    expect(h.result.current.deactivate).toBeDefined();

    await editTo(h, 'typed');
    expect(h.result.current.mode).toBe('edit');
    expect(h.result.current.deactivate).toBeUndefined();

    await act(async () => {
      void h.result.current.save();
    });
    expect(h.result.current.saving).toBe(true);
    expect(h.result.current.deactivate).toBeUndefined();

    await act(async () => pending.resolve({ error: null }));
    // Saved, back in view, re-fetching the record.
    expect(h.result.current.mode).toBe('view');
    expect(h.result.current.saving).toBe(false);
    expect(h.result.current.deactivate).toBeUndefined();

    await act(async () => refetch.resolve({ id: A, name: 'typed' }));
    expect(h.result.current.deactivate).toBeDefined();
  });

  describe('deactivate is withheld while the record is stale', () => {
    it('after a failed post-save reload', async () => {
      const record = fakeRecord({
        data: recA,
        refetch: vi.fn(async () => Promise.reject(new Error('500'))),
      });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(() => h.result.current.save());
      expect(h.result.current.warning).toBe(STALE);
      expect(h.result.current.mode).toBe('view');
      expect(h.result.current.deactivate).toBeUndefined();
    });

    it('after a post-save reload that resolves null', async () => {
      const record = fakeRecord({ data: recA, refetch: vi.fn(async () => null) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(() => h.result.current.save());
      expect(h.result.current.warning).toBe(STALE);
      expect(h.result.current.deactivate).toBeUndefined();
    });

    it('is available again once a later record.data hydrates', async () => {
      const record = fakeRecord({ data: recA, refetch: vi.fn(async () => null) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(() => h.result.current.save());
      expect(h.result.current.deactivate).toBeUndefined();

      h.rerender({ record: fakeRecord({ data: { id: A, name: 'typed' } }) });
      expect(h.result.current.deactivate).toBeDefined();
    });

    it('is available again after a selection change', async () => {
      const record = fakeRecord({ data: recA, refetch: vi.fn(async () => null) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(() => h.result.current.save());
      expect(h.result.current.deactivate).toBeUndefined();

      h.rerender({ id: B, record: fakeRecord({ data: recB }) });
      expect(h.result.current.deactivate).toBeDefined();
    });
  });

  it('a Q9 deactivated state resets on an id change', async () => {
    const h = setup();
    await act(() => h.result.current.deactivate!());
    h.rerender({ id: B, record: fakeRecord({ data: recB }) });
    expect(h.result.current.deactivatedOpen).toBe(false);
    expect(h.result.current.deactivate).toBeDefined();
    expect(h.result.current.enterEdit).toBeDefined();
  });

  it('normalise is applied to the dirty compare (VT flag false ≡ absent)', async () => {
    const h = setup({ normalise: f => ({ ...f, flag: f.flag || undefined }) });
    act(() => h.result.current.enterEdit?.());
    act(() => h.result.current.setForm({ ...recA, flag: true }));
    expect(h.result.current.isDirty).toBe(true);
    act(() => h.result.current.setForm({ ...recA, flag: false }));
    expect(h.result.current.isDirty).toBe(false);
  });

  it('a new record.data identity re-baselines the form', () => {
    const h = setup();
    const next: Rec = { id: A, name: 'refreshed' };
    h.rerender({ record: fakeRecord({ data: next }) });
    expect(h.result.current.form).toEqual(next);
    expect(h.result.current.isDirty).toBe(false);
  });

  it('canSubmit follows the option, defaulting to true', () => {
    expect(setup().result.current.canSubmit).toBe(true);
    const h = setup({ canSubmit: f => f.name.length > 0 });
    expect(h.result.current.canSubmit).toBe(true);
    act(() => h.result.current.setForm({ ...recA, name: '' }));
    expect(h.result.current.canSubmit).toBe(false);
  });

  // ── Amendment invariants ──────────────────────────────────────────────────

  describe('invariant 1: a stale continuation leaves the editor alone', () => {
    it('save resolving after an id change: no state, no refetch; onWritten(A, null) still fires', async () => {
      const pending = deferred<{ error: null }>();
      const record = fakeRecord({ data: recA });
      const h = setup({ record, save: vi.fn(() => pending.promise) });
      await editTo(h, 'typed');
      await act(async () => {
        void h.result.current.save();
      });
      const recordB = fakeRecord({ data: recB });
      h.rerender({ id: B, record: recordB });
      await act(async () => pending.resolve({ error: null }));

      expect(record.refetch).not.toHaveBeenCalled();
      expect(recordB.refetch).not.toHaveBeenCalled();
      expect(h.result.current.form).toEqual(recB);
      expect(h.result.current.savedOpen).toBe(false);
      expect(h.result.current.warning).toBeNull();
      expect(h.result.current.saving).toBe(false);
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'saved',
        id: A,
        record: null,
      });
    });

    it('record refetch resolving after an id change: no success, no warning', async () => {
      const refetch = deferred<Rec | null>();
      const record = fakeRecord({ data: recA, refetch: vi.fn(() => refetch.promise) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(async () => {
        void h.result.current.save();
      });
      h.rerender({ id: B, record: fakeRecord({ data: recB }) });
      await act(async () => refetch.reject(new Error('late')));
      expect(h.result.current.savedOpen).toBe(false);
      expect(h.result.current.warning).toBeNull();
      expect(h.result.current.enterEdit).toBeDefined(); // refreshing cleared by the reset
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'saved',
        id: A,
        record: null,
      });
    });

    it('a create resolving after an org change: no onCreated, onWritten(created, null)', async () => {
      const pending = deferred<{ newId: string }>();
      const h = setup({
        id: NEW_SELECTION,
        record: fakeRecord(),
        save: vi.fn(() => pending.promise),
      });
      act(() => h.result.current.setForm({ id: '', name: 'n' }));
      await act(async () => {
        void h.result.current.save();
      });
      mocks.org = { id: 'ORG:2' };
      h.rerender({});
      await act(async () => pending.resolve({ newId: NEW_ID }));
      expect(h.spies.onCreated).not.toHaveBeenCalled();
      expect(h.result.current.savedOpen).toBe(false);
      expect(h.result.current.form).toEqual(BLANK);
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'created',
        id: NEW_ID,
        record: null,
      });
    });

    it('save resolving after unmount: no refetch, no onCreated; onWritten still fires', async () => {
      const pending = deferred<{ newId: string }>();
      const h = setup({
        id: NEW_SELECTION,
        record: fakeRecord(),
        save: vi.fn(() => pending.promise),
      });
      await act(async () => {
        void h.result.current.save();
      });
      h.unmount();
      await act(async () => pending.resolve({ newId: NEW_ID }));
      expect(h.spies.onCreated).not.toHaveBeenCalled();
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'created',
        id: NEW_ID,
        record: null,
      });
    });

    it('unmount after the create-advance, before the record lands: onWritten(created, null) once', async () => {
      const h = setup({
        id: NEW_SELECTION,
        record: fakeRecord(),
        save: vi.fn(async () => ({ newId: NEW_ID })),
      });
      await act(() => h.result.current.save());
      expect(h.spies.onCreated).toHaveBeenCalledExactlyOnceWith(NEW_ID);
      h.rerender({ id: NEW_ID, record: fakeRecord({ loading: true }) });
      expect(h.spies.onWritten).not.toHaveBeenCalled();
      h.unmount();
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'created',
        id: NEW_ID,
        record: null,
      });
    });

    it('a deactivate resolving after an id change leaves the new selection editable', async () => {
      const pending = deferred<{ error: null }>();
      const h = setup({ deactivate: vi.fn(() => pending.promise) });
      await act(async () => {
        void h.result.current.deactivate!();
      });
      h.rerender({ id: B, record: fakeRecord({ data: recB }) });
      await act(async () => pending.resolve({ error: null }));
      expect(h.result.current.deactivatedOpen).toBe(false);
      expect(h.result.current.deactivate).toBeDefined();
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'deactivated',
        id: A,
        record: null,
      });
    });

    it('an advance that moves on before the record lands still reports the create once', async () => {
      const h = setup({
        id: NEW_SELECTION,
        record: fakeRecord(),
        save: vi.fn(async () => ({ newId: NEW_ID })),
      });
      await act(() => h.result.current.save());
      h.rerender({ id: NEW_ID, record: fakeRecord({ loading: true }) });
      h.rerender({ id: B, record: fakeRecord({ data: recB }) });
      expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
        type: 'created',
        id: NEW_ID,
        record: null,
      });
      expect(h.result.current.savedOpen).toBe(false);
    });
  });

  describe('invariant 2: Edit is unavailable while refreshing or loading', () => {
    it('withholds enterEdit for the whole post-save continuation', async () => {
      const refetch = deferred<Rec | null>();
      const record = fakeRecord({ data: recA, refetch: vi.fn(() => refetch.promise) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'typed');
      await act(async () => {
        void h.result.current.save();
      });
      expect(h.result.current.mode).toBe('view');
      expect(h.result.current.enterEdit).toBeUndefined();
      await act(async () => refetch.resolve(recA));
      expect(h.result.current.enterEdit).toBeDefined();
    });

    it('withholds enterEdit while record.loading, and once already editing', () => {
      const h = setup({ record: fakeRecord({ data: recA, loading: true }) });
      expect(h.result.current.enterEdit).toBeUndefined();
      h.rerender({ record: fakeRecord({ data: recA }) });
      expect(h.result.current.enterEdit).toBeDefined();
      act(() => h.result.current.enterEdit?.());
      expect(h.result.current.enterEdit).toBeUndefined();
    });
  });

  it('invariant 3: Cancel after a create whose first load failed keeps the new id', async () => {
    const h = setup({
      id: NEW_SELECTION,
      record: fakeRecord(),
      save: vi.fn(async () => ({ newId: NEW_ID })),
    });
    act(() => h.result.current.setForm({ id: '', name: 'n' }));
    await act(() => h.result.current.save());
    h.rerender({ id: NEW_ID, record: fakeRecord({ loading: true }) });
    h.rerender({ record: fakeRecord({ error: 'load failed' }) });
    expect(h.spies.onWritten).toHaveBeenCalledExactlyOnceWith({
      type: 'created',
      id: NEW_ID,
      record: null,
    });

    act(() => h.result.current.enterEdit?.());
    act(() => h.result.current.setForm({ id: NEW_ID, name: 'changed' }));
    act(() => h.result.current.cancel());
    expect(h.result.current.form).toEqual({ id: NEW_ID, name: 'n' });
    expect(h.result.current.isDirty).toBe(false);
  });

  describe('invariant 4: transient state resets on the org+id key', () => {
    it('an org-only change resets mode, success and form', async () => {
      const record = fakeRecord({ data: recA, refetch: vi.fn(async () => recA) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'x');
      await act(() => h.result.current.save());
      act(() => h.result.current.enterEdit?.());
      act(() => h.result.current.setForm({ ...recA, name: 'unsaved' }));

      mocks.org = { id: 'ORG:2' };
      h.rerender({ record: fakeRecord({ loading: true }) });
      expect(h.result.current.mode).toBe('view');
      expect(h.result.current.savedOpen).toBe(false);
      expect(h.result.current.form).toEqual(BLANK);
      expect(h.result.current.isDirty).toBe(false);
    });

    it('a refreshing continuation invalidated by the move does not strand Edit', async () => {
      const refetch = deferred<Rec | null>();
      const record = fakeRecord({ data: recA, refetch: vi.fn(() => refetch.promise) });
      const h = setup({ record, save: vi.fn(async () => ({})) });
      await editTo(h, 'x');
      await act(async () => {
        void h.result.current.save();
      });
      expect(h.result.current.enterEdit).toBeUndefined();
      h.rerender({ id: B, record: fakeRecord({ data: recB }) });
      expect(h.result.current.enterEdit).toBeDefined();
    });
  });

  it('invariant 5: only the current selection’s save error is shown', async () => {
    const pending = deferred<{ error: string }>();
    const h = setup({ save: vi.fn(() => pending.promise) });
    await editTo(h, 'x');
    await act(async () => {
      void h.result.current.save();
    });
    h.rerender({ id: B, record: fakeRecord({ data: recB }) });
    await act(async () => pending.resolve({ error: 'A failed' }));
    expect(h.result.current.saveError).toBeNull();
    expect(h.spies.onWritten).not.toHaveBeenCalled();
  });

  it('invariant 6: a failed or empty by-id load is the record’s to render, not the editor’s state', () => {
    const h = setup({ record: fakeRecord({ error: 'load failed' }) });
    expect(h.result.current.form).toEqual(BLANK);
    expect(h.result.current.warning).toBeNull();
    expect(h.result.current.saveError).toBeNull();
    h.rerender({ record: fakeRecord({ notFound: true }) });
    expect(h.result.current.form).toEqual(BLANK);
    expect(h.result.current.warning).toBeNull();
    expect(h.spies.onWritten).not.toHaveBeenCalled();
  });

  // ── onWritten is fire-and-forget ─────────────────────────────────────────

  it('never awaits onWritten nor lets it throw into the hook', async () => {
    const record = fakeRecord({ data: recA, refetch: vi.fn(async () => recA) });
    const hang = vi.fn(() => new Promise<void>(() => {}));
    const h = setup({ record, save: vi.fn(async () => ({})), onWritten: hang });
    await editTo(h, 'x');
    await act(() => h.result.current.save());
    expect(h.result.current.savedOpen).toBe(true);

    const thrower = vi.fn(() => {
      throw new Error('host broke');
    });
    const rejecter = vi.fn(async () => Promise.reject(new Error('list down')));
    h.rerender({ onWritten: thrower });
    await editTo(h, 'y');
    await expect(act(() => h.result.current.save())).resolves.toBeUndefined();
    h.rerender({ onWritten: rejecter });
    await act(() => h.result.current.deactivate!());
    expect(thrower).toHaveBeenCalledTimes(1);
    expect(rejecter).toHaveBeenCalledTimes(1);
    expect(h.result.current.deactivatedOpen).toBe(true);
  });
});
