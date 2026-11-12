import type { VehicleTypeKind } from '../types/vehicleTypeTypes.ts';

/** What differs between the PHYSICAL and the CONTRACTUAL vehicle-type pages: the route, the
 *  copy and the test ids. Everything else is shared. */
export interface VehicleTypeKindConfig {
  /** Collection route; the form page is `<path>/:id`. */
  path: string;
  /** i18n keys of the collection page (`CollectionPage` `keys`). */
  keys: { title: string; new: string; empty: string };
  /** i18n keys of the editor (`EditorFrame` `copy`). */
  copy: {
    title: string;
    notFound: string;
    saved: string;
    deactivateTitle: string;
    deactivateMessage: string;
  };
  newTestId: string;
  editorTestId: string;
  /** Vehicles may only refer to PHYSICAL types, so only those list theirs. */
  showVehicles: boolean;
}

export const VEHICLE_TYPE_KIND_CONFIG: Record<VehicleTypeKind, VehicleTypeKindConfig> = {
  PHYSICAL: {
    path: '/vehicle-types',
    keys: {
      title: 'vehicleType.title',
      new: 'vehicleTypes.actions.new',
      empty: 'vehicleTypes.empty',
    },
    copy: {
      title: 'vehicleType.detailsTitle',
      notFound: 'vehicleType.notFound',
      saved: 'vehicleType.saveSuccess',
      deactivateTitle: 'vehicleType.deactivateConfirmTitle',
      deactivateMessage: 'vehicleType.deactivateConfirmMessage',
    },
    newTestId: 'create-vehicle-type-fab',
    editorTestId: 'vehicle-type',
    showVehicles: true,
  },
  CONTRACTUAL: {
    path: '/contractual-vehicle-types',
    keys: {
      title: 'contractualVehicleType.title',
      new: 'contractualVehicleTypes.actions.new',
      empty: 'contractualVehicleTypes.empty',
    },
    copy: {
      title: 'contractualVehicleType.detailsTitle',
      notFound: 'contractualVehicleType.notFound',
      saved: 'contractualVehicleType.saveSuccess',
      deactivateTitle: 'contractualVehicleType.deactivateConfirmTitle',
      deactivateMessage: 'contractualVehicleType.deactivateConfirmMessage',
    },
    newTestId: 'create-contractual-vehicle-type-fab',
    editorTestId: 'contractual-vehicle-type',
    showVehicles: false,
  },
};
