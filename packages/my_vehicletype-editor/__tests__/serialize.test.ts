import { describe, it, expect } from 'vitest';
import { serialize } from '../src/serialize.js';
import { normalize } from '../src/normalize.js';
import { XMLParser } from 'fast-xml-parser';

describe('serialize', () => {
  it('serializes deckPlanRef as <DeckPlanRef>', () => {
    const xml = serialize({ deckPlanRef: 'test' });
    expect(xml).toContain('<DeckPlanRef>test</DeckPlanRef>');
  });

  it('serializes euroClass as <EuroClass>', () => {
    const xml = serialize({ euroClass: 'test' });
    expect(xml).toContain('<EuroClass>test</EuroClass>');
  });

  it('serializes id as <Id>', () => {
    const xml = serialize({ id: 'test' });
    expect(xml).toContain('<Id>test</Id>');
  });

  it('serializes includedIn as <IncludedIn>', () => {
    const xml = serialize({ includedIn: 'test' });
    expect(xml).toContain('<IncludedIn>test</IncludedIn>');
  });

  it('serializes classifiedAsRef as <ClassifiedAsRef>', () => {
    const xml = serialize({ classifiedAsRef: 'test' });
    expect(xml).toContain('<ClassifiedAsRef>test</ClassifiedAsRef>');
  });

  it('serializes facilities as <Facilities>', () => {
    const xml = serialize({ facilities: 'test' });
    expect(xml).toContain('<Facilities>test</Facilities>');
  });

  it('serializes canCarry as <CanCarry>', () => {
    const xml = serialize({ canCarry: 'test' });
    expect(xml).toContain('<CanCarry>test</CanCarry>');
  });

  it('serializes satisfiesFacilityRequirements as <SatisfiesFacilityRequirements>', () => {
    const xml = serialize({ satisfiesFacilityRequirements: 'test' });
    expect(xml).toContain('<SatisfiesFacilityRequirements>test</SatisfiesFacilityRequirements>');
  });

  it('serializes brandingRef as <BrandingRef>', () => {
    const xml = serialize({ brandingRef: 'test' });
    expect(xml).toContain('<BrandingRef>test</BrandingRef>');
  });

  it('serializes responsibilitySetRef as <ResponsibilitySetRef>', () => {
    const xml = serialize({ responsibilitySetRef: 'test' });
    expect(xml).toContain('<ResponsibilitySetRef>test</ResponsibilitySetRef>');
  });

  it('serializes boolean reversingDirection as string', () => {
    const xml = serialize({ reversingDirection: true });
    expect(xml).toContain('<ReversingDirection>true</ReversingDirection>');
  });

  it('serializes boolean selfPropelled as string', () => {
    const xml = serialize({ selfPropelled: true });
    expect(xml).toContain('<SelfPropelled>true</SelfPropelled>');
  });

  it('serializes boolean monitored as string', () => {
    const xml = serialize({ monitored: true });
    expect(xml).toContain('<Monitored>true</Monitored>');
  });

  it('serializes boolean lowFloor as string', () => {
    const xml = serialize({ lowFloor: true });
    expect(xml).toContain('<LowFloor>true</LowFloor>');
  });

  it('serializes boolean hasLiftOrRamp as string', () => {
    const xml = serialize({ hasLiftOrRamp: true });
    expect(xml).toContain('<HasLiftOrRamp>true</HasLiftOrRamp>');
  });

  it('serializes boolean hasHoist as string', () => {
    const xml = serialize({ hasHoist: true });
    expect(xml).toContain('<HasHoist>true</HasHoist>');
  });

  it('serializes name ref-array', () => {
    const xml = serialize({ name: [{ value: 'a' }] });
    expect(xml).toContain('<Name>');
  });

  it('serializes shortName ref-array', () => {
    const xml = serialize({ shortName: [{ value: 'a' }] });
    expect(xml).toContain('<ShortName>');
  });

  it('serializes description ref-array', () => {
    const xml = serialize({ description: [{ value: 'a' }] });
    expect(xml).toContain('<Description>');
  });

  it('serializes keyList ref-array', () => {
    const xml = serialize({ keyList: [{ value: 'a' }] });
    expect(xml).toContain('<KeyList>');
  });

  it('serializes privateCodes ref-array', () => {
    const xml = serialize({ privateCodes: [{ value: 'a' }] });
    expect(xml).toContain('<PrivateCodes>');
  });

  it('wraps output in <My_VehicleType>', () => {
    const xml = serialize({ id: 'test' });
    expect(xml).toContain('<My_VehicleType>');
    expect(xml).toContain('</My_VehicleType>');
  });

  it('roundtrips primitives through normalize', () => {
    const original = {
      deckPlanRef: 'roundtrip',
      euroClass: 'roundtrip',
      reversingDirection: true,
      selfPropelled: true,
      maximumRange: 42,
      maximumVelocity: 42,
      id: 'roundtrip',
      includedIn: 'roundtrip',
      classifiedAsRef: 'roundtrip',
      facilities: 'roundtrip',
      monitored: true,
      lowFloor: true,
      hasLiftOrRamp: true,
      hasHoist: true,
      hoistOperatingRadius: 42,
      boardingHeight: 42,
      gapToPlatform: 42,
      length: 42,
      width: 42,
      height: 42,
      weight: 42,
      firstAxleHeight: 42,
      canCarry: 'roundtrip',
      satisfiesFacilityRequirements: 'roundtrip',
      brandingRef: 'roundtrip',
      responsibilitySetRef: 'roundtrip',
    };
    const xml = serialize(original);
    const parser = new XMLParser();
    const parsed = parser.parse(xml);
    const restored = normalize(parsed.My_VehicleType);
    expect(restored).toMatchObject(original);
  });
});
