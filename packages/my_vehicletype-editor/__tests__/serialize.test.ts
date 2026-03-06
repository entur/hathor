import { describe, it, expect } from 'vitest';
import { serialize } from '../src/serialize.js';
import { normalize } from '../src/normalize.js';
import { XMLParser } from 'fast-xml-parser';

describe('serialize', () => {
  it('serializes DeckPlanRef as <DeckPlanRef>', () => {
    const xml = serialize({ DeckPlanRef: 'test' });
    expect(xml).toContain('<DeckPlanRef>test</DeckPlanRef>');
  });

  it('serializes EuroClass as <EuroClass>', () => {
    const xml = serialize({ EuroClass: 'test' });
    expect(xml).toContain('<EuroClass>test</EuroClass>');
  });

  it('serializes $id as XML attribute', () => {
    const xml = serialize({ $id: 'test' });
    expect(xml).toContain('id="test"');
    expect(xml).not.toContain('<Id>');
  });

  it('serializes IncludedIn as <IncludedIn>', () => {
    const xml = serialize({ IncludedIn: 'test' });
    expect(xml).toContain('<IncludedIn>test</IncludedIn>');
  });

  it('serializes ClassifiedAsRef as <ClassifiedAsRef>', () => {
    const xml = serialize({ ClassifiedAsRef: 'test' });
    expect(xml).toContain('<ClassifiedAsRef>test</ClassifiedAsRef>');
  });

  it('serializes Facilities as <Facilities>', () => {
    const xml = serialize({ Facilities: 'test' });
    expect(xml).toContain('<Facilities>test</Facilities>');
  });

  it('serializes CanCarry as <CanCarry>', () => {
    const xml = serialize({ CanCarry: 'test' });
    expect(xml).toContain('<CanCarry>test</CanCarry>');
  });

  it('serializes SatisfiesFacilityRequirements as <SatisfiesFacilityRequirements>', () => {
    const xml = serialize({ SatisfiesFacilityRequirements: 'test' });
    expect(xml).toContain('<SatisfiesFacilityRequirements>test</SatisfiesFacilityRequirements>');
  });

  it('serializes BrandingRef as <BrandingRef>', () => {
    const xml = serialize({ BrandingRef: 'test' });
    expect(xml).toContain('<BrandingRef>test</BrandingRef>');
  });

  it('serializes $responsibilitySetRef as XML attribute', () => {
    const xml = serialize({ $responsibilitySetRef: 'test' });
    expect(xml).toContain('responsibilitySetRef="test"');
    expect(xml).not.toContain('<ResponsibilitySetRef>');
  });

  it('serializes boolean ReversingDirection as string', () => {
    const xml = serialize({ ReversingDirection: true });
    expect(xml).toContain('<ReversingDirection>true</ReversingDirection>');
  });

  it('serializes boolean SelfPropelled as string', () => {
    const xml = serialize({ SelfPropelled: true });
    expect(xml).toContain('<SelfPropelled>true</SelfPropelled>');
  });

  it('serializes boolean Monitored as string', () => {
    const xml = serialize({ Monitored: true });
    expect(xml).toContain('<Monitored>true</Monitored>');
  });

  it('serializes boolean LowFloor as string', () => {
    const xml = serialize({ LowFloor: true });
    expect(xml).toContain('<LowFloor>true</LowFloor>');
  });

  it('serializes boolean HasLiftOrRamp as string', () => {
    const xml = serialize({ HasLiftOrRamp: true });
    expect(xml).toContain('<HasLiftOrRamp>true</HasLiftOrRamp>');
  });

  it('serializes boolean HasHoist as string', () => {
    const xml = serialize({ HasHoist: true });
    expect(xml).toContain('<HasHoist>true</HasHoist>');
  });

  it('serializes Name ref-array', () => {
    const xml = serialize({ Name: [{ Value: 'a' }] });
    expect(xml).toContain('<Name>');
  });

  it('serializes ShortName ref-array', () => {
    const xml = serialize({ ShortName: [{ Value: 'a' }] });
    expect(xml).toContain('<ShortName>');
  });

  it('serializes Description ref-array', () => {
    const xml = serialize({ Description: [{ Value: 'a' }] });
    expect(xml).toContain('<Description>');
  });

  it('serializes KeyList ref-array', () => {
    const xml = serialize({ KeyList: [{ Value: 'a' }] });
    expect(xml).toContain('<KeyList>');
  });

  it('serializes PrivateCodes ref-array', () => {
    const xml = serialize({ PrivateCodes: [{ Value: 'a' }] });
    expect(xml).toContain('<PrivateCodes>');
  });

  it('wraps output in <VehicleType>', () => {
    const xml = serialize({ $id: 'test' });
    expect(xml).toContain('<VehicleType');
    expect(xml).toContain('</VehicleType>');
  });

  it('roundtrips primitives through normalize', () => {
    const original = {
      DeckPlanRef: 'roundtrip',
      EuroClass: 'roundtrip',
      ReversingDirection: true,
      SelfPropelled: true,
      MaximumRange: 42,
      MaximumVelocity: 42,
      $id: 'roundtrip',
      IncludedIn: 'roundtrip',
      ClassifiedAsRef: 'roundtrip',
      Facilities: 'roundtrip',
      Monitored: true,
      LowFloor: true,
      HasLiftOrRamp: true,
      HasHoist: true,
      HoistOperatingRadius: 42,
      BoardingHeight: 42,
      GapToPlatform: 42,
      Length: 42,
      Width: 42,
      Height: 42,
      Weight: 42,
      FirstAxleHeight: 42,
      CanCarry: 'roundtrip',
      SatisfiesFacilityRequirements: 'roundtrip',
      BrandingRef: 'roundtrip',
      $responsibilitySetRef: 'roundtrip',
    };
    const xml = serialize(original);
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);
    const restored = normalize(parsed.VehicleType);
    expect(restored).toMatchObject(original);
  });
});
