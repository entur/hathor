// Auto-generated from entity file initialy,
//  is now modifed to improve JSX/TSX interop as state

export type SimpleRef = string;

export const TRANSPORT_MODES = [
  'all',
  'unknown',
  'bus',
  'trolleyBus',
  'tram',
  'coach',
  'rail',
  'intercityRail',
  'urbanRail',
  'metro',
  'air',
  'water',
  'cableway',
  'funicular',
  'snowAndIce',
  'taxi',
  'ferry',
  'lift',
  'selfDrive',
  'anyMode',
  'other',
] as const;
export type AllPublicTransportModesEnumeration = (typeof TRANSPORT_MODES)[number];

export const PROPULSION_TYPES = [
  'combustion',
  'electric',
  'electricAssist',
  'hybrid',
  'human',
  'other',
] as const;
export type PropulsionTypeEnumeration = (typeof PROPULSION_TYPES)[number];

export const FUEL_TYPES = [
  'battery',
  'biodiesel',
  'diesel',
  'dieselBatteryHybrid',
  'electricContact',
  'electricity',
  'ethanol',
  'hydrogen',
  'liquidGas',
  'tpg',
  'methane',
  'naturalGas',
  'petrol',
  'petrolBatteryHybrid',
  'petrolLeaded',
  'petrolUnleaded',
  'none',
  'other',
] as const;
export type FuelTypeEnumeration = (typeof FUEL_TYPES)[number];

export const FARE_CLASSES = [
  'unknown',
  'firstClass',
  'secondClass',
  'thirdClass',
  'preferente',
  'premiumClass',
  'businessClass',
  'standardClass',
  'turista',
  'economyClass',
  'any',
] as const;

export interface VehicleType {
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
  //fuelType?: FuelTypeEnumeration; deprecated
  //typeOfFuel?: FuelTypeEnumeration; deprecated
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
  fareClass?: (typeof FARE_CLASSES)[number];
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
