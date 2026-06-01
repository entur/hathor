import { fetchVehicleTypesRequest } from '../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type {
  VehicleTypeContext,
  VehicleType,
  Name,
  HybridCategory,
  PropulsionType,
  FuelType,
  PassengerCapacity,
  DeckPlan,
  Vehicle,
} from './types/vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';
import type { Page } from '../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../graphql/paginationTypes.ts';

export interface VehicleTypeWire {
  netexId: string;
  version?: number;
  name?: Name | null;
  shortName?: Name | null;
  description?: Name | null;
  transportMode?: string | null;
  length: number;
  width: number;
  height: number;
  weight?: number | null;
  lowFloor?: boolean | null;
  selfPropelled?: boolean | null;
  hybridCategory?: HybridCategory | null;
  euroClass?: string | null;
  propulsionTypes?: PropulsionType[] | null;
  fuelTypes?: FuelType[] | null;
  passengerCapacity?: PassengerCapacity | null;
  formDragCoefficient?: number | null;
  rollResistanceCoefficient?: number | null;
  maximumEngineEffectKW?: number | null;
  maximumVelocity?: number | null;
  maximumRange?: number | null;
  created?: string | null;
  changed?: string | null;
  changedBy?: string | null;
  deckPlan?: DeckPlan | null;
  vehicles?: Vehicle[] | null;
}

export const projectVehicleType = (vt: VehicleTypeWire): VehicleType => ({
  id: vt.netexId,
  version: vt.version || 0,
  name: vt.name ?? undefined,
  shortName: vt.shortName ?? undefined,
  description: vt.description ?? undefined,
  transportMode: vt.transportMode ?? undefined,
  length: vt.length,
  width: vt.width,
  height: vt.height,
  weight: vt.weight ?? undefined,
  lowFloor: vt.lowFloor ?? undefined,
  selfPropelled: vt.selfPropelled ?? undefined,
  hybridCategory: vt.hybridCategory ?? undefined,
  euroClass: vt.euroClass ?? undefined,
  propulsionTypes: vt.propulsionTypes ?? undefined,
  fuelTypes: vt.fuelTypes ?? undefined,
  passengerCapacity: vt.passengerCapacity
    ? {
        seatingCapacity: vt.passengerCapacity.seatingCapacity ?? undefined,
        standingCapacity: vt.passengerCapacity.standingCapacity ?? undefined,
      }
    : undefined,
  formDragCoefficient: vt.formDragCoefficient ?? undefined,
  rollResistanceCoefficient: vt.rollResistanceCoefficient ?? undefined,
  maximumEngineEffectKW: vt.maximumEngineEffectKW ?? undefined,
  maximumVelocity: vt.maximumVelocity ?? undefined,
  maximumRange: vt.maximumRange ?? undefined,
  created: vt.created ?? undefined,
  changed: vt.changed ?? undefined,
  changedBy: vt.changedBy ?? undefined,
  deckPlan: vt.deckPlan ? { id: vt.deckPlan.id, name: vt.deckPlan.name ?? undefined } : undefined,
  vehicles: vt.vehicles
    ? vt.vehicles.map(v => ({
        id: v.id,
        registrationNumber: v.registrationNumber,
        version: v.version,
      }))
    : undefined,
});

/**
 * Fetch the full VehicleType list (plus nested deckPlan + vehicles). Sobek's
 * post-#135 schema returns `netexId` in full NeTEx form at every level, so the
 * projection just renames `netexId` → `id` and coerces server-side `null` to
 * `undefined` to match the internal optional-shape contract.
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export const fetchVehicleTypes = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleTypeContext> => {
  const raw: { vehicleTypes: Page<VehicleTypeWire> } = await fetchVehicleTypesRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return { vehicleTypes: raw.vehicleTypes.content.map(projectVehicleType) };
};
