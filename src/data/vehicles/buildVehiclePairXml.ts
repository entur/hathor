import { buildPublicationDeliveryXml } from '../netex/publicationDeliveryXml';
import { vehicleToXmlShape } from './Vehicle-mapping';
import { vehicleModelToXmlShape } from './VehicleModel-mapping';
import type { VehicleEditFormValue } from './VehicleEditForm';

export function buildVehiclePairXml(form: VehicleEditFormValue): string {
  return buildPublicationDeliveryXml({
    vehicles: [vehicleToXmlShape(form.vehicle as Record<string, unknown>)],
    vehicleModels: [vehicleModelToXmlShape(form.model as Record<string, unknown>)],
  });
}
