import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

const fetchVehicleTypesGQL = gql`
  query VehicleTypes($page: Int, $size: Int, $filter: VehicleTypeFilter) {
    vehicleTypes(page: $page, size: $size, filter: $filter) {
      content {
        id
        version
        name {
          value
        }
        shortName {
          value
        }
        transportMode
        length
        width
        height
        created
        changed
        changedBy
        versionComment
        deckPlan {
          id
          description
          name {
            value
          }
        }
        vehicles {
          id
          registrationNumber
          version
        }
      }
      totalElements
      page
      size
    }
  }
`;

export type VehicleTypeVars = {
  page?: number;
  size?: number;
  filter?: { ids?: string[]; transportMode?: string };
};

export const fetchVehicleTypesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: VehicleTypeVars
) => request(applicationBaseUrl, fetchVehicleTypesGQL, variables, authHeader(token));
