import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

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

export const fetchVehicleTypesRequest = (applicationBaseUrl: string, token: AccessToken) => {
  return request(applicationBaseUrl, fetchVehicleTypesGQL, undefined, authHeader(token));
};
