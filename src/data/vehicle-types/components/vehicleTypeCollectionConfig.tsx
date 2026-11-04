import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createEntityCollection,
  type CardSpec,
  type EntityCollectionProps,
} from '../../../components/collection/index.ts';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import {
  vehicleTypeFields,
  vehicleTypeFilterFields,
  type VehicleTypeField,
} from '../types/vehicleTypeFields.ts';

type Props = EntityCollectionProps<VehicleType, VehicleTypeField>;

/** The vehicle-type collection: toolbar, grid and cards over the field mapping. */
export const VehicleTypeCollection = createEntityCollection(vehicleTypeFields, {
  filterFields: vehicleTypeFilterFields,
});

/** Name first, id second (U4); then what tells two types apart at a glance. */
const COLUMN_KEYS = [
  'name',
  'id',
  'transportMode',
  'deckPlan',
  'totalCapacity',
  'length',
  'lowFloor',
] as const satisfies readonly VehicleTypeField[];

export const VEHICLE_TYPE_CARD: CardSpec<VehicleTypeField> = {
  title: 'name',
  subtitle: 'id',
  fields: ['transportMode', 'deckPlan', 'totalCapacity'],
};

/** Icon + its text, not the icon alone (V4). */
const renderTransportMode = (r: VehicleType) =>
  r.transportMode && <TransportModeIcon mode={r.transportMode} iconPosition="left" />;

/**
 * The collection's columns, labelled from `vehicleType.field.*`.
 *
 * @returns {Props['columns']} the columns, stable until the language changes
 */
export function useVehicleTypeColumns(): Props['columns'] {
  const { t } = useTranslation();
  return useMemo(
    () =>
      COLUMN_KEYS.map(field => ({
        field,
        label: t(`vehicleType.field.${field}`),
        ...(field === 'transportMode' && { render: renderTransportMode }),
      })),
    [t]
  );
}
