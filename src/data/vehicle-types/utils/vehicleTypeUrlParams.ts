import { NEXT_BASE } from '../../../pages/shell/PageShell.tsx';

/** Query-param key on `/vehicle-types` driving the deep-link slider — mirrors `/vehicles` (see FORK_DECISIONS.md). */
export const VEHICLE_TYPE_SELECTED_PARAM = 'selected';

/** Build the `/vehicle-types?selected=<id>` href for a VehicleType row id. */
export const vehicleTypeSelectedHref = (id: string): string =>
  `/vehicle-types?${VEHICLE_TYPE_SELECTED_PARAM}=${encodeURIComponent(id)}`;

/** Build the vehicle type's form-page href, `/next/vehicle-types/<id>` (#285). */
export const vehicleTypeFormHref = (id: string): string =>
  `${NEXT_BASE}/vehicle-types/${encodeURIComponent(id)}`;
