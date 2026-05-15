import { ActualVehicleEquipment } from '../../../actualVehicleEquipment';
import { Name as GeneralName } from '../../../general';
export declare class OtherDeckSpace {
  attr_id: string;
  attr_version: string;
  Name: GeneralName | undefined;
  PublicUse: boolean | undefined;
  TotalCapacity: number | undefined;
  actualVehicleEquipments: ActualVehicleEquipment[];
  constructor({
    attr_id,
    attr_version,
    Name,
    PublicUse,
    TotalCapacity,
    actualVehicleEquipments,
  }: {
    attr_id: string;
    attr_version: string;
    Name: {
      text_value: string;
    };
    actualVehicleEquipments: {
      ActualVehicleEquipment: ActualVehicleEquipment[];
    };
    PublicUse: {
      text_value: boolean;
    };
    TotalCapacity: {
      text_value: number;
    };
  });
  toXML(): {
    attr_id: string;
    attr_version: string;
    Name:
      | (() => {
          text_value: string;
        })
      | undefined;
  };
}
