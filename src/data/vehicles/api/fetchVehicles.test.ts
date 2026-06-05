import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchVehicles } from './fetchVehicles.ts';
import { fetchVehiclesRequest } from '../../../graphql/vehicles/queries/fetchVehicles.ts';

vi.mock('../../../graphql/vehicles/queries/fetchVehicles.ts', () => ({
  fetchVehiclesRequest: vi.fn(),
}));

const mockedRequest = vi.mocked(fetchVehiclesRequest);

const mkPage = (content: Array<Record<string, unknown>>, totalElements = content.length) => ({
  vehicles: { content, totalElements, page: 0, size: content.length },
});

describe('fetchVehicles', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('returns an empty array when content is empty', async () => {
    mockedRequest.mockResolvedValue(mkPage([]));
    expect(await fetchVehicles('http://x', 'NOG:Authority:1', null)).toEqual([]);
  });

  it('projects a vehicle with a full transportType into the nested row shape', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:Vehicle:1',
          version: 2,
          registrationNumber: 'RAIL-001',
          operationalNumber: 'OP-77',
          buildDate: '2020-01-01',
          chassisNumber: 'CHASSIS-123',
          description: { value: 'A rail vehicle' },
          name: { value: 'Vehicle One' },
          registrationDate: '2020-02-01',
          transportType: {
            netexId: 'NMR:VehicleType:rail',
            version: 3,
            name: { value: 'Rail Type' },
            transportMode: 'RAIL',
          },
        },
      ])
    );
    expect(await fetchVehicles('http://x', 'NOG:Authority:1', null)).toEqual([
      {
        id: 'NMR:Vehicle:1',
        version: 2,
        registrationNumber: 'RAIL-001',
        operationalNumber: 'OP-77',
        buildDate: '2020-01-01',
        chassisNumber: 'CHASSIS-123',
        description: { value: 'A rail vehicle' },
        name: { value: 'Vehicle One' },
        registrationDate: '2020-02-01',
        transportType: {
          id: 'NMR:VehicleType:rail',
          version: 3,
          name: { value: 'Rail Type' },
          transportMode: 'RAIL',
        },
      },
    ]);
  });

  it('omits transportType on the row when the server returns transportType: null', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:Vehicle:V1',
          version: 1,
          registrationNumber: 'X-1',
          transportType: null,
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', 'NOG:Authority:1', null);
    expect(row.transportType).toBeUndefined();
  });

  it("coalesces a null/missing transportType.transportMode to 'UNKNOWN'", async () => {
    // Sobek types transportMode as the GraphQL enum; the only non-enum value it
    // can send is null. The projection coalesces null → 'UNKNOWN' (Sobek does
    // not default) and otherwise passes the enum value through verbatim.
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:Vehicle:V1',
          version: 1,
          registrationNumber: 'X-1',
          transportType: {
            netexId: 'NMR:VehicleType:weird',
            version: 1,
            transportMode: null,
          },
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', 'NOG:Authority:1', null);
    expect(row.transportType?.transportMode).toBe('UNKNOWN');
  });

  it('omits operationalNumber on the row when the server returns null', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          netexId: 'NMR:Vehicle:V1',
          version: 1,
          registrationNumber: 'X-1',
          operationalNumber: null,
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', 'NOG:Authority:1', null);
    expect(row.operationalNumber).toBeUndefined();
  });

  describe('truncation canary', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('warns when content.length < totalElements', async () => {
      mockedRequest.mockResolvedValue(
        mkPage(
          [{ netexId: 'NMR:Vehicle:V1', version: 1, registrationNumber: 'A' }],
          /* totalElements */ 42
        )
      );
      await fetchVehicles('http://x', 'NOG:Authority:1', null);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/truncated/);
    });

    it('does not warn when content.length === totalElements', async () => {
      mockedRequest.mockResolvedValue(mkPage([]));
      await fetchVehicles('http://x', 'NOG:Authority:1', null);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
