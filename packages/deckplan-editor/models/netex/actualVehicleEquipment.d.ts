import type { EquipmentRef } from './equipment';
import { PassengerEquipment } from './passengerEquipment';
export declare class ActualVehicleEquipment extends PassengerEquipment {
  static xmlTagName: string;
  Units: number;
  TicketingEquipmentRef: EquipmentRef | undefined;
  TicketValidatorEquipmentRef: EquipmentRef | undefined;
  constructor(data: any);
  toXML(): any;
}
