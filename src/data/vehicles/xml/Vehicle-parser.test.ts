import { describe, it, expect } from 'vitest';
import { parseVehicleXml } from './Vehicle-parser';
import { vehicleToXmlShape } from '../types/Vehicle-mapping';
import { buildPublicationDeliveryXml } from '../../netex/publicationDeliveryXml';
import type { TextType } from '../types/Vehicle';

const SEED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <PublicationTimestamp>2026-04-17T10:00:00.000Z</PublicationTimestamp>
  <ParticipantRef>TST</ParticipantRef>
  <dataObjects>
    <ResourceFrame id="AKT:ResourceFrame:export-seed" version="1">
      <FrameDefaults>
        <DefaultLocale>
          <TimeZone>Europe/Oslo</TimeZone>
        </DefaultLocale>
      </FrameDefaults>
      <vehicles>
        <Vehicle id="AKT:Vehicle:export-seed" version="1">
          <ValidBetween>
            <FromDate>2026-04-17T00:00:00</FromDate>
          </ValidBetween>
          <Name lang="nb">ExportSeed Vehicle</Name>
          <RegistrationNumber>EXP-0001</RegistrationNumber>
          <TransportTypeRef ref="AKT:VehicleType:export-seed"/>
        </Vehicle>
      </vehicles>
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
          <vehicles>
            <Vehicle id="AKT:Vehicle:cf-1" version="2">
              <Name lang="nb">CF Vehicle</Name>
              <RegistrationNumber>CF-0001</RegistrationNumber>
            </Vehicle>
          </vehicles>
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
      <vehicles>
        <Vehicle id="X:V:1" version="1">
          <Name lang="nb">Bokmål navn</Name>
          <Name lang="en">English name</Name>
          <RegistrationNumber>MN-0001</RegistrationNumber>
        </Vehicle>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

const BARE_NAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <dataObjects>
    <ResourceFrame id="X:RF:1" version="1">
      <vehicles>
        <Vehicle id="X:V:1" version="1">
          <Name>Bare Name</Name>
          <RegistrationNumber>BN-0001</RegistrationNumber>
        </Vehicle>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

const SOBEK_NAME_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <dataObjects>
    <ResourceFrame id="X:RF:1" version="1">
      <vehicles>
        <Vehicle id="X:V:1" version="1">
          <Name>
            <Text>Sobek Wrapped Name</Text>
          </Name>
          <RegistrationNumber>SW-0001</RegistrationNumber>
        </Vehicle>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

describe('parseVehicleXml', () => {
  it('maps the seed fixture into the Vehicle domain shape', () => {
    const v = parseVehicleXml(SEED_XML);
    expect(v).not.toBeNull();
    expect(v!.$id).toBe('AKT:Vehicle:export-seed');
    expect(v!.$version).toBe('1');
    expect(v!.RegistrationNumber).toBe('EXP-0001');
    expect(v!.Name?.[0]?.value).toBe('ExportSeed Vehicle');
    expect(v!.Name?.[0]?.$lang).toBe('nb');
    expect(v!.TransportTypeRef).toBe('AKT:VehicleType:export-seed');
    expect(v!.ValidBetween?.[0]?.FromDate).toBe('2026-04-17T00:00:00');
  });

  it('drills through CompositeFrame > frames > ResourceFrame', () => {
    const v = parseVehicleXml(COMPOSITE_FRAME_XML);
    expect(v?.$id).toBe('AKT:Vehicle:cf-1');
    expect(v?.$version).toBe('2');
    expect(v?.Name?.[0]?.value).toBe('CF Vehicle');
  });

  it('returns null on empty ResourceFrame (unknown id)', () => {
    expect(parseVehicleXml(EMPTY_RF_XML)).toBeNull();
  });

  it('forces single-Name into a singleton array and keeps multi-Name as array', () => {
    const v = parseVehicleXml(MULTI_NAME_XML);
    expect(v?.Name).toHaveLength(2);
    expect(v?.Name?.map((n: TextType) => n.value)).toEqual(['Bokmål navn', 'English name']);
    expect(v?.Name?.map((n: TextType) => n.$lang)).toEqual(['nb', 'en']);

    const single = parseVehicleXml(SEED_XML);
    expect(Array.isArray(single?.Name)).toBe(true);
    expect(single?.Name).toHaveLength(1);
  });

  it('parses a bare <Name> with no lang attribute (#80 — projectText dropped primitive text nodes)', () => {
    const v = parseVehicleXml(BARE_NAME_XML);
    expect(v?.Name?.[0]?.value).toBe('Bare Name');
  });

  it("parses Sobek's <Name><Text>…</Text></Name> export shape (#80 — the real single-vehicle GET shape)", () => {
    const v = parseVehicleXml(SOBEK_NAME_XML);
    expect(v?.Name?.[0]?.value).toBe('Sobek Wrapped Name');
  });

  it('round-trips a Name carrying no lang — hathor serializes attribute-less <Name>', () => {
    const input = {
      $id: 'X:V:1',
      $version: '1',
      Name: [{ value: 'No Lang Name' }],
      RegistrationNumber: 'NL-0001',
    };
    const xml = buildPublicationDeliveryXml({
      vehicles: [vehicleToXmlShape(input as Record<string, unknown>)],
    });
    expect(parseVehicleXml(xml)?.Name?.[0]?.value).toBe('No Lang Name');
  });

  it('round-trips Refs with domain→xml aliases (M1: TransportOrganisationRef ↔ <AuthorityRef>, VehicleModelProfileRef ↔ <CarModelProfileRef>)', () => {
    // Vehicle-mapping.ts:36,41 emits domain keys under XML aliases:
    //   TransportOrganisationRef  → <AuthorityRef ref="…"/>
    //   VehicleModelProfileRef    → <CarModelProfileRef ref="…"/>
    // parseVehicleXml must translate the XML aliases back, otherwise the
    // round-trip drops the domain key names.
    const input = {
      $id: 'AKT:Vehicle:alias-1',
      $version: '1',
      Name: [{ value: 'Alias Vehicle', $lang: 'nb' }],
      RegistrationNumber: 'ALI-0001',
      TransportOrganisationRef: 'NMR:Authority:42',
      VehicleModelProfileRef: 'NMR:VehicleModelProfile:7',
    };
    const xml = buildPublicationDeliveryXml({
      vehicles: [vehicleToXmlShape(input as Record<string, unknown>)],
    });
    const parsed = parseVehicleXml(xml);
    expect(parsed?.TransportOrganisationRef).toBe('NMR:Authority:42');
    expect(parsed?.VehicleModelProfileRef).toBe('NMR:VehicleModelProfile:7');
  });

  it('round-trips: parse → vehicleToXmlShape → buildPublicationDeliveryXml → parse matches', () => {
    const first = parseVehicleXml(SEED_XML);
    expect(first).not.toBeNull();
    const xml = buildPublicationDeliveryXml({
      vehicles: [vehicleToXmlShape(first as Record<string, unknown>)],
    });
    const second = parseVehicleXml(xml);
    expect(second?.$id).toBe(first!.$id);
    expect(second?.$version).toBe(first!.$version);
    expect(second?.RegistrationNumber).toBe(first!.RegistrationNumber);
    expect(second?.Name?.[0]?.value).toBe(first!.Name?.[0]?.value);
    expect(second?.Name?.[0]?.$lang).toBe(first!.Name?.[0]?.$lang);
    expect(second?.TransportTypeRef).toBe(first!.TransportTypeRef);
    expect(second?.ValidBetween?.[0]?.FromDate).toBe(first!.ValidBetween?.[0]?.FromDate);
  });
});
