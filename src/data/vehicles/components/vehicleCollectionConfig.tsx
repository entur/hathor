import { useMemo } from 'react';
import i18next from 'i18next';
import {
  createEntityCollection,
  type CardSpec,
  type EntityCollectionProps,
} from '../../../components/collection/index.ts';
import { BusPicture } from '../../../components/bus-picture/index.ts';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { useCollectionLabels } from '../../../hooks/useCollectionLabels.ts';
import { netexText } from '../../netex/multilingualString.ts';
import { transportModeLabelKey } from '../../netex/transportMode.ts';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { vehicleMode, type Vehicle } from '../types/vehicle.ts';
import { vehicleFields, vehicleFilterFields, type VehicleField } from '../types/vehicleFields.ts';

type Props = EntityCollectionProps<Vehicle, VehicleField>;

const Collection = createEntityCollection(vehicleFields, { filterFields: vehicleFilterFields });

/** Name first, the registration number when it has none (U4); id second; then what tells
 *  two vehicles apart at a glance. Captions come from `vehicles.field.*`. */
const COLUMNS: Props['columns'] = [
  { field: 'name', text: v => netexText(v.name)?.trim() || v.registrationNumber || '' },
  'id',
  'registrationNumber',
  'transportType',
  {
    field: 'transportMode',
    // Icon + its text, not the icon alone (V4); search matches that text too.
    render: v => <TransportModeIcon mode={vehicleMode(v)} iconPosition="left" />,
    text: v => i18next.t(transportModeLabelKey(vehicleMode(v))),
  },
  'operationalNumber',
];

const CARD: CardSpec<VehicleField> = {
  title: 'name',
  subtitle: 'id',
  fields: ['registrationNumber', 'transportType', 'transportMode'],
};

// Relative: resolves under whichever route lists the collection.
const editHref = (v: Vehicle) => encodeURIComponent(v.id);

/**
 * The vehicle collection, wired once for the page and its story: field + filter
 * mapping, columns, card, a red bus in the vehicle type's dims, localized labels and an
 * Edit link per record (#285).
 *
 * @param {Partial<Props> & Pick<Props, 'rows'>} props rows, plus any override
 * @returns {JSX.Element} toolbar, grid and cards
 */
export function VehicleCollection(props: Partial<Props> & Pick<Props, 'rows'>) {
  const labels = useCollectionLabels('vehicles.field');
  const { allData: types } = useVehicleTypes();
  // Cards: the vehicle drawn as a bus, red, in its type's dims (the `vehicles` query
  // carries none); dims the type lacks come from the standard bus.
  const busMedia = useMemo(() => {
    const byId = new Map(types.map(vt => [vt.id, vt]));
    return (v: Vehicle) => (
      <BusPicture
        dims={byId.get(v.transportType?.id ?? '') ?? {}}
        paint="vehicle"
        mode={vehicleMode(v)}
      />
    );
  }, [types]);
  return (
    <Collection
      columns={COLUMNS}
      card={CARD}
      cardMedia={busMedia}
      labels={labels}
      editHref={editHref}
      {...props}
    />
  );
}
