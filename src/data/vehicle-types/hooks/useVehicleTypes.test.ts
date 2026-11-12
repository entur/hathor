// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useVehicleTypes } from './useVehicleTypes.ts';
import { fetchVehicleTypes } from '../api/fetchVehicleTypes.ts';
import type { VehicleType, VehicleTypeKind } from '../types/vehicleTypeTypes.ts';

vi.mock('../api/fetchVehicleTypes.ts', () => ({ fetchVehicleTypes: vi.fn() }));
vi.mock('../../../contexts/configContext.ts', () => ({
  useConfig: () => ({ applicationBaseUrl: 'http://x' }),
}));
// Stable identities, like the real providers': a fresh one per render would refire the fetch effect.
const { auth, organisations } = vi.hoisted(() => ({
  auth: { getAccessToken: async () => null },
  organisations: { currentOrganisation: { id: 'NMR:Organisation:1' } },
}));
vi.mock('../../../auth/authUtils.ts', () => ({ useAuth: () => auth }));
vi.mock('../../../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => organisations,
}));

const mockedFetch = vi.mocked(fetchVehicleTypes);

const vt = (id: string): VehicleType => ({ id, version: 1, name: { value: id, lang: 'nb' } });

/** A fetch the test settles by hand. */
const deferred = () => {
  let resolve!: (rows: VehicleType[]) => void;
  const promise = new Promise<{ vehicleTypes: VehicleType[] }>(r => {
    resolve = rows => r({ vehicleTypes: rows });
  });
  return { promise, resolve };
};

describe('useVehicleTypes', () => {
  beforeEach(() => mockedFetch.mockReset());

  it('fetches the kind it is given', async () => {
    mockedFetch.mockResolvedValue({ vehicleTypes: [] });
    renderHook(() => useVehicleTypes('CONTRACTUAL'));
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    expect(mockedFetch.mock.calls[0][3]).toBe('CONTRACTUAL');
  });

  it('ignores a late response of the kind it has switched away from', async () => {
    const physical = deferred();
    const contractual = deferred();
    mockedFetch.mockReturnValueOnce(physical.promise).mockReturnValueOnce(contractual.promise);

    const { result, rerender } = renderHook(({ kind }) => useVehicleTypes(kind), {
      initialProps: { kind: 'PHYSICAL' as VehicleTypeKind },
    });
    await waitFor(() => expect(mockedFetch).toHaveBeenCalledTimes(1));
    rerender({ kind: 'CONTRACTUAL' });
    await waitFor(() => expect(mockedFetch).toHaveBeenCalledTimes(2));

    // The newer read lands first, then the stale PHYSICAL one.
    await act(async () => contractual.resolve([vt('CVT:VehicleType:c')]));
    await act(async () => physical.resolve([vt('NMR:VehicleType:p')]));

    expect(result.current.allData.map(r => r.id)).toEqual(['CVT:VehicleType:c']);
    expect(result.current.loading).toBe(false);
  });

  it('does not show the previous kind’s rows while the new kind loads', async () => {
    const physical = deferred();
    const contractual = deferred();
    mockedFetch.mockReturnValueOnce(physical.promise).mockReturnValueOnce(contractual.promise);

    const { result, rerender } = renderHook(({ kind }) => useVehicleTypes(kind), {
      initialProps: { kind: 'PHYSICAL' as VehicleTypeKind },
    });
    await act(async () => physical.resolve([vt('NMR:VehicleType:p')]));
    expect(result.current.allData).toHaveLength(1);

    rerender({ kind: 'CONTRACTUAL' });
    expect(result.current.allData).toEqual([]);
  });
});
