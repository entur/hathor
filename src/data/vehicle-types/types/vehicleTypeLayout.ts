import type { LayoutItem } from '../../../components/form-layout/index.ts';
import type { VehicleTypeField } from './vehicleTypeFields.ts';

/**
 * The vehicle-type form's sections, in order: section id → its fields. The
 * legacy sidebar draws them as tabs (`general` and `dimensions` share one), the
 * form page as stacked sections with a table of contents (#280).
 */
export const vehicleTypeSections = {
  general: ['name', 'transportMode', 'lowFloor'],
  dimensions: (['length', 'width', 'height', 'weight'] as const).map(field => ({
    field,
    width: '1/4' as const,
  })),
  propulsion: [
    'propulsionTypes',
    'fuelTypes',
    'selfPropelled',
    'euroClass',
    'maximumVelocity',
    'maximumRange',
  ],
  capacity: [
    'totalCapacity',
    'seatingCapacity',
    'standingCapacity',
    'pushchairCapacity',
    'wheelchairPlaceCapacity',
    'pramPlaceCapacity',
    'bicycleRackCapacity',
  ],
  environment: [
    'formDragCoefficient',
    'rollResistanceCoefficient',
    'maximumEngineEffectKW',
    'hybridCategory',
  ],
  vehicles: ['vehicles'],
} satisfies Record<string, LayoutItem<VehicleTypeField>[]>;

export type VehicleTypeSection = keyof typeof vehicleTypeSections;

/** Each section's heading (i18n key), in full words (V3). */
export const VEHICLE_TYPE_SECTION_LABEL: Record<VehicleTypeSection, string> = {
  general: 'vehicleType.tab.general',
  dimensions: 'vehicleType.field.dimensions',
  propulsion: 'vehicleType.section.propulsion',
  capacity: 'vehicleType.tab.capacity',
  environment: 'vehicleType.tab.environment',
  vehicles: 'vehicleType.tab.vehicles',
};

/** A section's field keys, whether listed bare or with a width. */
export const sectionFields = (s: VehicleTypeSection): VehicleTypeField[] =>
  vehicleTypeSections[s].map(item => (typeof item === 'string' ? item : item.field));
