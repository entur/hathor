export declare class SpotColumn {
  attr_id: string;
  label: string;
  constructor({ attr_id, Label }: { attr_id: string; Label: string });
  toXML(): {
    attr_id: string;
    label: string;
  };
}
export declare class SpotColumnRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
