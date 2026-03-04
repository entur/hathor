import { describe, it, expect } from 'vitest';
import { normalize } from '../src/normalize.js';

describe('normalize', () => {
  it('maps PascalCase DeckPlanRef → deckPlanRef', () => {
    const result = normalize({ DeckPlanRef: 'hello' });
    expect(result.deckPlanRef).toBe('hello');
  });

  it('maps PascalCase EuroClass → euroClass', () => {
    const result = normalize({ EuroClass: 'hello' });
    expect(result.euroClass).toBe('hello');
  });

  it('maps PascalCase Id → id', () => {
    const result = normalize({ Id: 'hello' });
    expect(result.id).toBe('hello');
  });

  it('maps PascalCase IncludedIn → includedIn', () => {
    const result = normalize({ IncludedIn: 'hello' });
    expect(result.includedIn).toBe('hello');
  });

  it('maps PascalCase ClassifiedAsRef → classifiedAsRef', () => {
    const result = normalize({ ClassifiedAsRef: 'hello' });
    expect(result.classifiedAsRef).toBe('hello');
  });

  it('maps PascalCase Facilities → facilities', () => {
    const result = normalize({ Facilities: 'hello' });
    expect(result.facilities).toBe('hello');
  });

  it('maps PascalCase CanCarry → canCarry', () => {
    const result = normalize({ CanCarry: 'hello' });
    expect(result.canCarry).toBe('hello');
  });

  it('maps PascalCase SatisfiesFacilityRequirements → satisfiesFacilityRequirements', () => {
    const result = normalize({ SatisfiesFacilityRequirements: 'hello' });
    expect(result.satisfiesFacilityRequirements).toBe('hello');
  });

  it('maps PascalCase BrandingRef → brandingRef', () => {
    const result = normalize({ BrandingRef: 'hello' });
    expect(result.brandingRef).toBe('hello');
  });

  it('maps PascalCase ResponsibilitySetRef → responsibilitySetRef', () => {
    const result = normalize({ ResponsibilitySetRef: 'hello' });
    expect(result.responsibilitySetRef).toBe('hello');
  });

  it('passes through camelCase deckPlanRef', () => {
    const result = normalize({ deckPlanRef: 'world' });
    expect(result.deckPlanRef).toBe('world');
  });

  it('passes through camelCase euroClass', () => {
    const result = normalize({ euroClass: 'world' });
    expect(result.euroClass).toBe('world');
  });

  it('passes through camelCase id', () => {
    const result = normalize({ id: 'world' });
    expect(result.id).toBe('world');
  });

  it('passes through camelCase includedIn', () => {
    const result = normalize({ includedIn: 'world' });
    expect(result.includedIn).toBe('world');
  });

  it('passes through camelCase classifiedAsRef', () => {
    const result = normalize({ classifiedAsRef: 'world' });
    expect(result.classifiedAsRef).toBe('world');
  });

  it('passes through camelCase facilities', () => {
    const result = normalize({ facilities: 'world' });
    expect(result.facilities).toBe('world');
  });

  it('passes through camelCase canCarry', () => {
    const result = normalize({ canCarry: 'world' });
    expect(result.canCarry).toBe('world');
  });

  it('passes through camelCase satisfiesFacilityRequirements', () => {
    const result = normalize({ satisfiesFacilityRequirements: 'world' });
    expect(result.satisfiesFacilityRequirements).toBe('world');
  });

  it('passes through camelCase brandingRef', () => {
    const result = normalize({ brandingRef: 'world' });
    expect(result.brandingRef).toBe('world');
  });

  it('passes through camelCase responsibilitySetRef', () => {
    const result = normalize({ responsibilitySetRef: 'world' });
    expect(result.responsibilitySetRef).toBe('world');
  });

  it('coerces string "true" to boolean for reversingDirection', () => {
    const result = normalize({ ReversingDirection: 'true' });
    expect(result.reversingDirection).toBe(true);
  });

  it('coerces string "false" to boolean for reversingDirection', () => {
    const result = normalize({ ReversingDirection: 'false' });
    expect(result.reversingDirection).toBe(false);
  });

  it('passes through boolean reversingDirection', () => {
    const result = normalize({ reversingDirection: true });
    expect(result.reversingDirection).toBe(true);
  });

  it('coerces string "true" to boolean for selfPropelled', () => {
    const result = normalize({ SelfPropelled: 'true' });
    expect(result.selfPropelled).toBe(true);
  });

  it('coerces string "false" to boolean for selfPropelled', () => {
    const result = normalize({ SelfPropelled: 'false' });
    expect(result.selfPropelled).toBe(false);
  });

  it('passes through boolean selfPropelled', () => {
    const result = normalize({ selfPropelled: true });
    expect(result.selfPropelled).toBe(true);
  });

  it('coerces string "true" to boolean for monitored', () => {
    const result = normalize({ Monitored: 'true' });
    expect(result.monitored).toBe(true);
  });

  it('coerces string "false" to boolean for monitored', () => {
    const result = normalize({ Monitored: 'false' });
    expect(result.monitored).toBe(false);
  });

  it('passes through boolean monitored', () => {
    const result = normalize({ monitored: true });
    expect(result.monitored).toBe(true);
  });

  it('coerces string "true" to boolean for lowFloor', () => {
    const result = normalize({ LowFloor: 'true' });
    expect(result.lowFloor).toBe(true);
  });

  it('coerces string "false" to boolean for lowFloor', () => {
    const result = normalize({ LowFloor: 'false' });
    expect(result.lowFloor).toBe(false);
  });

  it('passes through boolean lowFloor', () => {
    const result = normalize({ lowFloor: true });
    expect(result.lowFloor).toBe(true);
  });

  it('coerces string "true" to boolean for hasLiftOrRamp', () => {
    const result = normalize({ HasLiftOrRamp: 'true' });
    expect(result.hasLiftOrRamp).toBe(true);
  });

  it('coerces string "false" to boolean for hasLiftOrRamp', () => {
    const result = normalize({ HasLiftOrRamp: 'false' });
    expect(result.hasLiftOrRamp).toBe(false);
  });

  it('passes through boolean hasLiftOrRamp', () => {
    const result = normalize({ hasLiftOrRamp: true });
    expect(result.hasLiftOrRamp).toBe(true);
  });

  it('coerces string "true" to boolean for hasHoist', () => {
    const result = normalize({ HasHoist: 'true' });
    expect(result.hasHoist).toBe(true);
  });

  it('coerces string "false" to boolean for hasHoist', () => {
    const result = normalize({ HasHoist: 'false' });
    expect(result.hasHoist).toBe(false);
  });

  it('passes through boolean hasHoist', () => {
    const result = normalize({ hasHoist: true });
    expect(result.hasHoist).toBe(true);
  });

  it('normalizes valid union value for transportMode', () => {
    const result = normalize({ TransportMode: 'all' });
    expect(result.transportMode).toBe('all');
  });

  it('rejects invalid union value for transportMode', () => {
    const result = normalize({ TransportMode: 'invalid_value_xyz' });
    expect(result.transportMode).toBeUndefined();
  });

  it('normalizes valid union value for propulsionType', () => {
    const result = normalize({ PropulsionType: 'other' });
    expect(result.propulsionType).toBe('other');
  });

  it('rejects invalid union value for propulsionType', () => {
    const result = normalize({ PropulsionType: 'invalid_value_xyz' });
    expect(result.propulsionType).toBeUndefined();
  });

  it('normalizes name array', () => {
    const result = normalize({ Name: [{ Value: 'test' }] });
    expect(result.name).toHaveLength(1);
    expect(result.name![0].value).toBe('test');
  });

  it('wraps single name object in array', () => {
    const result = normalize({ Name: { Value: 'solo' } });
    expect(result.name).toHaveLength(1);
    expect(result.name![0].value).toBe('solo');
  });

  it('normalizes shortName array', () => {
    const result = normalize({ ShortName: [{ Value: 'test' }] });
    expect(result.shortName).toHaveLength(1);
    expect(result.shortName![0].value).toBe('test');
  });

  it('wraps single shortName object in array', () => {
    const result = normalize({ ShortName: { Value: 'solo' } });
    expect(result.shortName).toHaveLength(1);
    expect(result.shortName![0].value).toBe('solo');
  });

  it('normalizes description array', () => {
    const result = normalize({ Description: [{ Value: 'test' }] });
    expect(result.description).toHaveLength(1);
    expect(result.description![0].value).toBe('test');
  });

  it('wraps single description object in array', () => {
    const result = normalize({ Description: { Value: 'solo' } });
    expect(result.description).toHaveLength(1);
    expect(result.description![0].value).toBe('solo');
  });

  it('normalizes keyList array', () => {
    const result = normalize({ KeyList: [{ Key: 'test' }] });
    expect(result.keyList).toHaveLength(1);
    expect(result.keyList![0].key).toBe('test');
  });

  it('wraps single keyList object in array', () => {
    const result = normalize({ KeyList: { Key: 'solo' } });
    expect(result.keyList).toHaveLength(1);
    expect(result.keyList![0].key).toBe('solo');
  });

  it('normalizes privateCodes array', () => {
    const result = normalize({ PrivateCodes: [{ Value: 'test' }] });
    expect(result.privateCodes).toHaveLength(1);
    expect(result.privateCodes![0].value).toBe('test');
  });

  it('wraps single privateCodes object in array', () => {
    const result = normalize({ PrivateCodes: { Value: 'solo' } });
    expect(result.privateCodes).toHaveLength(1);
    expect(result.privateCodes![0].value).toBe('solo');
  });

  it('returns empty object for empty input', () => {
    const result = normalize({});
    expect(result).toEqual({});
  });

  // ── @_-prefixed attribute fields (fast-xml-parser output) ──

  it('maps @_id → id (XML attribute prefix)', () => {
    const result = normalize({ '@_id': 'attr-value' });
    expect(result.id).toBe('attr-value');
  });

  it('maps @_responsibilitySetRef → responsibilitySetRef (XML attribute prefix)', () => {
    const result = normalize({ '@_responsibilitySetRef': 'attr-value' });
    expect(result.responsibilitySetRef).toBe('attr-value');
  });
});
