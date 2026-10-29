import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Sidebar-create URL advance. After a successful save fired from the
 * `?selected=new` sidebar editor (Vehicle, VehicleType, …), the URL still
 * names `new`; refresh/copy-link would reopen a blank create form. The
 * returned callback rewrites `?<paramKey>=<newId>` via a replace-history nav
 * so the editor fetches the just-created record by id. A save that mints no id
 * never gets here: {@link useEntityEditor} warns instead.
 *
 * @param {string} paramKey - The feature's `?selected=` key (e.g. `VEHICLE_SELECTED_PARAM`).
 * @returns {(newId: string) => void} The URL advance.
 */
export function useSidebarCreateAdvance(paramKey: string): (newId: string) => void {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    (newId: string) =>
      setSearchParams(
        params => {
          params.set(paramKey, newId);
          return params;
        },
        { replace: true }
      ),
    [paramKey, setSearchParams]
  );
}
