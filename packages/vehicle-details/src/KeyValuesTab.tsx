import type React from 'react';
import type { Vehicle, KeyValueStructure, PrivateCodeStructure } from './generated/Vehicle.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export interface KeyValuesTabProps {
  value: Partial<Vehicle>;
  onChange: (next: Partial<Vehicle>) => void;
}

export function KeyValuesTab({ value, onChange }: KeyValuesTabProps): React.JSX.Element {
  const kv = value.keyList ?? [];
  const pc = value.privateCodes ?? [];

  const updKv = (i: number, patch: Partial<KeyValueStructure>) => {
    onChange({ ...value, keyList: kv.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  };
  const addKv = () => onChange({ ...value, keyList: [...kv, {}] });
  const rmKv = (i: number) => {
    const next = kv.filter((_, j) => j !== i);
    onChange({ ...value, keyList: next.length ? next : undefined });
  };

  const updPc = (i: number, patch: Partial<PrivateCodeStructure>) => {
    onChange({ ...value, privateCodes: pc.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  };
  const addPc = () => onChange({ ...value, privateCodes: [...pc, {}] });
  const rmPc = (i: number) => {
    const next = pc.filter((_, j) => j !== i);
    onChange({ ...value, privateCodes: next.length ? next : undefined });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" display="block" gutterBottom>
            keyList
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>typeOfKey</TableCell>
                <TableCell padding="none" />
              </TableRow>
            </TableHead>
            <TableBody>
              {kv.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={r.Key ?? ''}
                      onChange={e => updKv(i, { Key: e.target.value || undefined })}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={r.Value ?? ''}
                      onChange={e => updKv(i, { Value: e.target.value || undefined })}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={r.$typeOfKey ?? ''}
                      onChange={e => updKv(i, { $typeOfKey: e.target.value || undefined })}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    <IconButton size="small" onClick={() => rmKv(i)} aria-label="Remove">
                      <span>&times;</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" onClick={addKv} sx={{ mt: 1 }}>
            + Add key-value
          </Button>
        </Box>

        <Box>
          <Typography variant="overline" display="block" gutterBottom>
            privateCodes
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>value</TableCell>
                <TableCell>type</TableCell>
                <TableCell padding="none" />
              </TableRow>
            </TableHead>
            <TableBody>
              {pc.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={r.value ?? ''}
                      onChange={e => updPc(i, { value: e.target.value || undefined })}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={r.$type ?? ''}
                      onChange={e => updPc(i, { $type: e.target.value || undefined })}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    <IconButton size="small" onClick={() => rmPc(i)} aria-label="Remove">
                      <span>&times;</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" onClick={addPc} sx={{ mt: 1 }}>
            + Add private code
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
