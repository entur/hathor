import { useMemo, type ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FormAutocompleteField,
  FormNumberField,
  FormSelectField,
  FormSwitchField,
  FormTextField,
} from '../../../components/FormFields.tsx';
import {
  TRANSPORT_MODES,
  transportModeLabelKey,
  type TransportMode,
} from '../../netex/transportMode.ts';
import { vehicleSelectedHref } from '../../vehicles/utils/vehicleUrlParams.ts';
import { mergeNameText } from '../../netex/multilingualString.ts';
import type { VehicleType, PassengerCapacity } from '../types/vehicleTypeTypes.ts';
import { vehicleTypeFields, type VehicleTypeField } from '../types/vehicleTypeFields.ts';
import { rawValue, type FieldSpec } from '../../../components/collection/index.ts';
import type { CodeValue } from '../../code-values/types/codeValueTypes.ts';
import { codeValueOpts } from '../../code-values/utils/codeValueOpts.ts';

// A field's DOM id: `vtype-low-floor` for `lowFloor`, as e2e selectors know them.
const kebab = (key: string) => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);

export interface VehicleTypeControlsOptions {
  value: VehicleType;
  onChange: (next: VehicleType) => void;
  mode: 'view' | 'edit';
  /** Sobek's emission-standard code list; the stored value is always offered too. */
  euroClasses: readonly CodeValue[];
  /** How view mode locks a field: `disabled` (the sidebar) or `readOnly` (the form page, #267). */
  lock?: 'disabled' | 'readOnly';
  /** Where a Vehicles chip links: the sidebar's `?selected=` by default, the vehicle's form
   *  page on a form page (#285). */
  vehicleHref?: (id: string) => string;
}

/**
 * One control per vehicle-type field, so the sidebar's tabs and the form page's
 * sections draw the same fields. Most follow `vehicleTypeFields` (kind, path, enum
 * values); a few are drawn by hand.
 *
 * @param {VehicleTypeControlsOptions} options value, onChange, mode, euro classes and view-mode lock
 * @returns {(key: VehicleTypeField) => ReactNode} the control for a field key (nothing for
 *   a key the form doesn't edit)
 */
export function useVehicleTypeControls({
  value,
  onChange,
  mode,
  euroClasses,
  lock = 'disabled',
  vehicleHref = vehicleSelectedHref,
}: VehicleTypeControlsOptions): (key: VehicleTypeField) => ReactNode {
  const { t } = useTranslation();
  const transportModeOptions = useMemo(
    () => TRANSPORT_MODES.map(m => ({ value: m, label: t(transportModeLabelKey(m), m) })),
    [t]
  );
  const locked = mode === 'view' ? { [lock]: true } : {};
  const label = (key: VehicleTypeField) => t(`vehicleType.field.${key}`);

  const setField = (patch: Partial<VehicleType>) => onChange({ ...value, ...patch });
  const setCapacity = (patch: Partial<PassengerCapacity>) => {
    const merged = { ...value.passengerCapacity, ...patch };
    // Collapse back to `undefined` when every count is cleared so the object
    // doesn't linger as `{}` and read as dirty vs an absent baseline.
    const hasAny = Object.values(merged).some(v => v != null);
    onChange({ ...value, passengerCapacity: hasAny ? merged : undefined });
  };

  return key => {
    // The fields the field mapping can't describe: a multilingual name, localized mode
    // labels, a code list, and the linked vehicles.
    switch (key) {
      case 'name':
        return (
          <FormTextField
            id="vtype-name"
            label={label(key)}
            value={value.name?.value ?? ''}
            onChange={text => setField({ name: mergeNameText(value.name, text) })}
            {...locked}
          />
        );
      case 'transportMode':
        return (
          <FormSelectField<TransportMode>
            id="vtype-transport-mode"
            label={label(key)}
            // `transportMode` is normalised to a canonical mode (or undefined)
            // at projection, so it always matches an option or the blank one
            // — no MUI out-of-range value, no read/write skew.
            value={value.transportMode}
            options={transportModeOptions}
            noneLabel={t('common.none')}
            onChange={transportMode => setField({ transportMode })}
            {...locked}
          />
        );
      case 'euroClass':
        return (
          <FormSelectField
            id="vtype-euro-class"
            label={label(key)}
            value={value.euroClass}
            // `euroClass` is a free String in Sobek, so `codeValueOpts` keeps
            // an out-of-list stored value as an option — a full-document save
            // must not blank it.
            options={codeValueOpts(euroClasses, value.euroClass)}
            noneLabel={t('common.none')}
            onChange={euroClass => setField({ euroClass })}
            {...locked}
          />
        );
      case 'vehicles':
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, py: 0.5 }}>
            {value.vehicles?.length ? (
              value.vehicles.map(v => (
                <Chip
                  key={v.id}
                  component={RouterLink}
                  to={vehicleHref(v.id)}
                  clickable
                  size="small"
                  variant="outlined"
                  label={
                    <>
                      {v.registrationNumber}
                      {v.operationalNumber && (
                        <Box component="span" sx={{ color: 'primary.main', ml: 0.5 }}>
                          ({v.operationalNumber})
                        </Box>
                      )}
                    </>
                  }
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('vehicleType.noVehicles')}
              </Typography>
            )}
          </Box>
        );
    }
    // The rest by the field mapping's kind and path.
    const spec: FieldSpec = vehicleTypeFields[key];
    const own = rawValue(value, spec);
    const set = (v: unknown) => setField({ [key]: v } as Partial<VehicleType>);
    switch (spec.kind) {
      case 'number': {
        const cap = spec.path[0] === 'passengerCapacity';
        return (
          <FormNumberField
            id={cap ? `vtype-cap-${key}` : `vtype-${key}`}
            label={label(key)}
            value={own as number | undefined}
            onChange={cap ? n => setCapacity({ [key]: n }) : set}
            {...locked}
          />
        );
      }
      case 'switch':
        return (
          <FormSwitchField
            id={`vtype-${kebab(key)}`}
            label={label(key)}
            checked={!!own}
            onChange={set}
            {...locked}
          />
        );
      case 'enum':
        return (
          <FormSelectField
            id={`vtype-${kebab(key)}`}
            label={label(key)}
            value={own as string | undefined}
            options={(spec.options ?? []).map(o => ({ value: o, label: o }))}
            noneLabel={t('common.none')}
            onChange={set}
            {...locked}
          />
        );
      case 'enumMulti':
        return (
          <FormAutocompleteField<string, true>
            id={`vtype-${kebab(key)}`}
            label={label(key)}
            multiple
            options={spec.options ?? []}
            value={(own as string[] | undefined) ?? []}
            onChange={(_e, v) => set(v.length ? v : undefined)}
            disableCloseOnSelect
            {...locked}
          />
        );
      default:
        return null;
    }
  };
}
