import { describe, it, expect } from 'vitest';
import { validate } from '../src/generated/validate.js';

describe('validate', () => {
  it('fails when DeckPlanRef has wrong type (number)', () => {
    const result = validate({ DeckPlanRef: 123 as never });
    expect(result.errors).toContain('DeckPlanRef must be a string');
  });

  it('fails when EuroClass has wrong type (number)', () => {
    const result = validate({ EuroClass: 123 as never });
    expect(result.errors).toContain('EuroClass must be a string');
  });

  it('fails when ReversingDirection has wrong type (string)', () => {
    const result = validate({ ReversingDirection: 'not-a-bool' as never });
    expect(result.errors).toContain('ReversingDirection must be a boolean');
  });

  it('fails when SelfPropelled has wrong type (string)', () => {
    const result = validate({ SelfPropelled: 'not-a-bool' as never });
    expect(result.errors).toContain('SelfPropelled must be a boolean');
  });

  it('fails when MaximumRange has wrong type (string)', () => {
    const result = validate({ MaximumRange: 'not-a-number' as never });
    expect(result.errors).toContain('MaximumRange must be a number');
  });

  it('fails when MaximumVelocity has wrong type (string)', () => {
    const result = validate({ MaximumVelocity: 'not-a-number' as never });
    expect(result.errors).toContain('MaximumVelocity must be a number');
  });

  it('fails when $id has wrong type (number)', () => {
    const result = validate({ $id: 123 as never });
    expect(result.errors).toContain('$id must be a string');
  });

  it('fails when IncludedIn has wrong type (number)', () => {
    const result = validate({ IncludedIn: 123 as never });
    expect(result.errors).toContain('IncludedIn must be a string');
  });

  it('fails when ClassifiedAsRef has wrong type (number)', () => {
    const result = validate({ ClassifiedAsRef: 123 as never });
    expect(result.errors).toContain('ClassifiedAsRef must be a string');
  });

  it('fails when facilities has wrong type (number)', () => {
    const result = validate({ facilities: 123 as never });
    expect(result.errors).toContain('facilities must be a string');
  });

  it('fails when Monitored has wrong type (string)', () => {
    const result = validate({ Monitored: 'not-a-bool' as never });
    expect(result.errors).toContain('Monitored must be a boolean');
  });

  it('fails when LowFloor has wrong type (string)', () => {
    const result = validate({ LowFloor: 'not-a-bool' as never });
    expect(result.errors).toContain('LowFloor must be a boolean');
  });

  it('fails when HasLiftOrRamp has wrong type (string)', () => {
    const result = validate({ HasLiftOrRamp: 'not-a-bool' as never });
    expect(result.errors).toContain('HasLiftOrRamp must be a boolean');
  });

  it('fails when HasHoist has wrong type (string)', () => {
    const result = validate({ HasHoist: 'not-a-bool' as never });
    expect(result.errors).toContain('HasHoist must be a boolean');
  });

  it('fails when HoistOperatingRadius has wrong type (string)', () => {
    const result = validate({ HoistOperatingRadius: 'not-a-number' as never });
    expect(result.errors).toContain('HoistOperatingRadius must be a number');
  });

  it('fails when BoardingHeight has wrong type (string)', () => {
    const result = validate({ BoardingHeight: 'not-a-number' as never });
    expect(result.errors).toContain('BoardingHeight must be a number');
  });

  it('fails when GapToPlatform has wrong type (string)', () => {
    const result = validate({ GapToPlatform: 'not-a-number' as never });
    expect(result.errors).toContain('GapToPlatform must be a number');
  });

  it('fails when Length has wrong type (string)', () => {
    const result = validate({ Length: 'not-a-number' as never });
    expect(result.errors).toContain('Length must be a number');
  });

  it('fails when Width has wrong type (string)', () => {
    const result = validate({ Width: 'not-a-number' as never });
    expect(result.errors).toContain('Width must be a number');
  });

  it('fails when Height has wrong type (string)', () => {
    const result = validate({ Height: 'not-a-number' as never });
    expect(result.errors).toContain('Height must be a number');
  });

  it('fails when Weight has wrong type (string)', () => {
    const result = validate({ Weight: 'not-a-number' as never });
    expect(result.errors).toContain('Weight must be a number');
  });

  it('fails when FirstAxleHeight has wrong type (string)', () => {
    const result = validate({ FirstAxleHeight: 'not-a-number' as never });
    expect(result.errors).toContain('FirstAxleHeight must be a number');
  });

  it('fails when canCarry has wrong type (number)', () => {
    const result = validate({ canCarry: 123 as never });
    expect(result.errors).toContain('canCarry must be a string');
  });

  it('fails when satisfiesFacilityRequirements has wrong type (number)', () => {
    const result = validate({ satisfiesFacilityRequirements: 123 as never });
    expect(result.errors).toContain('satisfiesFacilityRequirements must be a string');
  });

  it('fails when BrandingRef has wrong type (number)', () => {
    const result = validate({ BrandingRef: 123 as never });
    expect(result.errors).toContain('BrandingRef must be a string');
  });

  it('fails when $responsibilitySetRef has wrong type (number)', () => {
    const result = validate({ $responsibilitySetRef: 123 as never });
    expect(result.errors).toContain('$responsibilitySetRef must be a string');
  });

  it('accepts valid union value for TransportMode', () => {
    const result = validate({ TransportMode: 'all' });
    const transportModeErrors = result.errors.filter(e => e.includes('TransportMode'));
    expect(transportModeErrors).toEqual([]);
  });

  it('rejects invalid union value for TransportMode', () => {
    const result = validate({ TransportMode: 'invalid_xyz' as never });
    expect(result.errors).toContain(
      'TransportMode must be one of: all, unknown, bus, trolleyBus, tram, coach, rail, intercityRail, urbanRail, metro, air, water, cableway, funicular, snowAndIce, taxi, ferry, lift, selfDrive, anyMode, other'
    );
  });

  it('accepts valid union value for PropulsionType', () => {
    const result = validate({ PropulsionType: 'other' });
    const propulsionTypeErrors = result.errors.filter(e => e.includes('PropulsionType'));
    expect(propulsionTypeErrors).toEqual([]);
  });

  it('rejects invalid union value for PropulsionType', () => {
    const result = validate({ PropulsionType: 'invalid_xyz' as never });
    expect(result.errors).toContain(
      'PropulsionType must be one of: combustion, electric, electricAssist, hybrid, human, other'
    );
  });

  it('passes with all valid primitive fields', () => {
    const result = validate({
      DeckPlanRef: 'valid',
      EuroClass: 'valid',
      ReversingDirection: true,
      SelfPropelled: true,
      MaximumRange: 42,
      MaximumVelocity: 42,
      $id: 'valid',
      IncludedIn: 'valid',
      ClassifiedAsRef: 'valid',
      facilities: 'valid',
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
      canCarry: 'valid',
      satisfiesFacilityRequirements: 'valid',
      BrandingRef: 'valid',
      $responsibilitySetRef: 'valid',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('passes with empty object (all optional)', () => {
    const result = validate({});
    expect(result.valid).toBe(true);
  });
});
