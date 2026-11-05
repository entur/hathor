import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BusPictureFrame } from '../../../components/bus-picture/index.ts';
import { FormSections, resolveSections } from '../../../components/form-layout/index.ts';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.ts';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { VEHICLE_TYPES_NEXT_PATH } from '../../vehicle-types/components/VehicleTypeCollectionPage.tsx';
import { useVehicleControls } from '../hooks/useVehicleControls.tsx';
import { vehicleFields, vehicleLayout, type VehicleField } from '../types/vehicleFields.ts';
import type { Vehicle } from '../types/vehicle.ts';

const PICTURE_DEBOUNCE_MS = 400;

const SECTIONS = resolveSections(vehicleFields, vehicleLayout);
const typeHref = (id: string) => `${VEHICLE_TYPES_NEXT_PATH}/${encodeURIComponent(id)}`;

interface VehicleSectionsProps {
  value: Vehicle;
  onChange: (next: Vehicle) => void;
  mode: 'view' | 'edit';
}

/**
 * The form page's Vehicle body (#285): `vehicleLayout`'s one flat section, with the
 * vehicle drawn as a red bus in its type's dims above it — "Select type" until it has
 * one. View mode is read-only, not greyed out.
 *
 * @param {VehicleSectionsProps} props value, onChange and mode
 * @returns {JSX.Element} the section and the picture
 */
export default function VehicleSections(form: VehicleSectionsProps) {
  const { t } = useTranslation();
  // The type picker's options, and the picture's dims by the picked type.
  const vehicleTypes = useVehicleTypes();
  const control = useVehicleControls({ ...form, vehicleTypes, lock: 'readOnly', typeHref });
  const typeId = form.value.transportType?.id;
  const type = vehicleTypes.allData.find(vt => vt.id === typeId);
  const { length, width, height } = type ?? {};
  // The picture follows the type once picking pauses: each new one is a WebGL shot.
  const dims = useDebouncedValue(
    useMemo(() => ({ length, width, height }), [length, width, height]),
    PICTURE_DEBOUNCE_MS
  );

  return (
    <FormSections
      sections={SECTIONS}
      renderField={f => control(f.key as VehicleField)}
      aside={
        <BusPictureFrame
          dims={dims}
          paint="vehicle"
          mode={type?.transportMode ?? form.value.transportType?.transportMode}
          placeholder={typeId ? undefined : t('vehicles.selectType')}
        />
      }
    />
  );
}
