export declare abstract class Equipment {
  attr_id: string;
  attr_version: string;
  Name?: string;
  Description?: string;
  constructor(data: any);
  toXML(): any;
}
export declare abstract class InstalledEquipment extends Equipment {
  constructor(data: any);
}
export declare abstract class PassengerEquipment extends InstalledEquipment {
  Fixed?: boolean;
  constructor(data: any);
  toXML(): any;
}
export declare class AccessVehicleEquipment extends PassengerEquipment {
  static xmlTagName: string;
  LowFloor?: boolean;
  HighFloor?: boolean;
  Ramp?: boolean;
  constructor(data: any);
  toXML(): any;
}
export declare class SanitaryEquipment extends PassengerEquipment {
  static xmlTagName: string;
  constructor(data: any);
}
export declare class SeatingEquipment extends InstalledEquipment {
  static xmlTagName: string;
  constructor(data: any);
}
