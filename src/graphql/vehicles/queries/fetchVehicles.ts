import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { MultilingualString } from '../../../data/netex/multilingualString.ts';
import type { TransportMode } from '../../../data/netex/transportMode.ts';

const vehiclesDocument = gql`
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

/** Sobek `VehicleFilter` — the `vehicles(filter:)` argument. */
export type VehicleFilter = {
  netexIds?: string[];
  transportModes?: string[];
  dataOwnerRef: string;
};

/** Variables of the `Vehicles` query. */
export type VehiclesQueryVariables = { page?: number; size?: number; filter?: VehicleFilter };

/** Result of the `Vehicles` query: one page of vehicles, as selected above. */
export type VehiclesQuery = {
  vehicles: {
    content: {
      registrationDate: string | undefined;
      description: MultilingualString | undefined;
      chassisNumber: string | undefined;
      buildDate: string | undefined;
      netexId?: string;
      version?: number;
      name?: MultilingualString | undefined;
      registrationNumber: string;
      operationalNumber?: string | undefined;
      transportType?:
        | {
            netexId: string;
            version: number;
            name?: MultilingualString | undefined;
            transportMode?: TransportMode | null;
          }
        | null
        | undefined;
    }[];
    totalElements: number;
    page: number;
    size: number;
  };
};

export const fetchVehiclesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: VehiclesQueryVariables
) => request<VehiclesQuery>(applicationBaseUrl, vehiclesDocument, variables, authHeader(token));
