import type { ReactNode } from 'react';
import {
  Autocomplete,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  type AutocompleteProps,
} from '@mui/material';
import { blankToUndefined } from '../utils/blankToUndefined.ts';

const NUMERIC_WIDTH = '66.667%',
  NUMERIC_FULL_BELOW = '16rem';
// A number rarely needs the whole rail: two thirds wide, unless the form is so
// narrow that two thirds would cramp the value (`fullWidth` then applies).
const NUMERIC_SX = {
  [`@container (min-width: ${NUMERIC_FULL_BELOW})`]: { width: NUMERIC_WIDTH },
};

// Labels stay in the notch above the field, never resting inside it: an editor
// mounts empty and hydrates, which would otherwise animate every label on open,
// and a native date input's dd.mm.yyyy mask would overlap a resting label.
const SHRUNK_LABEL = { inputLabel: { shrink: true } };
// What every text-like field in a sidebar form shares.
const FIELD_BASE = { size: 'small', fullWidth: true, slotProps: SHRUNK_LABEL } as const;

interface FieldProps {
  /** DOM id of the control — external selectors and the label both target it. */
  id: string;
  label: string;
  disabled?: boolean;
}

interface FormTextFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date';
}

/**
 * Single-line text (or date) field for a sidebar form.
 *
 * @param id       DOM id of the input.
 * @param label    Field label.
 * @param value    Current text; `''` when empty.
 * @param onChange Fired with the raw input string on every edit.
 * @param disabled Render the field read-only.
 * @param type     `'date'` for a native date picker; defaults to `'text'`.
 * @returns The labelled field.
 */
export function FormTextField({ id, label, value, onChange, disabled, type }: FormTextFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      {...FIELD_BASE}
    />
  );
}

interface FormNumberFieldProps extends FieldProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

/**
 * Numeric field for a sidebar form. An empty input is reported as `undefined`,
 * never `0` or `NaN`. Two thirds wide inside a `FormStack` with room, full
 * width in a narrow one.
 *
 * @param id       DOM id of the input.
 * @param label    Field label.
 * @param value    Current number; `undefined` renders an empty input.
 * @param onChange Fired with the parsed number, or `undefined` when cleared.
 * @param disabled Render the field read-only.
 * @returns The labelled field.
 */
export function FormNumberField({ id, label, value, onChange, disabled }: FormNumberFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      type="number"
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      disabled={disabled}
      {...FIELD_BASE}
      sx={NUMERIC_SX}
    />
  );
}

interface FormSelectFieldProps<T extends string> extends FieldProps {
  value?: T;
  options: readonly { value: T; label: string }[];
  /** Label of the leading blank option that clears the field. */
  noneLabel: string;
  onChange: (value: T | undefined) => void;
}

/**
 * Single-choice dropdown for a sidebar form, with a leading blank option that
 * clears the field.
 *
 * @param id        DOM id of the select.
 * @param label     Field label.
 * @param value     Selected option value; `undefined` selects the blank option.
 * @param options   Choices, in display order.
 * @param noneLabel Label of the blank option.
 * @param onChange  Fired with the chosen value, or `undefined` for the blank option.
 * @param disabled  Render the field read-only.
 * @returns The labelled field.
 */
export function FormSelectField<T extends string>({
  id,
  label,
  value,
  options,
  noneLabel,
  onChange,
  disabled,
}: FormSelectFieldProps<T>) {
  return (
    <TextField
      id={id}
      label={label}
      select
      value={value ?? ''}
      onChange={e => onChange(blankToUndefined(e.target.value) as T | undefined)}
      disabled={disabled}
      {...FIELD_BASE}
    >
      <MenuItem value="">
        <em>{noneLabel}</em>
      </MenuItem>
      {options.map(o => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

type FormAutocompleteFieldProps<
  T,
  Multiple extends boolean,
  DisableClearable extends boolean,
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, false>,
  'id' | 'renderInput' | 'size' | 'fullWidth'
> &
  Pick<FieldProps, 'id' | 'label'> & {
    required?: boolean;
    error?: boolean;
    helperText?: ReactNode;
  };

/**
 * Searchable single- or multi-choice picker for a sidebar form. Takes MUI
 * `Autocomplete` props as-is, minus the input rendering, which it owns.
 *
 * @param id         DOM id of the combobox input.
 * @param label      Field label.
 * @param required   Mark the field as required.
 * @param error      Render the field in its error state.
 * @param helperText Text or node shown under the field.
 * @returns The labelled picker.
 */
export function FormAutocompleteField<
  T,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
>({
  label,
  required,
  error,
  helperText,
  ...autocompleteProps
}: FormAutocompleteFieldProps<T, Multiple, DisableClearable>) {
  return (
    <Autocomplete<T, Multiple, DisableClearable, false>
      {...autocompleteProps}
      size="small"
      fullWidth
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          // `params.InputLabelProps` carries the label's id/htmlFor wiring.
          slotProps={{ inputLabel: { ...params.InputLabelProps, ...SHRUNK_LABEL.inputLabel } }}
        />
      )}
    />
  );
}

interface FormSwitchFieldProps extends FieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * On/off switch for a sidebar form.
 *
 * @param id       DOM id of the switch input.
 * @param label    Label shown beside the switch.
 * @param checked  Current state.
 * @param onChange Fired with the new state on toggle.
 * @param disabled Render the switch read-only.
 * @returns The labelled switch.
 */
export function FormSwitchField({ id, label, checked, onChange, disabled }: FormSwitchFieldProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          id={id}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          size="small"
        />
      }
      label={label}
    />
  );
}
