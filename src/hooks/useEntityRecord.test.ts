// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NEW_SELECTION } from './useUrlEditorSelection';
import { useEntityRecord } from './useEntityRecord';

const BASE_URL = 'http://sobek.test',
  TOKEN = 'tok';
const mocks = vi.hoisted(() => ({ org: { id: 'ORG:1' } as { id: string } | null }));

vi.mock('../contexts/configContext.ts', () => ({
  useConfig: () => ({ applicationBaseUrl: 'http://sobek.test' }),
}));
vi.mock('../auth/authUtils.ts', () => ({
  useAuth: () => ({ getAccessToken: () => Promise.resolve('tok') }),
}));
vi.mock('../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: mocks.org }),
}));

describe('useEntityRecord', () => {
  beforeEach(() => {
    mocks.org = { id: 'ORG:1' };
  });

  it('loads the record for an id', async () => {
    const fetchById = vi.fn().mockResolvedValue({ id: 'A' });
    const { result } = renderHook(() => useEntityRecord('A', fetchById));
    await waitFor(() => expect(result.current.data).toEqual({ id: 'A' }));
    expect(result.current.loading).toBe(false);
    expect(result.current.notFound).toBe(false);
    expect(fetchById).toHaveBeenCalledWith('A', {
      applicationBaseUrl: BASE_URL,
      dataOwnerRef: 'ORG:1',
      token: TOKEN,
    });
  });

  it.each([null, NEW_SELECTION])('does not fetch for %s', async id => {
    const fetchById = vi.fn();
    const { result } = renderHook(() => useEntityRecord(id, fetchById));
    await act(async () => {});
    expect(fetchById).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('flags notFound when Sobek returns null', async () => {
    const { result } = renderHook(() => useEntityRecord('A', vi.fn().mockResolvedValue(null)));
    await waitFor(() => expect(result.current.notFound).toBe(true));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets error and keeps data null when the fetch throws', async () => {
    const { result } = renderHook(() =>
      useEntityRecord('A', vi.fn().mockRejectedValue(new Error('boom')))
    );
    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('re-fetches when the id changes', async () => {
    const fetchById = vi.fn((id: string) => Promise.resolve({ id }));
    const { result, rerender } = renderHook(({ id }) => useEntityRecord(id, fetchById), {
      initialProps: { id: 'A' },
    });
    await waitFor(() => expect(result.current.data).toEqual({ id: 'A' }));
    rerender({ id: 'B' });
    await waitFor(() => expect(result.current.data).toEqual({ id: 'B' }));
    expect(fetchById).toHaveBeenCalledTimes(2);
  });

  it('re-fetches when the org changes', async () => {
    const fetchById = vi.fn((id: string) => Promise.resolve({ id }));
    const { rerender } = renderHook(() => useEntityRecord('A', fetchById));
    await waitFor(() => expect(fetchById).toHaveBeenCalledTimes(1));
    mocks.org = { id: 'ORG:2' };
    rerender();
    await waitFor(() => expect(fetchById).toHaveBeenCalledTimes(2));
    expect(fetchById.mock.calls[1][1].dataOwnerRef).toBe('ORG:2');
  });

  it('refetch resolves with the fresh record', async () => {
    const fetchById = vi.fn().mockResolvedValueOnce({ v: 1 }).mockResolvedValueOnce({ v: 2 });
    const { result } = renderHook(() => useEntityRecord('A', fetchById));
    await waitFor(() => expect(result.current.data).toEqual({ v: 1 }));
    let fresh: unknown;
    await act(async () => {
      fresh = await result.current.refetch();
    });
    expect(fresh).toEqual({ v: 2 });
    expect(result.current.data).toEqual({ v: 2 });
  });

  it('refetch rejects when the fetch throws', async () => {
    const fetchById = vi.fn().mockResolvedValueOnce({ v: 1 }).mockRejectedValueOnce(new Error('x'));
    const { result } = renderHook(() => useEntityRecord('A', fetchById));
    await waitFor(() => expect(result.current.data).toEqual({ v: 1 }));
    await act(async () => {
      await expect(result.current.refetch()).rejects.toThrow('x');
    });
    expect(result.current.error).toBe('x');
    expect(result.current.data).toEqual({ v: 1 });
  });

  it('clears data when the id changes before the new record lands', async () => {
    const fetchById = vi
      .fn()
      .mockResolvedValueOnce({ id: 'A' })
      .mockReturnValueOnce(new Promise(() => {}));
    const { result, rerender } = renderHook(({ id }) => useEntityRecord(id, fetchById), {
      initialProps: { id: 'A' },
    });
    await waitFor(() => expect(result.current.data).toEqual({ id: 'A' }));
    rerender({ id: 'B' });
    expect(result.current.data).toBeNull();
    expect(result.current.notFound).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it('reports loading on the first render after the id changes', async () => {
    const fetchById = vi.fn().mockResolvedValue(null);
    const { result, rerender } = renderHook(({ id }) => useEntityRecord(id, fetchById), {
      initialProps: { id: 'A' },
    });
    await waitFor(() => expect(result.current.notFound).toBe(true));
    rerender({ id: 'B' });
    expect(result.current.loading).toBe(true);
    expect(result.current.notFound).toBe(false);
  });

  it('ignores a stale response after the id changed', async () => {
    const resolvers: Record<string, (v: unknown) => void> = {};
    const fetchById = vi.fn((id: string) => new Promise(res => void (resolvers[id] = res)));
    const { result, rerender } = renderHook(({ id }) => useEntityRecord(id, fetchById), {
      initialProps: { id: 'A' },
    });
    await waitFor(() => expect(resolvers.A).toBeDefined());
    rerender({ id: 'B' });
    await waitFor(() => expect(resolvers.B).toBeDefined());
    await act(async () => resolvers.B({ id: 'B' }));
    await act(async () => resolvers.A({ id: 'A' }));
    expect(result.current.data).toEqual({ id: 'B' });
  });

  it('reports loading during a same-key refetch, keeping the last record', async () => {
    let release!: (v: unknown) => void;
    const fetchById = vi
      .fn()
      .mockResolvedValueOnce({ v: 1 })
      .mockReturnValueOnce(new Promise(res => (release = res)));
    const { result } = renderHook(() => useEntityRecord('A', fetchById));
    await waitFor(() => expect(result.current.data).toEqual({ v: 1 }));
    let pending!: Promise<unknown>;
    act(() => {
      pending = result.current.refetch();
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual({ v: 1 });
    await act(async () => {
      release({ v: 2 });
      await pending;
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ v: 2 });
  });

  it('a stale-key refetch resolves null without fetching or superseding the current key', async () => {
    const resolvers: Record<string, (v: unknown) => void> = {};
    const fetchById = vi.fn((id: string) => new Promise(res => void (resolvers[id] = res)));
    const { result, rerender } = renderHook(({ id }) => useEntityRecord(id, fetchById), {
      initialProps: { id: 'A' },
    });
    await waitFor(() => expect(resolvers.A).toBeDefined());
    await act(async () => resolvers.A({ id: 'A' }));
    const staleRefetch = result.current.refetch;

    rerender({ id: 'B' });
    await waitFor(() => expect(resolvers.B).toBeDefined());
    let stale: unknown = 'unset';
    await act(async () => {
      stale = await staleRefetch();
    });
    expect(stale).toBeNull();
    expect(fetchById).toHaveBeenCalledTimes(2);

    await act(async () => resolvers.B({ id: 'B' }));
    expect(result.current.data).toEqual({ id: 'B' });
    expect(result.current.loading).toBe(false);
  });
});
