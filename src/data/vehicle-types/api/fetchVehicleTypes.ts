import { fetchVehicleTypesRequest } from '../../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type {
  VehicleTypeContext,
  VehicleType,
  Name,
  PassengerCapacity,
  PropulsionType,
  FuelType,
  HybridCategory,
} from '../types/vehicleTypeTypes.ts';
import type { AccessToken } from '../../../auth';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import { UNKNOWN_TRANSPORT_MODE, type TransportMode } from '../../netex/transportMode.ts';

export interface VehicleTypeWire {
  netexId: string;
  version: number;
  name?: Name | null;
  shortName?: Name | null;
  description?: Name | null;
  transportMode?: TransportMode | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  weight?: number | null;
  lowFloor?: boolean | null;
  propulsionTypes?: (PropulsionType | null)[] | null;
  fuelTypes?: (FuelType | null)[] | null;
  selfPropelled?: boolean | null;
  euroClass?: string | null;
  maximumVelocity?: number | null;
  maximumRange?: number | null;
  formDragCoefficient?: number | null;
  rollResistanceCoefficient?: number | null;
  maximumEngineEffectKW?: number | null;
  hybridCategory?: HybridCategory | null;
  passengerCapacity?: PassengerCapacity | null;
  created?: string | null;
  changed?: string | null;
  changedBy?: string | null;
  deckPlan?: { netexId: string; name?: Name | null } | null;
  vehicles?:
    | {
        netexId: string;
        registrationNumber: string;
        operationalNumber?: string | null;
        version: number;
      }[]
    | null;
  privateCode?: { type?: string | null; value: string } | null;
  keyValues?: { key: string; values: string[] }[] | null;
}

/** Drop server-side `null`s from a nullable list, coercing to `undefined` when empty. */
const compact = <T>(list?: (T | null)[] | null): T[] | undefined => {
  const out = list?.filter((x): x is T => x != null);
  return out && out.length ? out : undefined;
};

export const projectVehicleType = (vt: VehicleTypeWire): VehicleType => ({
  id: vt.netexId,
  version: vt.version,
  name: vt.name ?? undefined,
  shortName: vt.shortName ?? undefined,
  description: vt.description ?? undefined,
  // Sobek's enum verbatim; null (Sobek does not default) → UNKNOWN.
  transportMode: vt.transportMode ?? UNKNOWN_TRANSPORT_MODE,
  length: vt.length ?? undefined,
  width: vt.width ?? undefined,
  height: vt.height ?? undefined,
  weight: vt.weight ?? undefined,
  lowFloor: vt.lowFloor ?? undefined,
  propulsionTypes: compact(vt.propulsionTypes),
  fuelTypes: compact(vt.fuelTypes),
  selfPropelled: vt.selfPropelled ?? undefined,
  euroClass: vt.euroClass ?? undefined,
  maximumVelocity: vt.maximumVelocity ?? undefined,
  maximumRange: vt.maximumRange ?? undefined,
  formDragCoefficient: vt.formDragCoefficient ?? undefined,
  rollResistanceCoefficient: vt.rollResistanceCoefficient ?? undefined,
  maximumEngineEffectKW: vt.maximumEngineEffectKW ?? undefined,
  hybridCategory: vt.hybridCategory ?? undefined,
  passengerCapacity: vt.passengerCapacity ?? undefined,
  created: vt.created ?? undefined,
  changed: vt.changed ?? undefined,
  changedBy: vt.changedBy ?? undefined,
  deckPlan: vt.deckPlan
    ? { id: vt.deckPlan.netexId, name: vt.deckPlan.name ?? undefined }
    : undefined,
  vehicles: vt.vehicles
    ? vt.vehicles.map(v => ({
        id: v.netexId,
        registrationNumber: v.registrationNumber,
        operationalNumber: v.operationalNumber ?? undefined,
        version: v.version,
      }))
    : undefined,
  privateCode: vt.privateCode
    ? { type: vt.privateCode.type ?? undefined, value: vt.privateCode.value }
    : undefined,
  keyValues: vt.keyValues ?? undefined,
});

/**
 * Sobek `VehicleTypeInput` — the mutation-accepted shape. Strict subset of the
 * fetched {@link VehicleTypeWire}: no `version`/`created`/`changed`/`changedBy`
 * /`vehicles` (all server-managed; Sobek resolves the live version by `netexId`)
 * and it adds `description`. Mirrors `input VehicleTypeInput` in the SDL
 * (`src/graphql/sobek.schema.graphqls`).
 */
export interface VehicleTypeInput {
  netexId?: string | null;
  name?: Name | null;
  shortName?: Name | null;
  description?: Name | null;
  euroClass?: string | null;
  propulsionTypes?: (PropulsionType | null)[] | null;
  fuelTypes?: (FuelType | null)[] | null;
  transportMode?: string | null;
  passengerCapacity?: PassengerCapacity | null;
  deckPlan?: { netexId?: string | null; name?: Name | null } | null;
  formDragCoefficient?: number | null;
  rollResistanceCoefficient?: number | null;
  maximumEngineEffectKW?: number | null;
  maximumVelocity?: number | null;
  maximumRange?: number | null;
  length?: number | null;
  height?: number | null;
  width?: number | null;
  weight?: number | null;
  lowFloor?: boolean | null;
  selfPropelled?: boolean | null;
  hybridCategory?: HybridCategory | null;
  privateCode?: { type?: string | null; value: string } | null;
  keyValues?: { key: string; values: string[] }[] | null;
}

/**
 * Inverse of {@link projectVehicleType}: domain {@link VehicleType} →
 * {@link VehicleTypeInput} for `createOrUpdateVehicleType`. Sobek does a
 * **full-document replace**, so every input-accepted field is emitted —
 * `undefined` is coerced to explicit `null` so a blanked field is cleared
 * rather than silently retained (the opposite of `useVehiclePairSave`'s
 * omit-blank). `version`/`vehicles`/audit fields are intentionally dropped
 * (not part of the input contract).
 *
 * @param vt Domain VehicleType (as held by the editor form).
 * @returns The mutation input payload.
 */
export const serializeVehicleType = (vt: VehicleType): VehicleTypeInput => ({
  netexId: vt.id,
  name: vt.name ?? null,
  shortName: vt.shortName ?? null,
  description: vt.description ?? null,
  euroClass: vt.euroClass ?? null,
  propulsionTypes: vt.propulsionTypes ?? null,
  fuelTypes: vt.fuelTypes ?? null,
  transportMode: vt.transportMode ?? null,
  passengerCapacity: vt.passengerCapacity ?? null,
  deckPlan: vt.deckPlan ? { netexId: vt.deckPlan.id, name: vt.deckPlan.name ?? null } : null,
  formDragCoefficient: vt.formDragCoefficient ?? null,
  rollResistanceCoefficient: vt.rollResistanceCoefficient ?? null,
  maximumEngineEffectKW: vt.maximumEngineEffectKW ?? null,
  maximumVelocity: vt.maximumVelocity ?? null,
  maximumRange: vt.maximumRange ?? null,
  length: vt.length ?? null,
  height: vt.height ?? null,
  width: vt.width ?? null,
  weight: vt.weight ?? null,
  lowFloor: vt.lowFloor ?? null,
  selfPropelled: vt.selfPropelled ?? null,
  hybridCategory: vt.hybridCategory ?? null,
  // Carried through untouched — Sobek stores env values + the Autosys
  // imported-id here; omitting them would null them under full-replace.
  privateCode: vt.privateCode ?? null,
  keyValues: vt.keyValues ?? null,
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
