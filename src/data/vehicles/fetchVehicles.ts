import { fetchVehicleTypes } from '../vehicle-types/fetchVehicleTypes.ts';
import { isTransportMode } from '../netex/transportMode.ts';
import type { VehicleRow } from './vehicleTypes.ts';
import type { AccessToken } from '../../auth';

/**
 * Flatten all `vehicleType.vehicles[]` arrays into a single `VehicleRow[]`.
 *
 * Delegates to the existing `fetchVehicleTypes` request — no duplicated
 * GraphQL query. Each row is enriched with parent VehicleType context so the
 * list view can display name/transportMode and so the shared TransportMode
 * chip filter (GH #24) can narrow rows client-side without a Sobek change.
 * Unknown backend transport-mode values are dropped (`undefined`) rather than
 * cast — see `isTransportMode`.
 *
 * @param applicationBaseUrl Sobek base URL.
 * @param token OIDC access token (bearer).
 */
export async function fetchVehicles(
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleRow[]> {
  const { vehicleTypes } = await fetchVehicleTypes(applicationBaseUrl, token);
  return vehicleTypes.flatMap(vt =>
    (vt.vehicles ?? []).map<VehicleRow>(v => ({
      id: v.id,
      registrationNumber: v.registrationNumber,
      version: v.version,
      parentVehicleTypeId: vt.id,
      parentVehicleTypeName: vt.name?.value,
      parentTransportMode: isTransportMode(vt.transportMode) ? vt.transportMode : undefined,
    }))
  );
}
