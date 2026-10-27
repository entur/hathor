/** Shepet's bulk `fetchError-message-<i>` codes (`FetchVehicleErrorCode`, entur/shepet#39). */
export const NOT_FOUND = 'NOT_FOUND',
  UPSTREAM_ERROR = 'UPSTREAM_ERROR';

interface BulkVehicle {
  reg: string;
  vehicleTypeId?: string;
  vehicleModelId?: string;
}

interface MakeBulkXmlOptions {
  vehicles?: BulkVehicle[];
  /** Failed plates, serialised the way shepet does: indexed `fetchError-*` KeyValues. */
  errors?: { reg: string; message: string }[];
}

const keyValue = (key: string, value: string) =>
  `<KeyValue><Key>${key}</Key><Value>${value}</Value></KeyValue>`;

/** `<wrapper>` holding one rendered child per item, or nothing for no items. */
const section = <T>(wrapper: string, items: T[], render: (item: T, i: number) => string) =>
  items.length ? `<${wrapper}>${items.map(render).join('')}</${wrapper}>` : '';

/** One empty `<element id>` per distinct id. */
const refs = (wrapper: string, element: string, ids: (string | undefined)[]) =>
  section(wrapper, [...new Set(ids.filter(Boolean))], id => `<${element} version="1" id="${id}"/>`);

/**
 * Shepet's bulk `PublicationDelivery` (entur/shepet#39): one flat ResourceFrame,
 * entities already deduplicated, per-plate failures in the frame's `keyList`.
 */
export function makeBulkXml({
  vehicles = [{ reg: 'AB1234' }],
  errors = [],
}: MakeBulkXmlOptions = {}): string {
  const vs = vehicles.map(v => ({
    vehicleTypeId: 'NMR:VehicleType:1',
    vehicleModelId: 'NMR:VehicleModel:1',
    ...v,
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <ResourceFrame version="1" id="NMR:ResourceFrame:1">
      ${section('keyList', errors, (e, i) => keyValue(`fetchError-registrationNumber-${i}`, e.reg) + keyValue(`fetchError-message-${i}`, e.message))}
      ${refs(
        'vehicleTypes',
        'VehicleType',
        vs.map(v => v.vehicleTypeId)
      )}
      ${refs(
        'vehicleModels',
        'VehicleModel',
        vs.map(v => v.vehicleModelId)
      )}
      ${section('vehicles', vs, v => `<Vehicle version="1" id="AUTOSYS:Vehicle:${v.reg}"><RegistrationNumber>${v.reg}</RegistrationNumber></Vehicle>`)}
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;
}
