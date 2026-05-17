import { describe, expect, it, vi } from 'vitest';
import { commitSave } from './commitSave';

describe('commitSave — save → onSaved chain (M4)', () => {
  it('M4: on success, awaits onSaved before resolving', async () => {
    // Reproducer of M4 (PR #74). The previous VehicleDetails.handleSave
    // called `save()` then mutated UI state without awaiting any list-side
    // refresh — the row on `/vehicles` stayed stale until manual reload.
    // commitSave makes the refresh part of the save chain: the returned
    // promise resolves only after `onSaved` (the list refetch) completes.
    let resolveSaved!: () => void;
    const savedPromise = new Promise<void>(r => {
      resolveSaved = r;
    });
    const save = vi.fn().mockResolvedValue({});
    const onSaved = vi.fn().mockReturnValue(savedPromise);

    const p = commitSave(save, { x: 1 }, onSaved);
    await Promise.resolve();
    await Promise.resolve();
    expect(save).toHaveBeenCalledWith({ x: 1 });
    expect(onSaved).toHaveBeenCalled();

    let done = false;
    p.then(() => {
      done = true;
    });
    await Promise.resolve();
    expect(done).toBe(false);

    resolveSaved();
    await p;
    expect(done).toBe(true);
  });

  it('skips onSaved when save returns an error', async () => {
    const save = vi.fn().mockResolvedValue({ error: 'nope' });
    const onSaved = vi.fn();
    const result = await commitSave(save, { x: 1 }, onSaved);
    expect(onSaved).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'nope' });
  });

  it('returns the save result unchanged on success', async () => {
    const save = vi.fn().mockResolvedValue({ id: 'ok' });
    const onSaved = vi.fn().mockResolvedValue(undefined);
    const result = await commitSave(save, { x: 1 }, onSaved);
    expect(result).toEqual({ id: 'ok' });
  });

  it('works when onSaved is undefined (no refetch channel wired)', async () => {
    const result = await commitSave(async () => ({}), { x: 1 }, undefined);
    expect(result).toEqual({});
  });

  it('propagates synchronous onSaved (non-Promise) without throwing', async () => {
    const onSaved = vi.fn(() => undefined);
    const result = await commitSave(async () => ({}), { x: 1 }, onSaved);
    expect(onSaved).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
