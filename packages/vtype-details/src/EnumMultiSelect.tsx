import type React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export function EnumMultiSelect<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T[] | undefined;
  onChange: (selected: T[] | undefined) => void;
  label: string;
}): React.JSX.Element {
  return (
    <Autocomplete
      multiple
      options={options as T[]}
      value={value ?? []}
      onChange={(_e, v) => onChange(v.length ? (v as T[]) : undefined)}
      isOptionEqualToValue={(a, b) => a === b}
      renderInput={params => <TextField {...params} label={label} size="small" />}
      size="small"
      disableCloseOnSelect
    />
  );
}
