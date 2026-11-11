import { useSearchParams } from 'react-router-dom';
import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { useFocusEditId } from '../../../pages/shell/useFocusEditId.ts';
import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';
import { VehicleTypeCollection } from './vehicleTypeCollectionConfig.tsx';

/** Collection route of vehicle types under the page shell. */
export const VEHICLE_TYPES_NEXT_PATH = `${NEXT_BASE}/vehicle-types`;

/** Query param an Autosys import lands with: the vehicle-type ids it wrote, comma-separated
 *  (`AutosysImportFloatingMenu`). */
export const VEHICLE_TYPE_FILTER_PARAM = 'filter';

/** The page's i18n keys. */
const KEYS = {
  title: 'vehicleType.title',
  new: 'vehicleTypes.actions.new',
  empty: 'vehicleTypes.empty',
};

/**
 * `/next/vehicle-types` — the vehicle-type collection page: the org's vehicle types in grid or
 * cards, each with an Edit link to its details page. `?filter=<ids>` opens it narrowed to
 * those ids, as a chip the reader can remove.
 *
 * @returns {JSX.Element} The vehicle-type collection page.
 */
export default function VehicleTypeCollectionPage() {
  const { allData, loading, error } = useVehicleTypes();
  const focusEditId = useFocusEditId();
  const filter = useSearchParams()[0].get(VEHICLE_TYPE_FILTER_PARAM);
  return (
    <CollectionPage
      listPath={VEHICLE_TYPES_NEXT_PATH}
      keys={KEYS}
      newTestId="create-vehicle-type-fab"
      count={allData.length}
      loading={loading}
      error={error}
    >
      {/* Keyed: a second import onto this page re-opens it on the new ids. */}
      <VehicleTypeCollection
        key={filter}
        rows={allData}
        focusEditId={focusEditId}
        initialFilters={filter ? { id: filter } : undefined}
      />
    </CollectionPage>
  );
}
