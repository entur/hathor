export declare class Text {
  value: string;
  constructor({ value }: { value: string });
  toXML(): string;
}
export declare class Name {
  value: string;
  constructor(value: { text_value: string });
  toXML(): {
    text_value: string;
  };
}
export declare class Label {
  value: string;
  constructor({ value }: { value: string });
  toXML(): string;
}
export declare function extractElementList<TInput, TOutput>(
  element: TInput | TInput[] | undefined,
  ElementConstructor: new (e: TInput) => TOutput
): TOutput[];
interface Serializable {
  toXML(): object;
}
export declare function serializeElements(elements: Serializable[]): object[];
export declare function serializeElementsAndRefs(elementsAndRefs: Serializable[]): any;
export {};
