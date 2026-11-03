import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import VehicleTypeDetails from '../components/VehicleTypeDetails.tsx';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

interface UrlSelectionParams {
  allData: VehicleType[] | null;
  dataForTable: VehicleType[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  /** List refetch, forwarded into `VehicleTypeDetails` so a save can refresh the row. */
  refetch?: () => Promise<void>;
}

/**
 * VehicleType binding for the generic {@link useUrlEditorSelection} hook: param
 * key `selected`, row id is `vt.id` (already the full NeTEx id), editor is
 * `<VehicleTypeDetails>` with the list `refetch` wired to `onSaved` so a save
 * refreshes the table.
 *
 * @param allData      Full dataset; `null` while the initial fetch is in flight.
 * @param dataForTable Current page slice (drives the deep-link page jump).
 * @param rowsPerPage  Page size, for the page-jump maths.
 * @param setPage      Pager setter.
 * @param refetch      List refetch, forwarded as the editor's `onSaved`.
 */
export function useVehicleTypeUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<VehicleType>({
    paramKey: VEHICLE_TYPE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    getId: vt => vt.id,
    renderEditor: host => <VehicleTypeDetails {...host} onSaved={refetch} />,
  });
}
