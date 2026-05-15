import { ValidityCondition, ValidityConditionRef } from '../../../../validityCondition';
export declare class DeckEntranceUsage {
  attr_ref: string;
  attr_version: string;
  validityConditions: (ValidityCondition | ValidityConditionRef)[];
  Name: string;
  EntranceUsageType: 'exit' | 'entrance' | undefined;
  EntranceSetting: 'shut' | 'open' | undefined;
  ControlledLocking: boolean;
  constructor({
    attr_ref,
    attr_version,
    validityConditions,
    Name,
    EntranceUsageType,
    EntranceSetting,
    ControlledLocking,
  }: {
    attr_ref: string;
    attr_version: string;
    validityConditions: {
      ValidityConditionRef: any[];
      ValidityCondition: any[];
    };
    Name: string;
    EntranceUsageType: 'exit' | 'entrance' | undefined;
    EntranceSetting: 'shut' | 'open' | undefined;
    ControlledLocking: boolean;
  });
  toXML(): {
    attr_ref: string;
    attr_version: string;
    validityConditions: any;
    Name: string;
    EntranceUsageType: 'exit' | 'entrance' | undefined;
    EntranceSetting: 'shut' | 'open' | undefined;
    ControlledLocking: boolean;
  };
}
