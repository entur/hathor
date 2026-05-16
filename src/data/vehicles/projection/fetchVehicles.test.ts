import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchVehicles } from './fetchVehicles.ts';
import { fetchVehicleTypes } from '../../vehicle-types/fetchVehicleTypes.ts';
import type { VehicleType } from '../../vehicle-types/vehicleTypeTypes.ts';

vi.mock('../../vehicle-types/fetchVehicleTypes.ts', () => ({
  fetchVehicleTypes: vi.fn(),
}));

const mockedFetchVehicleTypes = vi.mocked(fetchVehicleTypes);

const mkVT = (over: Partial<VehicleType>): VehicleType => ({
  id: 'NMR:VehicleType:default',
  version: 1,
  length: 10,
  width: 2,
  height: 3,
  __typename: 'VehicleType',
  ...over,
});

describe('fetchVehicles', () => {
  beforeEach(() => {
    mockedFetchVehicleTypes.mockReset();
  });

  it('returns an empty array when there are no vehicleTypes', async () => {
    mockedFetchVehicleTypes.mockResolvedValue({ vehicleTypes: [] });
    expect(await fetchVehicles('http://x', null)).toEqual([]);
  });

  it('contributes zero rows for a VehicleType with no vehicles array', async () => {
    mockedFetchVehicleTypes.mockResolvedValue({
      vehicleTypes: [mkVT({ vehicles: undefined })],
    });
    expect(await fetchVehicles('http://x', null)).toEqual([]);
  });

  it('inherits parentVehicleTypeId / Name / TransportMode on every flattened row', async () => {
    mockedFetchVehicleTypes.mockResolvedValue({
      vehicleTypes: [
        mkVT({
          id: 'NMR:VehicleType:rail',
          name: { value: 'Rail Type' },
          transportMode: 'rail',
          vehicles: [
            { id: 'V1', registrationNumber: 'RAIL-001', version: 2 },
            { id: 'V2', registrationNumber: 'RAIL-002', version: 1 },
          ],
        }),
      ],
    });
    expect(await fetchVehicles('http://x', null)).toEqual([
      {
        id: 'V1',
        registrationNumber: 'RAIL-001',
        version: 2,
        parentVehicleTypeId: 'NMR:VehicleType:rail',
        parentVehicleTypeName: 'Rail Type',
        parentTransportMode: 'rail',
      },
      {
        id: 'V2',
        registrationNumber: 'RAIL-002',
        version: 1,
        parentVehicleTypeId: 'NMR:VehicleType:rail',
        parentVehicleTypeName: 'Rail Type',
        parentTransportMode: 'rail',
      },
    ]);
  });

  it("collapses an unrecognised parent transportMode to 'unknown'", async () => {
    mockedFetchVehicleTypes.mockResolvedValue({
      vehicleTypes: [
        mkVT({
          transportMode: 'someUnknownNetexValue',
          vehicles: [{ id: 'V1', registrationNumber: 'X', version: 1 }],
        }),
      ],
    });
    const rows = await fetchVehicles('http://x', null);
    expect(rows[0].parentTransportMode).toBe('unknown');
  });
});
