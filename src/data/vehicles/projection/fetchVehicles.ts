import { fetchVehiclesRequest } from '../../../graphql/vehicles/queries/fetchVehicles.ts';
import { toTransportMode } from '../../netex/transportMode.ts';
import { restructNetexId } from '../../netex/restructNetexId.ts';
import { FETCH_ALL_SIZE, type Page } from '../../../graphql/paginationTypes.ts';
import type { VehicleGQLShaped } from './vehicleGqlShaped.ts';
import type { AccessToken } from '../../../auth';

interface VehicleWire {
  id: string;
  version: number;
  registrationNumber: string;
  operationalNumber?: string | null;
  transportType?: {
    id: string;
    version: number;
    name?: { value: string } | null;
    transportMode?: string | null;
  } | null;
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
    id: v.id,
    version: v.version,
    registrationNumber: v.registrationNumber,
    operationalNumber: v.operationalNumber ?? undefined,
    transportType: v.transportType
      ? {
          // NOTE: nested transportType.id falls back to DB row id pending sobek#125 —
          // reconstruct full NeTEx id from outer Vehicle.id codespace.
          id: restructNetexId(v.id, 'VehicleType', v.transportType.id),
          version: v.transportType.version,
          name: v.transportType.name?.value,
          transportMode: toTransportMode(v.transportType.transportMode),
        }
      : undefined,
  }));
}
