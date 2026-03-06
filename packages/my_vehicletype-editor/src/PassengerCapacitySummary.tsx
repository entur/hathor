import type React from 'react';
import type { PassengerCapacityStructure } from './generated/types.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export interface PassengerCapacitySummaryProps {
  value: Partial<PassengerCapacityStructure>;
  onChange: (next: Partial<PassengerCapacityStructure>) => void;
}

const numVal = (n: number | undefined) => (n != null ? String(n) : '');
const parseNum = (s: string) => (s === '' ? undefined : Number(s));

export function PassengerCapacitySummary({
  value,
  onChange,
}: PassengerCapacitySummaryProps): React.JSX.Element {
  const summary = [
    value.TotalCapacity != null && `Total: ${value.TotalCapacity}`,
    value.SeatingCapacity != null && `Seated: ${value.SeatingCapacity}`,
    value.StandingCapacity != null && `Standing: ${value.StandingCapacity}`,
    value.WheelchairPlaceCapacity != null && `Wheelchair: ${value.WheelchairPlaceCapacity}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Accordion variant="outlined" disableGutters sx={{ '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<span>&#9660;</span>}>
        <Typography variant="body2" fontWeight={500}>
          Passenger capacity
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
            label="Total capacity"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.TotalCapacity)}
            onChange={e => onChange({ ...value, TotalCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Seating capacity"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.SeatingCapacity)}
            onChange={e => onChange({ ...value, SeatingCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Standing capacity"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.StandingCapacity)}
            onChange={e => onChange({ ...value, StandingCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Wheelchair places"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.WheelchairPlaceCapacity)}
            onChange={e =>
              onChange({ ...value, WheelchairPlaceCapacity: parseNum(e.target.value) })
            }
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
