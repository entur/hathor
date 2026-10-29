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
  /** List refetch, run (not awaited) after each committed write in `VehicleTypeDetails`. */
  refetch?: () => Promise<void>;
}

/**
 * VehicleType binding for the generic {@link useUrlEditorSelection} hook: param
 * key `selected`, row id is `vt.id` (already the full NeTEx id), editor is
 * `<VehicleTypeDetails>` — given only the id, it loads its own record — with
 * the list refetch fired from `onWritten`. A failed list refetch is the list's
 * to show, not the editor's.
 *
 * @param allData      Full dataset; `null` while the initial fetch is in flight.
 * @param dataForTable Current page slice (drives the deep-link page jump).
 * @param rowsPerPage  Page size, for the page-jump maths.
 * @param setPage      Pager setter.
 * @param loading      Whether the dataset fetch is in flight.
 * @param refetch      List refetch, fired (not awaited) after each committed write.
 */
export function useVehicleTypeUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<VehicleType>({
    paramKey: VEHICLE_TYPE_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading,
    getId: vt => vt.id,
    renderEditor: id => <VehicleTypeDetails id={id} onWritten={() => refetch?.()} />,
  });
}
