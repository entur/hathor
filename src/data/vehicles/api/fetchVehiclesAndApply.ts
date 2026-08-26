/**
 * Pure async orchestration for the `/vehicles` list fetch. Awaits the
 * full chain so callers can `await refetch()` and observe new data
 * (M3, PR #74 review). Side-effects flow through injected setters; the
 * `fetchVehiclesImpl` seam exists so tests can drive completion with a
 * deferred promise without mocking the module graph.
 */
import { ClientError } from 'graphql-request';
import type { AccessToken } from '../../../auth';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped';
import { fetchVehicles } from './fetchVehicles';

export interface FetchVehiclesAndApplyDeps {
  applicationBaseUrl: string;
  getAccessToken: () => Promise<AccessToken>;
  setData: (rows: VehicleGQLShaped[]) => void;
  setError: (msg: string | null) => void;
  /** Test seam. Defaults to the production `fetchVehicles`. */
  fetchVehiclesImpl?: (
    baseUrl: string,
    dataOwnerRef: string,
    token: AccessToken
  ) => Promise<VehicleGQLShaped[]>;
  dataOwnerRef: string;
}

export async function fetchVehiclesAndApply({
  applicationBaseUrl,
  getAccessToken,
  setData,
  setError,
  fetchVehiclesImpl = fetchVehicles,
  dataOwnerRef,
}: FetchVehiclesAndApplyDeps): Promise<void> {
  setError(null);
  try {
    const token = await getAccessToken();
    const rows = await fetchVehiclesImpl(applicationBaseUrl, dataOwnerRef, token);
    setData(rows);
  } catch (err) {
    setError(translateVehiclesFetchError(err));
  }
}

/** Map a thrown value from the vehicles fetch into a user-visible string. */
export function translateVehiclesFetchError(err: unknown): string {
  if (err instanceof ClientError) {
    const status = err.response.status;
    if (status === 401) return 'Not authenticated — please log in to access this data';
    if (status === 403) return 'Access denied — you do not have permission to view this data';
    const message = err.response.errors?.[0]?.message;
    return message ?? `Server error (${status})`;
  }
  if (err instanceof TypeError) return 'Unable to reach server — check that the backend is running';
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
