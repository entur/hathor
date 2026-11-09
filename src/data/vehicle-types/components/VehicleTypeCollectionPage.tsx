import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';
import { VehicleTypeCollection } from './vehicleTypeCollectionConfig.tsx';

/** Collection route of vehicle types under the page shell. */
export const VEHICLE_TYPES_NEXT_PATH = `${NEXT_BASE}/vehicle-types`;

/** The page's i18n keys. */
const KEYS = {
  title: 'vehicleType.title',
  new: 'vehicleTypes.actions.new',
  empty: 'vehicleTypes.empty',
};

/**
 * `/next/vehicle-types` — the vehicle-type collection page: the org's vehicle types in grid or
 * cards, each with an Edit link to its details page.
 *
 * @returns {JSX.Element} The vehicle-type collection page.
 */
export default function VehicleTypeCollectionPage() {
  const { allData, loading, error } = useVehicleTypes();
  return (
    <CollectionPage
      listPath={VEHICLE_TYPES_NEXT_PATH}
      keys={KEYS}
      newTestId="create-vehicle-type-fab"
      count={allData.length}
      loading={loading}
      error={error}
    >
      <VehicleTypeCollection rows={allData} />
    </CollectionPage>
  );
}
