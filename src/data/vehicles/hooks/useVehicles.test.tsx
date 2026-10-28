// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useVehicles } from './useVehicles.ts';
import type { Vehicle } from '../types/vehicle.ts';

const mocks = vi.hoisted(() => ({ fetchVehicles: vi.fn() }));

vi.mock('../api/fetchVehicles.ts', () => ({ fetchVehicles: mocks.fetchVehicles }));
vi.mock('../../../contexts/configContext.ts', () => ({
  useConfig: () => ({ applicationBaseUrl: 'http://sobek.test/' }),
}));
vi.mock('../../../auth/authUtils.ts', () => ({
  useAuth: () => ({ getAccessToken: GET_TOKEN }),
}));
vi.mock('../../../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: { id: 'NMR:Authority:1' } }),
}));

const GET_TOKEN = async () => 'token';

const deferred = <T,>() => {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>(res => (resolve = res));
  return { promise, resolve };
};

const rowsOf = (...names: string[]): Vehicle[] =>
  names.map((name, i) => ({
    id: `NMR:Vehicle:${i}`,
    version: 1,
    registrationNumber: name,
  })) as unknown as Vehicle[];

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

const names = (rows: Vehicle[]) => rows.map(r => r.registrationNumber);

describe('useVehicles', () => {
  it('an older refetch landing after a newer one does not overwrite it', async () => {
    const initial = deferred<Vehicle[]>(),
      older = deferred<Vehicle[]>(),
      newer = deferred<Vehicle[]>();
    mocks.fetchVehicles
      .mockReturnValueOnce(initial.promise)
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);
    const { result } = renderHook(() => useVehicles(), { wrapper });
    await act(async () => initial.resolve(rowsOf('first')));
    await waitFor(() => expect(names(result.current.allData)).toEqual(['first']));

    let olderDone!: Promise<void>, newerDone!: Promise<void>;
    await act(async () => {
      olderDone = result.current.refetch() as Promise<void>;
      newerDone = result.current.refetch() as Promise<void>;
    });
    await act(async () => {
      newer.resolve(rowsOf('newest'));
      await newerDone;
    });
    expect(result.current.loading).toBe(false);
    await act(async () => {
      older.resolve(rowsOf('stale'));
      await olderDone;
    });

    expect(names(result.current.allData)).toEqual(['newest']);
    expect(result.current.loading).toBe(false);
  });
});
