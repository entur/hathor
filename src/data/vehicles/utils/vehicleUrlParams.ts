import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';

/** Query-param key on `/vehicles` driving the deep-link slider — see FORK_DECISIONS.md. */
export const VEHICLE_SELECTED_PARAM = 'selected';

/** Build the `/vehicles?selected=<id>` href for a Vehicle row id. */
export const vehicleSelectedHref = (id: string): string =>
  `/vehicles?${VEHICLE_SELECTED_PARAM}=${encodeURIComponent(id)}`;

/** Build the vehicle's form-page href, `/next/vehicles/<id>` (#285). */
export const vehicleFormHref = (id: string): string =>
  `${NEXT_BASE}/vehicles/${encodeURIComponent(id)}`;
