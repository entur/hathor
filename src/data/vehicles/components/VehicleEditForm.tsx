import { Autocomplete, Link, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { mergeNameText } from '../../netex/multilingualString.ts';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';

type VTOption = { id: string; name: string };

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

  const {
    allData: vehicleTypes,
    loading: vtLoading,
    error: vtError,
    refetch: refetchVehicleTypes,
  } = useVehicleTypes();
  const currentVtId = v?.transportType?.id;
  const currentVtName = v.transportType?.name?.value;
  // One memo for the four derived bits (option list + selection) so that
  // typing in sibling fields doesn't hand `Autocomplete` a fresh `options`
  // reference each keystroke.
  const { options: vtOptionsWithOrphan, value: currentVtOption } = useMemo(() => {
    const opts: VTOption[] = vehicleTypes.map(vt => ({
      id: vt.id,
      name: vt.name?.value ?? vt.id,
    }));
    const known = opts.find(o => o.id === currentVtId);
    // Preserve an externally-set ref (e.g. Autosys-imported non-numeric) as a
    // one-off option so the user still sees it AND can swap it. Prefer the
    // vehicle's embedded name over the bare id so the label is human-friendly
    // before/while `vehicleTypes` resolves.
    const orphan: VTOption | null =
      currentVtId && !known ? { id: currentVtId, name: currentVtName ?? currentVtId } : null;
    return {
      options: orphan ? [orphan, ...opts] : opts,
      value: known ?? orphan ?? null,
    };
  }, [vehicleTypes, currentVtId, currentVtName]);

  return (
    <FormLayout>
      <FieldRow id="vehicle-name" label={t('vehicles.field.name', 'Name')}>
        <TextField
          id="vehicle-name"
          value={v.name?.value ?? ''}
          onChange={e => setV({ name: mergeNameText(v.name, e.target.value) })}
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

      <FieldRow
        id="vehicle-transport-type"
        label={t('vehicles.field.transportType', 'Vehicle Type')}
      >
        <Autocomplete<VTOption, false, true>
          options={vtOptionsWithOrphan}
          // VehicleType is required, so the picker is non-clearable; MUI's
          // type-level `disableClearable` strips null from the value type, but
          // null is the legitimate initial state on /vehicles/new — MUI tolerates
          // it at runtime, hence the cast.
          value={currentVtOption as VTOption}
          disableClearable
          loading={vtLoading}
          disabled={ro}
          getOptionLabel={o => o.name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          loadingText={t('vehicleTypePicker.loading', 'Loading vehicle types…')}
          noOptionsText={t('vehicleTypePicker.noOptions', 'No vehicle types')}
          onChange={(_e, opt) => setV({ transportType: { id: opt.id } })}
          size="small"
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              // MUI Autocomplete sets `params.inputProps.id` on the inner input;
              // override there so external selectors (#vehicle-transport-type,
              // FieldRow's htmlFor) actually land on the focusable combobox.
              inputProps={{ ...params.inputProps, id: 'vehicle-transport-type' }}
              size="small"
              required
              aria-label={t('vehicles.field.transportType', 'Vehicle Type')}
              error={!ro && !currentVtId}
              helperText={
                vtError ? (
                  <>
                    {vtError}{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => void refetchVehicleTypes().catch(() => {})}
                    >
                      {t('common.retry', 'Retry')}
                    </Link>
                  </>
                ) : undefined
              }
            />
          )}
        />
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
          onChange={e => setV({ description: mergeNameText(v.description, e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );
}
