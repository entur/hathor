// Auto-generated from entity file — do not edit manually
import type { My_VehicleType } from './types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validate(obj: Partial<My_VehicleType>): ValidationResult {
  const errors: string[] = [];
  if (obj.name != null && !Array.isArray(obj.name)) errors.push('name must be an array');
  if (obj.shortName != null && !Array.isArray(obj.shortName))
    errors.push('shortName must be an array');
  if (obj.description != null && !Array.isArray(obj.description))
    errors.push('description must be an array');
  if (obj.privateCode != null && typeof obj.privateCode !== 'object')
    errors.push('privateCode must be an object');
  if (
    obj.transportMode != null &&
    ![
      'all',
      'unknown',
      'bus',
      'trolleyBus',
      'tram',
      'coach',
      'rail',
      'intercityRail',
      'urbanRail',
      'metro',
      'air',
      'water',
      'cableway',
      'funicular',
      'snowAndIce',
      'taxi',
      'ferry',
      'lift',
      'selfDrive',
      'anyMode',
      'other',
    ].includes(obj.transportMode)
  )
    errors.push(
      'transportMode must be one of: all, unknown, bus, trolleyBus, tram, coach, rail, intercityRail, urbanRail, metro, air, water, cableway, funicular, snowAndIce, taxi, ferry, lift, selfDrive, anyMode, other'
    );
  if (obj.deckPlanRef != null && typeof obj.deckPlanRef !== 'string')
    errors.push('deckPlanRef must be a string');
  if (obj.euroClass != null && typeof obj.euroClass !== 'string')
    errors.push('euroClass must be a string');
  if (obj.reversingDirection != null && typeof obj.reversingDirection !== 'boolean')
    errors.push('reversingDirection must be a boolean');
  if (obj.selfPropelled != null && typeof obj.selfPropelled !== 'boolean')
    errors.push('selfPropelled must be a boolean');
  if (obj.propulsionTypes != null && !Array.isArray(obj.propulsionTypes))
    errors.push('propulsionTypes must be an array');
  if (
    obj.propulsionType != null &&
    !['other', 'combustion', 'electric', 'electricAssist', 'hybrid', 'human'].includes(
      obj.propulsionType
    )
  )
    errors.push(
      'propulsionType must be one of: other, combustion, electric, electricAssist, hybrid, human'
    );
  if (obj.fuelTypes != null && !Array.isArray(obj.fuelTypes))
    errors.push('fuelTypes must be an array');
  if (obj.maximumRange != null && typeof obj.maximumRange !== 'number')
    errors.push('maximumRange must be a number');
  if (obj.maximumVelocity != null && typeof obj.maximumVelocity !== 'number')
    errors.push('maximumVelocity must be a number');
  if (
    obj.fuelType != null &&
    ![
      'other',
      'battery',
      'biodiesel',
      'diesel',
      'dieselBatteryHybrid',
      'electricContact',
      'electricity',
      'ethanol',
      'hydrogen',
      'liquidGas',
      'tpg',
      'methane',
      'naturalGas',
      'petrol',
      'petrolBatteryHybrid',
      'petrolLeaded',
      'petrolUnleaded',
      'none',
    ].includes(obj.fuelType)
  )
    errors.push(
      'fuelType must be one of: other, battery, biodiesel, diesel, dieselBatteryHybrid, electricContact, electricity, ethanol, hydrogen, liquidGas, tpg, methane, naturalGas, petrol, petrolBatteryHybrid, petrolLeaded, petrolUnleaded, none'
    );
  if (
    obj.typeOfFuel != null &&
    ![
      'other',
      'battery',
      'biodiesel',
      'diesel',
      'dieselBatteryHybrid',
      'electricContact',
      'electricity',
      'ethanol',
      'hydrogen',
      'liquidGas',
      'tpg',
      'methane',
      'naturalGas',
      'petrol',
      'petrolBatteryHybrid',
      'petrolLeaded',
      'petrolUnleaded',
      'none',
    ].includes(obj.typeOfFuel)
  )
    errors.push(
      'typeOfFuel must be one of: other, battery, biodiesel, diesel, dieselBatteryHybrid, electricContact, electricity, ethanol, hydrogen, liquidGas, tpg, methane, naturalGas, petrol, petrolBatteryHybrid, petrolLeaded, petrolUnleaded, none'
    );
  if (obj.passengerCapacity != null && typeof obj.passengerCapacity !== 'object')
    errors.push('passengerCapacity must be an object');
  if (obj.id != null && typeof obj.id !== 'string') errors.push('id must be a string');
  if (obj.includedIn != null && typeof obj.includedIn !== 'string')
    errors.push('includedIn must be a string');
  if (obj.classifiedAsRef != null && typeof obj.classifiedAsRef !== 'string')
    errors.push('classifiedAsRef must be a string');
  if (obj.facilities != null && typeof obj.facilities !== 'string')
    errors.push('facilities must be a string');
  if (obj.monitored != null && typeof obj.monitored !== 'boolean')
    errors.push('monitored must be a boolean');
  if (obj.lowFloor != null && typeof obj.lowFloor !== 'boolean')
    errors.push('lowFloor must be a boolean');
  if (obj.hasLiftOrRamp != null && typeof obj.hasLiftOrRamp !== 'boolean')
    errors.push('hasLiftOrRamp must be a boolean');
  if (obj.hasHoist != null && typeof obj.hasHoist !== 'boolean')
    errors.push('hasHoist must be a boolean');
  if (obj.hoistOperatingRadius != null && typeof obj.hoistOperatingRadius !== 'number')
    errors.push('hoistOperatingRadius must be a number');
  if (obj.boardingHeight != null && typeof obj.boardingHeight !== 'number')
    errors.push('boardingHeight must be a number');
  if (obj.gapToPlatform != null && typeof obj.gapToPlatform !== 'number')
    errors.push('gapToPlatform must be a number');
  if (obj.length != null && typeof obj.length !== 'number') errors.push('length must be a number');
  if (obj.width != null && typeof obj.width !== 'number') errors.push('width must be a number');
  if (obj.height != null && typeof obj.height !== 'number') errors.push('height must be a number');
  if (obj.weight != null && typeof obj.weight !== 'number') errors.push('weight must be a number');
  if (obj.firstAxleHeight != null && typeof obj.firstAxleHeight !== 'number')
    errors.push('firstAxleHeight must be a number');
  if (obj.canCarry != null && typeof obj.canCarry !== 'string')
    errors.push('canCarry must be a string');
  if (obj.canManoeuvre != null && typeof obj.canManoeuvre !== 'object')
    errors.push('canManoeuvre must be an object');
  if (
    obj.satisfiesFacilityRequirements != null &&
    typeof obj.satisfiesFacilityRequirements !== 'string'
  )
    errors.push('satisfiesFacilityRequirements must be a string');
  if (obj.keyList != null && !Array.isArray(obj.keyList)) errors.push('keyList must be an array');
  if (obj.privateCodes != null && !Array.isArray(obj.privateCodes))
    errors.push('privateCodes must be an array');
  if (obj.brandingRef != null && typeof obj.brandingRef !== 'string')
    errors.push('brandingRef must be a string');
  if (obj.responsibilitySetRef != null && typeof obj.responsibilitySetRef !== 'string')
    errors.push('responsibilitySetRef must be a string');
  return { valid: errors.length === 0, errors };
}
