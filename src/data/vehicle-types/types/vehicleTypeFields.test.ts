import { describe, expect, it } from 'vitest';
import type { VehicleType } from './vehicleTypeTypes.ts';
import { vehicleTypeFields } from './vehicleTypeFields.ts';

/** Every field set, so a path that misses the row's shape reads `undefined`. */
const FULL: Required<VehicleType> = {
  id: 'NMR:VehicleType:1',
  version: 1,
  name: { value: 'Citea' },
  shortName: { value: 'C' },
  description: { value: 'City bus' },
  transportMode: 'BUS',
  deckPlan: { id: 'NMR:DeckPlan:1', name: { value: 'Deck' } },
  length: 12,
  width: 2.5,
  height: 3,
  weight: 12000,
  lowFloor: true,
  propulsionTypes: ['ELECTRIC'],
  fuelTypes: ['BATTERY'],
  selfPropelled: true,
  euroClass: 'EURO6',
  maximumVelocity: 80,
  maximumRange: 300,
  formDragCoefficient: 0.6,
  rollResistanceCoefficient: 0.01,
  maximumEngineEffectKW: 250,
  hybridCategory: 'CHARGEABLE',
  passengerCapacity: {
    totalCapacity: 90,
    seatingCapacity: 30,
    standingCapacity: 60,
    pushchairCapacity: 1,
    wheelchairPlaceCapacity: 1,
    pramPlaceCapacity: 1,
    bicycleRackCapacity: 2,
  },
  created: '2026-01-01T00:00:00Z',
  changed: '2026-01-02T00:00:00Z',
  changedBy: 'kdm',
  vehicles: [],
};

const at = (row: unknown, path: readonly string[]) =>
  path.reduce<unknown>((v, k) => (v as Record<string, unknown> | undefined)?.[k], row);

describe('vehicleTypeFields', () => {
  it.each(Object.entries(vehicleTypeFields))(
    '%s reads a value off a full VehicleType',
    (_, spec) => {
      expect(at(FULL, spec.path)).toBeDefined();
    }
  );
});
