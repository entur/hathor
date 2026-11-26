import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { MultilingualString } from '../../../data/netex/multilingualString.ts';
import type { TransportMode } from '../../../data/netex/transportMode.ts';
import type {
  FuelType,
  HybridCategory,
  PassengerCapacity,
  PropulsionType,
  ThroughAccess,
  TrainElementType,
  TrainSize,
  VehicleOrientation,
  VehicleTypeKind,
  VehicleTypeSubtype,
} from '../../../data/vehicle-types/types/vehicleTypeTypes.ts';

/** A train component's label / description, with the lang a save must keep. */
type Text = MultilingualString | null;

const vehicleTypesDocument = gql`
  query VehicleTypes($page: Int, $size: Int, $filter: VehicleTypeFilter) {
    vehicleTypes(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        version
        subtype
        numberOfCars
        trainSizeType
        trainElementType
        trainComponents {
          netexId
          label {
            value
            lang
          }
          description {
            value
            lang
          }
          trainElement {
            netexId
          }
          operationalOrientation
          forwardCouplingThroughAccess
        }
        compoundTrainComponents {
          netexId
          label {
            value
            lang
          }
          description {
            value
            lang
          }
          train {
            netexId
          }
          operationalOrientation
        }
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
  vehicleTypeKind: VehicleTypeKind;
  dataOwnerRef: string;
};

/** Variables of the `VehicleTypes` query. */
export type VehicleTypesQueryVariables = {
  page?: number;
  size?: number;
  /** Required: Sobek rejects `vehicleTypes` without `dataOwnerRef` and `vehicleTypeKind`. */
  filter: VehicleTypeFilter;
};

/** Result of the `VehicleTypes` query: one page of vehicle types, as selected above. */
export type VehicleTypesQuery = {
  vehicleTypes: {
    content: {
      netexId: string;
      version: number;
      subtype?: VehicleTypeSubtype | null;
      numberOfCars?: number | null;
      trainSizeType?: TrainSize | null;
      trainElementType?: TrainElementType | null;
      trainComponents?:
        | {
            netexId?: string | null;
            label?: Text;
            description?: Text;
            trainElement?: { netexId: string } | null;
            operationalOrientation?: VehicleOrientation | null;
            forwardCouplingThroughAccess?: ThroughAccess | null;
          }[]
        | null;
      compoundTrainComponents?:
        | {
            netexId?: string | null;
            label?: Text;
            description?: Text;
            train?: { netexId: string } | null;
            operationalOrientation?: VehicleOrientation | null;
          }[]
        | null;
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
