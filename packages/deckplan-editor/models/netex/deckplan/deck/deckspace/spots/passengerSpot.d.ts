import { Centroid as GeneralCentroid } from '../../../../centroid';
import { PassengerSpotAvailability } from '../../../../../view/seats';
import { LocatableSpot } from './locatableSpot';
export declare class PassengerSpot extends LocatableSpot {
  static xmlTagName: string;
  IsByWindow: boolean | undefined;
  IsByAisle: boolean | undefined;
  IsBetweenSeats: boolean | undefined;
  IsInFrontRow: boolean | undefined;
  IsInEndRow: boolean | undefined;
  TableType: string | undefined;
  HasPower: boolean | undefined;
  Centroid: GeneralCentroid | undefined;
  Width: number;
  Length: number;
  availability: undefined | PassengerSpotAvailability;
  constructor({
    attr_id,
    attr_version,
    Label,
    Orientation,
    actualVehicleEquipments,
    SpotColumnRef,
    SpotRowRef,
    IsByWindow,
    IsByAisle,
    IsBetweenSeats,
    IsInFrontRow,
    IsInEndRow,
    TableType,
    HasPower,
    Centroid,
    Width,
    Length,
  }: {
    attr_id: string;
    attr_version: string;
    Label: string;
    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards';
    actualVehicleEquipments: any[];
    SpotColumnRef: any;
    SpotRowRef: any;
    IsByWindow: boolean | undefined;
    IsByAisle: boolean | undefined;
    IsBetweenSeats: boolean | undefined;
    IsInFrontRow: boolean | undefined;
    IsInEndRow: boolean | undefined;
    TableType: string | undefined;
    HasPower: boolean | undefined;
    Centroid: any | undefined;
    Width: number | undefined;
    Length: number | undefined;
  });
  toXML(): {
    attr_id: string;
    attr_version: string;
    Label:
      | {
          text_value: string;
        }
      | undefined;
    Orientation:
      | {
          text_value: 'backwards' | 'forwards' | 'leftwards' | 'rightwards';
        }
      | undefined;
    actualVehicleEquipments: any;
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
    IsByWindow:
      | {
          text_value: true;
        }
      | undefined;
    IsByAisle:
      | {
          text_value: true;
        }
      | undefined;
    TableType:
      | {
          text_value: string;
        }
      | undefined;
    HasPower:
      | {
          text_value: true;
        }
      | undefined;
    Centroid:
      | {
          Location: {
            pos: string;
          };
        }
      | undefined;
    Width: number;
    Length: number;
  };
  getClasses(): string;
  getShape(scale: number):
    | {
        x: number;
        y: number;
        width: number;
        height: number;
        fill: string;
        stroke: string;
        strokeWidth: number;
        cornerRadius: number;
        draggable: boolean;
      }
    | {
        x: number;
        y: number;
        width: number;
        height: number;
        fill: string;
        draggable: boolean;
        stroke?: undefined;
        strokeWidth?: undefined;
        cornerRadius?: undefined;
      };
}
export declare class PassengerSpotRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
