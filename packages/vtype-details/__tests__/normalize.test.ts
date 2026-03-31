import { describe, it, expect } from 'vitest';
import { normalizeXML as normalize, normalizeGraphQL } from '../src/normalize.js';

describe('normalize', () => {
  // ── String fields pass through ──

  it('passes through DeckPlanRef', () => {
    const result = normalize({ DeckPlanRef: 'hello' });
    expect(result.DeckPlanRef).toBe('hello');
  });

  it('passes through EuroClass', () => {
    const result = normalize({ EuroClass: 'hello' });
    expect(result.EuroClass).toBe('hello');
  });

  it('passes through IncludedIn', () => {
    const result = normalize({ IncludedIn: 'hello' });
    expect(result.IncludedIn).toBe('hello');
  });

  it('passes through ClassifiedAsRef', () => {
    const result = normalize({ ClassifiedAsRef: 'hello' });
    expect(result.ClassifiedAsRef).toBe('hello');
  });

  it('passes through facilities', () => {
    const result = normalize({ facilities: 'hello' });
    expect(result.facilities).toBe('hello');
  });

  it('passes through canCarry', () => {
    const result = normalize({ canCarry: 'hello' });
    expect(result.canCarry).toBe('hello');
  });

  it('passes through satisfiesFacilityRequirements', () => {
    const result = normalize({ satisfiesFacilityRequirements: 'hello' });
    expect(result.satisfiesFacilityRequirements).toBe('hello');
  });

  it('passes through BrandingRef', () => {
    const result = normalize({ BrandingRef: 'hello' });
    expect(result.BrandingRef).toBe('hello');
  });

  // ── Boolean coercion ──

  it('coerces string "true" to boolean for ReversingDirection', () => {
    const result = normalize({ ReversingDirection: 'true' });
    expect(result.ReversingDirection).toBe(true);
  });

  it('coerces string "false" to boolean for ReversingDirection', () => {
    const result = normalize({ ReversingDirection: 'false' });
    expect(result.ReversingDirection).toBe(false);
  });

  it('passes through boolean ReversingDirection', () => {
    const result = normalize({ ReversingDirection: true });
    expect(result.ReversingDirection).toBe(true);
  });

  it('coerces string "true" to boolean for SelfPropelled', () => {
    const result = normalize({ SelfPropelled: 'true' });
    expect(result.SelfPropelled).toBe(true);
  });

  it('coerces string "false" to boolean for SelfPropelled', () => {
    const result = normalize({ SelfPropelled: 'false' });
    expect(result.SelfPropelled).toBe(false);
  });

  it('passes through boolean SelfPropelled', () => {
    const result = normalize({ SelfPropelled: true });
    expect(result.SelfPropelled).toBe(true);
  });

  it('coerces string "true" to boolean for Monitored', () => {
    const result = normalize({ Monitored: 'true' });
    expect(result.Monitored).toBe(true);
  });

  it('coerces string "false" to boolean for Monitored', () => {
    const result = normalize({ Monitored: 'false' });
    expect(result.Monitored).toBe(false);
  });

  it('passes through boolean Monitored', () => {
    const result = normalize({ Monitored: true });
    expect(result.Monitored).toBe(true);
  });

  it('coerces string "true" to boolean for LowFloor', () => {
    const result = normalize({ LowFloor: 'true' });
    expect(result.LowFloor).toBe(true);
  });

  it('coerces string "false" to boolean for LowFloor', () => {
    const result = normalize({ LowFloor: 'false' });
    expect(result.LowFloor).toBe(false);
  });

  it('passes through boolean LowFloor', () => {
    const result = normalize({ LowFloor: true });
    expect(result.LowFloor).toBe(true);
  });

  it('coerces string "true" to boolean for HasLiftOrRamp', () => {
    const result = normalize({ HasLiftOrRamp: 'true' });
    expect(result.HasLiftOrRamp).toBe(true);
  });

  it('coerces string "false" to boolean for HasLiftOrRamp', () => {
    const result = normalize({ HasLiftOrRamp: 'false' });
    expect(result.HasLiftOrRamp).toBe(false);
  });

  it('passes through boolean HasLiftOrRamp', () => {
    const result = normalize({ HasLiftOrRamp: true });
    expect(result.HasLiftOrRamp).toBe(true);
  });

  it('coerces string "true" to boolean for HasHoist', () => {
    const result = normalize({ HasHoist: 'true' });
    expect(result.HasHoist).toBe(true);
  });

  it('coerces string "false" to boolean for HasHoist', () => {
    const result = normalize({ HasHoist: 'false' });
    expect(result.HasHoist).toBe(false);
  });

  it('passes through boolean HasHoist', () => {
    const result = normalize({ HasHoist: true });
    expect(result.HasHoist).toBe(true);
  });

  // ── Enum coercion ──

  it('normalizes valid union value for TransportMode', () => {
    const result = normalize({ TransportMode: 'all' });
    expect(result.TransportMode).toBe('all');
  });

  it('rejects invalid union value for TransportMode', () => {
    const result = normalize({ TransportMode: 'invalid_value_xyz' });
    expect(result.TransportMode).toBeUndefined();
  });

  it('normalizes valid union value for PropulsionType', () => {
    const result = normalize({ PropulsionType: 'other' });
    expect(result.PropulsionType).toBe('other');
  });

  it('rejects invalid union value for PropulsionType', () => {
    const result = normalize({ PropulsionType: 'invalid_value_xyz' });
    expect(result.PropulsionType).toBeUndefined();
  });

  // ── Array fields ──

  it('normalizes Name array', () => {
    const result = normalize({ Name: [{ value: 'test' }] });
    expect(result.Name).toHaveLength(1);
  });

  it('wraps single Name object in array', () => {
    const result = normalize({ Name: { value: 'solo' } });
    expect(result.Name).toHaveLength(1);
  });

  it('normalizes ShortName array', () => {
    const result = normalize({ ShortName: [{ value: 'test' }] });
    expect(result.ShortName).toHaveLength(1);
  });

  it('wraps single ShortName object in array', () => {
    const result = normalize({ ShortName: { value: 'solo' } });
    expect(result.ShortName).toHaveLength(1);
  });

  it('normalizes Description array', () => {
    const result = normalize({ Description: [{ value: 'test' }] });
    expect(result.Description).toHaveLength(1);
  });

  it('wraps single Description object in array', () => {
    const result = normalize({ Description: { value: 'solo' } });
    expect(result.Description).toHaveLength(1);
  });

  it('normalizes keyList array', () => {
    const result = normalize({ keyList: [{ Key: 'test' }] });
    expect(result.keyList).toHaveLength(1);
    expect(result.keyList![0].Key).toBe('test');
  });

  it('wraps single keyList object in array', () => {
    const result = normalize({ keyList: { Key: 'solo' } });
    expect(result.keyList).toHaveLength(1);
    expect(result.keyList![0].Key).toBe('solo');
  });

  it('normalizes privateCodes array', () => {
    const result = normalize({ privateCodes: [{ value: 'test' }] });
    expect(result.privateCodes).toHaveLength(1);
  });

  it('wraps single privateCodes object in array', () => {
    const result = normalize({ privateCodes: { value: 'solo' } });
    expect(result.privateCodes).toHaveLength(1);
  });

  it('returns empty object for empty input', () => {
    const result = normalize({});
    expect(result).toEqual({});
  });

  // ── @_-prefixed attribute fields (fast-xml-parser output) ──

  it('maps @_id → $id (XML attribute prefix)', () => {
    const result = normalize({ '@_id': 'attr-value' });
    expect(result.$id).toBe('attr-value');
  });

  it('maps @_responsibilitySetRef → $responsibilitySetRef (XML attribute prefix)', () => {
    const result = normalize({ '@_responsibilitySetRef': 'attr-value' });
    expect(result.$responsibilitySetRef).toBe('attr-value');
  });
});

