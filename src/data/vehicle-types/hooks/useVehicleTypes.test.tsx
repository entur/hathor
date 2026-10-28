// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useVehicleTypes } from './useVehicleTypes.ts';
import type { VehicleType, VehicleTypeContext } from '../types/vehicleTypeTypes.ts';

const mocks = vi.hoisted(() => ({ fetchVehicleTypes: vi.fn() }));

vi.mock('../api/fetchVehicleTypes.ts', () => ({ fetchVehicleTypes: mocks.fetchVehicleTypes }));
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

const ctxOf = (...names: string[]): VehicleTypeContext =>
  ({
    vehicleTypes: names.map((name, i) => ({ id: `NMR:VehicleType:${i}`, version: 1, name })),
  }) as unknown as VehicleTypeContext;

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

const names = (rows: VehicleType[]) => rows.map(r => r.name);

describe('useVehicleTypes', () => {
  it('an older refetch landing after a newer one does not overwrite it', async () => {
    const initial = deferred<VehicleTypeContext>(),
      older = deferred<VehicleTypeContext>(),
      newer = deferred<VehicleTypeContext>();
    mocks.fetchVehicleTypes
      .mockReturnValueOnce(initial.promise)
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);
    const { result } = renderHook(() => useVehicleTypes(), { wrapper });
    await act(async () => initial.resolve(ctxOf('first')));
    await waitFor(() => expect(names(result.current.allData)).toEqual(['first']));

    let olderDone!: Promise<void>, newerDone!: Promise<void>;
    await act(async () => {
      olderDone = result.current.refetch() as Promise<void>;
      newerDone = result.current.refetch() as Promise<void>;
    });
    await act(async () => {
      newer.resolve(ctxOf('newest'));
      await newerDone;
    });
    expect(result.current.loading).toBe(false);
    await act(async () => {
      older.resolve(ctxOf('stale'));
      await olderDone;
    });

    expect(names(result.current.allData)).toEqual(['newest']);
    expect(result.current.loading).toBe(false);
  });
});
