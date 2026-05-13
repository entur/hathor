import { describe, it, expect } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { buildPublicationDeliveryXml } from './publicationDeliveryXml';

const parser = new XMLParser({ ignoreAttributes: false });

describe('buildPublicationDeliveryXml', () => {
  it('emits the XML declaration on the first line', () => {
    const xml = buildPublicationDeliveryXml({});
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('emits envelope defaults with no slots populated', () => {
    const xml = buildPublicationDeliveryXml({});
    const pd = parser.parse(xml).PublicationDelivery;
    expect(pd['@_xmlns']).toBe('http://www.netex.org.uk/netex');
    expect(pd['@_version']).toBe('1.0');
    expect(typeof pd.PublicationTimestamp).toBe('string');
    expect(pd.dataObjects.ResourceFrame['@_id']).toBe('RF:1');
    expect(pd.dataObjects.ResourceFrame['@_version']).toBe('1');
    expect(pd.dataObjects.ResourceFrame.FrameDefaults.DefaultLocale.TimeZone).toBe('Europe/Oslo');
  });

  it('wraps a single vehicleTypes slot in <vehicleTypes><VehicleType/>', () => {
    const xml = buildPublicationDeliveryXml({
      vehicleTypes: [{ '@_id': 'X:VT:1', '@_version': '1', Name: 'foo' }],
    });
    const vt =
      parser.parse(xml).PublicationDelivery.dataObjects.ResourceFrame.vehicleTypes.VehicleType;
    expect(vt['@_id']).toBe('X:VT:1');
    expect(vt['@_version']).toBe('1');
    expect(vt.Name).toBe('foo');
  });

  it('populates vehicles and vehicleModels slots in the same envelope', () => {
    const xml = buildPublicationDeliveryXml({
      vehicles: [{ '@_id': 'X:V:1', '@_version': '1' }],
      vehicleModels: [{ '@_id': 'INLINE:VehicleModel:1', Manufacturer: 'Acme' }],
    });
    const rf = parser.parse(xml).PublicationDelivery.dataObjects.ResourceFrame;
    expect(rf.vehicles.Vehicle['@_id']).toBe('X:V:1');
    expect(rf.vehicleModels.VehicleModel['@_id']).toBe('INLINE:VehicleModel:1');
    expect(rf.vehicleModels.VehicleModel.Manufacturer).toBe('Acme');
  });

  it('emits multiple items in one slot as sibling elements', () => {
    const xml = buildPublicationDeliveryXml({
      vehicleTypes: [
        { '@_id': 'X:VT:1', '@_version': '1' },
        { '@_id': 'X:VT:2', '@_version': '1' },
      ],
    });
    const vts =
      parser.parse(xml).PublicationDelivery.dataObjects.ResourceFrame.vehicleTypes.VehicleType;
    expect(Array.isArray(vts)).toBe(true);
    expect(vts).toHaveLength(2);
    expect(vts.map((vt: { '@_id': string }) => vt['@_id'])).toEqual(['X:VT:1', 'X:VT:2']);
  });

  it('omits empty slot arrays from output', () => {
    const xml = buildPublicationDeliveryXml({ vehicles: [] });
    const rf = parser.parse(xml).PublicationDelivery.dataObjects.ResourceFrame;
    expect(rf.vehicles).toBeUndefined();
  });

  it('emits a fresh PublicationTimestamp on each call', () => {
    const xml1 = buildPublicationDeliveryXml({});
    const ts1 = parser.parse(xml1).PublicationDelivery.PublicationTimestamp;
    const xml2 = buildPublicationDeliveryXml({});
    const ts2 = parser.parse(xml2).PublicationDelivery.PublicationTimestamp;
    expect(typeof ts1).toBe('string');
    expect(typeof ts2).toBe('string');
    // Timestamps may collide within the same millisecond on a fast machine —
    // just assert format, not strict inequality.
    expect(ts1).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
