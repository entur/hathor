export declare class DeckSpaceCapacity {
  attr_ref: string;
  attr_version: string;
  LocatableSpotType: 'seat' | undefined;
  capacity: number;
  constructor({
    attr_ref,
    attr_version,
    LocatableSpotType,
    capacity,
  }: {
    attr_ref: string;
    attr_version: string;
    LocatableSpotType: 'seat' | undefined;
    capacity: number;
  });
  toXML(): {
    attr_ref: string;
    attr_version: string;
    LocatableSpotType: 'seat' | undefined;
    capacity: number;
  };
}
