import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import VehicleDetails from '../components/VehicleDetails.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import type { Vehicle } from '../types/vehicle.ts';

interface UrlSelectionParams {
  allData: Vehicle[] | null;
  dataForTable: Vehicle[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  /** List refetch, forwarded into `VehicleDetails` so a save can refresh the row. */
  refetch?: () => Promise<void>;
}

/**
 * Vehicle-specific binding for the generic
 * {@link useUrlEditorSelection} hook: param key `selected`, row id is
 * `v.id` (already the full NeTEx id), editor is `<VehicleDetails>` with
 * the list refetch wired to `onSaved`.
 */
export function useVehicleUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<Vehicle>({
    paramKey: VEHICLE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    getId: v => v.id ?? '',
    renderEditor: host => <VehicleDetails {...host} onSaved={refetch} />,
  });
}
