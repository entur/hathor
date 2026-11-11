import i18next from 'i18next';
import {
  createEntityCollection,
  type CardSpec,
  type EntityCollectionProps,
} from '../../../components/collection/index.ts';
import { BusPicture } from '../../../components/bus-picture/index.ts';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { useCollectionLabels } from '../../../hooks/useCollectionLabels.ts';
import { useIsFeatureOn } from '../../../config/featureFlags.ts';
import { transportModeLabelKey } from '../../netex/transportMode.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import {
  vehicleTypeFields,
  vehicleTypeFilterFields,
  type VehicleTypeField,
} from '../types/vehicleTypeFields.ts';
import { vehicleTypeTitle } from '../utils/vehicleTypeTitle.ts';
import { deckPlanTitle } from '../../deck-plans/utils/deckPlanTitle.ts';

type Props = EntityCollectionProps<VehicleType, VehicleTypeField>;

const Collection = createEntityCollection(vehicleTypeFields, {
  filterFields: vehicleTypeFilterFields,
});

/** Name first, the id when it has none (U4); id second; then what tells two types apart at a glance. Captions
 *  come from `vehicleType.field.*` through the labels' `field`. */
const COLUMNS: NonNullable<Props['columns']> = [
  // Shown, not stored: sort and search still read the name.
  { field: 'name', render: vehicleTypeTitle },
  'id',
  {
    field: 'transportMode',
    // Icon + its text, not the icon alone (V4); search matches that text too.
    render: r =>
      r.transportMode && <TransportModeIcon mode={r.transportMode} iconPosition="left" />,
    text: r => (r.transportMode ? i18next.t(transportModeLabelKey(r.transportMode)) : ''),
  },
  // By name, its id when Sobek's name is blank (whitespace): a cell, not a gap; search matches it.
  {
    field: 'deckPlan',
    render: r => r.deckPlan && deckPlanTitle(r.deckPlan),
    text: r => (r.deckPlan ? deckPlanTitle(r.deckPlan) : ''),
  },
  'totalCapacity',
  'length',
  'lowFloor',
];

const CARD: CardSpec<VehicleTypeField> = {
  title: 'name',
  subtitle: 'id',
  fields: ['transportMode', 'deckPlan', 'totalCapacity'],
};

// `DeckPlans` off: no deck plan shown, in either view.
const isDeckPlan = (c: (typeof COLUMNS)[number]) =>
  (typeof c === 'string' ? c : c.field) === 'deckPlan';
const COLUMNS_NO_DECK_PLAN = COLUMNS.filter(c => !isDeckPlan(c));
const CARD_NO_DECK_PLAN = { ...CARD, fields: CARD.fields.filter(f => f !== 'deckPlan') };

// Cards: the type drawn as a bus, white; dims it lacks come from the standard bus.
// Not a bus or coach: a line of text instead.
const busMedia = (vt: VehicleType) => (
  <BusPicture dims={vt} paint="vehicleType" mode={vt.transportMode} />
);

// Relative: resolves under whichever route lists the collection.
const editHref = (vt: VehicleType) => encodeURIComponent(vt.id);

/**
 * The vehicle-type collection, wired once for the page and its story: field +
 * filter mapping, columns, card, bus picture, localized labels and an Edit link per record.
 *
 * @param {Partial<Props> & Pick<Props, 'rows'>} props rows, plus any override
 * @returns {JSX.Element} toolbar, grid and cards
 */
export function VehicleTypeCollection(props: Partial<Props> & Pick<Props, 'rows'>) {
  const labels = useCollectionLabels('vehicleType.field');
  const deckPlans = useIsFeatureOn()('DeckPlans');
  return (
    <Collection
      columns={deckPlans ? COLUMNS : COLUMNS_NO_DECK_PLAN}
      card={deckPlans ? CARD : CARD_NO_DECK_PLAN}
      cardMedia={busMedia}
      labels={labels}
      editHref={editHref}
      rowTitle={vehicleTypeTitle}
      {...props}
    />
  );
}
