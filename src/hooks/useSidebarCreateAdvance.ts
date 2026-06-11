import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Sidebar-create URL advance. After a successful save fired from the
 * `?selected=new` sidebar editor (Vehicle, VehicleType, …), the URL still
 * names `new`; refresh/copy-link reopens a blank create form and the
 * `useUrlEditorSelection` commit guard never re-resolves to the just-created
 * row. The returned callback rewrites `?<paramKey>=<newId>` via a replace-
 * history nav so the next render hits the resolved row.
 *
 * Returns `false` (and does NOT touch the URL) when `newId` is null/undefined
 * — a successful save that mints no id is a backend-invariant break, surfaced
 * by the caller as a save-error (the `common.saveNoIdReturned` snackbar).
 *
 * @param paramKey The feature's `?selected=` key (e.g. `VEHICLE_SELECTED_PARAM`).
 * @returns `(newId) => boolean` — `true` if advanced, `false` if no id.
 */
export function useSidebarCreateAdvance(
  paramKey: string
): (newId: string | null | undefined) => boolean {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    (newId: string | null | undefined): boolean => {
      if (!newId) return false;
      setSearchParams(
        params => {
          params.set(paramKey, newId);
          return params;
        },
        { replace: true }
      );
      return true;
    },
    [paramKey, setSearchParams]
  );
}
