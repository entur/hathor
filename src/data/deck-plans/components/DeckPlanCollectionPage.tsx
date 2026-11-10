import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { useFocusEditId } from '../../../pages/shell/useFocusEditId.ts';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import { useDeckPlans } from '../hooks/useDeckPlans.ts';
import { DeckPlanCollection } from './deckPlanCollectionConfig.tsx';

/** Collection route of deck plans under the page shell. */
export const DECK_PLANS_NEXT_PATH = `${NEXT_BASE}/deck-plans`;

/** The page's i18n keys. */
const KEYS = { title: 'deckPlans.title', new: 'deckPlans.actions.new', empty: 'deckPlans.empty' };

/**
 * `/next/deck-plans` — the deck-plan collection page: the org's deck plans in grid or cards,
 * each with an Edit link to its details page (#287).
 *
 * @returns {JSX.Element} The deck-plan collection page.
 */
export default function DeckPlanCollectionPage() {
  const { allData, loading, error } = useDeckPlans();
  const focusEditId = useFocusEditId();
  return (
    <CollectionPage
      listPath={DECK_PLANS_NEXT_PATH}
      keys={KEYS}
      newTestId="create-deck-plan-fab"
      count={allData.length}
      loading={loading}
      error={error}
    >
      <DeckPlanCollection rows={allData} focusEditId={focusEditId} />
    </CollectionPage>
  );
}
