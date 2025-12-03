import { request, gql } from 'graphql-request';

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

export const fetchVehicleTypesRequest = (applicationBaseUrl: string, token: string) => {
  return request(applicationBaseUrl, fetchVehicleTypesGQL, undefined, {
    Authorization: `Bearer ${token}`,
  });
};
