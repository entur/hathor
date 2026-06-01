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
  operationalNumber?: string;
  version: number;
};

/** Sobek `PropulsionType` enum (wire form is SCREAMING_SNAKE). */
export const PROPULSION_TYPES = [
  'COMBUSTION',
  'ELECTRIC',
  'ELECTRIC_ASSIST',
  'HYBRID',
  'HUMAN',
  'OTHER',
] as const;

/** Sobek `FuelType` enum. */
export const FUEL_TYPES = [
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

/** Sobek `HybridCategory` enum. */
export const HYBRID_CATEGORIES = ['CHARGEABLE', 'NONCHARGEABLE'] as const;

export type PropulsionType = (typeof PROPULSION_TYPES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];
export type HybridCategory = (typeof HYBRID_CATEGORIES)[number];

/** Sobek `PassengerCapacity` — all counts optional. */
export type PassengerCapacity = {
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
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  lowFloor?: boolean;
  // Propulsion & performance (Edit tab)
  propulsionTypes?: PropulsionType[];
  fuelTypes?: FuelType[];
  selfPropelled?: boolean;
  euroClass?: string;
  maximumVelocity?: number;
  maximumRange?: number;
  // Environmental extras (Environment tab) — first-class in Sobek's schema
  formDragCoefficient?: number;
  rollResistanceCoefficient?: number;
  maximumEngineEffectKW?: number;
  hybridCategory?: HybridCategory;
  passengerCapacity?: PassengerCapacity;
  created?: string;
  changed?: string;
  changedBy?: string;
  vehicles?: Vehicle[];
};

export type VehicleTypeContext = {
  vehicleTypes: VehicleType[];
};
