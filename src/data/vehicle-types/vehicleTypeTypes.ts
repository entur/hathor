export type Name = {
  value: string;
};

export type DeckPlan = {
  id: string;
  description?: string;
  name?: Name;
};

export type VehicleType = {
  id: string;
  version: number;
  name: Name;
  deckPlan?: DeckPlan;
  length: number;
  width: number;
  height: number;
  __typename: string;
};

export type VehicleTypeContext = {
  vehicleTypes: VehicleType[];
};
