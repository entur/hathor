import { LocatableSpot } from './locatableSpot';
export declare class LuggageSpot extends LocatableSpot {
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
  toXML(): {
    attr_id: string;
    attr_version: string;
    Label: string | undefined;
    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined;
    actualVehicleEquipments: {
      ActualVehicleEquipment: object[];
    };
    SpotColumnRef:
      | {
          attr_ref: string;
          attr_version: string;
        }
      | undefined;
    SpotRowRef:
      | {
          attr_ref: string;
          attr_version: string;
        }
      | undefined;
  };
}
export declare class LuggageSpotRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
