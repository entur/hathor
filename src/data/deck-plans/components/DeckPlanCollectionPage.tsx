import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CollectionShell from '../../../pages/shell/CollectionShell.tsx';
import { NEW_SELECTION } from '../../../hooks/useEntityEditor.ts';
import { netexText } from '../../netex/multilingualString.ts';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import NewEntityFab from '../../../components/NewEntityFab.tsx';
import { useDeckPlans } from '../hooks/useDeckPlans.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { DeckPlanCollection } from './deckPlanCollectionConfig.tsx';

/** Collection route of deck plans under the page shell. */
export const DECK_PLANS_NEXT_PATH = `${NEXT_BASE}/deck-plans`;

/**
 * `/next/deck-plans` — the deck-plan collection page: {@link CollectionShell} around the
 * org's deck plans, in grid or cards, each with an Edit link to its details page (#287).
 *
 * @returns {JSX.Element} The deck-plan collection page.
 */
export default function DeckPlanCollectionPage() {
  const { t } = useTranslation();
  const { allData, loading, error } = useDeckPlans();
  const orgName = netexText(useOrganisationsContext().currentOrganisation?.name) ?? '';
  const newAction = (
    <NewEntityFab
      label={t('deckPlans.actions.new')}
      shortLabel={t('common.new')}
      to={`${DECK_PLANS_NEXT_PATH}/${NEW_SELECTION}`}
      testid="create-deck-plan-fab"
    />
  );

  return (
    <CollectionShell
      titleKey="deckPlans.title"
      loading={loading}
      error={error}
      subtitle={[orgName, t('data.totalEntries', { count: allData.length })]
        .filter(Boolean)
        .join(' · ')}
      actions={newAction}
      empty={
        allData.length === 0 ? (
          <Stack spacing={2} alignItems="flex-start" data-testid="collection-empty">
            <Typography color="text.secondary">{t('deckPlans.empty', { org: orgName })}</Typography>
            {newAction}
          </Stack>
        ) : undefined
      }
    >
      <DeckPlanCollection rows={allData} />
    </CollectionShell>
  );
}
