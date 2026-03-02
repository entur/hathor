import { describe, it, expect } from 'vitest';
import { validate } from '../src/generated/validate.js';

describe('validate', () => {
  it('fails when deckPlanRef has wrong type (number)', () => {
    const result = validate({ deckPlanRef: 123 as never });
    expect(result.errors).toContain('deckPlanRef must be a string');
  });

  it('fails when euroClass has wrong type (number)', () => {
    const result = validate({ euroClass: 123 as never });
    expect(result.errors).toContain('euroClass must be a string');
  });

  it('fails when reversingDirection has wrong type (string)', () => {
    const result = validate({ reversingDirection: 'not-a-bool' as never });
    expect(result.errors).toContain('reversingDirection must be a boolean');
  });

  it('fails when selfPropelled has wrong type (string)', () => {
    const result = validate({ selfPropelled: 'not-a-bool' as never });
    expect(result.errors).toContain('selfPropelled must be a boolean');
  });

  it('fails when maximumRange has wrong type (string)', () => {
    const result = validate({ maximumRange: 'not-a-number' as never });
    expect(result.errors).toContain('maximumRange must be a number');
  });

  it('fails when maximumVelocity has wrong type (string)', () => {
    const result = validate({ maximumVelocity: 'not-a-number' as never });
    expect(result.errors).toContain('maximumVelocity must be a number');
  });

  it('fails when id has wrong type (number)', () => {
    const result = validate({ id: 123 as never });
    expect(result.errors).toContain('id must be a string');
  });

  it('fails when includedIn has wrong type (number)', () => {
    const result = validate({ includedIn: 123 as never });
    expect(result.errors).toContain('includedIn must be a string');
  });

  it('fails when classifiedAsRef has wrong type (number)', () => {
    const result = validate({ classifiedAsRef: 123 as never });
    expect(result.errors).toContain('classifiedAsRef must be a string');
  });

  it('fails when facilities has wrong type (number)', () => {
    const result = validate({ facilities: 123 as never });
    expect(result.errors).toContain('facilities must be a string');
  });

  it('fails when monitored has wrong type (string)', () => {
    const result = validate({ monitored: 'not-a-bool' as never });
    expect(result.errors).toContain('monitored must be a boolean');
  });

  it('fails when lowFloor has wrong type (string)', () => {
    const result = validate({ lowFloor: 'not-a-bool' as never });
    expect(result.errors).toContain('lowFloor must be a boolean');
  });

  it('fails when hasLiftOrRamp has wrong type (string)', () => {
    const result = validate({ hasLiftOrRamp: 'not-a-bool' as never });
    expect(result.errors).toContain('hasLiftOrRamp must be a boolean');
  });

  it('fails when hasHoist has wrong type (string)', () => {
    const result = validate({ hasHoist: 'not-a-bool' as never });
    expect(result.errors).toContain('hasHoist must be a boolean');
  });

  it('fails when hoistOperatingRadius has wrong type (string)', () => {
    const result = validate({ hoistOperatingRadius: 'not-a-number' as never });
    expect(result.errors).toContain('hoistOperatingRadius must be a number');
  });

  it('fails when boardingHeight has wrong type (string)', () => {
    const result = validate({ boardingHeight: 'not-a-number' as never });
    expect(result.errors).toContain('boardingHeight must be a number');
  });

  it('fails when gapToPlatform has wrong type (string)', () => {
    const result = validate({ gapToPlatform: 'not-a-number' as never });
    expect(result.errors).toContain('gapToPlatform must be a number');
  });

  it('fails when length has wrong type (string)', () => {
    const result = validate({ length: 'not-a-number' as never });
    expect(result.errors).toContain('length must be a number');
  });

  it('fails when width has wrong type (string)', () => {
    const result = validate({ width: 'not-a-number' as never });
    expect(result.errors).toContain('width must be a number');
  });

  it('fails when height has wrong type (string)', () => {
    const result = validate({ height: 'not-a-number' as never });
    expect(result.errors).toContain('height must be a number');
  });

  it('fails when weight has wrong type (string)', () => {
    const result = validate({ weight: 'not-a-number' as never });
    expect(result.errors).toContain('weight must be a number');
  });

  it('fails when firstAxleHeight has wrong type (string)', () => {
    const result = validate({ firstAxleHeight: 'not-a-number' as never });
    expect(result.errors).toContain('firstAxleHeight must be a number');
  });

  it('fails when canCarry has wrong type (number)', () => {
    const result = validate({ canCarry: 123 as never });
    expect(result.errors).toContain('canCarry must be a string');
  });

  it('fails when satisfiesFacilityRequirements has wrong type (number)', () => {
    const result = validate({ satisfiesFacilityRequirements: 123 as never });
    expect(result.errors).toContain('satisfiesFacilityRequirements must be a string');
  });

  it('fails when brandingRef has wrong type (number)', () => {
    const result = validate({ brandingRef: 123 as never });
    expect(result.errors).toContain('brandingRef must be a string');
  });

  it('fails when responsibilitySetRef has wrong type (number)', () => {
    const result = validate({ responsibilitySetRef: 123 as never });
    expect(result.errors).toContain('responsibilitySetRef must be a string');
  });

  it('accepts valid union value for transportMode', () => {
    const result = validate({ transportMode: 'all' });
    const transportModeErrors = result.errors.filter(e => e.includes('transportMode'));
    expect(transportModeErrors).toEqual([]);
  });

  it('rejects invalid union value for transportMode', () => {
    const result = validate({ transportMode: 'invalid_xyz' as never });
    expect(result.errors).toContain(
      'transportMode must be one of: all, unknown, bus, trolleyBus, tram, coach, rail, intercityRail, urbanRail, metro, air, water, cableway, funicular, snowAndIce, taxi, ferry, lift, selfDrive, anyMode, other'
    );
  });

  it('accepts valid union value for propulsionType', () => {
    const result = validate({ propulsionType: 'other' });
    const propulsionTypeErrors = result.errors.filter(e => e.includes('propulsionType'));
    expect(propulsionTypeErrors).toEqual([]);
  });

  it('rejects invalid union value for propulsionType', () => {
    const result = validate({ propulsionType: 'invalid_xyz' as never });
    expect(result.errors).toContain(
      'propulsionType must be one of: combustion, electric, electricAssist, hybrid, human, other'
    );
  });

  it('passes with all valid primitive fields', () => {
    const result = validate({
      deckPlanRef: 'valid',
      euroClass: 'valid',
      reversingDirection: true,
      selfPropelled: true,
      maximumRange: 42,
      maximumVelocity: 42,
      id: 'valid',
      includedIn: 'valid',
      classifiedAsRef: 'valid',
      facilities: 'valid',
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
      canCarry: 'valid',
      satisfiesFacilityRequirements: 'valid',
      brandingRef: 'valid',
      responsibilitySetRef: 'valid',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('passes with empty object (all optional)', () => {
    const result = validate({});
    expect(result.valid).toBe(true);
  });
});
