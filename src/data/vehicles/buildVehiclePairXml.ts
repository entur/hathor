import { buildPublicationDeliveryXml } from '../netex/publicationDeliveryXml';
import { vehicleToXmlShape } from './Vehicle-mapping';
import { vehicleModelToXmlShape } from './VehicleModel-mapping';
import type { VehicleEditFormValue } from './VehicleEditForm';

/**
 * Compose a NeTEx PublicationDelivery from a Vehicle + VehicleModel form
 * pair. Each entity is shaped via its matching `*ToXmlShape` function and
 * embedded into its slot in the envelope; the builder runs `XMLBuilder.build`
 * exactly once over the full tree.
 *
 * VehicleModel emits only its unique fields per issue #69 — the form leaves
 * overlap fields (Name / Description / TransportTypeRef / BrandingRef /
 * ValidBetween) blank on the model side and the server collapses the inline
 * model under the 1-to-1 relationship.
 */
export function buildVehiclePairXml(form: VehicleEditFormValue): string {
  return buildPublicationDeliveryXml({
    vehicles: [vehicleToXmlShape(form.vehicle as Record<string, unknown>)],
    vehicleModels: [vehicleModelToXmlShape(form.model as Record<string, unknown>)],
  });
}
