import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import { useVehicles } from '../hooks/useVehicles.ts';
import { VehicleCollection } from './vehicleCollectionConfig.tsx';

/** Collection route of vehicles under the page shell. */
export const VEHICLES_NEXT_PATH = `${NEXT_BASE}/vehicles`;

/** The page's i18n keys. */
const KEYS = { title: 'vehicles.title', new: 'vehicles.actions.new', empty: 'vehicles.empty' };

/**
 * `/next/vehicles` — the vehicle collection page: the org's vehicles in grid or cards, each
 * with an Edit link to its details page (#285).
 *
 * @returns {JSX.Element} The vehicle collection page.
 */
export default function VehicleCollectionPage() {
  const { allData, loading, error } = useVehicles();
  return (
    <CollectionPage
      listPath={VEHICLES_NEXT_PATH}
      keys={KEYS}
      newTestId="create-vehicle-fab"
      count={allData.length}
      loading={loading}
      error={error}
    >
      <VehicleCollection rows={allData} />
    </CollectionPage>
  );
}
