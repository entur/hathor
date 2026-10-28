import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import VehicleDetails from '../components/VehicleDetails.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import type { Vehicle } from '../types/vehicle.ts';

interface UrlSelectionParams {
  allData: Vehicle[] | null;
  dataForTable: Vehicle[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
  /** List refetch, run (not awaited) after each committed write in `VehicleDetails`. */
  refetch?: () => Promise<void>;
}

/**
 * Vehicle-specific binding for the generic
 * {@link useUrlEditorSelection} hook: param key `selected`, row id is
 * `v.id` (already the full NeTEx id), editor is `<VehicleDetails>` — given
 * only the id, it loads its own record — with the list refetch fired from
 * `onWritten`. A failed list refetch is the list's to show, not the editor's.
 */
export function useVehicleUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<Vehicle>({
    paramKey: VEHICLE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading,
    getId: v => v.id ?? '',
    renderEditor: (id, mode) => (
      <VehicleDetails id={id} mode={mode} onWritten={() => void refetch?.().catch(() => {})} />
    ),
  });
}
