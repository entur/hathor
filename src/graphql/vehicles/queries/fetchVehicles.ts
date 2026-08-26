import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { PageVars } from '../../paginationTypes.ts';

const fetchVehiclesGQL = gql`
  query Vehicles($page: Int, $size: Int, $filter: VehicleFilter) {
    vehicles(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        version
        registrationNumber
        operationalNumber
        buildDate
        chassisNumber
        description {
          value
        }
        registrationDate
        name {
          value
        }
        transportType {
          netexId
          version
          name {
            value
          }
          transportMode
        }
      }
      totalElements
      page
      size
    }
  }
`;

export type VehicleVars = PageVars & {
  filter?: { netexIds?: string[]; transportModes?: string[]; dataOwnerRef: string };
};

export const fetchVehiclesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: VehicleVars
) => request(applicationBaseUrl, fetchVehiclesGQL, variables, authHeader(token));
