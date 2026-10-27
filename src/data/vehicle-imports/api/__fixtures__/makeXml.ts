interface BulkVehicle {
  reg: string;
  vehicleTypeId?: string;
  vehicleModelId?: string;
  deckPlanId?: string;
}

interface MakeBulkXmlOptions {
  vehicles?: BulkVehicle[];
  /** Failed plates, serialised the way shepet does: indexed `fetchError-*` KeyValues. */
  errors?: { reg: string; message: string }[];
}

const uniq = (ids: (string | undefined)[]) => [...new Set(ids.filter(Boolean))] as string[];

const keyValue = (key: string, value: string) =>
  `<KeyValue><Key>${key}</Key><Value>${value}</Value></KeyValue>`;

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
  const keyList = errors.length
    ? `<keyList>${errors
        .map(
          (e, i) =>
            keyValue(`fetchError-registrationNumber-${i}`, e.reg) +
            keyValue(`fetchError-message-${i}`, e.message)
        )
        .join('')}</keyList>`
    : '';
  const section = (wrapper: string, element: string, ids: string[]) =>
    ids.length
      ? `<${wrapper}>${ids.map(id => `<${element} version="1" id="${id}"/>`).join('')}</${wrapper}>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <ResourceFrame version="1" id="NMR:ResourceFrame:1">
      ${keyList}
      ${section('vehicleTypes', 'VehicleType', uniq(vs.map(v => v.vehicleTypeId)))}
      ${section('deckPlans', 'DeckPlan', uniq(vs.map(v => v.deckPlanId)))}
      ${section('vehicleModels', 'VehicleModel', uniq(vs.map(v => v.vehicleModelId)))}
      ${
        vs.length
          ? `<vehicles>${vs
              .map(
                v =>
                  `<Vehicle version="1" id="AUTOSYS:Vehicle:${v.reg}"><RegistrationNumber>${v.reg}</RegistrationNumber></Vehicle>`
              )
              .join('')}</vehicles>`
          : ''
      }
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;
}
