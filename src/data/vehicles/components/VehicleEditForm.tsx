import { Autocomplete, Link, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import { mergeNameText } from '../../netex/multilingualString.ts';
import { FormStack } from '../../../components/FormLayout.tsx';
import { FormTextField } from '../../../components/FormFields.tsx';
import { blankToUndefined } from '../../../utils/blankToUndefined.ts';
import type { Vehicle } from '../types/vehicle.ts';

type VTOption = { id: string; name: string };

export interface VehicleEditFormValue {
  vehicle: Vehicle;
}

interface VehicleEditFormProps {
  value: VehicleEditFormValue;
  onChange: (next: VehicleEditFormValue) => void;
  mode: 'view' | 'edit';
}

export default function VehicleEditForm({ value, onChange, mode }: VehicleEditFormProps) {
  const { t } = useTranslation();
  const v = value.vehicle;
  const ro = mode === 'view';
  const setV = (patch: Partial<Vehicle>) => onChange({ ...value, vehicle: { ...v, ...patch } });

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
    <FormStack>
      <FormTextField
        id="vehicle-name"
        label={t('vehicles.field.name')}
        value={v.name?.value ?? ''}
        onChange={text => setV({ name: mergeNameText(v.name, text) })}
        disabled={ro}
      />

      <FormTextField
        id="vehicle-registration-number"
        label={t('vehicles.field.registrationNumber')}
        value={v.registrationNumber ?? ''}
        onChange={text => setV({ registrationNumber: blankToUndefined(text) })}
        disabled={ro}
      />

      <Autocomplete<VTOption, false, true>
        // On the Autocomplete, not the TextField: this is the id MUI puts on
        // the focusable combobox input and points the label at.
        id="vehicle-transport-type"
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
        loadingText={t('vehicleTypePicker.loading')}
        noOptionsText={t('vehicleTypePicker.noOptions')}
        onChange={(_e, opt) => setV({ transportType: { id: opt.id } })}
        size="small"
        fullWidth
        renderInput={params => (
          <TextField
            {...params}
            size="small"
            required
            label={t('vehicles.field.transportType')}
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
                    {t('common.retry')}
                  </Link>
                </>
              ) : undefined
            }
          />
        )}
      />

      <FormTextField
        id="vehicle-operational-number"
        label={t('vehicles.field.operationalNumber')}
        value={v.operationalNumber ?? ''}
        onChange={text => setV({ operationalNumber: blankToUndefined(text) })}
        disabled={ro}
      />

      <FormTextField
        id="vehicle-chassis-number"
        label={t('vehicles.field.chassisNumber')}
        value={v.chassisNumber ?? ''}
        onChange={text => setV({ chassisNumber: blankToUndefined(text) })}
        disabled={ro}
      />

      <FormTextField
        id="vehicle-build-date"
        label={t('vehicles.field.buildDate')}
        type="date"
        value={(v.buildDate ?? '').slice(0, 10)}
        onChange={text => setV({ buildDate: blankToUndefined(text) })}
        disabled={ro}
      />

      <FormTextField
        id="vehicle-registration-date"
        label={t('vehicles.field.registrationDate')}
        type="date"
        value={(v.registrationDate ?? '').slice(0, 10)}
        onChange={text => setV({ registrationDate: blankToUndefined(text) })}
        disabled={ro}
      />

      <FormTextField
        id="vehicle-description"
        label={t('vehicles.field.description')}
        value={v.description?.value ?? ''}
        onChange={text => setV({ description: mergeNameText(v.description, text) })}
        disabled={ro}
      />
    </FormStack>
  );
}
