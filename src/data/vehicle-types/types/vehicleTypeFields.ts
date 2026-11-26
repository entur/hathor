import type { FieldSpec, FilterFields } from '../../../components/collection/index.ts';
import { TRANSPORT_MODES } from '../../netex/transportMode.ts';
import { FUEL_TYPES, HYBRID_CATEGORIES, PROPULSION_TYPES } from './vehicleTypeTypes.ts';

/**
 * Field mapping of `VehicleType`: field key → kind, path into the row and
 * enum values. A key doubles as its `vehicleType.field.<key>` label.
 */
export const vehicleTypeFields = {
  id: { kind: 'text', path: ['id'] },
  name: { kind: 'name', path: ['name'] },
  shortName: { kind: 'name', path: ['shortName'] },
  description: { kind: 'name', path: ['description'] },
  transportMode: { kind: 'enum', path: ['transportMode'], options: TRANSPORT_MODES },
  deckPlan: { kind: 'name', path: ['deckPlan', 'name'] },
  length: { kind: 'number', path: ['length'] },
  width: { kind: 'number', path: ['width'] },
  height: { kind: 'number', path: ['height'] },
  weight: { kind: 'number', path: ['weight'] },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
  propulsionTypes: { kind: 'enumMulti', path: ['propulsionTypes'], options: PROPULSION_TYPES },
  fuelTypes: { kind: 'enumMulti', path: ['fuelTypes'], options: FUEL_TYPES },
  selfPropelled: { kind: 'switch', path: ['selfPropelled'] },
  euroClass: { kind: 'text', path: ['euroClass'] },
  maximumVelocity: { kind: 'number', path: ['maximumVelocity'] },
  maximumRange: { kind: 'number', path: ['maximumRange'] },
  formDragCoefficient: { kind: 'number', path: ['formDragCoefficient'] },
  rollResistanceCoefficient: { kind: 'number', path: ['rollResistanceCoefficient'] },
  maximumEngineEffectKW: { kind: 'number', path: ['maximumEngineEffectKW'] },
  hybridCategory: { kind: 'enum', path: ['hybridCategory'], options: HYBRID_CATEGORIES },
  totalCapacity: { kind: 'number', path: ['passengerCapacity', 'totalCapacity'] },
  seatingCapacity: { kind: 'number', path: ['passengerCapacity', 'seatingCapacity'] },
  standingCapacity: { kind: 'number', path: ['passengerCapacity', 'standingCapacity'] },
  pushchairCapacity: { kind: 'number', path: ['passengerCapacity', 'pushchairCapacity'] },
  wheelchairPlaceCapacity: {
    kind: 'number',
    path: ['passengerCapacity', 'wheelchairPlaceCapacity'],
  },
  pramPlaceCapacity: { kind: 'number', path: ['passengerCapacity', 'pramPlaceCapacity'] },
  bicycleRackCapacity: { kind: 'number', path: ['passengerCapacity', 'bicycleRackCapacity'] },
  created: { kind: 'datetime', path: ['created'] },
  changed: { kind: 'datetime', path: ['changed'] },
  changedBy: { kind: 'text', path: ['changedBy'] },
  vehicles: { kind: 'grid', path: ['vehicles'] },
} satisfies Record<string, FieldSpec>;

export type VehicleTypeField = keyof typeof vehicleTypeFields;

/** Filter mapping: which fields filter, through which `VehicleTypeFilter` argument. */
export const vehicleTypeFilterFields = {
  id: { arg: 'netexIds', op: 'anyOf' },
  name: { arg: 'name', op: 'contains' },
  transportMode: { arg: 'transportModes', op: 'anyOf' },
} satisfies FilterFields;
