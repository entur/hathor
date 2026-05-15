import { ActualVehicleEquipment } from '../../../../actualVehicleEquipment';
import { Centroid as GeneralCentroid } from '../../../../centroid';
import { Name as GeneralName } from '../../../../general';
export declare class PassengerEntrance {
  static xmlTagName: string;
  attr_id: string;
  attr_version: string;
  Name: GeneralName | undefined;
  Label: string | undefined;
  Width: number | undefined;
  Height: number | undefined;
  actualVehicleEquipments: ActualVehicleEquipment[];
  PublicUse: boolean | undefined;
  VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
  SequenceFromFront: number | undefined;
  HeightFromGround: number | undefined;
  DeckEntranceType: 'external' | 'internal' | undefined;
  IsEmergencyExit: boolean | undefined;
  HasDoor: boolean | undefined;
  IsAutomatic: boolean | undefined;
  Centroid: GeneralCentroid | undefined;
  constructor({
    attr_id,
    attr_version,
    Name,
    Label,
    Width,
    Height,
    actualVehicleEquipments,
    PublicUse,
    VehicleSide,
    SequenceFromFront,
    HeightFromGround,
    DeckEntranceType,
    IsEmergencyExit,
    HasDoor,
    IsAutomatic,
    Centroid,
  }: {
    attr_id: string;
    attr_version: string;
    Name: {
      text_value: string;
    };
    Label:
      | {
          text_value: string;
        }
      | undefined;
    Width:
      | {
          text_value: number;
        }
      | undefined;
    Height:
      | {
          text_value: number;
        }
      | undefined;
    actualVehicleEquipments: {
      ActualVehicleEquipment: any[];
    };
    PublicUse:
      | {
          text_value: boolean;
        }
      | undefined;
    VehicleSide:
      | {
          text_value: 'rightSide' | 'leftSide' | 'front' | 'back';
        }
      | undefined;
    SequenceFromFront:
      | {
          text_value: number;
        }
      | undefined;
    HeightFromGround:
      | {
          text_value: number;
        }
      | undefined;
    DeckEntranceType:
      | {
          text_value: 'external' | 'internal';
        }
      | undefined;
    IsEmergencyExit:
      | {
          text_value: boolean;
        }
      | undefined;
    HasDoor:
      | {
          text_value: boolean;
        }
      | undefined;
    IsAutomatic:
      | {
          text_value: boolean;
        }
      | undefined;
    Centroid: any | undefined;
  });
  toXML(): {
    attr_id: string;
    attr_version: string;
    Name:
      | {
          text_value: string;
        }
      | undefined;
    Label: string | undefined;
    Width: number | undefined;
    Height: number | undefined;
    actualVehicleEquipments: {
      ActualVehicleEquipment: object[];
    };
    PublicUse: boolean | undefined;
    VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined;
    SequenceFromFront: number | undefined;
    HeightFromGround: number | undefined;
    DeckEntranceType: 'external' | 'internal' | undefined;
    IsEmergencyExit: boolean | undefined;
    HasDoor: boolean | undefined;
    IsAutomatic: boolean | undefined;
    Centroid:
      | {
          Location: {
            pos: string;
          };
        }
      | undefined;
  };
  getShape(
    scale: number,
    deckLength: number,
    deckWidth: number
  ): {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    draggable: boolean;
  };
}
export declare class PassengerEntranceRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
