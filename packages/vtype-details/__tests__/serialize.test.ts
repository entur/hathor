import { describe, it, expect } from 'vitest';
import { serialize } from '../src/serialize.js';

describe('serialize', () => {
  it('renders DeckPlanRef with @_ref', () => {
    const xml = serialize({ DeckPlanRef: 'test' });
    expect(xml).toContain('ref="test"');
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

  it('serializes $version as XML attribute', () => {
    const xml = serialize({ $version: '1' });
    expect(xml).toContain('version="1"');
  });

  it('renders IncludedIn with @_ref', () => {
    const xml = serialize({ IncludedIn: 'test' });
    expect(xml).toContain('<IncludedIn');
    expect(xml).toContain('ref="test"');
  });

  it('renders ClassifiedAsRef with @_ref', () => {
    const xml = serialize({ ClassifiedAsRef: 'test' });
    expect(xml).toContain('<ClassifiedAsRef');
    expect(xml).toContain('ref="test"');
  });

  it('renders BrandingRef with @_ref', () => {
    const xml = serialize({ BrandingRef: 'test' });
    expect(xml).toContain('<BrandingRef');
    expect(xml).toContain('ref="test"');
  });

  it('does not serialize facilities (not valid as plain text in XSD)', () => {
    const xml = serialize({ facilities: 'test' });
    expect(xml).not.toContain('<facilities>');
  });

  it('does not serialize canCarry (not valid as plain text in XSD)', () => {
    const xml = serialize({ canCarry: 'test' });
    expect(xml).not.toContain('<canCarry>');
  });

  it('does not serialize satisfiesFacilityRequirements (not valid as plain text in XSD)', () => {
    const xml = serialize({ satisfiesFacilityRequirements: 'test' });
    expect(xml).not.toContain('<satisfiesFacilityRequirements>');
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

  it('serializes Name as TextType with lang attr', () => {
    const xml = serialize({ Name: [{ value: 'a', $lang: 'nb' }] });
    expect(xml).toContain('<Name');
    expect(xml).toContain('lang="nb"');
    expect(xml).toContain('a');
  });

  it('serializes ShortName as TextType', () => {
    const xml = serialize({ ShortName: [{ value: 'a' }] });
    expect(xml).toContain('<ShortName>');
  });

  it('serializes Description as TextType', () => {
    const xml = serialize({ Description: [{ value: 'a' }] });
    expect(xml).toContain('<Description>');
  });

  it('wraps keyList items in <keyList><KeyValue>', () => {
    const xml = serialize({ keyList: [{ Key: 'k', Value: 'v' }] });
    expect(xml).toContain('<keyList>');
    expect(xml).toContain('<KeyValue>');
    expect(xml).toContain('<Key>k</Key>');
  });

  it('wraps privateCodes items in <privateCodes><PrivateCode>', () => {
    const xml = serialize({ privateCodes: [{ value: 'pc1', $type: 't' }] });
    expect(xml).toContain('<privateCodes>');
    expect(xml).toContain('<PrivateCode');
    expect(xml).toContain('pc1');
  });

  it('wraps output in <VehicleType>', () => {
    const xml = serialize({ $id: 'test' });
    expect(xml).toContain('<VehicleType');
    expect(xml).toContain('</VehicleType>');
  });

  it('wraps canManoeuvre in <VehicleManoeuvringRequirement>', () => {
    const xml = serialize({ canManoeuvre: { Reversible: true } });
    expect(xml).toContain('<canManoeuvre>');
    expect(xml).toContain('<VehicleManoeuvringRequirement>');
    expect(xml).toContain('<Reversible>true</Reversible>');
  });
});
