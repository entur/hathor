import { buildPublicationDeliveryXml } from '../../netex/publicationDeliveryXml';
import { vehicleToXmlShape } from '../types/Vehicle-mapping';
import { vehicleModelToXmlShape } from '../types/VehicleModel-mapping';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';

export function buildVehiclePairXml(form: VehicleEditFormValue): string {
  return buildPublicationDeliveryXml({
    vehicles: [vehicleToXmlShape(form.vehicle as Record<string, unknown>)],
    vehicleModels: [vehicleModelToXmlShape(form.model as Record<string, unknown>)],
  });
}
