import { XMLBuilder } from 'fast-xml-parser';

const NETEX_NAMESPACE = 'http://www.netex.org.uk/netex';
const PUBLICATION_VERSION = '1.0';
const RESOURCE_FRAME_ID = 'RF:1';
const RESOURCE_FRAME_VERSION = '1';
const DEFAULT_TIMEZONE = 'Europe/Oslo';
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

type XmlShape = Record<string, unknown>;

export interface ResourceFrameSlots {
  vehicles?: XmlShape[];
  vehicleModels?: XmlShape[];
  vehicleTypes?: XmlShape[];
}

const SLOT_ELEMENT: Record<keyof ResourceFrameSlots, string> = {
  vehicleTypes: 'VehicleType',
  vehicleModels: 'VehicleModel',
  vehicles: 'Vehicle',
};

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
  suppressEmptyNode: true,
});

export function buildPublicationDeliveryXml(rf: ResourceFrameSlots): string {
  const resourceFrame: XmlShape = {
    '@_id': RESOURCE_FRAME_ID,
    '@_version': RESOURCE_FRAME_VERSION,
    FrameDefaults: { DefaultLocale: { TimeZone: DEFAULT_TIMEZONE } },
  };
  for (const slot of Object.keys(SLOT_ELEMENT) as (keyof ResourceFrameSlots)[]) {
    const items = rf[slot];
    if (items && items.length > 0) {
      resourceFrame[slot] = { [SLOT_ELEMENT[slot]]: items };
    }
  }
  const tree: XmlShape = {
    PublicationDelivery: {
      '@_xmlns': NETEX_NAMESPACE,
      '@_version': PUBLICATION_VERSION,
      PublicationTimestamp: new Date().toISOString(),
      dataObjects: { ResourceFrame: resourceFrame },
    },
  };
  return `${XML_DECLARATION}\n${builder.build(tree)}`;
}
