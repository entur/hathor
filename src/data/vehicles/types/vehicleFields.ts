import type { FieldSpec, FilterFields } from '../../../components/collection/index.ts';
import type { Layout } from '../../../components/form-layout/index.ts';
import { TRANSPORT_MODES } from '../../netex/transportMode.ts';

/**
 * Field mapping of `Vehicle`: field key → kind, path into the row and enum
 * values. A key doubles as its `vehicles.field.<key>` label.
 */
export const vehicleFields = {
  id: { kind: 'text', path: ['id'] },
  name: { kind: 'name', path: ['name'] },
  registrationNumber: { kind: 'text', path: ['registrationNumber'] },
  operationalNumber: { kind: 'text', path: ['operationalNumber'] },
  transportType: { kind: 'name', path: ['transportType', 'name'] },
  transportMode: {
    kind: 'enum',
    path: ['transportType', 'transportMode'],
    options: TRANSPORT_MODES,
  },
  chassisNumber: { kind: 'text', path: ['chassisNumber'] },
  buildDate: { kind: 'date', path: ['buildDate'] },
  registrationDate: { kind: 'date', path: ['registrationDate'] },
  description: { kind: 'name', path: ['description'] },
} satisfies Record<string, FieldSpec>;

export type VehicleField = keyof typeof vehicleFields;

/** Filter mapping: which fields filter, through which `VehicleFilter` argument. */
export const vehicleFilterFields = {
  id: { arg: 'netexIds', op: 'anyOf' },
  name: { arg: 'name', op: 'contains' },
  transportMode: { arg: 'transportModes', op: 'anyOf' },
} satisfies FilterFields;

/** The vehicle form: one flat section, short codes at half width, paired (#285). The
 *  key is never shown — one section draws no heading. */
export const vehicleLayout: Layout<VehicleField> = {
  vehicle: [
    'name',
    { field: 'registrationNumber', width: '1/2' },
    { field: 'operationalNumber', width: '1/2' },
    'transportType',
    { field: 'buildDate', width: '1/2' },
    { field: 'registrationDate', width: '1/2' },
    { field: 'chassisNumber', width: '1/2' },
    'description',
  ],
};
