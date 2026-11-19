import { useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  type AutocompleteProps,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { blankToUndefined } from '../utils/blankToUndefined.ts';
import { FormResetContext } from './form-layout/formResetContext.ts';
import { CAN_HOVER, FIELD_BORDER, HOVER_FILL, ringOn } from '../theme/createThemeFromConfig.ts';

// What every text-like field in a sidebar form shares: Linje's 48 px field, its label inside
// the box until focused or filled — MUI's small filled field (createThemeFromConfig
// `MuiFilledInput`). Its width is the form layout's (`KIND_WIDTH`, at most two per row).
export const FIELD_BASE = { fullWidth: true, variant: 'filled', size: 'small' } as const;

// Linje Checkbox (`@entur/form` Checkbox.scss:170-183, `form/Checkbox/Standard/*`): a 20 px box,
// 2 px accent border, radius 2 (legacy medium / 2), accent fill and white check when checked.
// Read-only keeps the field border: Linje's #e3e6e8 is 1.25:1 on white (WCAG 1.4.11).
const BOX_PX = 20,
  BOX_BORDER_PX = 2,
  BOX_RADIUS_PX = 2,
  CHECK_PX = 16,
  CHECKED_HOVER = '#393d79', // Fill-SelectedHover
  // MUI's FormControlLabel pulls the control in by 11 px: an 11 px pad puts the box on the
  // field edge, with a 42 px target (WCAG 2.5.8).
  CHECKBOX_PAD_PX = 11;
/** A checkbox row's height: the box and its padding (`FormSkeleton` draws it). */
export const CHECKBOX_ROW_PX = BOX_PX + 2 * CHECKBOX_PAD_PX;
const BOX = 'FormCheckbox-box';

/** The drawn box: MUI's checkbox takes it as `icon` / `checkedIcon`. */
const CheckBoxIcon = ({ checked, readOnly }: { checked?: boolean; readOnly?: boolean }) => (
  <Box
    component="span"
    className={BOX}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: BOX_PX,
      height: BOX_PX,
      border: `${BOX_BORDER_PX}px solid`,
      borderRadius: `${BOX_RADIUS_PX}px`,
      borderColor: readOnly ? FIELD_BORDER : 'primary.main',
      bgcolor: checked && !readOnly ? 'primary.main' : 'transparent',
      color: readOnly ? 'primary.main' : 'common.white',
    }}
  >
    {checked && <CheckIcon sx={{ fontSize: CHECK_PX }} />}
  </Box>
);

interface FieldProps {
  /** DOM id of the control — external selectors and the label both target it. */
  id: string;
  label: string;
  disabled?: boolean;
  /** Shown as is, not greyed out: a form page's view mode (#267). The value stays selectable. */
  readOnly?: boolean;
}

/**
 * `FIELD_BASE` plus the read-only input, and a label held at the top when `pinLabel` is
 * set: a native date input always shows its dd/mm/yyyy mask, which a resting label overlaps.
 */
const fieldBase = (readOnly?: boolean, pinLabel?: boolean) => ({
  ...FIELD_BASE,
  slotProps: {
    ...(readOnly && { input: { readOnly } }),
    ...(pinLabel && { inputLabel: { shrink: true } }),
  },
});

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
 * @param disabled Render the field greyed out.
 * @param readOnly Render the field read-only, not greyed out.
 * @param type     `'date'` for a native date picker; defaults to `'text'`.
 * @returns The labelled field.
 */
export function FormTextField({
  id,
  label,
  value,
  onChange,
  disabled,
  readOnly,
  type,
}: FormTextFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      {...fieldBase(readOnly, type === 'date')}
    />
  );
}

interface FormNumberFieldProps extends FieldProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

/** A typed number: digits, an optional sign, `.` or `,` as the decimal mark. */
const NUMBER_RE = /^[-+]?(\d+([.,]\d*)?|[.,]\d+)$/;

/** Parse what was typed: `undefined` when blank, `null` when it is not a number. */
const parseNumber = (text: string): number | undefined | null => {
  const s = text.trim();
  if (s === '') return undefined;
  if (!NUMBER_RE.test(s)) return null;
  const n = Number(s.replace(',', '.'));
  // Too many digits read as Infinity, which JSON sends as null: not a number either.
  return Number.isFinite(n) ? n : null;
};

