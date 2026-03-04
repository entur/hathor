// Auto-generated from entity file — do not edit manually
export type SimpleRef = string;
export type AllPublicTransportModesEnumeration =
  | 'all'
  | 'unknown'
  | 'bus'
  | 'trolleyBus'
  | 'tram'
  | 'coach'
  | 'rail'
  | 'intercityRail'
  | 'urbanRail'
  | 'metro'
  | 'air'
  | 'water'
  | 'cableway'
  | 'funicular'
  | 'snowAndIce'
  | 'taxi'
  | 'ferry'
  | 'lift'
  | 'selfDrive'
  | 'anyMode'
  | 'other';
export type PropulsionTypeEnumeration =
  | 'combustion'
  | 'electric'
  | 'electricAssist'
  | 'hybrid'
  | 'human'
  | 'other'
  | 'combustion'
  | 'electric'
  | 'electricAssist'
  | 'hybrid'
  | 'human'
  | 'other';
export type FuelTypeEnumeration =
  | 'battery'
  | 'biodiesel'
  | 'diesel'
  | 'dieselBatteryHybrid'
  | 'electricContact'
  | 'electricity'
  | 'ethanol'
  | 'hydrogen'
  | 'liquidGas'
  | 'tpg'
  | 'methane'
  | 'naturalGas'
  | 'petrol'
  | 'petrolBatteryHybrid'
  | 'petrolLeaded'
  | 'petrolUnleaded'
  | 'none'
  | 'other';

export interface My_VehicleType {
  // ── type ──
  name?: TextType[];
  shortName?: TextType[];
  description?: TextType[];
  privateCode?: PrivateCodeStructure;
  transportMode?: AllPublicTransportModesEnumeration;
  deckPlanRef?: SimpleRef;
  euroClass?: string;
  reversingDirection?: boolean;
  selfPropelled?: boolean;
  propulsionTypes?: PropulsionTypeEnumeration[];
  propulsionType?: PropulsionTypeEnumeration;
  fuelTypes?: FuelTypeEnumeration[];
  maximumRange?: number;
  maximumVelocity?: number;
  fuelType?: FuelTypeEnumeration;
  typeOfFuel?: FuelTypeEnumeration;
  passengerCapacity?: PassengerCapacityStructure;

  // ── core ──
  id?: string;
  includedIn?: SimpleRef;
  classifiedAsRef?: SimpleRef;
  facilities?: SimpleRef;
  monitored?: boolean;
  lowFloor?: boolean;
  hasLiftOrRamp?: boolean;
  hasHoist?: boolean;
  hoistOperatingRadius?: number;
  boardingHeight?: number;
  gapToPlatform?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  firstAxleHeight?: number;
  canCarry?: SimpleRef;
  canManoeuvre?: VehicleManoeuvringRequirements_STUB;
  satisfiesFacilityRequirements?: SimpleRef;

  // ── extra ──
  keyList?: KeyValueStructure[];
  privateCodes?: PrivateCodeStructure[];
  brandingRef?: SimpleRef;
  responsibilitySetRef?: SimpleRef;
}

export interface KeyValueStructure {
  key?: string;
  value?: string;
  typeOfKey?: string;
}

export interface PrivateCodeStructure {
  value?: string;
  type?: string;
}

export interface TextType {
  value?: string;
  lang?: string;
  textIdType?: string;
}

export interface PassengerCapacityStructure {
  fareClass?:
    | 'unknown'
    | 'firstClass'
    | 'secondClass'
    | 'thirdClass'
    | 'preferente'
    | 'premiumClass'
    | 'businessClass'
    | 'standardClass'
    | 'turista'
    | 'economyClass'
    | 'any';
  totalCapacity?: number;
  seatingCapacity?: number;
  standingCapacity?: number;
  specialPlaceCapacity?: number;
  pushchairCapacity?: number;
  wheelchairPlaceCapacity?: number;
  pramPlaceCapacity?: number;
  bicycleRackCapacity?: number;
}

export interface VehicleManoeuvringRequirements_STUB {
  reversible?: boolean;
  minimumTurningCircle?: number;
  minimumOvertakingWidth?: number;
  minimumLength?: number;
}
