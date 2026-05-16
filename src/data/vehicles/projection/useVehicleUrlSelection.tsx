import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEditing } from '../../../contexts/EditingContext.tsx';
import VehicleDetails from '../VehicleDetails.tsx';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleGQLShaped } from './vehicleGqlShaped.ts';

interface UrlSelectionParams {
  allData: VehicleGQLShaped[] | null;
  dataForTable: VehicleGQLShaped[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
}

/**
 * Reconciles the `/vehicle?selected=<id>` URL param with `EditingContext` and
 * pagination.
 *
 * **Wait for the initial fetch.** Cross-page nav (e.g. a chip on
 * `/vehicle-type` linking to `/vehicle?selected=…`) lands here while
 * `loading` is still `true` and `allData` is `[]`. Committing in that window
 * captures `vehicle=null` in the editor closure, and the idempotence guard
 * below then locks the slider on the not-found body forever.
 *
 * **Idempotence guard.** Once committed, `setEditingItem` only re-fires when
 * the resolved id changes — without this, fresh `allData`/`dataForTable`
 * references each render (e.g. from an unmemoised client-side sort) replace
 * `editingItem.EditorComponent` with a new closure, remount `VehicleDetails`,
 * and wipe its internal view/edit `mode` state on every render.
 */
export function useVehicleUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
}: UrlSelectionParams): void {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get(VEHICLE_SELECTED_PARAM);
  const { setEditingItem } = useEditing();

  const lastCommittedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selected) {
      if (lastCommittedIdRef.current !== null) {
        setEditingItem(null);
        lastCommittedIdRef.current = null;
      }
      return;
    }
    if (loading) return;
    if (allData === null) return;

    const idx = allData.findIndex(v => v.id === selected);
    const row = idx >= 0 ? allData[idx] : null;

    if (lastCommittedIdRef.current !== selected) {
      setEditingItem({
        id: selected,
        EditorComponent: () => <VehicleDetails vehicle={row} />,
      });
      lastCommittedIdRef.current = selected;
    }

    if (idx >= 0 && !dataForTable.some(v => v.id === selected)) {
      setPage(Math.floor(idx / rowsPerPage));
    }
  }, [selected, loading, allData, dataForTable, rowsPerPage, setPage, setEditingItem]);

  useEffect(() => {
    return () => {
      setEditingItem(null);
    };
  }, [setEditingItem]);
}
