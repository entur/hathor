import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { intToRef, refToInt } from '../utils/transportTypeRef';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';

export interface VehicleEditFormValue {
  vehicle: VehicleGQLShaped;
}

interface VehicleEditFormProps {
  value: VehicleEditFormValue;
  onChange: (next: VehicleEditFormValue) => void;
  mode: 'view' | 'edit';
}

const orUndef = (s: string): string | undefined => (s.length === 0 ? undefined : s);

export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const { t } = useTranslation();
  const v = value.vehicle;
  const ro = mode === 'view';
  const setV = (patch: Partial<VehicleGQLShaped>) =>
    onChange({ ...value, vehicle: { ...v, ...patch } });

  const transportRef = v?.transportType?.id ?? '';
  const transportIntValue = refToInt(v?.transportType?.id);
  // An existing ref the TEMP numeric input can't represent (non-numeric suffix
  // or non-NMR codespace) — render it raw + read-only rather than as a blank/
  // error field that invites accidental overwrite.
  const rawTransportRef = transportRef !== '' && transportIntValue === '';

  return (
    <FormLayout>
      <FieldRow id="vehicle-name" label={t('vehicles.field.name', 'Name')}>
        <TextField
          id="vehicle-name"
          value={v.name?.value ?? ''}
          onChange={e => setV({ name: { lang: v.name?.lang, value: e.target.value } })}
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
          value={v.registrationNumber}
          onChange={e => setV({ registrationNumber: orUndef(e.target.value) })}
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
            onChange={e => setV({ transportType: { id: intToRef(e.target.value) } })}
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
          value={v.operationalNumber ?? ''}
          onChange={e => setV({ operationalNumber: orUndef(e.target.value) })}
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
          value={v.chassisNumber ?? ''}
          onChange={e => setV({ chassisNumber: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow id="vehicle-build-date" label={t('vehicles.field.buildDate', 'Build Date')}>
        <TextField
          id="vehicle-build-date"
          type="date"
          value={(v.buildDate ?? '').slice(0, 10)}
          onChange={e => setV({ buildDate: orUndef(e.target.value) })}
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
          value={(v.registrationDate ?? '').slice(0, 10)}
          onChange={e => setV({ registrationDate: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>

      <FieldRow id="vehicle-description" label={t('vehicles.field.description', 'Description')}>
        <TextField
          id="vehicle-description"
          value={v.description?.value ?? ''}
          onChange={e =>
            setV({ description: { lang: v.description?.lang, value: e.target.value } })
          }
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );
}
