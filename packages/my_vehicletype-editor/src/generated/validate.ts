import type { VehicleType } from './types.js';
import { TRANSPORT_MODES, PROPULSION_TYPES } from './types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validate(obj: Partial<VehicleType>): ValidationResult {
  const errors: string[] = [];
  if (obj.Name != null && !Array.isArray(obj.Name)) errors.push('Name must be an array');
  if (obj.ShortName != null && !Array.isArray(obj.ShortName))
    errors.push('ShortName must be an array');
  if (obj.Description != null && !Array.isArray(obj.Description))
    errors.push('Description must be an array');
  if (obj.PrivateCode != null && typeof obj.PrivateCode !== 'object')
    errors.push('PrivateCode must be an object');
  if (
    obj.TransportMode != null &&
    !(TRANSPORT_MODES as readonly string[]).includes(obj.TransportMode)
  )
    errors.push(`TransportMode must be one of: ${TRANSPORT_MODES.join(', ')}`);
  if (obj.DeckPlanRef != null && typeof obj.DeckPlanRef !== 'string')
    errors.push('DeckPlanRef must be a string');
  if (obj.EuroClass != null && typeof obj.EuroClass !== 'string')
    errors.push('EuroClass must be a string');
  if (obj.ReversingDirection != null && typeof obj.ReversingDirection !== 'boolean')
    errors.push('ReversingDirection must be a boolean');
  if (obj.SelfPropelled != null && typeof obj.SelfPropelled !== 'boolean')
    errors.push('SelfPropelled must be a boolean');
  if (obj.PropulsionTypes != null && !Array.isArray(obj.PropulsionTypes))
    errors.push('PropulsionTypes must be an array');
  if (
    obj.PropulsionType != null &&
    !(PROPULSION_TYPES as readonly string[]).includes(obj.PropulsionType)
  )
    errors.push(`PropulsionType must be one of: ${PROPULSION_TYPES.join(', ')}`);
  if (obj.FuelTypes != null && !Array.isArray(obj.FuelTypes))
    errors.push('FuelTypes must be an array');
  if (obj.MaximumRange != null && typeof obj.MaximumRange !== 'number')
    errors.push('MaximumRange must be a number');
  if (obj.MaximumVelocity != null && typeof obj.MaximumVelocity !== 'number')
    errors.push('MaximumVelocity must be a number');
  if (obj.PassengerCapacity != null && typeof obj.PassengerCapacity !== 'object')
    errors.push('PassengerCapacity must be an object');
  if (obj.$id != null && typeof obj.$id !== 'string') errors.push('$id must be a string');
  if (obj.IncludedIn != null && typeof obj.IncludedIn !== 'string')
    errors.push('IncludedIn must be a string');
  if (obj.ClassifiedAsRef != null && typeof obj.ClassifiedAsRef !== 'string')
    errors.push('ClassifiedAsRef must be a string');
  if (obj.Facilities != null && typeof obj.Facilities !== 'string')
    errors.push('Facilities must be a string');
  if (obj.Monitored != null && typeof obj.Monitored !== 'boolean')
    errors.push('Monitored must be a boolean');
  if (obj.LowFloor != null && typeof obj.LowFloor !== 'boolean')
    errors.push('LowFloor must be a boolean');
  if (obj.HasLiftOrRamp != null && typeof obj.HasLiftOrRamp !== 'boolean')
    errors.push('HasLiftOrRamp must be a boolean');
  if (obj.HasHoist != null && typeof obj.HasHoist !== 'boolean')
    errors.push('HasHoist must be a boolean');
  if (obj.HoistOperatingRadius != null && typeof obj.HoistOperatingRadius !== 'number')
    errors.push('HoistOperatingRadius must be a number');
  if (obj.BoardingHeight != null && typeof obj.BoardingHeight !== 'number')
    errors.push('BoardingHeight must be a number');
  if (obj.GapToPlatform != null && typeof obj.GapToPlatform !== 'number')
    errors.push('GapToPlatform must be a number');
  if (obj.Length != null && typeof obj.Length !== 'number') errors.push('Length must be a number');
  if (obj.Width != null && typeof obj.Width !== 'number') errors.push('Width must be a number');
  if (obj.Height != null && typeof obj.Height !== 'number') errors.push('Height must be a number');
  if (obj.Weight != null && typeof obj.Weight !== 'number') errors.push('Weight must be a number');
  if (obj.FirstAxleHeight != null && typeof obj.FirstAxleHeight !== 'number')
    errors.push('FirstAxleHeight must be a number');
  if (obj.CanCarry != null && typeof obj.CanCarry !== 'string')
    errors.push('CanCarry must be a string');
  if (obj.CanManoeuvre != null && typeof obj.CanManoeuvre !== 'object')
    errors.push('CanManoeuvre must be an object');
  if (
    obj.SatisfiesFacilityRequirements != null &&
    typeof obj.SatisfiesFacilityRequirements !== 'string'
  )
    errors.push('SatisfiesFacilityRequirements must be a string');
  if (obj.KeyList != null && !Array.isArray(obj.KeyList)) errors.push('KeyList must be an array');
  if (obj.PrivateCodes != null && !Array.isArray(obj.PrivateCodes))
    errors.push('PrivateCodes must be an array');
  if (obj.BrandingRef != null && typeof obj.BrandingRef !== 'string')
    errors.push('BrandingRef must be a string');
  if (obj.$responsibilitySetRef != null && typeof obj.$responsibilitySetRef !== 'string')
    errors.push('$responsibilitySetRef must be a string');
  return { valid: errors.length === 0, errors };
}
