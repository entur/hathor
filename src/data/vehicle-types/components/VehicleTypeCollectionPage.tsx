import { useSearchParams } from 'react-router-dom';
import CollectionPage from '../../../pages/shell/CollectionPage.tsx';
import { useFocusEditId } from '../../../pages/shell/useFocusEditId.ts';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';
import { VehicleTypeCollection } from './vehicleTypeCollectionConfig.tsx';
import type { VehicleTypeKind } from '../types/vehicleTypeTypes.ts';
import { VEHICLE_TYPE_KIND_CONFIG } from '../utils/vehicleTypeKindConfig.ts';

/** Collection route of vehicle types under the page shell. */
export const VEHICLE_TYPES_PATH = VEHICLE_TYPE_KIND_CONFIG.PHYSICAL.path;

/** Query param an Autosys import lands with: the vehicle-type ids it wrote, comma-separated
 *  (`AutosysImportFloatingMenu`). */
export const VEHICLE_TYPE_FILTER_PARAM = 'filter';

/**
 * `/vehicle-types` (PHYSICAL) or `/contractual-vehicle-types` (CONTRACTUAL) — the vehicle-type
 * collection page: the org's vehicle types of that kind in grid or
 * cards, each with an Edit link to its details page. `?filter=<ids>` opens it narrowed to
 * those ids, as a chip; once the reader changes or removes it, the param goes too.
 *
 * @param {{ kind: VehicleTypeKind }} props The kind this route lists.
 * @returns {JSX.Element} The vehicle-type collection page.
 */
export default function VehicleTypeCollectionPage({ kind }: { kind: VehicleTypeKind }) {
  const { path, keys, newTestId } = VEHICLE_TYPE_KIND_CONFIG[kind];
  const { allData, loading, error } = useVehicleTypes(kind);
  const focusEditId = useFocusEditId();
  const [params, setParams] = useSearchParams();
  const filter = params.get(VEHICLE_TYPE_FILTER_PARAM);
  return (
    <CollectionPage
      listPath={path}
      keys={keys}
      newTestId={newTestId}
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
