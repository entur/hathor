import { fetchVehicleTypes } from '../vehicle-types/fetchVehicleTypes.ts';
import type { Vehicle } from './vehicleTypes.ts';
import type { TransportMode } from '../netex/transportMode.ts';
import type { AccessToken } from '../../auth';

/**
 * Flatten all `vehicleType.vehicles[]` arrays into a single Vehicle[] list.
 *
 * Delegates to the existing `fetchVehicleTypes` request — no duplicated
 * GraphQL query. Each Vehicle is enriched with parent VehicleType context so
 * the list view can display name/transportMode and so the shared TransportMode
 * chip filter (GH #24) can narrow rows client-side without a Sobek change.
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export async function fetchVehicles(
  applicationBaseUrl: string,
  token: AccessToken
): Promise<Vehicle[]> {
  const { vehicleTypes } = await fetchVehicleTypes(applicationBaseUrl, token);
  return vehicleTypes.flatMap(vt =>
    (vt.vehicles ?? []).map<Vehicle>(v => ({
      id: v.id,
      registrationNumber: v.registrationNumber,
      version: v.version,
      parentVehicleTypeId: vt.id,
      parentVehicleTypeName: vt.name?.value,
      parentTransportMode: vt.transportMode as TransportMode | undefined,
    }))
  );
}
