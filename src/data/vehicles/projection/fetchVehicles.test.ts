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
    expect(await fetchVehicles('http://x', null)).toEqual([]);
  });

  it('projects a vehicle with a full transportType into the nested row shape', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          id: 'NMR:Vehicle:1',
          version: 2,
          registrationNumber: 'RAIL-001',
          operationalNumber: 'OP-77',
          transportType: {
            id: 'NMR:VehicleType:rail',
            version: 3,
            name: { value: 'Rail Type' },
            transportMode: 'rail',
          },
        },
      ])
    );
    expect(await fetchVehicles('http://x', null)).toEqual([
      {
        id: 'NMR:Vehicle:1',
        version: 2,
        registrationNumber: 'RAIL-001',
        operationalNumber: 'OP-77',
        transportType: {
          id: 'NMR:VehicleType:rail',
          version: 3,
          name: 'Rail Type',
          transportMode: 'rail',
        },
      },
    ]);
  });

  it('omits transportType on the row when the server returns transportType: null', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          id: 'V1',
          version: 1,
          registrationNumber: 'X-1',
          transportType: null,
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', null);
    expect(row.transportType).toBeUndefined();
  });

  it("collapses an unrecognised transportType.transportMode to 'unknown'", async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          id: 'V1',
          version: 1,
          registrationNumber: 'X-1',
          transportType: {
            id: 'NMR:VehicleType:weird',
            version: 1,
            transportMode: 'someUnknownNetexValue',
          },
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', null);
    expect(row.transportType?.transportMode).toBe('unknown');
  });

  it('reconstructs a bare transportType.id into a full NeTEx id (sobek#125 bridge)', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          id: 'NMR:Vehicle:V1',
          version: 1,
          registrationNumber: 'X-1',
          transportType: {
            id: '42',
            version: 1,
            transportMode: 'bus',
          },
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', null);
    expect(row.transportType?.id).toBe('NMR:VehicleType:42');
  });

  it('omits operationalNumber on the row when the server returns null', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([
        {
          id: 'V1',
          version: 1,
          registrationNumber: 'X-1',
          operationalNumber: null,
        },
      ])
    );
    const [row] = await fetchVehicles('http://x', null);
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
        mkPage([{ id: 'V1', version: 1, registrationNumber: 'A' }], /* totalElements */ 42)
      );
      await fetchVehicles('http://x', null);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/truncated/);
    });

    it('does not warn when content.length === totalElements', async () => {
      mockedRequest.mockResolvedValue(mkPage([]));
      await fetchVehicles('http://x', null);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
