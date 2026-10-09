import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { MultilingualString } from '../../../data/netex/multilingualString.ts';
import type { TransportMode } from '../../../data/netex/transportMode.ts';
import type {
  FuelType,
  HybridCategory,
  PassengerCapacity,
  PropulsionType,
} from '../../../data/vehicle-types/types/vehicleTypeTypes.ts';

const vehicleTypesDocument = gql`
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

/** Sobek `VehicleTypeFilter` — the `vehicleTypes(filter:)` argument. */
export type VehicleTypeFilter = {
  netexIds?: string[];
  transportModes?: string[];
  dataOwnerRef: string;
};

/** Variables of the `VehicleTypes` query. */
export type VehicleTypesQueryVariables = {
  page?: number;
  size?: number;
  filter?: VehicleTypeFilter;
};

/** Result of the `VehicleTypes` query: one page of vehicle types, as selected above. */
export type VehicleTypesQuery = {
  vehicleTypes: {
    content: {
      netexId: string;
      version: number;
      name?: MultilingualString | null;
      shortName?: MultilingualString | null;
      description?: MultilingualString | null;
      transportMode?: TransportMode | null;
      length?: number | null;
      width?: number | null;
      height?: number | null;
      weight?: number | null;
      lowFloor?: boolean | null;
      propulsionTypes?: (PropulsionType | null)[] | null;
      fuelTypes?: (FuelType | null)[] | null;
      selfPropelled?: boolean | null;
      euroClass?: string | null;
      maximumVelocity?: number | null;
      maximumRange?: number | null;
      formDragCoefficient?: number | null;
      rollResistanceCoefficient?: number | null;
      maximumEngineEffectKW?: number | null;
      hybridCategory?: HybridCategory | null;
      passengerCapacity?: PassengerCapacity | null;
      created?: string | null;
      changed?: string | null;
      changedBy?: string | null;
      deckPlan?: { netexId: string; name?: MultilingualString | null; version: number } | null;
      vehicles?:
        | {
            netexId: string;
            registrationNumber: string;
            operationalNumber?: string | null;
            version: number;
          }[]
        | null;
    }[];
    totalElements: number;
    page: number;
    size: number;
  };
};

export const fetchVehicleTypesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: VehicleTypesQueryVariables
) =>
  request<VehicleTypesQuery>(
    applicationBaseUrl,
    vehicleTypesDocument,
    variables,
    authHeader(token)
  );
