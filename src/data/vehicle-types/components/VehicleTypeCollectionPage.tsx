import { Button, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CollectionShell from '../../../pages/shell/CollectionShell.tsx';
import type { DetailsLinkState } from '../../../pages/shell/EntityDetailsShell.tsx';
import { NEW_SELECTION } from '../../../hooks/useEntityEditor.ts';
import { netexText } from '../../netex/multilingualString.ts';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import NewEntityFab from '../../../components/NewEntityFab.tsx';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';

/** Collection route of vehicle types under the page shell. */
export const VEHICLE_TYPES_NEXT_PATH = `${NEXT_BASE}/vehicle-types`;

const EDIT_LINK_STATE: DetailsLinkState = { initialMode: 'edit' };

/**
 * `/next/vehicle-types` — the vehicle-type collection page: {@link CollectionShell}
 * around the org's vehicle types, each with an Edit link to its details page.
 *
 * @returns {JSX.Element} The vehicle-type collection page.
 */
export default function VehicleTypeCollectionPage() {
  const { t } = useTranslation();
  const { allData, loading, error } = useVehicleTypes();

  return (
    <CollectionShell
      titleKey="vehicleType.title"
      loading={loading}
      error={error}
      actions={
        <NewEntityFab
          label={t('vehicleTypes.actions.new')}
          to={`${VEHICLE_TYPES_NEXT_PATH}/${NEW_SELECTION}`}
          testid="create-vehicle-type-fab"
        />
      }
    >
      {/* shortcut: stand-in list, replaced by the EntityCollection port (#252 pri 2) */}
      <List dense data-testid="collection-list">
        {allData.map(vt => (
          <ListItem
            key={vt.id}
            secondaryAction={
              <Button
                component={Link}
                to={encodeURIComponent(vt.id)}
                state={EDIT_LINK_STATE}
                data-testid="collection-edit"
              >
                {t('edit')}
              </Button>
            }
          >
            <ListItemText primary={netexText(vt.name) ?? t('common.unnamed')} secondary={vt.id} />
          </ListItem>
        ))}
      </List>
    </CollectionShell>
  );
}
