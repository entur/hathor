import type React from 'react';
import type { Vehicle, ValidBetween_VersionStructure } from './generated/Vehicle.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
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

export interface ValidityAccordionProps {
  value: Partial<Vehicle>;
  onChange: (next: Partial<Vehicle>) => void;
}

function fmtRange(v: ValidBetween_VersionStructure): string {
  const from = v.FromDate ? v.FromDate.slice(0, 10) : '…';
  const to = v.ToDate ? v.ToDate.slice(0, 10) : '…';
  return `${from} → ${to}`;
}

export function ValidityAccordion({ value, onChange }: ValidityAccordionProps): React.JSX.Element {
  const ranges = value.ValidBetween ?? [];
  const summary = ranges.length
    ? ranges.length === 1
      ? fmtRange(ranges[0])
      : `${ranges.length} periods`
    : '';

  const updateRange = (idx: number, patch: Partial<ValidBetween_VersionStructure>) => {
    const next = ranges.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChange({ ...value, ValidBetween: next });
  };

  const addRange = () => {
    onChange({ ...value, ValidBetween: [...ranges, {}] });
  };

  const removeRange = (idx: number) => {
    const next = ranges.filter((_, i) => i !== idx);
    onChange({ ...value, ValidBetween: next.length ? next : undefined });
  };

  return (
    <Accordion variant="outlined" disableGutters sx={{ '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<span>&#9660;</span>}>
        <Typography variant="body2" fontWeight={500}>
          Validity
          {summary && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({summary})
            </Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.5}>
          <TextField
            label="validityConditions"
            size="small"
            fullWidth
            value={value.validityConditions ?? ''}
            onChange={e => onChange({ ...value, validityConditions: e.target.value || undefined })}
          />
          <Box>
            <Typography variant="overline" display="block">
              ValidBetween
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>FromDate</TableCell>
                  <TableCell>ToDate</TableCell>
                  <TableCell padding="none" />
                </TableRow>
              </TableHead>
              <TableBody>
                {ranges.map((r, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        size="small"
                        type="date"
                        value={r.FromDate?.slice(0, 10) ?? ''}
                        onChange={e => updateRange(idx, { FromDate: e.target.value || undefined })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="date"
                        value={r.ToDate?.slice(0, 10) ?? ''}
                        onChange={e => updateRange(idx, { ToDate: e.target.value || undefined })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell padding="none">
                      <IconButton size="small" onClick={() => removeRange(idx)} aria-label="Remove">
                        <span>&times;</span>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button size="small" onClick={addRange} sx={{ mt: 1 }}>
              + Add period
            </Button>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
