/** Build the vehicle type's form-page href, `/vehicle-types/<id>` (#285). */
export const vehicleTypeFormHref = (id: string): string =>
  `/vehicle-types/${encodeURIComponent(id)}`;
