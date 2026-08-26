/** Query-param key on `/vehicle-types` driving the deep-link slider — mirrors `/vehicles` (see FORK_DECISIONS.md). */
export const VEHICLE_TYPE_SELECTED_PARAM = 'selected';

/** Build the `/vehicle-types?selected=<id>` href for a VehicleType row id. */
export const vehicleTypeSelectedHref = (id: string): string =>
  `/vehicle-types?${VEHICLE_TYPE_SELECTED_PARAM}=${encodeURIComponent(id)}`;
