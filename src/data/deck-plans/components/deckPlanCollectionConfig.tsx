import {
  createEntityCollection,
  type CardSpec,
  type EntityCollectionProps,
} from '../../../components/collection/index.ts';
import { useCollectionLabels } from '../../../hooks/useCollectionLabels.ts';
import { netexText } from '../../netex/multilingualString.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import {
  deckPlanFields,
  deckPlanFilterFields,
  type DeckPlanField,
} from '../types/deckPlanFields.ts';

type Props = EntityCollectionProps<DeckPlan, DeckPlanField>;

const Collection = createEntityCollection(deckPlanFields, { filterFields: deckPlanFilterFields });

/** Name first, the id when it has none (U4); then id and description. Captions come
 *  from `deckPlans.field.*`. */
const COLUMNS: Props['columns'] = [
  // Shown, not stored: sort and search still read the name.
  { field: 'name', render: dp => netexText(dp.name)?.trim() || dp.id },
  'id',
  'description',
];

/** Text only: drawing the decks needs one XML read per plan (#287). */
const CARD: CardSpec<DeckPlanField> = { title: 'name', subtitle: 'id', fields: ['description'] };

// Relative: resolves under whichever route lists the collection.
const editHref = (dp: DeckPlan) => encodeURIComponent(dp.id);

/**
 * The deck-plan collection, wired once for the page and its story: field + filter
 * mapping, columns, card, localized labels and an Edit link per record (#287).
 *
 * @param {Partial<Props> & Pick<Props, 'rows'>} props rows, plus any override
 * @returns {JSX.Element} toolbar, grid and cards
 */
export function DeckPlanCollection(props: Partial<Props> & Pick<Props, 'rows'>) {
  const labels = useCollectionLabels('deckPlans.field');
  return (
    <Collection columns={COLUMNS} card={CARD} labels={labels} editHref={editHref} {...props} />
  );
}
