import { ActualVehicleEquipment } from '../../../../actualVehicleEquipment';
import { SpotColumnRef as GeneralSpotColumnRef } from '../../spotColumn';
import { SpotRowRef as GeneralSpotRowRef } from '../../spotRow';
export declare class LocatableSpot {
  attr_id: string;
  attr_version: string;
  Label: string | undefined;
  Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined;
  actualVehicleEquipments: ActualVehicleEquipment[];
  SpotColumnRef: GeneralSpotColumnRef | undefined;
  SpotRowRef: GeneralSpotRowRef | undefined;
  constructor({
    attr_id,
    attr_version,
    Label,
    Orientation,
    actualVehicleEquipments,
    SpotColumnRef,
    SpotRowRef,
  }: {
    attr_id: string;
    attr_version: string;
    Label: string | undefined;
    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined;
    actualVehicleEquipments: any[];
    SpotColumnRef: any;
    SpotRowRef: any;
  });
}
