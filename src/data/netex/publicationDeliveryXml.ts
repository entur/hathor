/*
 * Compose a NeTEx PublicationDelivery envelope containing one ResourceFrame
 * whose entity containers are populated from a type-blind slot map. Replaces
 * the legacy string-template helper that lived at
 * `vehicle-imports/xmlUtils.ts::wrapInPublicationDelivery`.
 *
 * Slot items are already-shaped XMLBuilder objects produced by the matching
 * `*ToXmlShape(...)` function (e.g. `vehicleToXmlShape`, `vehicleModelToXmlShape`,
 * `vehicleTypeToXmlShape`). The builder is type-blind and does not import
 * from feature dirs — adding a new entity is a one-line slot definition.
 *
 * Envelope defaults (namespace, version, ResourceFrame@id, FrameDefaults
 * TimeZone) are carried forward verbatim from the legacy helper to preserve
 * compatibility with the VehicleType save path while it migrates.
 */
import { XMLBuilder } from 'fast-xml-parser';

const NETEX_NAMESPACE = 'http://www.netex.org.uk/netex';
const PUBLICATION_VERSION = '1.0';
const RESOURCE_FRAME_ID = 'RF:1';
const RESOURCE_FRAME_VERSION = '1';
const DEFAULT_TIMEZONE = 'Europe/Oslo';
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

/** Output of any `*ToXmlShape(...)` function — ready for fast-xml-parser's XMLBuilder. */
type XmlShape = Record<string, unknown>;

/** Map of NeTEx ResourceFrame slot → pre-shaped entity array. */
export interface ResourceFrameSlots {
  vehicles?: XmlShape[];
  vehicleModels?: XmlShape[];
  vehicleTypes?: XmlShape[];
}

/** Container key → child element key. Order here defines emission order in XML. */
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

/**
 * Compose a NeTEx PublicationDelivery for one or more entity slots.
 *
 * @param rf  Slot map; each populated slot becomes one `<container>` block
 *            inside `<ResourceFrame>`. Empty arrays are omitted from output.
 * @returns   Fully serialised NeTEx PublicationDelivery XML, including the
 *            `<?xml ?>` declaration.
 */
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
