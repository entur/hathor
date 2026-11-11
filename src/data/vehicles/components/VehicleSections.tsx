import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BusPictureFrame } from '../../../components/bus-picture/index.ts';
import { FormSections, resolveSections } from '../../../components/form-layout/index.ts';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { vehicleTypeFormHref } from '../../vehicle-types/utils/vehicleTypeUrlParams.ts';
import { useVehicleControls } from '../hooks/useVehicleControls.tsx';
import { vehicleFields, vehicleLayout } from '../types/vehicleFields.ts';
import { vehiclePictureMode, type Vehicle } from '../types/vehicle.ts';

const SECTIONS = resolveSections(vehicleFields, vehicleLayout);

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
  const control = useVehicleControls({
    ...form,
    vehicleTypes,
    typeHref: vehicleTypeFormHref,
  });
  const typeId = form.value.transportType?.id;
  const type = vehicleTypes.allData.find(vt => vt.id === typeId);
  const { length, width, height } = type ?? {};
  // A type changes in one pick, not per keystroke: no debounce, one shot per type.
  const dims = useMemo(() => ({ length, width, height }), [length, width, height]);

  return (
    <FormSections
      sections={SECTIONS}
      renderField={f => control(f.key)}
      aside={
        <BusPictureFrame
          dims={dims}
          paint="vehicle"
          mode={vehiclePictureMode(form.value, type)}
          placeholder={typeId ? undefined : t('vehicles.selectType')}
        />
      }
    />
  );
}
