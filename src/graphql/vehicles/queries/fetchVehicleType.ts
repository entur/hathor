import { fetchVehicleTypesRequest } from './fetchVehicleTypes.ts';
import type { AccessToken } from '../../../auth';

export const fetchVehicleTypeRequest = (
  applicationBaseUrl: string,
  id: string,
  token: AccessToken
) => fetchVehicleTypesRequest(applicationBaseUrl, token, { size: 1, filter: { ids: [id] } });
