import type { ParsedXml } from './types';

/** Normalise to array — handles single-element vs array in parsed XML. */
function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Combine an array of parsed Autosys PublicationDelivery objects into a single
 * PublicationDelivery structure with one merged ResourceFrame containing all
 * VehicleTypes, DeckPlans, VehicleModels, and Vehicles.
 */
export function pubDeliveryFromListV2(list: ParsedXml[]): ParsedXml {
  const resourceFrames = list
    .map(p => p.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame)
    .filter(Boolean);

  const vehicleTypes = resourceFrames.flatMap(rf => toArray(rf.vehicleTypes?.VehicleType));
  const deckPlans = resourceFrames.flatMap(rf => toArray(rf.deckPlans?.DeckPlan));
  const vehicleModels = resourceFrames.flatMap(rf => toArray(rf.vehicleModels?.VehicleModel));
  const vehicles = resourceFrames.flatMap(rf => toArray(rf.vehicles?.Vehicle));

  const firstFrame = list[0]?.PublicationDelivery?.dataObjects?.CompositeFrame;
  const frameDefaults = firstFrame?.FrameDefaults;

  return {
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    PublicationDelivery: {
      '@_xmlns': 'http://www.netex.org.uk/netex',
      '@_version': '1.12:NO-NeTEx-vehicle:1.4',
      PublicationTimestamp: new Date().toISOString(),
      ParticipantRef: 'NMR',
      dataObjects: {
        CompositeFrame: {
          '@_id': 'NMR:CompositeFrame:multi-import',
          '@_version': '1',
          ...(frameDefaults && { FrameDefaults: frameDefaults }),
          frames: {
            ResourceFrame: {
              '@_id': 'NMR:ResourceFrame:multi-import',
              '@_version': '1',
              ...(vehicleTypes.length > 0 && { vehicleTypes: { VehicleType: vehicleTypes } }),
              ...(deckPlans.length > 0 && { deckPlans: { DeckPlan: deckPlans } }),
              ...(vehicleModels.length > 0 && { vehicleModels: { VehicleModel: vehicleModels } }),
              ...(vehicles.length > 0 && { vehicles: { Vehicle: vehicles } }),
            },
          },
        },
      },
    },
  };
}
