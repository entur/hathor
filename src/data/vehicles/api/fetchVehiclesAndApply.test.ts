import { describe, expect, it, vi } from 'vitest';
import { fetchVehiclesAndApply } from './fetchVehiclesAndApply';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped';

const noop = () => {};

const aRow = { id: 'NMR:Vehicle:1' } as unknown as VehicleGQLShaped;

describe('fetchVehiclesAndApply — awaitable orchestration (M3)', () => {
  it('M3: returned promise resolves only after setData has been called', async () => {
    // Reproducer of M3 (PR #74). The previous useVehicles.doFetch returned
    // an immediately-resolved promise (fire-and-forget `.then().catch()`),
    // so `await refetch()` returned before the new data was committed —
    // M4's save→refetch chain couldn't observe fresh rows. This module
    // restores the natural await semantics: the returned promise is the
    // entire orchestration chain.
    let resolveFetch!: (rows: VehicleGQLShaped[]) => void;
    const fetchPromise = new Promise<VehicleGQLShaped[]>(r => {
      resolveFetch = r;
    });
    const setData = vi.fn();

    const applyPromise = fetchVehiclesAndApply({
      applicationBaseUrl: 'http://x/',
      getAccessToken: async () => 'tok',
      setData,
      setError: noop,
      fetchVehiclesImpl: () => fetchPromise,
    });

    let resolved = false;
    applyPromise.then(() => {
      resolved = true;
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(setData).not.toHaveBeenCalled();
    expect(resolved).toBe(false);

    resolveFetch([aRow]);
    await applyPromise;

    expect(setData).toHaveBeenCalledTimes(1);
    expect(setData).toHaveBeenCalledWith([aRow]);
    expect(resolved).toBe(true);
  });

  it('clears prior error before fetching', async () => {
    const setError = vi.fn();
    await fetchVehiclesAndApply({
      applicationBaseUrl: 'http://x/',
      getAccessToken: async () => 'tok',
      setData: noop,
      setError,
      fetchVehiclesImpl: async () => [],
    });
    expect(setError).toHaveBeenNthCalledWith(1, null);
  });

  it('skips setData when fetch throws', async () => {
    const setData = vi.fn();
    await fetchVehiclesAndApply({
      applicationBaseUrl: 'http://x/',
      getAccessToken: async () => 'tok',
      setData,
      setError: noop,
      fetchVehiclesImpl: async () => {
        throw new Error('boom');
      },
    });
    expect(setData).not.toHaveBeenCalled();
  });

  // Only the routing is asserted here; the status/type → message mapping is
  // pinned once in `graphqlErrMsg.test.ts`.
  it('routes errors through graphqlErrMsg', async () => {
    const setError = vi.fn();
    await fetchVehiclesAndApply({
      applicationBaseUrl: 'http://x/',
      getAccessToken: async () => 'tok',
      setData: noop,
      setError,
      fetchVehiclesImpl: async () => {
        throw new Error('boom');
      },
    });
    expect(setError).toHaveBeenLastCalledWith('boom');
  });
});
