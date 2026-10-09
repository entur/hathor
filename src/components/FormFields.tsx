import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';

// A native date input always shows its dd.mm.yyyy mask, so the label must stay
// in the notch or the two overlap.
const SHRUNK_LABEL = { inputLabel: { shrink: true } };

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
      slotProps={type === 'date' ? SHRUNK_LABEL : undefined}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      size="small"
      fullWidth
    />
  );
}

interface FormNumberFieldProps extends FieldProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

/**
 * Numeric field for a sidebar form. An empty input is reported as `undefined`,
 * never `0` or `NaN`.
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
      size="small"
      fullWidth
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
      onChange={e => onChange((e.target.value || undefined) as T | undefined)}
      disabled={disabled}
      size="small"
      fullWidth
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
