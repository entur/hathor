import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CollectionShell from '../../../pages/shell/CollectionShell.tsx';
import { NEW_SELECTION } from '../../../hooks/useEntityEditor.ts';
import { netexText } from '../../netex/multilingualString.ts';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import NewEntityFab from '../../../components/NewEntityFab.tsx';
import { useVehicles } from '../hooks/useVehicles.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { VehicleCollection } from './vehicleCollectionConfig.tsx';

/** Collection route of vehicles under the page shell. */
export const VEHICLES_NEXT_PATH = `${NEXT_BASE}/vehicles`;

/**
 * `/next/vehicles` — the vehicle collection page: {@link CollectionShell} around the
 * org's vehicles, in grid or cards, each with an Edit link to its details page (#285).
 *
 * @returns {JSX.Element} The vehicle collection page.
 */
export default function VehicleCollectionPage() {
  const { t } = useTranslation();
  const { allData, loading, error } = useVehicles();
  const orgName = netexText(useOrganisationsContext().currentOrganisation?.name) ?? '';
  const newAction = (
    <NewEntityFab
      label={t('vehicles.actions.new')}
      shortLabel={t('common.new')}
      to={`${VEHICLES_NEXT_PATH}/${NEW_SELECTION}`}
      testid="create-vehicle-fab"
    />
  );

  return (
    <CollectionShell
      titleKey="vehicles.title"
      loading={loading}
      error={error}
      subtitle={[orgName, t('data.totalEntries', { count: allData.length })]
        .filter(Boolean)
        .join(' · ')}
      actions={newAction}
      empty={
        allData.length === 0 ? (
          <Stack spacing={2} alignItems="flex-start" data-testid="collection-empty">
            <Typography color="text.secondary">{t('vehicles.empty', { org: orgName })}</Typography>
            {newAction}
          </Stack>
        ) : undefined
      }
    >
      <VehicleCollection rows={allData} />
    </CollectionShell>
  );
}