/**
 * Numeric field for a sidebar form: a text input with a number keypad, as Linje has no
 * stepper. A blank input is reported as `undefined`, never `0` or `NaN`; text that is not a
 * number shows an error and is not reported, so the form keeps its last number. Its width is
 * the form layout's (`KIND_WIDTH`: half a row).
 *
 * @param id       DOM id of the input.
 * @param label    Field label.
 * @param value    Current number; `undefined` renders an empty input.
 * @param onChange Fired with the parsed number, or `undefined` when cleared.
 * @param disabled Render the field greyed out.
 * @param readOnly Render the field read-only, not greyed out.
 * @returns The labelled field.
 */
export function FormNumberField({
  id,
  label,
  value,
  onChange,
  disabled,
  readOnly,
}: FormNumberFieldProps) {
  const { t } = useTranslation();
  // The typed text, kept so a bad entry stays visible; reset when the value changes elsewhere
  // (load, cancel).
  const [text, setText] = useState(String(value ?? ''));
  const [shown, setShown] = useState(value);
  // Cancel or a re-read can put back the very number shown: the reset key says so.
  const reset = useContext(FormResetContext);
  const [seenReset, setSeenReset] = useState(reset);
  const parsed = parseNumber(text);
  if (value !== shown || reset !== seenReset) {
    setShown(value);
    setSeenReset(reset);
    if (parsed !== value) setText(String(value ?? ''));
  }
  const bad = parsed === null;
  const { slotProps, ...base } = fieldBase(readOnly);
  return (
    <TextField
      id={id}
      label={label}
      value={text}
      onChange={e => {
        setText(e.target.value);
        const n = parseNumber(e.target.value);
        if (n !== null) {
          setShown(n);
          onChange(n);
        }
      }}
      disabled={disabled}
      error={bad}
      helperText={bad ? t('common.notANumber') : undefined}
      {...base}
      // Phones show a number keypad.
      slotProps={{ ...slotProps, htmlInput: { inputMode: 'decimal' } }}
    />
  );
}

interface FormSelectFieldProps<T extends string> extends FieldProps {
  value?: T;
  options: readonly { value: T; label: string }[];
  /** Label of a leading blank option that clears the field; none without it (a required pick). */
  noneLabel?: string;
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
 * @param noneLabel Label of the blank option; omit it for a required pick.
 * @param onChange  Fired with the chosen value, or `undefined` for the blank option.
 * @param disabled  Render the field greyed out.
 * @param readOnly  Render the field read-only (the menu doesn't open), not greyed out.
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
  readOnly,
}: FormSelectFieldProps<T>) {
  return (
    <TextField
      id={id}
      label={label}
      select
      value={value ?? ''}
      onChange={e => onChange(blankToUndefined(e.target.value) as T | undefined)}
      disabled={disabled}
      {...fieldBase(readOnly)}
    >
      {noneLabel !== undefined && (
        <MenuItem value="">
          <em>{noneLabel}</em>
        </MenuItem>
      )}
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
          variant="filled"
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}

interface FormCheckboxFieldProps extends FieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Yes/no checkbox for a form (user test S12: Linje's Switch is for actions that take effect at
 * once; a choice saved later is a Checkbox).
 *
 * @param id       DOM id of the checkbox input.
 * @param label    Label shown beside the box; clicking it toggles.
 * @param checked  Current state.
 * @param onChange Fired with the new state on toggle.
 * @param disabled Render the checkbox greyed out.
 * @param readOnly Render the checkbox read-only: a toggle is ignored, it isn't greyed out.
 * @returns The labelled checkbox.
 */
export function FormCheckboxField({
  id,
  label,
  checked,
  onChange,
  disabled,
  readOnly,
}: FormCheckboxFieldProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          id={id}
          checked={checked}
          onChange={e => !readOnly && onChange(e.target.checked)}
          disabled={disabled}
          disableRipple
          icon={<CheckBoxIcon readOnly={readOnly} />}
          checkedIcon={<CheckBoxIcon checked readOnly={readOnly} />}
          slotProps={readOnly ? { input: { readOnly, 'aria-readonly': true } } : undefined}
          sx={{
            p: `${CHECKBOX_PAD_PX}px`,
            '&:hover': { bgcolor: 'transparent' },
            ...(!readOnly && {
              [CAN_HOVER]: {
                [`&:hover .${BOX}`]: { bgcolor: HOVER_FILL },
                [`&.Mui-checked:hover .${BOX}`]: { bgcolor: CHECKED_HOVER },
              },
            }),
            '&.Mui-disabled': { opacity: 0.5 },
            ...ringOn(BOX),
          }}
        />
      }
      label={label}
    />
  );
}
