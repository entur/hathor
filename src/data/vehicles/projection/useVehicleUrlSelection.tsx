import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEditing } from '../../../contexts/EditingContext.tsx';
import VehicleDetails from '../VehicleDetails.tsx';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
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
 * Reconciles the `/vehicles?selected=<id>` URL param with `EditingContext` and
 * pagination.
 *
 * **Wait for the initial fetch.** Cross-page nav (e.g. a chip on
 * `/vehicle-types` linking to `/vehicles?selected=…`) lands here while
 * `loading` is still `true` and `allData` is `[]`. Committing in that window
 * captures `vehicle=null` in the editor closure, and the idempotence guard
 * below then locks the slider on the not-found body forever.
 *
 * **Commit guard.** After the first commit, `setEditingItem` only re-fires
 * when the resolved id changes (a new deep-link) or when a previously
 * not-found row resolves to found on a later list refetch. Fresh
 * `allData`/`dataForTable` references each render (e.g. from an unmemoised
 * client-side sort) must NOT replace `editingItem.EditorComponent` — that
 * remounts `VehicleDetails` and wipes its view/edit `mode`. It also does not
 * re-fire on an already-found row's content change: a slider save bumps the
 * row's `version`, and remounting there drops the in-flight success snackbar.
 */
export function useVehicleUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
  refetch,
}: UrlSelectionParams): void {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get(VEHICLE_SELECTED_PARAM);
  const { setEditingItem } = useEditing();

  const lastCommittedIdRef = useRef<string | null>(null);
  const lastCommittedRowRef = useRef<VehicleGQLShaped | null>(null);

  useEffect(() => {
    if (!selected) {
      if (lastCommittedIdRef.current !== null) {
        setEditingItem(null);
        lastCommittedIdRef.current = null;
        lastCommittedRowRef.current = null;
      }
      return;
    }
    if (loading) return;
    if (allData === null) return;

    const idx = allData.findIndex(v => v.id === selected);
    const row = idx >= 0 ? allData[idx] : null;

    // Re-commit on a new deep-link, or when a row that was not-found resolves
    // to found after a list refetch (recovers a stale-list cross-page deep-
    // link). Deliberately NOT on an already-found row's content change — a
    // slider save bumps the row's `version`, and remounting the editor there
    // would wipe its view/edit `mode` and drop the in-flight success snackbar.
    const idChanged = lastCommittedIdRef.current !== selected;
    const resolvedFromMissing = lastCommittedRowRef.current === null && row !== null;
    if (idChanged || resolvedFromMissing) {
      setEditingItem({
        id: selected,
        EditorComponent: () => <VehicleDetails vehicle={row} onSaved={refetch} />,
      });
      lastCommittedIdRef.current = selected;
      lastCommittedRowRef.current = row;
    }

    if (idx >= 0 && !dataForTable.some(v => v.id === selected)) {
      setPage(Math.floor(idx / rowsPerPage));
    }
  }, [selected, loading, allData, dataForTable, rowsPerPage, setPage, setEditingItem, refetch]);

  useEffect(() => {
    return () => {
      setEditingItem(null);
    };
  }, [setEditingItem]);
}
