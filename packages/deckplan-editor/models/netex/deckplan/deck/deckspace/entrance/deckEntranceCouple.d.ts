import { PassengerEntranceRef } from './passengerEntrance';
export declare class DeckEntranceCouple {
  attr_ref: string;
  attr_version: string;
  FromDeckEntranceRef: PassengerEntranceRef;
  ToDeckEntranceRef: PassengerEntranceRef;
  constructor({
    attr_ref,
    attr_version,
    FromDeckEntranceRef,
    ToDeckEntranceRef,
  }: {
    attr_ref: string;
    attr_version: string;
    FromDeckEntranceRef: any;
    ToDeckEntranceRef: any;
  });
  toXML(): {
    attr_ref: string;
    attr_version: string;
    FromDeckEntranceRef: {
      attr_ref: string;
      attr_version: string;
    };
    ToDeckEntranceRef: {
      attr_ref: string;
      attr_version: string;
    };
  };
}
