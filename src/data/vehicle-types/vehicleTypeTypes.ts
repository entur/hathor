export type Name = {
  value: string;
};

export type DeckPlan = {
  id: string;
  description?: string;
  name?: Name;
};

export type Vehicle = {
  id: string;
  registrationNumber: string;
  version: number;
};

export type VehicleType = {
  id: string;
  version: number;
  name: Name;
  deckPlan?: DeckPlan;
  length: number;
  width: number;
  height: number;
  vehicles?: Vehicle[];
  __typename: string;
};

export type VehicleTypeContext = {
  vehicleTypes: VehicleType[];
};

export type NeTExPassengerCapacity = {
  StandingCapacity?: number;
  SeatingCapacity?: number;
};

export type NeTExVehicleType = {
  id: string;
  PassengerCapacity: NeTExPassengerCapacity;
  Name: {
    value: string;
  };
  Length: number;
  Width: number;
  Height: number;
  FuelTypes?: string;
  DeckPlan?: {
    id: string;
    Description?: string;
    Name?: {
      value: string;
    };
  };
};

export type NeTExVehicleTypes = {
  VehicleType: NeTExVehicleType;
};

export type NeTExResourceFrame = {
  id: string;
  vehicleTypes: NeTExVehicleTypes;
  deckPlans?: {
    DeckPlan: {
      id: string;
      Description?: string;
      Name?: string;
    };
  };
  vehicles?: {
    Vehicle: {
      RegistrationNumber: string;
    };
  };
};
