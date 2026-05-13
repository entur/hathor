import { Stack, TextField, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Vehicle } from './Vehicle';
import type { VehicleModel } from './VehicleModel';

/**
 * Combined Vehicle + VehicleModel form state. Vehicle and VehicleModel are
 * persisted server-side as a 1-to-1 pair; in the UI we treat them as one
 * logical entity with two underlying typed objects.
 *
 * VehicleModel emits only its unique fields on save (per issue #69);
 * overlap fields (Name, Description, TransportTypeRef, BrandingRef,
 * ValidBetween) live on the Vehicle side only.
 */
export interface VehicleEditFormValue {
  vehicle: Vehicle;
  model: VehicleModel;
}

interface VehicleEditFormProps {
  value: VehicleEditFormValue;
  onChange: (next: VehicleEditFormValue) => void;
  mode: 'view' | 'edit';
}

/** First element's `.value` from a TextType[], or '' when missing. */
const firstText = (arr?: { value?: string }[]): string => arr?.[0]?.value ?? '';

/** Wrap a plain string as TextType[]; empty string → undefined (omit from XML). */
const toTextArr = (s: string): { value: string }[] | undefined =>
  s.length === 0 ? undefined : [{ value: s }];

/** Empty string → undefined so optional fields aren't serialised as ''. */
const orUndef = (s: string): string | undefined => (s.length === 0 ? undefined : s);

/**
 * Shared form for create (`/vehicle/new`) and edit (sidebar) flows. Renders
 * Vehicle fields and the VehicleModel-unique fields in one column; mode
 * toggles between view (disabled inputs) and edit. Save logic lives in the
 * hosting page/component, not here.
 *
 * Deferred (per issue #69): date pickers for BuildDate/RegistrationDate,
 * ref pickers for TransportTypeRef/BrandingRef, ValidBetween editor,
 * CustomerServiceContactDetails block.
 */
export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const { t } = useTranslation();
  const v = value.vehicle;
  const m = value.model;
  const ro = mode === 'view';
  const setV = (patch: Partial<Vehicle>) => onChange({ ...value, vehicle: { ...v, ...patch } });
  const setM = (patch: Partial<VehicleModel>) => onChange({ ...value, model: { ...m, ...patch } });

  return (
    <Stack spacing={2}>
      <Typography variant="overline">{t('vehicles.form.vehicleSection', 'Vehicle')}</Typography>

      <TextField
        label={t('vehicles.field.name', 'Name')}
        value={firstText(v.Name)}
        onChange={e => setV({ Name: toTextArr(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.shortName', 'Short Name')}
        value={firstText(v.ShortName)}
        onChange={e => setV({ ShortName: toTextArr(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.description', 'Description')}
        value={firstText(v.Description)}
        onChange={e => setV({ Description: toTextArr(e.target.value) })}
        disabled={ro}
        fullWidth
        multiline
        minRows={2}
      />
      <TextField
        label={t('vehicles.field.registrationNumber', 'Registration Number')}
        value={v.RegistrationNumber ?? ''}
        onChange={e => setV({ RegistrationNumber: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.chassisNumber', 'Chassis Number')}
        value={v.ChassisNumber ?? ''}
        onChange={e => setV({ ChassisNumber: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.buildDate', 'Build Date (YYYY-MM-DD)')}
        value={v.BuildDate ?? ''}
        onChange={e => setV({ BuildDate: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.registrationDate', 'Registration Date (YYYY-MM-DD)')}
        value={v.RegistrationDate ?? ''}
        onChange={e => setV({ RegistrationDate: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.operationalNumber', 'Operational Number')}
        value={v.OperationalNumber ?? ''}
        onChange={e => setV({ OperationalNumber: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.transportTypeRef', 'Transport Type Ref')}
        value={v.TransportTypeRef ?? ''}
        onChange={e => setV({ TransportTypeRef: orUndef(e.target.value) })}
        disabled={ro}
        fullWidth
      />

      <Divider />
      <Typography variant="overline">{t('vehicles.form.modelSection', 'Vehicle Model')}</Typography>

      <TextField
        label={t('vehicles.field.manufacturer', 'Manufacturer')}
        value={firstText(m.Manufacturer)}
        onChange={e => setM({ Manufacturer: toTextArr(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.range', 'Range')}
        type="number"
        value={m.Range ?? ''}
        onChange={e => setM({ Range: e.target.value === '' ? undefined : Number(e.target.value) })}
        disabled={ro}
        fullWidth
      />
      <TextField
        label={t('vehicles.field.fullCharge', 'Full Charge')}
        type="number"
        value={m.FullCharge ?? ''}
        onChange={e =>
          setM({ FullCharge: e.target.value === '' ? undefined : Number(e.target.value) })
        }
        disabled={ro}
        fullWidth
      />
    </Stack>
  );
}
