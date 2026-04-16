import type React from 'react';
import type { Vehicle } from './generated/Vehicle.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export interface ReferencesAccordionProps {
  value: Partial<Vehicle>;
  onChange: (next: Partial<Vehicle>) => void;
}

// Ordered per vehicleToXmlShape. Labels use the XML element name when it
// differs from the TS field name (e.g. AuthorityRef for TransportOrganisationRef).
const FIELDS: ReadonlyArray<{
  key: keyof Vehicle;
  label: string;
}> = [
  { key: 'TransportOrganisationRef', label: 'AuthorityRef' },
  { key: 'ContactRef', label: 'ContactRef' },
  { key: 'TransportTypeRef', label: 'TransportTypeRef' },
  { key: 'VehicleModelRef', label: 'VehicleModelRef' },
  { key: 'equipmentProfiles', label: 'equipmentProfiles' },
  { key: 'VehicleModelProfileRef', label: 'CarModelProfileRef' },
  { key: 'actualVehicleEquipments', label: 'actualVehicleEquipments' },
  { key: 'BrandingRef', label: 'BrandingRef' },
];

export function ReferencesAccordion({
  value,
  onChange,
}: ReferencesAccordionProps): React.JSX.Element {
  const set = FIELDS.filter(f => value[f.key]).map(f => f.label);
  const summary = set.length
    ? `${set.length} set: ${set.slice(0, 3).join(', ')}${set.length > 3 ? '…' : ''}`
    : '';

  return (
    <Accordion variant="outlined" disableGutters sx={{ '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<span>&#9660;</span>}>
        <Typography variant="body2" fontWeight={500}>
          References
          {summary && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({summary})
            </Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.5}>
          {FIELDS.map(f => (
            <TextField
              key={f.key as string}
              label={f.label}
              size="small"
              fullWidth
              value={(value[f.key] as string | undefined) ?? ''}
              onChange={e => onChange({ ...value, [f.key]: e.target.value || undefined })}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
