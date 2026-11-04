import i18next from 'i18next';
import {
  createEntityCollection,
  type CardSpec,
  type EntityCollectionProps,
} from '../../../components/collection/index.ts';
import { BusPicture } from '../../../components/bus-picture/index.ts';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { useCollectionLabels } from '../../../hooks/useCollectionLabels.ts';
import type { DetailsLinkState } from '../../../pages/shell/EntityDetailsShell.tsx';
import { transportModeLabelKey } from '../../netex/transportMode.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import {
  vehicleTypeFields,
  vehicleTypeFilterFields,
  type VehicleTypeField,
} from '../types/vehicleTypeFields.ts';

type Props = EntityCollectionProps<VehicleType, VehicleTypeField>;

const Collection = createEntityCollection(vehicleTypeFields, {
  filterFields: vehicleTypeFilterFields,
});

/** Name first, id second (U4); then what tells two types apart at a glance. Captions
 *  come from `vehicleType.field.*` through the labels' `field`. */
const COLUMNS: Props['columns'] = [
  'name',
  'id',
  {
    field: 'transportMode',
    // Icon + its text, not the icon alone (V4); search matches that text too.
    render: r =>
      r.transportMode && <TransportModeIcon mode={r.transportMode} iconPosition="left" />,
    text: r => (r.transportMode ? i18next.t(transportModeLabelKey(r.transportMode)) : ''),
  },
  'deckPlan',
  'totalCapacity',
  'length',
  'lowFloor',
];

const CARD: CardSpec<VehicleTypeField> = {
  title: 'name',
  subtitle: 'id',
  fields: ['transportMode', 'deckPlan', 'totalCapacity'],
};

// Cards: the type drawn as a bus, white; dims it lacks come from the standard bus.
// Not a bus or coach: a line of text instead.
const busMedia = (vt: VehicleType) => (
  <BusPicture dims={vt} paint="vehicleType" mode={vt.transportMode} />
);

// Relative: resolves under whichever route lists the collection.
const editHref = (vt: VehicleType) => encodeURIComponent(vt.id);
const EDIT_LINK_STATE: DetailsLinkState = { initialMode: 'edit' };

/**
 * The vehicle-type collection, wired once for the page and its story: field +
 * filter mapping, columns, card, bus picture, localized labels and an Edit link per record.
 *
 * @param {Partial<Props> & Pick<Props, 'rows'>} props rows, plus any override
 * @returns {JSX.Element} toolbar, grid and cards
 */
export function VehicleTypeCollection(props: Partial<Props> & Pick<Props, 'rows'>) {
  const labels = useCollectionLabels('vehicleType.field');
  return (
    <Collection
      columns={COLUMNS}
      card={CARD}
      cardMedia={busMedia}
      labels={labels}
      editHref={editHref}
      editState={EDIT_LINK_STATE}
      {...props}
    />
  );
}
