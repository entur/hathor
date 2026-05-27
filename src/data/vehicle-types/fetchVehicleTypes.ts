import { fetchVehicleTypesRequest } from '../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type { VehicleTypeContext, VehicleType, Name } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';
import type { Page } from '../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../graphql/paginationTypes.ts';

interface VehicleTypeWire {
  netexId: string;
  version: number;
  name?: Name | null;
  shortName?: Name | null;
  transportMode?: string | null;
  length: number;
  width: number;
  height: number;
  created?: string | null;
  changed?: string | null;
  changedBy?: string | null;
  deckPlan?: { netexId: string; name?: Name | null } | null;
  vehicles?: { netexId: string; registrationNumber: string; version: number }[] | null;
}

const projectVehicleType = (vt: VehicleTypeWire): VehicleType => ({
  id: vt.netexId,
  version: vt.version,
  name: vt.name ?? undefined,
  shortName: vt.shortName ?? undefined,
  transportMode: vt.transportMode ?? undefined,
  length: vt.length,
  width: vt.width,
  height: vt.height,
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
