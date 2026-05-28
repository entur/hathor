import { TextField, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Vehicle } from './types/Vehicle';
import type { VehicleModel } from './types/VehicleModel';
import { firstText } from '../netex/multilingualString.ts';
import { MISSING_TEXT } from './utils/vehicleFormDefaults';
import { intToRef, refToInt } from './utils/transportTypeRef';
import { FormLayout, FieldRow } from '../../components/FormLayout.tsx';

export interface VehicleEditFormValue {
  vehicle: Vehicle;
  model: VehicleModel;
}

interface VehicleEditFormProps {
  value: VehicleEditFormValue;
  onChange: (next: VehicleEditFormValue) => void;
  mode: 'view' | 'edit';
}

const toTextArr = (s: string): { value: string }[] | undefined =>
  s.length === 0 ? undefined : [{ value: s }];

const orUndef = (s: string): string | undefined => (s.length === 0 ? undefined : s);

export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const { t } = useTranslation();
  const v = value.vehicle;
  const m = value.model;
  const ro = mode === 'view';
  const setV = (patch: Partial<Vehicle>) => onChange({ ...value, vehicle: { ...v, ...patch } });
  const setM = (patch: Partial<VehicleModel>) => onChange({ ...value, model: { ...m, ...patch } });

  const transportRef = v.TransportTypeRef ?? '';
  const transportIntValue = refToInt(v.TransportTypeRef);
  // An existing ref the TEMP numeric input can't represent (non-numeric suffix
  // or non-NMR codespace) — render it raw + read-only rather than as a blank/
  // error field that invites accidental overwrite.
  const rawTransportRef = transportRef !== '' && transportIntValue === '';

  return (
    <FormLayout>
      <FieldRow id="vehicle-name" label={t('vehicles.field.name', 'Name')}>
        <TextField
          id="vehicle-name"
          value={firstText(v.Name)}
          onChange={e => setV({ Name: toTextArr(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow
        id="vehicle-registration-number"
        label={t('vehicles.field.registrationNumber', 'Registration Number')}
      >
        <TextField
          id="vehicle-registration-number"
          value={v.RegistrationNumber ?? ''}
          onChange={e => setV({ RegistrationNumber: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      {/* TEMP: bare numeric until Sobek `VehicleTypeFilter.name` lands; swap for
          TransportTypePicker. An existing non-numeric ref renders raw + read-only. */}
      <FieldRow
        id="vehicle-transport-type"
        label={t('vehicles.field.transportType', 'Vehicle Type ID')}
      >
        {rawTransportRef ? (
          <TextField
            id="vehicle-transport-type"
            value={transportRef}
            disabled
            size="small"
            fullWidth
          />
        ) : (
          <TextField
            id="vehicle-transport-type"
            type="number"
            required
            value={transportIntValue}
            onChange={e => setV({ TransportTypeRef: intToRef(e.target.value) })}
            disabled={ro}
            size="small"
            fullWidth
            error={!ro && !transportIntValue}
          />
        )}
      </FieldRow>

      <FieldRow
        id="vehicle-operational-number"
        label={t('vehicles.field.operationalNumber', 'Operational Number')}
      >
        <TextField
          id="vehicle-operational-number"
          value={v.OperationalNumber ?? ''}
          onChange={e => setV({ OperationalNumber: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow
        id="vehicle-chassis-number"
        label={t('vehicles.field.chassisNumber', 'Chassis Number')}
      >
        <TextField
          id="vehicle-chassis-number"
          value={v.ChassisNumber ?? ''}
          onChange={e => setV({ ChassisNumber: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow id="vehicle-build-date" label={t('vehicles.field.buildDate', 'Build Date')}>
        <TextField
          id="vehicle-build-date"
          type="date"
          value={(v.BuildDate ?? '').slice(0, 10)}
          onChange={e => setV({ BuildDate: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow
        id="vehicle-registration-date"
        label={t('vehicles.field.registrationDate', 'Registration Date')}
      >
        <TextField
          id="vehicle-registration-date"
          type="date"
          value={(v.RegistrationDate ?? '').slice(0, 10)}
          onChange={e => setV({ RegistrationDate: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow id="vehicle-description" label={t('vehicles.field.description', 'Description')}>
        <TextField
          id="vehicle-description"
          value={firstText(v.Description)}
          onChange={e => setV({ Description: toTextArr(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />
      <Typography variant="overline" sx={{ gridColumn: '1 / -1' }}>
        {t('vehicles.form.modelSection', 'Model')}
      </Typography>

      <FieldRow id="model-manufacturer" label={t('vehicles.field.manufacturer', 'Manufacturer')}>
        <TextField
          id="model-manufacturer"
          value={firstText(m.Manufacturer)}
          onChange={e => setM({ Manufacturer: toTextArr(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
          placeholder={MISSING_TEXT}
        />
      </FieldRow>

      <FieldRow id="model-range" label={t('vehicles.field.range', 'Range')}>
        <TextField
          id="model-range"
          type="number"
          value={m.Range ?? ''}
          onChange={e =>
            setM({ Range: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow id="model-full-charge" label={t('vehicles.field.fullCharge', 'Full Charge')}>
        <TextField
          id="model-full-charge"
          type="number"
          value={m.FullCharge ?? ''}
          onChange={e =>
            setM({ FullCharge: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );
}
