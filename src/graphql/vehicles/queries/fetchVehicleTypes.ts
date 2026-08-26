import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

const fetchVehicleTypesGQL = gql`
  query VehicleTypes($page: Int, $size: Int, $filter: VehicleTypeFilter) {
    vehicleTypes(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        version
        name {
          value
        }
        shortName {
          value
        }
        description {
          value
        }
        transportMode
        length
        width
        height
        weight
        lowFloor
        propulsionTypes
        fuelTypes
        selfPropelled
        euroClass
        maximumVelocity
        maximumRange
        formDragCoefficient
        rollResistanceCoefficient
        maximumEngineEffectKW
        hybridCategory
        passengerCapacity {
          totalCapacity
          seatingCapacity
          standingCapacity
          pushchairCapacity
          wheelchairPlaceCapacity
          pramPlaceCapacity
          bicycleRackCapacity
        }
        created
        changed
        changedBy
        deckPlan {
          netexId
          version
          name {
            value
          }
        }
        vehicles {
          netexId
          registrationNumber
          operationalNumber
          version
        }
      }
      totalElements
      page
      size
    }
  }
`;

import type { PageVars } from '../../paginationTypes.ts';

export type VehicleTypeVars = PageVars & {
  filter?: { netexIds?: string[]; transportModes?: string[]; dataOwnerRef: string };
};

export const fetchVehicleTypesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: VehicleTypeVars
) => request(applicationBaseUrl, fetchVehicleTypesGQL, variables, authHeader(token));
