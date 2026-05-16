/** Query-param key on `/vehicles` driving the deep-link slider — see FORK_DECISIONS.md. */
export const VEHICLE_SELECTED_PARAM = 'selected';

/** Build the `/vehicles?selected=<id>` href for a Vehicle row id. */
export const vehicleSelectedHref = (id: string): string =>
  `/vehicles?${VEHICLE_SELECTED_PARAM}=${encodeURIComponent(id)}`;
