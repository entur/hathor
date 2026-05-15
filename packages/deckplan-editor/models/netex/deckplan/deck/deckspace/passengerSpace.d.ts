import { ActualVehicleEquipment } from '../../../actualVehicleEquipment';
import { DeckEntranceCouple } from './entrance/deckEntranceCouple';
import { DeckEntranceUsage } from './entrance/deckEntranceUsage';
import { DeckSpaceCapacity } from './deckSpaceCapacity';
import { Name as GeneralName } from '../../../general';
import { LuggageSpot, LuggageSpotRef } from './spots/luggageSpot';
import { PassengerEntrance } from './entrance/passengerEntrance';
import { PassengerSpot, PassengerSpotRef } from './spots/passengerSpot';
import { Polygon as GeneralPolygon } from '../../../polygon';
import { Centroid as GeneralCentroid } from '../../../centroid';
import { ServiceFacilitySetRef as GeneralServiceFacilitySetRef } from '../../../serviceFacilitySet';
export declare class PassengerSpace {
  static xmlTagName: string;
  attr_id: string;
  attr_version: string;
  Name: GeneralName | undefined;
  SmokingAllowed: boolean | undefined;
  StandingAllowed: boolean | undefined;
  PassengerSpaceType:
    | 'seatingArea'
    | 'passengerCabin'
    | 'vehicleArea'
    | 'luggageStore'
    | 'corridor'
    | 'restaurant'
    | 'toilet'
    | 'bathroom'
    | 'other'
    | undefined;
  passengerSpots: (PassengerSpot | PassengerSpotRef)[] | undefined;
  luggageSpots: (LuggageSpot | LuggageSpotRef)[] | undefined;
  deckEntrances: PassengerEntrance[] | undefined;
  deckEntranceUsage: DeckEntranceUsage[] | undefined;
  deckEntranceCouples: DeckEntranceCouple[] | undefined;
  deckSpaceCapacities: DeckSpaceCapacity[] | undefined;
  actualVehicleEquipments: ActualVehicleEquipment[] | undefined;
  ServiceFacilitySetRef: GeneralServiceFacilitySetRef | undefined;
  Centroid: GeneralCentroid | undefined;
  Polygon: GeneralPolygon | undefined;
  PublicUse: boolean | undefined;
  TotalCapacity: number | undefined;
  FareClass: string | undefined;
  AirConditioned: boolean | undefined;
  constructor({
    attr_id,
    attr_version,
    Name,
    SmokingAllowed,
    StandingAllowed,
    PassengerSpaceType,
    passengerSpots,
    luggageSpots,
    deckEntrances,
    deckEntranceUsage,
    deckEntranceCouples,
    deckSpaceCapacities,
    actualVehicleEquipments,
    ServiceFacilitySetRef,
    Centroid,
    Polygon,
    PublicUse,
    TotalCapacity,
    FareClass,
    AirConditioned,
  }: {
    attr_id: string;
    attr_version: string;
    Name: GeneralName | undefined;
    SmokingAllowed: boolean | undefined;
    StandingAllowed: boolean | undefined;
    PassengerSpaceType:
      | 'seatingArea'
      | 'passengerCabin'
      | 'vehicleArea'
      | 'luggageStore'
      | 'corridor'
      | 'restaurant'
      | 'toilet'
      | 'bathroom'
      | 'other'
      | undefined;
    passengerSpots:
      | {
          PassengerSpot: any[];
          PassengerSpotRef: any[];
        }
      | undefined;
    luggageSpots:
      | {
          LuggageSpot: any[];
          LuggageSpotRef: any[];
        }
      | undefined;
    deckEntrances:
      | {
          PassengerEntrance: any[];
        }
      | undefined;
    deckEntranceUsage:
      | {
          DeckEntranceUsage: any[];
        }
      | undefined;
    deckEntranceCouples:
      | {
          DeckEntranceCouple: any[];
        }
      | undefined;
    deckSpaceCapacities:
      | {
          DeckSpaceCapacity: any[];
        }
      | undefined;
    actualVehicleEquipments:
      | {
          ActualVehicleEquipment: any[];
        }
      | undefined;
    ServiceFacilitySetRef: any | undefined;
    Centroid: any | undefined;
    Polygon: any | undefined;
    PublicUse:
      | {
          text_value: boolean;
        }
      | undefined;
    TotalCapacity:
      | {
          text_value: number;
        }
      | undefined;
    FareClass:
      | {
          text_value: string;
        }
      | undefined;
    AirConditioned:
      | {
          text_value: boolean;
        }
      | undefined;
  });
  static createDefault(id: string): PassengerSpace;
  toXML(): {
    attr_id: string;
    attr_version: string;
    Name: GeneralName | undefined;
    SmokingAllowed: boolean | undefined;
    StandingAllowed: boolean | undefined;
    PassengerSpaceType:
      | 'seatingArea'
      | 'passengerCabin'
      | 'vehicleArea'
      | 'luggageStore'
      | 'corridor'
      | 'restaurant'
      | 'toilet'
      | 'bathroom'
      | 'other'
      | undefined;
    passengerSpots: any;
    luggageSpots: any;
    deckEntrances: any;
    deckEntranceUsage: any;
    deckEntranceCouples: any;
    deckSpaceCapacities: any;
    actualVehicleEquipments: any;
    ServiceFacilitySetRef:
      | {
          attr_ref: string;
          attr_version: string;
        }
      | undefined;
    Centroid:
      | {
          Location: {
            pos: string;
          };
        }
      | undefined;
    Polygon: object | undefined;
    PublicUse: boolean | undefined;
    TotalCapacity: number | undefined;
    FareClass: string | undefined;
    AirConditioned: boolean | undefined;
  };
}
