export declare class DeckLevel {
  attr_id: string;
  attr_version: string;
  Label: string;
  constructor({
    Label,
    attr_id,
    attr_version,
  }: {
    attr_id: string;
    attr_version: string;
    Label: string;
  });
  toXML(): {
    attr_id: string;
    attr_version: string;
    Label: string;
  };
}
export declare class DeckLevelRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
