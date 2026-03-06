import { useState } from 'react';
import type React from 'react';
import type {
  VehicleType,
  TextType,
  AllPublicTransportModesEnumeration,
  PropulsionTypeEnumeration,
  FuelTypeEnumeration,
} from './generated/types.js';
import { TRANSPORT_MODES, PROPULSION_TYPES, FUEL_TYPES } from './generated/types.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useResizablePane } from './useResizablePane.js';
import { PassengerCapacitySummary } from './PassengerCapacitySummary.js';
import { EnvironmentalExtras } from './EnvironmentalExtras.js';

export interface SimpleEditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

const EURO_CLASSES = ['', 'Euro5', 'Euro6'] as const;

// TextType[] flattening helpers
const textVal = (arr?: TextType[]) => arr?.[0]?.Value ?? '';
const textSet = (text: string): TextType[] | undefined =>
  text ? [{ Value: text, $lang: 'nb' }] : undefined;

const numVal = (n: number | undefined) => (n != null ? String(n) : '');
const parseNum = (s: string) => (s === '' ? undefined : Number(s));

export function SimpleEditor({ value, onChange }: SimpleEditorProps): React.JSX.Element {
  const { containerRef, topFraction, isResizing, onMouseDown } = useResizablePane(0.65);
  const [bottomTab, setBottomTab] = useState(0);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 300,
        userSelect: isResizing ? 'none' : 'auto',
      }}
    >
      {/* ── Top pane: 2-col form grid ── */}
      <Box sx={{ flex: `0 0 ${topFraction * 100}%`, overflow: 'auto', p: 1.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
            alignItems: 'start',
          }}
        >
          {/* Card: Identity */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" gutterBottom display="block">
              Identity
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                label="Id"
                size="small"
                fullWidth
                value={value.$id ?? ''}
                onChange={e => onChange({ ...value, $id: e.target.value })}
              />
              <TextField
                label="Name"
                size="small"
                fullWidth
                value={textVal(value.Name)}
                onChange={e => onChange({ ...value, Name: textSet(e.target.value) })}
              />
              <TextField
                label="Short name"
                size="small"
                fullWidth
                value={textVal(value.ShortName)}
                onChange={e => onChange({ ...value, ShortName: textSet(e.target.value) })}
              />
              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={textVal(value.Description)}
                onChange={e => onChange({ ...value, Description: textSet(e.target.value) })}
              />
              <TextField
                label="Transport mode"
                select
                size="small"
                fullWidth
                SelectProps={{ native: true }}
                value={value.TransportMode ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    TransportMode: (e.target.value ||
                      undefined) as AllPublicTransportModesEnumeration,
                  })
                }
              >
                <option value="" />
                {TRANSPORT_MODES.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </TextField>
              <TextField
                label="Private code"
                size="small"
                fullWidth
                value={value.PrivateCode?.Value ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    PrivateCode: { ...value.PrivateCode, Value: e.target.value },
                  })
                }
              />
            </Stack>
          </Paper>

          {/* Card: Propulsion & performance */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" gutterBottom display="block">
              Propulsion &amp; performance
            </Typography>
            <Stack spacing={1.5}>
              <Autocomplete
                multiple
                options={PROPULSION_TYPES as unknown as PropulsionTypeEnumeration[]}
                value={value.PropulsionTypes ?? []}
                onChange={(_e, v) =>
                  onChange({
                    ...value,
                    PropulsionTypes: v.length ? (v as PropulsionTypeEnumeration[]) : undefined,
                  })
                }
                isOptionEqualToValue={(a, b) => a === b}
                renderInput={params => (
                  <TextField {...params} label="Propulsion types" size="small" />
                )}
                size="small"
                disableCloseOnSelect
              />
              <Autocomplete
                multiple
                options={FUEL_TYPES as unknown as FuelTypeEnumeration[]}
                value={value.FuelTypes ?? []}
                onChange={(_e, v) =>
                  onChange({
                    ...value,
                    FuelTypes: v.length ? (v as FuelTypeEnumeration[]) : undefined,
                  })
                }
                isOptionEqualToValue={(a, b) => a === b}
                renderInput={params => <TextField {...params} label="Fuel types" size="small" />}
                size="small"
                disableCloseOnSelect
              />
              <TextField
                label="Euro class"
                select
                size="small"
                fullWidth
                SelectProps={{ native: true }}
                value={value.EuroClass ?? ''}
                onChange={e => onChange({ ...value, EuroClass: e.target.value || undefined })}
              >
                {EURO_CLASSES.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value.SelfPropelled}
                    onChange={e => onChange({ ...value, SelfPropelled: e.target.checked })}
                    size="small"
                  />
                }
                label="Self-propelled"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value.ReversingDirection}
                    onChange={e => onChange({ ...value, ReversingDirection: e.target.checked })}
                    size="small"
                  />
                }
                label="Reversing direction"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value.LowFloor}
                    onChange={e => onChange({ ...value, LowFloor: e.target.checked })}
                    size="small"
                  />
                }
                label="Low floor"
              />
              <TextField
                label="Maximum range"
                size="small"
                type="number"
                fullWidth
                value={numVal(value.MaximumRange)}
                onChange={e => onChange({ ...value, MaximumRange: parseNum(e.target.value) })}
              />
              <TextField
                label="Maximum velocity"
                size="small"
                type="number"
                fullWidth
                value={numVal(value.MaximumVelocity)}
                onChange={e => onChange({ ...value, MaximumVelocity: parseNum(e.target.value) })}
              />
            </Stack>
          </Paper>

          {/* Card: Passenger capacity */}
          <PassengerCapacitySummary
            value={value.PassengerCapacity ?? {}}
            onChange={next => onChange({ ...value, PassengerCapacity: next })}
          />

          {/* Card: Dimensions */}
          <Accordion
            variant="outlined"
            defaultExpanded={false}
            disableGutters
            sx={{ '&::before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<span>&#9660;</span>}>
              <Typography variant="body2" fontWeight={500}>
                Dimensions
                {(value.Length != null ||
                  value.Width != null ||
                  value.Height != null ||
                  value.Weight != null) && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    (
                    {[
                      value.Length != null && `L: ${value.Length}`,
                      value.Width != null && `W: ${value.Width}`,
                      value.Height != null && `H: ${value.Height}`,
                      value.Weight != null && `${value.Weight} kg`,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                    )
                  </Typography>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                <TextField
                  label="Length"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.Length)}
                  onChange={e => onChange({ ...value, Length: parseNum(e.target.value) })}
                />
                <TextField
                  label="Width"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.Width)}
                  onChange={e => onChange({ ...value, Width: parseNum(e.target.value) })}
                />
                <TextField
                  label="Height"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.Height)}
                  onChange={e => onChange({ ...value, Height: parseNum(e.target.value) })}
                />
                <TextField
                  label="Weight"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.Weight)}
                  onChange={e => onChange({ ...value, Weight: parseNum(e.target.value) })}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

      {/* ── Drag handle ── */}
      <Box
        onMouseDown={onMouseDown}
        sx={{
          flex: '0 0 6px',
          cursor: 'ns-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 3,
            borderRadius: 1,
            bgcolor: 'text.disabled',
          }}
        />
      </Box>

      {/* ── Bottom pane: Tabs ── */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Tabs value={bottomTab} onChange={(_, v) => setBottomTab(v)}>
          <Tab label="Environmental extras" />
          <Tab label="Deck plans" />
        </Tabs>
        {bottomTab === 0 && <EnvironmentalExtras value={value} onChange={onChange} />}
        {bottomTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">Coming soon</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
