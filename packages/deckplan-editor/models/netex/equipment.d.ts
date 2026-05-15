export declare class EquipmentRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
