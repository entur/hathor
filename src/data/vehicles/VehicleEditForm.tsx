import type { ReactNode } from 'react';
import { Box, InputLabel, TextField, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Vehicle } from './xml/Vehicle';
import type { VehicleModel } from './xml/VehicleModel';
import { firstText } from '../netex/multilingualString.ts';

export const LABEL_COL_MIN = '8rem';
export const LABEL_COL_MAX = '12rem';
export const COL_GAP = 2;
export const ROW_GAP = 1.25;
const DATE_PLACEHOLDER = 'YYYY-MM-DD';

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

interface FieldRowProps {
  id: string;
  label: string;
  alignTop?: boolean;
  children: ReactNode;
}

/**
 * Two-column form row using CSS Grid `display: contents` so the InputLabel
 * and the input become direct grid items of the parent grid. Keeps label↔input
 * pairing explicit in JSX while letting a single parent grid guarantee column
 * alignment across all rows.
 */
function FieldRow({ id, label, alignTop, children }: FieldRowProps) {
  return (
    <Box sx={{ display: 'contents' }}>
      <InputLabel
        htmlFor={id}
        sx={{
          alignSelf: alignTop ? 'start' : 'center',
          pt: alignTop ? 1 : 0,
          mb: 0,
          fontSize: '0.875rem',
          color: 'text.primary',
          whiteSpace: 'normal',
        }}
      >
        {label}
      </InputLabel>
      {children}
    </Box>
  );
}

export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const { t } = useTranslation();
  const v = value.vehicle;
  const m = value.model;
  const ro = mode === 'view';
  const setV = (patch: Partial<Vehicle>) => onChange({ ...value, vehicle: { ...v, ...patch } });
  const setM = (patch: Partial<VehicleModel>) => onChange({ ...value, model: { ...m, ...patch } });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: `minmax(${LABEL_COL_MIN}, ${LABEL_COL_MAX}) 1fr` },
        columnGap: COL_GAP,
        rowGap: ROW_GAP,
        alignItems: 'center',
      }}
    >
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
          value={v.BuildDate ?? ''}
          onChange={e => setV({ BuildDate: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
          placeholder={DATE_PLACEHOLDER}
        />
      </FieldRow>

      <FieldRow
        id="vehicle-registration-date"
        label={t('vehicles.field.registrationDate', 'Registration Date')}
      >
        <TextField
          id="vehicle-registration-date"
          value={v.RegistrationDate ?? ''}
          onChange={e => setV({ RegistrationDate: orUndef(e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
          placeholder={DATE_PLACEHOLDER}
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
    </Box>
  );
}
