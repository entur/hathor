import type { DeckPlan } from '../../deck-plans/types/deckPlanTypes.ts';
import type { MultilingualString } from '../../netex/multilingualString.ts';
import type { TransportMode } from '../../netex/transportMode.ts';

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

/** Sobek `VehicleTypeKind` enum — fixed at creation; vehicles may only refer to PHYSICAL. */
export const VEHICLE_TYPE_KINDS = ['PHYSICAL', 'CONTRACTUAL'] as const;

/** Sobek `VehicleTypeSubtype` — fixed at creation; an update must repeat it (omitted = VEHICLE_TYPE). */
export const VEHICLE_TYPE_SUBTYPES = [
  'VEHICLE_TYPE',
  'TRAIN',
  'COMPOUND_TRAIN',
  'TRAIN_ELEMENT',
] as const;
/** Sobek `TrainSize`. */
export const TRAIN_SIZES = ['NORMAL', 'SHORT', 'LONG'] as const;
/** Sobek `TrainElementType`. */
export const TRAIN_ELEMENT_TYPES = [
  'BUFFET_CAR',
  'CARRIAGE',
  'ENGINE',
  'CAR_TRANSPORTER',
  'LARGE_VEHICLE_TRANSPORTER',
  'SLEEPER_CARRIAGE',
  'LUGGAGE_VAN',
  'RESTAURANT_CARRIAGE',
  'OTHER',
] as const;
/** Sobek `VehicleOrientation`. */
export const VEHICLE_ORIENTATIONS = ['FORWARDS', 'BACKWARDS', 'UNKNOWN'] as const;
/** Sobek `ThroughAccess`. */
export const THROUGH_ACCESSES = ['NO_THROUGH_ACCESS', 'OPEN_ENTRANCE', 'DOOR', 'UNKNOWN'] as const;

export type PropulsionType = (typeof PROPULSION_TYPES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];
export type HybridCategory = (typeof HYBRID_CATEGORIES)[number];
export type VehicleTypeKind = (typeof VEHICLE_TYPE_KINDS)[number];
export type VehicleTypeSubtype = (typeof VEHICLE_TYPE_SUBTYPES)[number];
export type TrainSize = (typeof TRAIN_SIZES)[number];
export type TrainElementType = (typeof TRAIN_ELEMENT_TYPES)[number];
export type VehicleOrientation = (typeof VEHICLE_ORIENTATIONS)[number];
export type ThroughAccess = (typeof THROUGH_ACCESSES)[number];

/** Sobek `TrainComponentInput`: a train element in its position (the list order). */
export type TrainComponentInput = {
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  trainElement: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
  forwardCouplingThroughAccess?: ThroughAccess | null;
};

/** Sobek `TrainInCompoundTrainInput`: a train in its position (the list order). */
export type TrainInCompoundTrainInput = {
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  train: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
};

/**
 * A train's, compound train's or train element's own fields, held as Sobek's input takes them.
 * Hathor neither shows nor edits them; a save is a full-document replace, so they go back as read.
 */
export type TrainParts = {
  numberOfCars?: number | null;
  trainSizeType?: TrainSize | null;
  trainElementType?: TrainElementType | null;
  trainComponents?: TrainComponentInput[] | null;
  compoundTrainComponents?: TrainInCompoundTrainInput[] | null;
};

/** The default kind: what vehicles refer to, and what the import and the vehicle type picker use
 *  (GraphQL filter + input, NeTEx import param). CONTRACTUAL types have their own pages. */
export const VEHICLE_TYPE_KIND: VehicleTypeKind = 'PHYSICAL';

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
  /** Undefined on a create: Sobek defaults to VEHICLE_TYPE. */
  subtype?: VehicleTypeSubtype;
  /** Set only for the train subtypes; sent back untouched on save. */
  train?: TrainParts;
  name?: MultilingualString;
  shortName?: MultilingualString;
  description?: MultilingualString;
  transportMode?: TransportMode;
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
  vehicles?: {
    id: string;
    registrationNumber: string;
    operationalNumber?: string;
    version: number;
  }[];
};

export type VehicleTypeContext = {
  vehicleTypes: VehicleType[];
};
