import { fetchVehiclesRequest } from '../../../graphql/vehicles/queries/fetchVehicles.ts';
import { toTransportMode } from '../../netex/transportMode.ts';
import { FETCH_ALL_SIZE, type Page } from '../../../graphql/paginationTypes.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';
import type { AccessToken } from '../../../auth';
import type { Name } from '../../vehicle-types/vehicleTypeTypes.ts';

export interface VehicleWire {
  registrationDate: string | undefined;
  description: Name | undefined;
  chassisNumber: string | undefined;
  buildDate: string | undefined;
  netexId: string;
  version: number;
  name?: Name | undefined;
  registrationNumber: string;
  operationalNumber?: string | undefined;
  transportType?:
    | {
        netexId: string;
        version: number;
        name?: Name | undefined;
        transportMode?: string | undefined;
      }
    | null
    | undefined;
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
  token: AccessToken
): Promise<VehicleGQLShaped[]> {
  const raw: { vehicles: Page<VehicleWire> } = await fetchVehiclesRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  const { content, totalElements } = raw.vehicles;
  if (content.length < totalElements) {
    console.warn(
      `fetchVehicles: server reports ${totalElements} vehicles but only ${content.length} returned — list is truncated. Bump FETCH_ALL_SIZE or move to server-side paging.`
    );
  }
  return content.map<VehicleGQLShaped>(v => ({
    id: v.netexId,
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
          transportMode: toTransportMode(v.transportType.transportMode),
        }
      : undefined,
  }));
}

/**
 * Fetch the full Vehicle list from Sobek's `vehicles(...)` GraphQL query and
 * project each entry into the camelCase row shape consumed by the list view.
 * Warns once when the response is truncated past `FETCH_ALL_SIZE`.
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export async function fetchVehicle(
  netexId: string,
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleGQLShaped[]> {
  const raw: { vehicles: Page<VehicleWire> } = await fetchVehiclesRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE, filter: { netexIds: [netexId] } }
  );
  const { content, totalElements } = raw.vehicles;
  if (content.length < totalElements) {
    console.warn(
      `fetchVehicles: server reports ${totalElements} vehicles but only ${content.length} returned — list is truncated. Bump FETCH_ALL_SIZE or move to server-side paging.`
    );
  }
  return content.map<VehicleGQLShaped>(v => ({
    id: v.netexId,
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
          transportMode: toTransportMode(v.transportType.transportMode),
        }
      : undefined,
  }));
}
