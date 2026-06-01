import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import VehicleDetails from '../components/VehicleDetails.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';

interface UrlSelectionParams {
  allData: VehicleGQLShaped[] | null;
  dataForTable: VehicleGQLShaped[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
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
  loading,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<VehicleGQLShaped>({
    paramKey: VEHICLE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading,
    getId: v => v.id ?? '',
    renderEditor: row => <VehicleDetails vehicle={row} onSaved={refetch} />,
  });
}
