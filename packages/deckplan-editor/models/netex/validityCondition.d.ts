export declare class ValidityCondition {
  attr_id: string;
  attr_version: string;
  Name: string;
  constructor({
    attr_id,
    attr_version,
    Name,
  }: {
    attr_id: string;
    attr_version: string;
    Name: string;
  });
  toXML(): {
    attr_id: string;
    Name: string;
    attr_version: string;
  };
}
export declare class ValidityConditionRef {
  attr_ref: string;
  attr_version: string;
  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string });
  toXML(): {
    attr_ref: string;
    attr_version: string;
  };
}
