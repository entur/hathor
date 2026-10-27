import { describe, expect, it } from 'vitest';
import { extractVehicleTypeIds } from './xmlUtils';
import { makeBulkXml } from './__fixtures__/makeXml';

describe('extractVehicleTypeIds', () => {
  it('returns each VehicleType id once', () => {
    const xml = makeBulkXml({
      vehicles: [{ reg: 'A' }, { reg: 'B' }, { reg: 'C', vehicleTypeId: 'NMR:VehicleType:2' }],
    });

    expect(extractVehicleTypeIds(xml)).toEqual(['NMR:VehicleType:1', 'NMR:VehicleType:2']);
  });

  it('returns nothing when the response has no ResourceFrame', () => {
    expect(extractVehicleTypeIds('<PublicationDelivery/>')).toEqual([]);
  });
});
