export type Name = {
  value: string;
};

export type VehicleImport = {
  id?: string;
  registrationNumber: string;
  operationalId?: string;
  vehicleTypeRef?: string;
  neTExXML?: string;
  status: 'PENDING' | 'IMPORTING' | 'COMPLETED' | 'FAILED';
};

export type VehicleImportContext = {
  vehicleImports: VehicleImport[];
};
