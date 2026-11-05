import EntityDetailsShell from '../../../pages/shell/EntityDetailsShell.tsx';
import DeckPlanDetails from './DeckPlanDetails.tsx';
import { DECK_PLANS_NEXT_PATH } from './DeckPlanCollectionPage.tsx';

/**
 * `/next/deck-plans/:id` — one deck plan's editor as a full page (#287).
 *
 * @returns {JSX.Element} The deck-plan details page.
 */
export default function DeckPlanDetailsPage() {
  return (
    <EntityDetailsShell
      listPath={DECK_PLANS_NEXT_PATH}
      renderEditor={host => <DeckPlanDetails {...host} />}
    />
  );
}
