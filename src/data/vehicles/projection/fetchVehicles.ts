import { fetchVehiclesRequest } from '../../../graphql/vehicles/queries/fetchVehicles.ts';
import { toTransportMode } from '../../netex/transportMode.ts';
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
 *
 * Bulk-fetches up to `FETCH_ALL_SIZE` and warns when the response is
 * truncated — see #72 for the follow-up that switches to server-side paging.
 * Unknown/missing `transportMode` values collapse to `'unknown'` via
 * `toTransportMode`.
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
    ...(v.operationalNumber ? { operationalNumber: v.operationalNumber } : {}),
    ...(v.transportType
      ? {
          transportType: {
            id: v.transportType.id,
            version: v.transportType.version,
            ...(v.transportType.name?.value ? { name: v.transportType.name.value } : {}),
            transportMode: toTransportMode(v.transportType.transportMode ?? undefined),
          },
        }
      : {}),
  }));
}
