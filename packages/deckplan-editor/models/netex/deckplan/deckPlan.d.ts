import { Deck } from './deck/deck';
import { DeckLevel } from './decklevels/deckLevel';
import type { PassengerSpot } from './deck/deckspace/spots/passengerSpot';
import type { LuggageSpot } from './deck/deckspace/spots/luggageSpot';
import type { PassengerSpace } from './deck/deckspace/passengerSpace';
import type { PassengerEntrance } from './deck/deckspace/entrance/passengerEntrance';
export declare class DeckPlan {
  attr_id: string;
  attr_version: string;
  deckLevels: DeckLevel[];
  decks: Deck[];
  constructor({
    attr_id,
    attr_version,
    decks,
    deckLevels,
  }: {
    attr_id: string;
    attr_version: string;
    deckLevels:
      | {
          DeckLevel: any[];
        }
      | {
          DeckLevel: any;
        }
      | undefined;
    decks:
      | {
          Deck: any[];
        }
      | {
          Deck: any;
        }
      | undefined;
  });
  static empty(): DeckPlan;
  addDeckLevel(): void;
  removeDeckLevel(deckLevelId: string): void;
  toXML(): {
    DeckPlan: {
      xmlTagName: string;
      attr_id: string;
      attr_version: string;
      decks: {
        Deck: object[];
      };
      deckLevels: {
        DeckLevel: object[];
      };
    };
  };
}
export type BuildableElement = PassengerSpot | PassengerSpace | LuggageSpot | PassengerEntrance;
