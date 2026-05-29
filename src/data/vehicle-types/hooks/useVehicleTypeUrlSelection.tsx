import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import VehicleTypeDetails from '../components/VehicleTypeDetails.tsx';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

interface UrlSelectionParams {
  allData: VehicleType[] | null;
  dataForTable: VehicleType[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
}

/**
 * VehicleType binding for the generic {@link useUrlEditorSelection} hook: param
 * key `selected`, row id is `vt.id` (already the full NeTEx id), editor is the
 * read-only `<VehicleTypeDetails>`. No `refetch`/`onSaved` — the sidebar renders
 * straight from the resolved list row and never mutates, so there is nothing to
 * refresh after.
 *
 * @param allData      Full dataset; `null` while the initial fetch is in flight.
 * @param dataForTable Current page slice (drives the deep-link page jump).
 * @param rowsPerPage  Page size, for the page-jump maths.
 * @param setPage      Pager setter.
 * @param loading      Whether the dataset fetch is in flight.
 */
export function useVehicleTypeUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
}: UrlSelectionParams): void {
  useUrlEditorSelection<VehicleType>({
    paramKey: VEHICLE_TYPE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading,
    getId: vt => vt.id,
    renderEditor: row => <VehicleTypeDetails vehicleType={row} />,
  });
}
