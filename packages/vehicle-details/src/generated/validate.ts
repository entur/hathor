import type { Vehicle } from './Vehicle.js';
import { MODIFICATION, STATUS } from './Vehicle.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validate(obj: Partial<Vehicle>): ValidationResult {
  const errors: string[] = [];
  if (obj.Name != null && !Array.isArray(obj.Name)) errors.push('Name must be an array');
  if (obj.ShortName != null && !Array.isArray(obj.ShortName))
    errors.push('ShortName must be an array');
  if (obj.Description != null && !Array.isArray(obj.Description))
    errors.push('Description must be an array');
  if (obj.$id != null && typeof obj.$id !== 'string') errors.push('$id must be a string');
  if (obj.BuildDate != null && typeof obj.BuildDate !== 'string')
    errors.push('BuildDate must be a string');
  if (obj.ChassisNumber != null && typeof obj.ChassisNumber !== 'string')
    errors.push('ChassisNumber must be a string');
  if (obj.RegistrationNumber != null && typeof obj.RegistrationNumber !== 'string')
    errors.push('RegistrationNumber must be a string');
  if (obj.RegistrationDate != null && typeof obj.RegistrationDate !== 'string')
    errors.push('RegistrationDate must be a string');
  if (obj.OperationalNumber != null && typeof obj.OperationalNumber !== 'string')
    errors.push('OperationalNumber must be a string');
  if (obj.PrivateCode != null && typeof obj.PrivateCode !== 'object')
    errors.push('PrivateCode must be an object');
  if (obj.TransportOrganisationRef != null && typeof obj.TransportOrganisationRef !== 'string')
    errors.push('TransportOrganisationRef must be a string');
  if (obj.ContactRef != null && typeof obj.ContactRef !== 'string')
    errors.push('ContactRef must be a string');
  if (obj.TransportTypeRef != null && typeof obj.TransportTypeRef !== 'string')
    errors.push('TransportTypeRef must be a string');
  if (obj.VehicleModelRef != null && typeof obj.VehicleModelRef !== 'string')
    errors.push('VehicleModelRef must be a string');
  if (obj.equipmentProfiles != null && typeof obj.equipmentProfiles !== 'string')
    errors.push('equipmentProfiles must be a string');
  if (obj.VehicleModelProfileRef != null && typeof obj.VehicleModelProfileRef !== 'string')
    errors.push('VehicleModelProfileRef must be a string');
  if (obj.actualVehicleEquipments != null && typeof obj.actualVehicleEquipments !== 'string')
    errors.push('actualVehicleEquipments must be a string');
  if (obj.Monitored != null && typeof obj.Monitored !== 'boolean')
    errors.push('Monitored must be a boolean');
  if (obj.keyList != null && !Array.isArray(obj.keyList)) errors.push('keyList must be an array');
  if (obj.privateCodes != null && !Array.isArray(obj.privateCodes))
    errors.push('privateCodes must be an array');
  if (obj.BrandingRef != null && typeof obj.BrandingRef !== 'string')
    errors.push('BrandingRef must be a string');
  if (obj.$responsibilitySetRef != null && typeof obj.$responsibilitySetRef !== 'string')
    errors.push('$responsibilitySetRef must be a string');
  if (obj.validityConditions != null && typeof obj.validityConditions !== 'string')
    errors.push('validityConditions must be a string');
  if (obj.ValidBetween != null && !Array.isArray(obj.ValidBetween))
    errors.push('ValidBetween must be an array');
  if (obj.$version != null && typeof obj.$version !== 'string')
    errors.push('$version must be a string');
  if (obj.$modification != null && !(MODIFICATION as readonly string[]).includes(obj.$modification))
    errors.push(`$modification must be one of: ${MODIFICATION.join(', ')}`);
  if (obj.$status != null && !(STATUS as readonly string[]).includes(obj.$status))
    errors.push(`$status must be one of: ${STATUS.join(', ')}`);
  return { valid: errors.length === 0, errors };
}
