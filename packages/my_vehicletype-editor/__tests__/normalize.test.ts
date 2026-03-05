import { describe, it, expect } from 'vitest';
import { normalize } from '../src/normalize.js';

describe('normalize', () => {
  // ── String fields pass through PascalCase ──

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

  it('passes through Facilities', () => {
    const result = normalize({ Facilities: 'hello' });
    expect(result.Facilities).toBe('hello');
  });

  it('passes through CanCarry', () => {
    const result = normalize({ CanCarry: 'hello' });
    expect(result.CanCarry).toBe('hello');
  });

  it('passes through SatisfiesFacilityRequirements', () => {
    const result = normalize({ SatisfiesFacilityRequirements: 'hello' });
    expect(result.SatisfiesFacilityRequirements).toBe('hello');
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
    const result = normalize({ Name: [{ Value: 'test' }] });
    expect(result.Name).toHaveLength(1);
    expect(result.Name![0].Value).toBe('test');
  });

  it('wraps single Name object in array', () => {
    const result = normalize({ Name: { Value: 'solo' } });
    expect(result.Name).toHaveLength(1);
    expect(result.Name![0].Value).toBe('solo');
  });

  it('normalizes ShortName array', () => {
    const result = normalize({ ShortName: [{ Value: 'test' }] });
    expect(result.ShortName).toHaveLength(1);
    expect(result.ShortName![0].Value).toBe('test');
  });

  it('wraps single ShortName object in array', () => {
    const result = normalize({ ShortName: { Value: 'solo' } });
    expect(result.ShortName).toHaveLength(1);
    expect(result.ShortName![0].Value).toBe('solo');
  });

  it('normalizes Description array', () => {
    const result = normalize({ Description: [{ Value: 'test' }] });
    expect(result.Description).toHaveLength(1);
    expect(result.Description![0].Value).toBe('test');
  });

  it('wraps single Description object in array', () => {
    const result = normalize({ Description: { Value: 'solo' } });
    expect(result.Description).toHaveLength(1);
    expect(result.Description![0].Value).toBe('solo');
  });

  it('normalizes KeyList array', () => {
    const result = normalize({ KeyList: [{ Key: 'test' }] });
    expect(result.KeyList).toHaveLength(1);
    expect(result.KeyList![0].Key).toBe('test');
  });

  it('wraps single KeyList object in array', () => {
    const result = normalize({ KeyList: { Key: 'solo' } });
    expect(result.KeyList).toHaveLength(1);
    expect(result.KeyList![0].Key).toBe('solo');
  });

  it('normalizes PrivateCodes array', () => {
    const result = normalize({ PrivateCodes: [{ Value: 'test' }] });
    expect(result.PrivateCodes).toHaveLength(1);
    expect(result.PrivateCodes![0].Value).toBe('test');
  });

  it('wraps single PrivateCodes object in array', () => {
    const result = normalize({ PrivateCodes: { Value: 'solo' } });
    expect(result.PrivateCodes).toHaveLength(1);
    expect(result.PrivateCodes![0].Value).toBe('solo');
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
