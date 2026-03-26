import { describe, it, expect } from 'vitest';
import { serialize } from '../src/serialize.js';
import { FULL_MOCK } from './fixtures/vehicletype-mock.js';

const xml = serialize(FULL_MOCK);

describe('VehicleType XML shape', () => {
  // ── root element + versioned attrs ──
  it('wraps in <VehicleType> with id and version', () => {
    expect(xml).toContain('<VehicleType');
    expect(xml).toContain('id="ENT:VehicleType:74"');
    expect(xml).toContain('version="1"');
  });

  // ── attrs renamed from $ to @_ ──
  it('renders $responsibilitySetRef as XML attribute', () => {
    expect(xml).toContain('responsibilitySetRef="ENT:ResponsibilitySet:1"');
  });

  // ── keyList wrapper ──
  it('wraps keyList items in <keyList><KeyValue>', () => {
    expect(xml).toContain('<keyList>');
    expect(xml).toContain('<KeyValue>');
    expect(xml).toContain('<Key>FormDragCoeff</Key>');
    expect(xml).toContain('<Value>0.35</Value>');
  });

  // ── privateCodes wrapper ──
  it('wraps privateCodes items in <privateCodes><PrivateCode>', () => {
    expect(xml).toContain('<privateCodes>');
    expect(xml).toMatch(/<PrivateCode[^>]*>NSB-74<\/PrivateCode>/);
  });

  // ── ref attrs ──
  it('renders BrandingRef with @_ref', () => {
    expect(xml).toContain('<BrandingRef');
    expect(xml).toContain('ref="ENT:Branding:VY"');
  });

  it('renders DeckPlanRef with @_ref', () => {
    expect(xml).toContain('ref="ENT:DeckPlan:1"');
  });

  it('renders IncludedIn with @_ref', () => {
    expect(xml).toContain('<IncludedIn');
    expect(xml).toContain('ref="ENT:VehicleType:100"');
  });

  // ── TextType simpleContent ──
  it('renders Name with lang attr and text content', () => {
    expect(xml).toContain('<Name');
    expect(xml).toContain('lang="nb"');
    expect(xml).toContain('Stadler FLIRT');
  });

  // ── PrivateCode simpleContent ──
  it('renders PrivateCode with type attr and text content', () => {
    expect(xml).toMatch(/<PrivateCode[^>]*type="internal"[^>]*>FL74<\/PrivateCode>/);
  });

  // ── booleans stringified ──
  it('stringifies booleans', () => {
    expect(xml).toContain('<ReversingDirection>true</ReversingDirection>');
    expect(xml).toContain('<HasHoist>false</HasHoist>');
  });

  // ── numbers ──
  it('renders numeric fields', () => {
    expect(xml).toContain('<MaximumRange>800</MaximumRange>');
    expect(xml).toContain('<Length>74.3</Length>');
  });

  // ── PassengerCapacity with id/version ──
  it('renders PassengerCapacity with id and version', () => {
    expect(xml).toContain('<PassengerCapacity');
    expect(xml).toContain('id="ENT:PassengerCapacity:74"');
    expect(xml).toContain('<TotalCapacity>300</TotalCapacity>');
  });

  // ── canManoeuvre wrapper element ──
  it('wraps canManoeuvre in <VehicleManoeuvringRequirement>', () => {
    expect(xml).toContain('<canManoeuvre>');
    expect(xml).toContain('<VehicleManoeuvringRequirement');
    expect(xml).toContain('id="ENT:VehicleManoeuvringRequirement:74"');
    expect(xml).toContain('<Reversible>true</Reversible>');
  });

  // ── dropped fields (can't produce valid XML as strings) ──
  it('does not serialize facilities/canCarry/satisfiesFacilityRequirements', () => {
    const withStubs = serialize({
      ...FULL_MOCK,
      facilities: 'x',
      canCarry: 'x',
      satisfiesFacilityRequirements: 'x',
    });
    expect(withStubs).not.toContain('<facilities>');
    expect(withStubs).not.toContain('<canCarry>');
    expect(withStubs).not.toContain('<satisfiesFacilityRequirements>');
  });
});
