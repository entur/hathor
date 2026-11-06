import { Fragment } from 'react';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { FormStack } from '../../../components/FormLayout.tsx';
import { useVehicleControls } from '../hooks/useVehicleControls.tsx';
import type { Vehicle } from '../types/vehicle.ts';
import type { VehicleField } from '../types/vehicleFields.ts';

// The sidebar's order; the form page lays them out from `vehicleLayout`.
const SIDEBAR_FIELDS: VehicleField[] = [
  'name',
  'registrationNumber',
  'transportType',
  'operationalNumber',
  'chassisNumber',
  'buildDate',
  'registrationDate',
  'description',
];

export interface VehicleEditFormValue {
  vehicle: Vehicle;
}

interface VehicleEditFormProps {
  value: VehicleEditFormValue;
  onChange: (next: VehicleEditFormValue) => void;
  mode: 'view' | 'edit';
}

export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const control = useVehicleControls({
    value: value.vehicle,
    onChange: vehicle => onChange({ ...value, vehicle }),
    mode,
    vehicleTypes: useVehicleTypes(),
  });
  return (
    <FormStack>
      {SIDEBAR_FIELDS.map(key => (
        <Fragment key={key}>{control(key)}</Fragment>
      ))}
    </FormStack>
  );
}