describe('normalizeGraphQL', () => {
  it('maps id → $id', () => {
    const r = normalizeGraphQL({ id: 'NMR:VehicleType:1' });
    expect(r.$id).toBe('NMR:VehicleType:1');
  });

  it('maps name.value → Name array', () => {
    const r = normalizeGraphQL({ name: { value: 'Flirt' } });
    expect(r.Name).toEqual([{ value: 'Flirt' }]);
  });

  it('maps dimensions', () => {
    const r = normalizeGraphQL({ length: 75, width: 3.2, height: 4.1 });
    expect(r.Length).toBe(75);
    expect(r.Width).toBe(3.2);
    expect(r.Height).toBe(4.1);
  });

  it('maps deckPlan.id → DeckPlanRef', () => {
    const r = normalizeGraphQL({ deckPlan: { id: 'NMR:DeckPlan:1' } });
    expect(r.DeckPlanRef).toBe('NMR:DeckPlan:1');
  });

  it('maps transportMode → TransportMode', () => {
    const r = normalizeGraphQL({ transportMode: 'rail' });
    expect(r.TransportMode).toBe('rail');
  });

  it('rejects invalid transportMode', () => {
    const r = normalizeGraphQL({ transportMode: 'spaceship' });
    expect(r.TransportMode).toBeUndefined();
  });

  it('maps boolean fields', () => {
    const r = normalizeGraphQL({ lowFloor: true, selfPropelled: false });
    expect(r.LowFloor).toBe(true);
    expect(r.SelfPropelled).toBe(false);
  });

  it('skips null/undefined fields', () => {
    const r = normalizeGraphQL({ id: 'X', length: null, name: undefined });
    expect(r.$id).toBe('X');
    expect(r.Length).toBeUndefined();
    expect(r.Name).toBeUndefined();
  });

  it('returns empty for empty input', () => {
    expect(normalizeGraphQL({})).toEqual({});
  });
});
