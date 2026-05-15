import { DeckLevel, DeckLevelRef as GeneralDeckLevelRef } from '../decklevels/deckLevel';
import { OtherDeckSpace } from './deckspace/otherDeckSpace';
import { PassengerSpace } from './deckspace/passengerSpace';
import { Polygon } from '../../polygon';
import { SpotColumn } from './spotColumn';
import { SpotRow } from './spotRow';
export declare class Deck {
  attr_id: string;
  attr_version: string;
  Name: string;
  polygon: Polygon | undefined;
  deckspaces: (OtherDeckSpace | PassengerSpace)[];
  DeckLevelRef: GeneralDeckLevelRef | undefined;
  spotRows: SpotRow[];
  spotColumns: SpotColumn[];
  Width: number;
  Length: number;
  constructor({
    attr_id,
    attr_version,
    deckSpaces,
    spotRows,
    spotColumns,
    DeckLevelRef,
    Name,
    polygon,
    Width,
    Length,
  }: {
    attr_id: string;
    attr_version: string;
    deckSpaces: {
      OtherDeckSpace: any | any[];
      PassengerSpace: any | any[];
    };
    spotRows:
      | {
          SpotRow: any[];
        }
      | undefined;
    spotColumns:
      | {
          SpotColumn: any[];
        }
      | undefined;
    DeckLevelRef: GeneralDeckLevelRef | undefined;
    Name: string | undefined;
    polygon: object | undefined;
    Width: number | undefined;
    Length: number | undefined;
  });
  static empty(deckLevel: DeckLevel): Deck;
  toXML(): {
    attr_id: string;
    attr_version: string;
    spotRows: {
      SpotRow: object[];
    };
    spotColumns: {
      SpotColumn: object[];
    };
    deckSpaces: any;
    DeckLevelRef:
      | {
          attr_ref: string;
          attr_version: string;
        }
      | undefined;
    polygon: object | undefined;
    Name: string;
    Width: number;
    Length: number;
  };
  getBoundingBox(): {
    width: number;
    height: number;
  };
  getShape(scale: number): {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius: number;
  };
}
