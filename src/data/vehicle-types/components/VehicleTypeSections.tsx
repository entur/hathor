import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BusPictureFrame } from '../../../components/bus-picture/index.ts';
import {
  FormSections,
  resolveSections,
  type Layout,
} from '../../../components/form-layout/index.ts';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.ts';
import { useVehicleTypeControls } from '../hooks/useVehicleTypeControls.tsx';
import { vehicleTypeFields, type VehicleTypeField } from '../types/vehicleTypeFields.ts';
import {
  VEHICLE_TYPE_SECTION_IDS,
  VEHICLE_TYPE_SECTION_LABEL,
  vehicleTypeSections,
} from '../types/vehicleTypeLayout.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { CodeValue } from '../../code-values/types/codeValueTypes.ts';
import { VEHICLES_NEXT_PATH } from '../../vehicles/components/VehicleCollectionPage.tsx';

const PICTURE_DEBOUNCE_MS = 400;

const vehicleHref = (id: string) => `${VEHICLES_NEXT_PATH}/${encodeURIComponent(id)}`;

interface VehicleTypeSectionsProps {
  value: VehicleType;
  onChange: (next: VehicleType) => void;
  mode: 'view' | 'edit';
  euroClasses: readonly CodeValue[];
  /** A create: a record not yet saved has no vehicles to list. */
  isCreate: boolean;
}

/**
 * The form page's VehicleType body (#280): `vehicleTypeSections` stacked, with
 * the table of contents (V3) and the type drawn as a bus above it. View mode is
 * read-only, not greyed out.
 *
 * @param {VehicleTypeSectionsProps} props value, onChange, mode, euro classes, create flag
 * @returns {JSX.Element} the sections, their table of contents and the picture
 */
export default function VehicleTypeSections({ isCreate, ...form }: VehicleTypeSectionsProps) {
  const { t } = useTranslation();
  const control = useVehicleTypeControls({ ...form, lock: 'readOnly', vehicleHref });
  const sections = useMemo(() => {
    const layout: Layout<VehicleTypeField> = Object.fromEntries(
      VEHICLE_TYPE_SECTION_IDS.filter(s => !(isCreate && s === 'vehicles')).map(s => [
        t(VEHICLE_TYPE_SECTION_LABEL[s]),
        vehicleTypeSections[s],
      ])
    );
    return resolveSections(vehicleTypeFields, layout);
  }, [isCreate, t]);
  const { value } = form;
  const { length, width, height } = value;
  // The picture follows the dims once typing pauses: each new one is a WebGL shot.
  const dims = useDebouncedValue(
    useMemo(() => ({ length, width, height }), [length, width, height]),
    PICTURE_DEBOUNCE_MS
  );

  return (
    <FormSections
      sections={sections}
      renderField={f => control(f.key as VehicleTypeField)}
      tocLabel={t('formSections.toc')}
      aside={<BusPictureFrame dims={dims} paint="vehicleType" mode={value.transportMode} />}
    />
  );
}
