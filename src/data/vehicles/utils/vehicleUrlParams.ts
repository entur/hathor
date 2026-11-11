/** Build the vehicle's form-page href, `/vehicles/<id>` (#285). */
export const vehicleFormHref = (id: string): string => `/vehicles/${encodeURIComponent(id)}`;
