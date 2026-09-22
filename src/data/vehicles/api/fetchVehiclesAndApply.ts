/**
 * Pure async orchestration for the `/vehicles` list fetch. Awaits the
 * full chain so callers can `await refetch()` and observe new data
 * (M3, PR #74 review). Side-effects flow through injected setters; the
 * `fetchVehiclesImpl` seam exists so tests can drive completion with a
 * deferred promise without mocking the module graph.
 */
import type { AccessToken } from '../../../auth';
import { graphqlErrMsg } from '../../graphqlErrMsg';
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
    setError(graphqlErrMsg(err));
  }
}
