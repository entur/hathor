// Field naming convention:
//   Elements: PascalCase matching XML tag name (e.g. Name, TransportMode)
//   Attributes: $ + camelCase XML attribute name (e.g. $id, $lang)

export type SimpleRef = string;
// _T is read by codegen AST, not at runtime
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Ref<_T extends string = string> = string;

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
  Name?: TextType[];
  ShortName?: TextType[];
  Description?: TextType[];
  PrivateCode?: PrivateCodeStructure;
  TransportMode?: AllPublicTransportModesEnumeration;
  DeckPlanRef?: Ref<'DeckPlan'>;
  EuroClass?: string;
  ReversingDirection?: boolean;
  SelfPropelled?: boolean;
  PropulsionTypes?: PropulsionTypeEnumeration[];
  PropulsionType?: PropulsionTypeEnumeration;
  FuelTypes?: FuelTypeEnumeration[];
  MaximumRange?: number;
  MaximumVelocity?: number;
  PassengerCapacity?: PassengerCapacityStructure;

  // ── core ──
  $id?: string;
  IncludedIn?: Ref<'VehicleType'>;
  ClassifiedAsRef?: Ref<'TypeOfVehicleType'>;
  Facilities?: SimpleRef;
  Monitored?: boolean;
  LowFloor?: boolean;
  HasLiftOrRamp?: boolean;
  HasHoist?: boolean;
  HoistOperatingRadius?: number;
  BoardingHeight?: number;
  GapToPlatform?: number;
  Length?: number;
  Width?: number;
  Height?: number;
  Weight?: number;
  FirstAxleHeight?: number;
  CanCarry?: SimpleRef;
  CanManoeuvre?: VehicleManoeuvringRequirements_STUB;
  SatisfiesFacilityRequirements?: SimpleRef;

  // ── extra ──
  KeyList?: KeyValueStructure[];
  PrivateCodes?: PrivateCodeStructure[];
  BrandingRef?: Ref<'Branding'>;
  $responsibilitySetRef?: Ref<'ResponsibilitySet'>;
}

export interface KeyValueStructure {
  Key?: string;
  Value?: string;
  $typeOfKey?: string;
}

export interface PrivateCodeStructure {
  Value?: string;
  $type?: string;
}

export interface TextType {
  Value?: string;
  $lang?: string;
  $textIdType?: string;
}

export interface PassengerCapacityStructure {
  FareClass?: (typeof FARE_CLASSES)[number];
  TotalCapacity?: number;
  SeatingCapacity?: number;
  StandingCapacity?: number;
  SpecialPlaceCapacity?: number;
  PushchairCapacity?: number;
  WheelchairPlaceCapacity?: number;
  PramPlaceCapacity?: number;
  BicycleRackCapacity?: number;
}

export interface VehicleManoeuvringRequirements_STUB {
  Reversible?: boolean;
  MinimumTurningCircle?: number;
  MinimumOvertakingWidth?: number;
  MinimumLength?: number;
}

// ── Type hints for normalize coercion ──

export type TypeHints = {
  booleans?: ReadonlySet<string>;
  numbers?: ReadonlySet<string>;
  enums?: Readonly<Record<string, readonly string[]>>;
  arrays?: ReadonlySet<string>;
  nested?: Readonly<Record<string, TypeHints>>;
};

export const PASSENGER_CAPACITY_HINTS: TypeHints = {
  numbers: new Set([
    'TotalCapacity',
    'SeatingCapacity',
    'StandingCapacity',
    'SpecialPlaceCapacity',
    'PushchairCapacity',
    'WheelchairPlaceCapacity',
    'PramPlaceCapacity',
    'BicycleRackCapacity',
  ]),
  enums: { FareClass: FARE_CLASSES },
};

export const MANOEUVRE_HINTS: TypeHints = {
  booleans: new Set(['Reversible']),
  numbers: new Set(['MinimumTurningCircle', 'MinimumOvertakingWidth', 'MinimumLength']),
};

export const VEHICLE_TYPE_HINTS: TypeHints = {
  arrays: new Set([
    'Name',
    'ShortName',
    'Description',
    'KeyList',
    'PrivateCodes',
    'PropulsionTypes',
    'FuelTypes',
  ]),
  booleans: new Set([
    'ReversingDirection',
    'SelfPropelled',
    'Monitored',
    'LowFloor',
    'HasLiftOrRamp',
    'HasHoist',
  ]),
  numbers: new Set([
    'MaximumRange',
    'MaximumVelocity',
    'HoistOperatingRadius',
    'BoardingHeight',
    'GapToPlatform',
    'Length',
    'Width',
    'Height',
    'Weight',
    'FirstAxleHeight',
  ]),
  enums: {
    TransportMode: TRANSPORT_MODES,
    PropulsionType: PROPULSION_TYPES,
  },
  nested: {
    PassengerCapacity: PASSENGER_CAPACITY_HINTS,
    CanManoeuvre: MANOEUVRE_HINTS,
  },
};
