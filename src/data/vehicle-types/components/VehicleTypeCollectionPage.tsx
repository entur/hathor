import { useSearchParams } from 'react-router-dom';
import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { useFocusEditId } from '../../../pages/shell/useFocusEditId.ts';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';
import { VehicleTypeCollection } from './vehicleTypeCollectionConfig.tsx';

/** Collection route of vehicle types under the page shell. */
export const VEHICLE_TYPES_PATH = `/vehicle-types`;

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
 * `/vehicle-types` — the vehicle-type collection page: the org's vehicle types in grid or
 * cards, each with an Edit link to its details page. `?filter=<ids>` opens it narrowed to
 * those ids, as a chip; once the reader changes or removes it, the param goes too.
 *
 * @returns {JSX.Element} The vehicle-type collection page.
 */
export default function VehicleTypeCollectionPage() {
  const { allData, loading, error } = useVehicleTypes();
  const focusEditId = useFocusEditId();
  const [params, setParams] = useSearchParams();
  const filter = params.get(VEHICLE_TYPE_FILTER_PARAM);
  return (
    <CollectionPage
      listPath={VEHICLE_TYPES_PATH}
      keys={KEYS}
      newTestId="create-vehicle-type-fab"
      count={allData.length}
      loading={loading}
      error={error}
    >
      <VehicleTypeCollection
        rows={allData}
        focusEditId={focusEditId}
        initialFilters={filter ? { id: filter } : undefined}
        onQueryChange={q => {
          // Read once on mount (`initialFilters`); a reload must not bring back what the reader changed.
          if (filter && q.filters.id !== filter)
            setParams(
              p => {
                p.delete(VEHICLE_TYPE_FILTER_PARAM);
                return p;
              },
              { replace: true }
            );
        }}
      />
    </CollectionPage>
  );
}
