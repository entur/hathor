import type React from 'react';
import type { VehicleType, KeyValueStructure } from './generated/types.js';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const FIXED_KEYS = [
  'FormDragCoeff',
  'RollResistanceCoeff',
  'MaximumEngineEffectKW',
  'HybridCategory',
] as const;

export interface EnvironmentalExtrasProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

function findByKey(list: KeyValueStructure[] | undefined, key: string): string {
  return list?.find(item => item.Key === key)?.Value ?? '';
}

function setByKey(
  list: KeyValueStructure[] | undefined,
  key: string,
  val: string
): KeyValueStructure[] {
  const arr = [...(list ?? [])];
  const idx = arr.findIndex(item => item.Key === key);
  if (val) {
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], Value: val };
    } else {
      arr.push({ Key: key, Value: val });
    }
  } else if (idx >= 0) {
    arr.splice(idx, 1);
  }
  return arr;
}

export function EnvironmentalExtras({
  value,
  onChange,
}: EnvironmentalExtrasProps): React.JSX.Element {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {FIXED_KEYS.map(key => (
        <TextField
          key={key}
          label={key}
          size="small"
          fullWidth
          value={findByKey(value.KeyList, key)}
          onChange={e =>
            onChange({ ...value, KeyList: setByKey(value.KeyList, key, e.target.value) })
          }
        />
      ))}
    </Stack>
  );
}
