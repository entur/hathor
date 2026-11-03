import { describe, it, expect, vi } from 'vitest';
import { runDeactivate, runSave, type WriteResult } from './entityEditorFlow.ts';

interface Form {
  id: string;
  name: string;
}

const NEW_ID = 'NMR:Vehicle:9';
const FORM: Form = { id: '', name: 'Bus' };

/** A promise plus the handles that settle it, for pausing a flow mid-await. */
const deferred = <T = void>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const saveDeps = (over: Partial<Parameters<typeof runSave<Form>>[0]> = {}) => {
  const calls: string[] = [];
  const log =
    (name: string) =>
    (...args: unknown[]) => {
      calls.push(args.length ? `${name}:${JSON.stringify(args[0])}` : name);
    };
  const deps = {
    t: (key: string) => key,
    live: () => true,
    isCreate: false,
    form: FORM,
    write: vi.fn(async (): Promise<WriteResult> => ({ error: null, newId: NEW_ID })),
    withNewId: (f: Form, id: string) => ({ ...f, id }),
    rebase: vi.fn(log('rebase')),
    toView: vi.fn(log('toView')),
    reread: vi.fn(async () => calls.push('reread')),
    reloadList: vi.fn(async () => void calls.push('reloadList')),
    fail: vi.fn(log('fail')),
    warn: vi.fn(log('warn')),
    onCreated: vi.fn(log('onCreated')),
    saved: vi.fn(log('saved')),
    ...over,
  };
  return { deps, calls };
};

describe('runSave', () => {
  it('create: rebases with the new id before the list reload, then onCreated + saved', async () => {
    const { deps, calls } = saveDeps({ isCreate: true });
    await runSave(deps);
    expect(calls).toEqual([
      `rebase:${JSON.stringify({ id: NEW_ID, name: 'Bus' })}`,
      'toView',
      'reloadList',
      `onCreated:"${NEW_ID}"`,
      'saved',
    ]);
  });

  it('create without newId warns and does not rebase', async () => {
    const { deps } = saveDeps({ isCreate: true, write: vi.fn(async () => ({ error: null })) });
    await runSave(deps);
    expect(deps.warn).toHaveBeenCalledWith('common.saveNoIdReturned');
    expect(deps.rebase).not.toHaveBeenCalled();
    expect(deps.onCreated).not.toHaveBeenCalled();
  });

  it('create with failing list reload still rebases, warns, does not advance', async () => {
    const { deps } = saveDeps({
      isCreate: true,
      reloadList: vi.fn(() => Promise.reject(new Error('list down'))),
    });
    await runSave(deps);
    expect(deps.rebase).toHaveBeenCalled();
    expect(deps.warn).toHaveBeenCalledWith('common.saveStaleList');
    expect(deps.onCreated).not.toHaveBeenCalled();
    expect(deps.saved).not.toHaveBeenCalled();
  });

  it('edit: rebases on the form, then re-read and list reload, then saved', async () => {
    const { deps, calls } = saveDeps();
    await runSave(deps);
    expect(calls).toEqual([
      `rebase:${JSON.stringify(FORM)}`,
      'toView',
      'reread',
      'reloadList',
      'saved',
    ]);
  });

  it('edit: failed re-read is silent', async () => {
    const { deps } = saveDeps({ reread: vi.fn(() => Promise.reject(new Error('gone'))) });
    await runSave(deps);
    expect(deps.saved).not.toHaveBeenCalled();
    expect(deps.warn).not.toHaveBeenCalled();
  });

  it('edit: failed list reload warns instead of saved', async () => {
    const { deps } = saveDeps({ reloadList: vi.fn(() => Promise.reject(new Error('x'))) });
    await runSave(deps);
    expect(deps.warn).toHaveBeenCalledWith('common.saveStaleList');
    expect(deps.saved).not.toHaveBeenCalled();
  });

  it('write error → fail, nothing else', async () => {
    const { deps, calls } = saveDeps({ write: vi.fn(async () => ({ error: 'boom' })) });
    await runSave(deps);
    expect(calls).toEqual(['fail:"boom"']);
  });

  it('late create continuation does not advance', async () => {
    let live = true;
    const list = deferred();
    const { deps } = saveDeps({ isCreate: true, live: () => live, reloadList: () => list.promise });
    const run = runSave(deps);
    await vi.waitFor(() => expect(deps.toView).toHaveBeenCalled());
    live = false; // the user picked another row
    list.resolve();
    await run;
    expect(deps.onCreated).not.toHaveBeenCalled();
    expect(deps.saved).not.toHaveBeenCalled();
    expect(deps.warn).not.toHaveBeenCalled();
  });

  it('late write continuation does nothing', async () => {
    let live = true;
    const write = deferred<WriteResult>();
    const { deps, calls } = saveDeps({ live: () => live, write: () => write.promise });
    const run = runSave(deps);
    live = false;
    write.resolve({ error: null });
    await run;
    expect(calls).toEqual([]);
  });
});

describe('runDeactivate', () => {
  const deactivateDeps = (over: Partial<Parameters<typeof runDeactivate>[0]> = {}) => {
    const calls: string[] = [];
    const deps = {
      t: (key: string) => key,
      live: () => true,
      deactivate: vi.fn(async () => ({ error: null })),
      toView: vi.fn(() => void calls.push('toView')),
      stale: vi.fn(() => void calls.push('stale')),
      ok: vi.fn(() => void calls.push('ok')),
      reloadList: vi.fn(async () => void calls.push('reloadList')),
      warn: vi.fn((m: string) => void calls.push(`warn:${m}`)),
      ...over,
    };
    return { deps, calls };
  };

  it('stale then ok', async () => {
    const { deps, calls } = deactivateDeps();
    await runDeactivate(deps);
    expect(calls).toEqual(['toView', 'stale', 'reloadList', 'ok']);
  });

  it('list fails → stale then warn deactivateStaleList', async () => {
    const { deps, calls } = deactivateDeps({
      reloadList: vi.fn(() => Promise.reject(new Error('x'))),
    });
    await runDeactivate(deps);
    expect(calls).toEqual(['toView', 'stale', 'warn:common.deactivateStaleList']);
  });

  it('deactivate error → warn(error), no stale', async () => {
    const { deps, calls } = deactivateDeps({ deactivate: vi.fn(async () => ({ error: 'nope' })) });
    await runDeactivate(deps);
    expect(calls).toEqual(['warn:nope']);
  });

  it('late deactivate continuation does nothing', async () => {
    let live = true;
    const req = deferred<{ error: string | null }>();
    const { deps, calls } = deactivateDeps({ live: () => live, deactivate: () => req.promise });
    const run = runDeactivate(deps);
    live = false;
    req.resolve({ error: null });
    await run;
    expect(calls).toEqual([]);
  });
});
