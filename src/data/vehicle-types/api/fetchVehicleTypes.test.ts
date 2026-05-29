import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchVehicleTypes } from './fetchVehicleTypes.ts';
import { fetchVehicleTypesRequest } from '../../../graphql/vehicles/queries/fetchVehicleTypes.ts';

vi.mock('../../../graphql/vehicles/queries/fetchVehicleTypes.ts', () => ({
  fetchVehicleTypesRequest: vi.fn(),
}));

const mockedRequest = vi.mocked(fetchVehicleTypesRequest);

const mkPage = (content: Array<Record<string, unknown>>, totalElements = content.length) => ({
  vehicleTypes: { content, totalElements, page: 0, size: content.length },
});

describe('fetchVehicleTypes', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('returns an empty array when content is empty', async () => {
    mockedRequest.mockResolvedValue(mkPage([]));
    const ctx = await fetchVehicleTypes('http://x', null);
    expect(ctx.vehicleTypes).toEqual([]);
  });

  it('projects a vehicle type with deckPlan and vehicles into the internal shape', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:VehicleType:rail',
          version: 1,
          name: { value: 'Rail Type' },
          shortName: { value: 'RT' },
          transportMode: 'rail',
          length: 100,
          width: 3,
          height: 4,
          created: '2026-01-01',
          changed: '2026-01-02',
          changedBy: 'kdm',
          deckPlan: {
            netexId: 'NMR:DeckPlan:DP1',
            name: { value: 'Standard' },
          },
          vehicles: [
            { netexId: 'NMR:Vehicle:V1', registrationNumber: 'R1', version: 1 },
            { netexId: 'NMR:Vehicle:V2', registrationNumber: 'R2', version: 2 },
          ],
        },
      ])
    );
    const ctx = await fetchVehicleTypes('http://x', null);
    expect(ctx.vehicleTypes).toEqual([
      {
        id: 'NMR:VehicleType:rail',
        version: 1,
        name: { value: 'Rail Type' },
        shortName: { value: 'RT' },
        transportMode: 'rail',
        length: 100,
        width: 3,
        height: 4,
        created: '2026-01-01',
        changed: '2026-01-02',
        changedBy: 'kdm',
        deckPlan: {
          id: 'NMR:DeckPlan:DP1',
          name: { value: 'Standard' },
        },
        vehicles: [
          { id: 'NMR:Vehicle:V1', registrationNumber: 'R1', version: 1 },
          { id: 'NMR:Vehicle:V2', registrationNumber: 'R2', version: 2 },
        ],
      },
    ]);
  });

  it('omits deckPlan when the server returns deckPlan: null', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:VehicleType:bus',
          version: 1,
          length: 12,
          width: 2.5,
          height: 3,
          deckPlan: null,
        },
      ])
    );
    const [vt] = (await fetchVehicleTypes('http://x', null)).vehicleTypes;
    expect(vt.deckPlan).toBeUndefined();
  });

  it('omits vehicles when the server returns no vehicles list', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:VehicleType:bus',
          version: 1,
          length: 12,
          width: 2.5,
          height: 3,
        },
      ])
    );
    const [vt] = (await fetchVehicleTypes('http://x', null)).vehicleTypes;
    expect(vt.vehicles).toBeUndefined();
  });
});
