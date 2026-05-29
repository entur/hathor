export type Name = {
  value: string;
  lang?: string;
};

export type DeckPlan = {
  id: string;
  name?: Name;
};

export type Vehicle = {
  id: string;
  registrationNumber: string;
  version: number;
};

export const TRANSPORT_MODE = [
  'ALL',
  'AIR',
  'ANY_MODE',
  'BUS',
  'CABLEWAY',
  'COACH',
  'FERRY',
  'FUNICULAR',
  'INTERCITY_RAIL',
  'LIFT',
  'METRO',
  'OTHER',
  'RAIL',
  'SELF_DRIVE',
  'SNOW_AND_ICE',
  'TAXI',
  'TRAM',
  'TROLLEY_BUS',
  'UNKNOWN',
  'URBAN_RAIL',
  'WATER',
] as const;
export type TransportMode = (typeof TRANSPORT_MODE)[number];

export const PROPULSION_TYPE = [
  'COMBUSTION',
  'ELECTRIC',
  'ELECTRIC_ASSIST',
  'HYBRID',
  'HUMAN',
  'OTHER',
] as const;
export type PropulsionType = (typeof PROPULSION_TYPE)[number];

export const FUEL_TYPE = [
  'PETROL',
  'PETROL_LEADED',
  'PETROL_UNLEADED',
  'DIESEL',
  'ELECTRICITY',
  'BATTERY',
  'ELECTRIC_CONTACT',
  'DIESEL_BATTERY_HYBRID',
  'PETROL_BATTERY_HYBRID',
  'HYDROGEN',
  'BIODIESEL',
  'NATURAL_GAS',
  'LIQUID_GAS',
  'METHANE',
  'TPG',
  'ETHANOL',
  'OTHER',
  'NONE',
] as const;
export type FuelType = (typeof FUEL_TYPE)[number];

export const HYBRID_CATEGORY = ['CHARGEABLE', 'NONCHARGEABLE'] as const;
export type HybridCategory = (typeof HYBRID_CATEGORY)[number];

export const FARE_CLASS = [
  'UNKNOWN',
  'FIRST_CLASS',
  'SECOND_CLASS',
  'THIRD_CLASS',
  'PREFERENTE',
  'PREMIUM_CLASS',
  'BUSINESS_CLASS',
  'STANDARD_CLASS',
  'TURISTA',
  'ECONOMY_CLASS',
  'ANY',
] as const;
export type FareClass = (typeof FARE_CLASS)[number];

export type PassengerCapacity = {
  fareClass?: FareClass;
  specialPlaceCapacity?: number;
  totalCapacity?: number;
  seatingCapacity?: number;
  standingCapacity?: number;
  pushchairCapacity?: number;
  wheelchairPlaceCapacity?: number;
  pramPlaceCapacity?: number;
  bicycleRackCapacity?: number;
};

export type VehicleType = {
  id: string;
  version: number;
  name?: Name;
  shortName?: Name;
  description?: Name;
  transportMode?: string;
  deckPlan?: DeckPlan;
  privateCode?: PrivateCode;
  length: number;
  width: number;
  height: number;
  created?: string;
  changed?: string;
  changedBy?: string;
  vehicles?: Vehicle[];
  euroClass?: string;
  propulsionTypes?: PropulsionType[];
  fuelTypes?: FuelType[];
  passengerCapacity?: PassengerCapacity;
  formDragCoefficient?: number;
  rollResistanceCoefficient?: number;
  maximumEngineEffectKW?: number;
  maximumVelocity?: number;
  maximumRange?: number;
  weight?: number;
  lowFloor?: boolean;
  selfPropelled?: boolean;
  hybridCategory?: HybridCategory;
};

export type PrivateCode = {
  value?: string;
  type?: string;
};

export type VehicleTypeContext = {
  vehicleTypes: VehicleType[];
};

export type NeTExPassengerCapacity = {
  StandingCapacity?: number;
  SeatingCapacity?: number;
};

export type NeTExVehicleType = {
  id: string;
  PassengerCapacity: NeTExPassengerCapacity;
  Name: {
    value: string;
  };
  Length: number;
  Width: number;
  Height: number;
  FuelTypes?: string;
  DeckPlan?: {
    id: string;
    Description?: string;
    Name?: {
      value: string;
    };
  };
};

export type NeTExVehicleTypes = {
  VehicleType: NeTExVehicleType;
};

export type NeTExResourceFrame = {
  id: string;
  vehicleTypes: NeTExVehicleTypes;
  deckPlans?: {
    DeckPlan: {
      id: string;
      Description?: string;
      Name?: string;
    };
  };
  vehicles?: {
    Vehicle: {
      RegistrationNumber: string;
    };
  };
};
