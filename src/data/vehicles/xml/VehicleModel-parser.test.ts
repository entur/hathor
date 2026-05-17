import { describe, it, expect } from 'vitest';
import { parseVehicleModelXml } from './VehicleModel-parser';
import { vehicleModelToXmlShape } from './VehicleModel-mapping';
import { buildPublicationDeliveryXml } from '../../netex/publicationDeliveryXml';
import type { TextType } from './VehicleModel';

const SEED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <PublicationTimestamp>2026-04-17T10:00:00.000Z</PublicationTimestamp>
  <dataObjects>
    <ResourceFrame id="AKT:ResourceFrame:export-seed" version="1">
      <vehicleModels>
        <VehicleModel id="AKT:VehicleModel:export-seed" version="1">
          <ValidBetween>
            <FromDate>2026-04-17T00:00:00</FromDate>
          </ValidBetween>
          <Name lang="nb">ExportSeed Model</Name>
          <Manufacturer lang="nb">Tesla</Manufacturer>
          <TransportTypeRef ref="AKT:VehicleType:export-seed"/>
          <Range>500</Range>
          <FullCharge>true</FullCharge>
        </VehicleModel>
      </vehicleModels>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

const COMPOSITE_FRAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <PublicationTimestamp>2026-04-17T10:00:00.000Z</PublicationTimestamp>
  <dataObjects>
    <CompositeFrame id="AKT:CompositeFrame:1" version="1">
      <frames>
        <ResourceFrame id="AKT:ResourceFrame:1" version="1">
          <vehicleModels>
            <VehicleModel id="AKT:VehicleModel:cf-1" version="2">
              <Name lang="nb">CF Model</Name>
              <Manufacturer lang="nb">Volvo</Manufacturer>
            </VehicleModel>
          </vehicleModels>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;

const EMPTY_RF_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <PublicationTimestamp>2026-04-17T10:00:00.000Z</PublicationTimestamp>
  <dataObjects>
    <ResourceFrame id="AKT:ResourceFrame:empty" version="1"/>
  </dataObjects>
</PublicationDelivery>`;

const MULTI_NAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <dataObjects>
    <ResourceFrame id="X:RF:1" version="1">
      <vehicleModels>
        <VehicleModel id="X:VM:1" version="1">
          <Name lang="nb">Bokmål navn</Name>
          <Name lang="en">English name</Name>
          <Manufacturer lang="nb">MAN</Manufacturer>
        </VehicleModel>
      </vehicleModels>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

describe('parseVehicleModelXml', () => {
  it('maps the seed fixture into the VehicleModel domain shape', () => {
    const m = parseVehicleModelXml(SEED_XML);
    expect(m).not.toBeNull();
    expect(m!.$id).toBe('AKT:VehicleModel:export-seed');
    expect(m!.$version).toBe('1');
    expect(m!.Name?.[0]?.value).toBe('ExportSeed Model');
    expect(m!.Name?.[0]?.$lang).toBe('nb');
    expect(m!.Manufacturer?.[0]?.value).toBe('Tesla');
    expect(m!.TransportTypeRef).toBe('AKT:VehicleType:export-seed');
    expect(m!.Range).toBe(500);
    expect(m!.ValidBetween?.[0]?.FromDate).toBe('2026-04-17T00:00:00');
  });

  it('drills through CompositeFrame > frames > ResourceFrame', () => {
    const m = parseVehicleModelXml(COMPOSITE_FRAME_XML);
    expect(m?.$id).toBe('AKT:VehicleModel:cf-1');
    expect(m?.$version).toBe('2');
    expect(m?.Name?.[0]?.value).toBe('CF Model');
    expect(m?.Manufacturer?.[0]?.value).toBe('Volvo');
  });

  it('returns null on empty ResourceFrame (unknown id)', () => {
    expect(parseVehicleModelXml(EMPTY_RF_XML)).toBeNull();
  });

  it('forces single-Name into a singleton array and keeps multi-Name as array', () => {
    const m = parseVehicleModelXml(MULTI_NAME_XML);
    expect(m?.Name).toHaveLength(2);
    expect(m?.Name?.map((n: TextType) => n.value)).toEqual(['Bokmål navn', 'English name']);

    const single = parseVehicleModelXml(SEED_XML);
    expect(Array.isArray(single?.Name)).toBe(true);
    expect(single?.Name).toHaveLength(1);
    expect(Array.isArray(single?.Manufacturer)).toBe(true);
    expect(single?.Manufacturer).toHaveLength(1);
  });

  it('round-trips the VehicleModelProfileRef ↔ <CarModelProfileRef> alias (M1)', () => {
    // VehicleModel-mapping.ts:34 emits VehicleModelProfileRef under XML alias
    // <CarModelProfileRef>. parseVehicleModelXml must translate it back.
    const input = {
      $id: 'AKT:VehicleModel:alias-1',
      $version: '1',
      Name: [{ value: 'Alias Model', $lang: 'nb' }],
      Manufacturer: [{ value: 'Tesla', $lang: 'nb' }],
      VehicleModelProfileRef: 'NMR:VehicleModelProfile:7',
    };
    const xml = buildPublicationDeliveryXml({
      vehicleModels: [vehicleModelToXmlShape(input as Record<string, unknown>)],
    });
    const parsed = parseVehicleModelXml(xml);
    expect(parsed?.VehicleModelProfileRef).toBe('NMR:VehicleModelProfile:7');
  });

  it('round-trips: parse → vehicleModelToXmlShape → buildPublicationDeliveryXml → parse matches', () => {
    const first = parseVehicleModelXml(SEED_XML);
    expect(first).not.toBeNull();
    const xml = buildPublicationDeliveryXml({
      vehicleModels: [vehicleModelToXmlShape(first as Record<string, unknown>)],
    });
    const second = parseVehicleModelXml(xml);
    expect(second?.$id).toBe(first!.$id);
    expect(second?.$version).toBe(first!.$version);
    expect(second?.Name?.[0]?.value).toBe(first!.Name?.[0]?.value);
    expect(second?.Manufacturer?.[0]?.value).toBe(first!.Manufacturer?.[0]?.value);
    expect(second?.TransportTypeRef).toBe(first!.TransportTypeRef);
    expect(second?.ValidBetween?.[0]?.FromDate).toBe(first!.ValidBetween?.[0]?.FromDate);
  });
});
