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
import { transportModeLabelKey } from '../../netex/transportMode.ts';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { vehiclePictureMode, type Vehicle } from '../types/vehicle.ts';
import { vehicleFields, vehicleFilterFields, type VehicleField } from '../types/vehicleFields.ts';
import { vehicleTitle } from '../utils/vehicleTitle.ts';

type Props = EntityCollectionProps<Vehicle, VehicleField>;

const Collection = createEntityCollection(vehicleFields, { filterFields: vehicleFilterFields });

/** Name first, the registration number when it has none (U4); id second; then what tells
 *  two vehicles apart at a glance. Captions come from `vehicles.field.*`. */
const COLUMNS: Props['columns'] = [
  // Shown, not stored: sort and search still read the name (and reg no has its own column).
  { field: 'name', render: vehicleTitle },
  'id',
  'registrationNumber',
  'transportType',
  {
    field: 'transportMode',
    // Icon + its text, not the icon alone (V4); search matches that text too.
    // The stored mode, as filter and sort read it: none shows nothing, not "Unknown".
    render: v =>
      v.transportType?.transportMode && (
        <TransportModeIcon mode={v.transportType.transportMode} iconPosition="left" />
      ),
    text: v =>
      v.transportType?.transportMode
        ? i18next.t(transportModeLabelKey(v.transportType.transportMode))
        : '',
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
    return (v: Vehicle) => {
      const type = byId.get(v.transportType?.id ?? '');
      return <BusPicture dims={type ?? {}} paint="vehicle" mode={vehiclePictureMode(v, type)} />;
    };
  }, [types]);
  return (
    <Collection
      columns={COLUMNS}
      card={CARD}
      cardMedia={busMedia}
      labels={labels}
      editHref={editHref}
      rowTitle={vehicleTitle}
      {...props}
    />
  );
}
