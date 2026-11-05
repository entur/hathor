import { useMemo, type ReactNode } from 'react';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormAutocompleteField, FormTextField } from '../../../components/FormFields.tsx';
import { blankToUndefined } from '../../../utils/blankToUndefined.ts';
import { mergeNameText } from '../../netex/multilingualString.ts';
import type { useVehicleTypes } from '../../vehicle-types/hooks/useVehicleTypes.ts';
import type { Vehicle } from '../types/vehicle.ts';
import type { VehicleField } from '../types/vehicleFields.ts';

type VTOption = { id: string; name: string };

export interface VehicleControlsOptions {
  value: Vehicle;
  onChange: (next: Vehicle) => void;
  mode: 'view' | 'edit';
  /** The org's vehicle types, the type picker's options: the host's `useVehicleTypes()`. */
  vehicleTypes: Pick<
    ReturnType<typeof useVehicleTypes>,
    'allData' | 'loading' | 'error' | 'refetch'
  >;
  /** How view mode locks a field: `disabled` (the sidebar) or `readOnly` (the form page, #267). */
  lock?: 'disabled' | 'readOnly';
  /** The picked type's form page; set → a link to it under the type picker (#285). */
  typeHref?: (id: string) => string;
}

/**
 * One control per vehicle field, so the sidebar's form and the form page's section
 * draw the same fields (#285).
 *
 * @param {VehicleControlsOptions} options value, onChange, mode, vehicle types, view-mode lock
 *   and the type link
 * @returns {(key: VehicleField) => ReactNode} the control for a field key (nothing for a key
 *   the form doesn't edit)
 */
export function useVehicleControls({
  value: v,
  onChange,
  mode,
  vehicleTypes,
  lock = 'disabled',
  typeHref,
}: VehicleControlsOptions): (key: VehicleField) => ReactNode {
  const { t } = useTranslation();
  const ro = mode === 'view';
  const locked = ro ? { [lock]: true } : {};
  const setV = (patch: Partial<Vehicle>) => onChange({ ...v, ...patch });
  const {
    allData,
    loading: vtLoading,
    error: vtError,
    refetch: refetchVehicleTypes,
  } = vehicleTypes;
  const currentVtId = v?.transportType?.id;
  const currentVtName = v.transportType?.name?.value;
  // One memo for the four derived bits (option list + selection) so that
  // typing in sibling fields doesn't hand `Autocomplete` a fresh `options`
  // reference each keystroke.
  const { options: vtOptionsWithOrphan, value: currentVtOption } = useMemo(() => {
    const opts: VTOption[] = allData.map(vt => ({
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
  }, [allData, currentVtId, currentVtName]);

  const text = (key: VehicleField, id: string, own: string | undefined, type?: 'date') => (
    <FormTextField
      id={id}
      label={t(`vehicles.field.${key}`)}
      type={type}
      // A date input reads `yyyy-mm-dd`; Sobek may hand back a full timestamp.
      value={type ? (own ?? '').slice(0, 10) : (own ?? '')}
      onChange={text => setV({ [key]: blankToUndefined(text) })}
      {...locked}
    />
  );

  return key => {
    switch (key) {
      case 'name':
      case 'description':
        return (
          <FormTextField
            id={`vehicle-${key}`}
            label={t(`vehicles.field.${key}`)}
            value={v[key]?.value ?? ''}
            onChange={text => setV({ [key]: mergeNameText(v[key], text) })}
            {...locked}
          />
        );
      case 'registrationNumber':
        return text(key, 'vehicle-registration-number', v.registrationNumber);
      case 'operationalNumber':
        return text(key, 'vehicle-operational-number', v.operationalNumber);
      case 'chassisNumber':
        return text(key, 'vehicle-chassis-number', v.chassisNumber);
      case 'buildDate':
        return text(key, 'vehicle-build-date', v.buildDate, 'date');
      case 'registrationDate':
        return text(key, 'vehicle-registration-date', v.registrationDate, 'date');
      case 'transportType':
        return (
          <FormAutocompleteField<VTOption, false, true>
            id="vehicle-transport-type"
            label={t('vehicles.field.transportType')}
            options={vtOptionsWithOrphan}
            // VehicleType is required, so the picker is non-clearable; MUI's
            // type-level `disableClearable` strips null from the value type, but
            // null is the legitimate initial state on /vehicles/new — MUI tolerates
            // it at runtime, hence the cast.
            value={currentVtOption as VTOption}
            disableClearable
            loading={vtLoading}
            {...locked}
            getOptionLabel={o => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            loadingText={t('vehicleTypePicker.loading')}
            noOptionsText={t('vehicleTypePicker.noOptions')}
            onChange={(_e, opt) => setV({ transportType: { id: opt.id } })}
            required
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
              ) : typeHref && currentVtId ? (
                <Link component={RouterLink} to={typeHref(currentVtId)}>
                  {t('vehicles.openVehicleType')}
                </Link>
              ) : undefined
            }
          />
        );
      default:
        return null;
    }
  };
}
