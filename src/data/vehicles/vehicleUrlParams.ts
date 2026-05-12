/** Query-param key on `/vehicle` driving the deep-link slider — see FORK_DECISIONS.md. */
export const VEHICLE_SELECTED_PARAM = 'selected';

/** Build the `/vehicle?selected=<id>` href for a Vehicle row id. */
export const vehicleSelectedHref = (id: string): string =>
  `/vehicle?${VEHICLE_SELECTED_PARAM}=${encodeURIComponent(id)}`;
