export declare class Centroid {
  x: number;
  y: number;
  constructor(x: number, y: number);
  static fromXML(value: any): Centroid | undefined;
  toXML(): {
    Location: {
      pos: string;
    };
  };
}
