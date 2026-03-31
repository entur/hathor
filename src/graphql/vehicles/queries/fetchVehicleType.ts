import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

// Workaround: Sobek lacks single-entity queries (entur/sobek#78).
// Reuses the collection query; caller filters by ID.
const fetchVehicleTypesGQL = gql`
  query VehicleTypes {
    vehicleTypes {
      id
      name {
        value
      }
      length
      width
      height
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
  }
`;

export const fetchVehicleTypeRequest = (applicationBaseUrl: string, token: AccessToken) => {
  return request(applicationBaseUrl, fetchVehicleTypesGQL, undefined, authHeader(token));
};
