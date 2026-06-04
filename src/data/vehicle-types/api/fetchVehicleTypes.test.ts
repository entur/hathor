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
          transportMode: 'RAIL',
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
        transportMode: 'RAIL',
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

  it('projects propulsion/perf/capacity fields, compacting null list members', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:VehicleType:elec',
          version: 1,
          length: 12,
          width: 2.5,
          height: 3,
          weight: 12000,
          lowFloor: true,
          propulsionTypes: ['ELECTRIC', null],
          fuelTypes: ['ELECTRICITY'],
          selfPropelled: true,
          euroClass: 'EURO6',
          maximumVelocity: 80,
          maximumRange: 600,
          formDragCoefficient: 0.6,
          rollResistanceCoefficient: 0.01,
          maximumEngineEffectKW: 250,
          hybridCategory: 'CHARGEABLE',
          passengerCapacity: { totalCapacity: 90, seatingCapacity: 40, standingCapacity: 50 },
        },
      ])
    );
    const [vt] = (await fetchVehicleTypes('http://x', null)).vehicleTypes;
    expect(vt.propulsionTypes).toEqual(['ELECTRIC']); // null member dropped
    expect(vt.fuelTypes).toEqual(['ELECTRICITY']);
    expect(vt.selfPropelled).toBe(true);
    expect(vt.lowFloor).toBe(true);
    expect(vt.weight).toBe(12000);
    expect(vt.euroClass).toBe('EURO6');
    expect(vt.maximumEngineEffectKW).toBe(250);
    expect(vt.hybridCategory).toBe('CHARGEABLE');
    expect(vt.passengerCapacity).toEqual({
      totalCapacity: 90,
      seatingCapacity: 40,
      standingCapacity: 50,
    });
  });

  it('coerces empty/absent propulsion list to undefined', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:VehicleType:x',
          version: 1,
          length: 1,
          width: 1,
          height: 1,
          propulsionTypes: [],
        },
      ])
    );
    const [vt] = (await fetchVehicleTypes('http://x', null)).vehicleTypes;
    expect(vt.propulsionTypes).toBeUndefined();
    expect(vt.passengerCapacity).toBeUndefined();
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
