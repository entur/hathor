import { fetchVehiclesRequest } from '../../../graphql/vehicles/queries/fetchVehicles.ts';
import { UNKNOWN_TRANSPORT_MODE } from '../../netex/transportMode.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import type { Vehicle } from '../types/vehicle.ts';
import type { AccessToken } from '../../../auth';
import type { MultilingualString } from '../../netex/multilingualString.ts';

/**
 * Sobek `VehicleInput` — the mutation-accepted shape (mirrors `input
 * VehicleInput` in the SDL). Strict subset of a fetched `VehiclesQuery` row:
 * no `version` (server-managed; Sobek resolves the live version by `netexId`)
 * and `transportType` is a Sobek `VehicleTypeReferenceInput` (only `netexId`).
 * `dataOwnerRef` is a required input field, threaded in by the caller (current
 * organisation). Mirrors the `<Entity>Input` convention used by
 * `VehicleTypeInput`.
 */
export interface VehicleInput {
  netexId?: string | null;
  /** Owning organisation ref (NeTEx codespace). Required by Sobek `VehicleInput`. */
  dataOwnerRef: string;
  name?: MultilingualString | null;
  description?: MultilingualString | null;
  registrationNumber?: string | null;
  operationalNumber?: string | null;
  transportType?: { netexId?: string | null } | null;
  chassisNumber?: string | null;
  buildDate?: string | null;
  registrationDate?: string | null;
}

/**
 * Fetch the full Vehicle list from Sobek's `vehicles(...)` GraphQL query and
 * project each entry into the camelCase row shape consumed by the list view.
 * Warns once when the response is truncated past `FETCH_ALL_SIZE`.
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export async function fetchVehicles(
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<Vehicle[]> {
  const raw = await fetchVehiclesRequest(applicationBaseUrl, token, {
    size: FETCH_ALL_SIZE,
    filter: { dataOwnerRef },
  });
  const { content, totalElements } = raw.vehicles;
  if (content.length < totalElements) {
    console.warn(
      `fetchVehicles: server reports ${totalElements} vehicles but only ${content.length} returned — list is truncated. Bump FETCH_ALL_SIZE or move to server-side paging.`
    );
  }
  return content.map<Vehicle>(v => ({
    id: v.netexId || '',
    version: v.version,
    name: v.name || undefined,
    registrationNumber: v.registrationNumber,
    operationalNumber: v.operationalNumber ?? undefined,
    buildDate: v.buildDate,
    chassisNumber: v.chassisNumber,
    description: v.description,
    registrationDate: v.registrationDate,
    transportType: v.transportType
      ? {
          id: v.transportType.netexId,
          version: v.transportType.version,
          name: v.transportType.name || undefined,
          transportMode: v.transportType.transportMode ?? UNKNOWN_TRANSPORT_MODE,
        }
      : undefined,
  }));
}

/**
 * Fetch one Vehicle from Sobek's `vehicles(...)` GraphQL query and
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export async function fetchVehicle(
  netexId: string,
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<Vehicle[]> {
  const raw = await fetchVehiclesRequest(applicationBaseUrl, token, {
    size: FETCH_ALL_SIZE,
    filter: { netexIds: [netexId], dataOwnerRef },
  });
  const { content, totalElements } = raw.vehicles;
  if (content.length < totalElements) {
    console.warn(
      `fetchVehicles: server reports ${totalElements} vehicles but only ${content.length} returned — list is truncated. Bump FETCH_ALL_SIZE or move to server-side paging.`
    );
  }
  return content.map<Vehicle>(v => ({
    id: v.netexId || '',
    version: v.version,
    name: v.name || undefined,
    registrationNumber: v.registrationNumber,
    operationalNumber: v.operationalNumber ?? undefined,
    buildDate: v.buildDate,
    chassisNumber: v.chassisNumber,
    description: v.description,
    registrationDate: v.registrationDate,
    transportType: v.transportType
      ? {
          id: v.transportType.netexId,
          version: v.transportType.version,
          name: v.transportType.name || undefined,
          transportMode: v.transportType.transportMode ?? UNKNOWN_TRANSPORT_MODE,
        }
      : undefined,
  }));
}
