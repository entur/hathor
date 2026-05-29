import type React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { numVal, parseNum } from './fieldHelpers.js';
import type { PassengerCapacity } from './vehicleTypeTypes.js';

export interface PassengerCapacitySummaryProps {
  value: Partial<PassengerCapacity>;
  onChange: (next: Partial<PassengerCapacity>) => void;
}

export function PassengerCapacitySummary({
  value,
  onChange,
}: PassengerCapacitySummaryProps): React.JSX.Element {
  const summary = [
    value.totalCapacity != null && `Total: ${value.totalCapacity}`,
    value.seatingCapacity != null && `Seated: ${value.seatingCapacity}`,
    value.standingCapacity != null && `Standing: ${value.standingCapacity}`,
    value.wheelchairPlaceCapacity != null && `Wheelchair: ${value.wheelchairPlaceCapacity}`,
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
            value={numVal(value.totalCapacity)}
            onChange={e => onChange({ ...value, totalCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Seating capacity"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.seatingCapacity)}
            onChange={e => onChange({ ...value, seatingCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Standing capacity"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.standingCapacity)}
            onChange={e => onChange({ ...value, standingCapacity: parseNum(e.target.value) })}
          />
          <TextField
            label="Wheelchair places"
            size="small"
            type="number"
            fullWidth
            value={numVal(value.wheelchairPlaceCapacity)}
            onChange={e =>
              onChange({ ...value, wheelchairPlaceCapacity: parseNum(e.target.value) })
            }
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
