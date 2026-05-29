import type React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { EnumMultiSelect } from './EnumMultiSelect.js';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useResizablePane } from './useResizablePane.js';
import { PassengerCapacitySummary } from './PassengerCapacitySummary.js';
import { numVal, parseNum } from './fieldHelpers.js';
import {
  FUEL_TYPE,
  PROPULSION_TYPE,
  TRANSPORT_MODE,
  type TransportMode,
  type VehicleType,
} from './vehicleTypeTypes.js';

export interface ExtraTab {
  label: string;
  content: React.ReactNode;
}

export interface SimpleEditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

const EURO_CLASSES = ['', 'Euro5', 'Euro6'] as const;

/**
 * Friendly form editor over {@link VehicleType}.
 *
 * Reads from and writes directly to `Partial<VehicleType>` — there is no
 * intermediate "simplified" shape. Each onChange handler converts its input
 * value into the full NeTEx structure inline (e.g. a Name text field calls
 * `textSet` which rebuilds `Name[]`). The complex type flows out on
 * every keystroke, so no `simplifiedToStem` transform is needed downstream.
 */
export function SimpleEditor({ value, onChange }: SimpleEditorProps): React.JSX.Element {
  const { containerRef, topFraction, isResizing, onMouseDown } = useResizablePane(0.65);

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
                disabled
                value={value.id ?? ''}
                onChange={e => onChange({ ...value, id: e.target.value })}
              />
              <TextField
                label="Name"
                size="small"
                fullWidth
                value={value.name?.value ?? ''}
                onChange={e =>
                  onChange({ ...value, name: { lang: value.name?.lang, value: e.target.value } })
                }
              />
              <TextField
                label="Short name"
                size="small"
                fullWidth
                value={value.shortName?.value ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    shortName: { lang: value.shortName?.lang, value: e.target.value },
                  })
                }
              />
              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={value.description?.value ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    description: { lang: value.description?.lang, value: e.target.value },
                  })
                }
              />
              <TextField
                label="Transport mode"
                select
                size="small"
                fullWidth
                SelectProps={{ native: true }}
                value={value.transportMode ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    transportMode: (e.target.value || undefined) as TransportMode | undefined,
                  })
                }
              >
                <option value="" />
                {TRANSPORT_MODE.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </TextField>
              <TextField
                label="Private code"
                size="small"
                fullWidth
                value={value.privateCode?.value ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    privateCode: { ...value.privateCode, value: e.target.value },
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
              <EnumMultiSelect
                label="Propulsion types"
                options={PROPULSION_TYPE}
                value={value.propulsionTypes}
                onChange={selected => onChange({ ...value, propulsionTypes: selected })}
              />
              <EnumMultiSelect
                label="Fuel types"
                options={FUEL_TYPE}
                value={value.fuelTypes}
                onChange={selected => onChange({ ...value, fuelTypes: selected })}
              />
              <TextField
                label="Euro class"
                select
                size="small"
                fullWidth
                SelectProps={{ native: true }}
                value={value.euroClass ?? ''}
                onChange={e => onChange({ ...value, euroClass: e.target.value || undefined })}
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
                    checked={!!value.selfPropelled}
                    onChange={e => onChange({ ...value, selfPropelled: e.target.checked })}
                    size="small"
                  />
                }
                label="Self-propelled"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value.lowFloor}
                    onChange={e => onChange({ ...value, lowFloor: e.target.checked })}
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
                value={numVal(value.maximumRange)}
                onChange={e => onChange({ ...value, maximumRange: parseNum(e.target.value) })}
              />
              <TextField
                label="Maximum velocity"
                size="small"
                type="number"
                fullWidth
                value={numVal(value.maximumVelocity)}
                onChange={e => onChange({ ...value, maximumVelocity: parseNum(e.target.value) })}
              />
            </Stack>
          </Paper>

          {/* Card: Passenger capacity */}
          <PassengerCapacitySummary
            value={value.passengerCapacity ?? {}}
            onChange={next => onChange({ ...value, passengerCapacity: next })}
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
                {(value.length != null ||
                  value.width != null ||
                  value.height != null ||
                  value.weight != null) && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    (
                    {[
                      value.length != null && `L: ${value.length}`,
                      value.width != null && `W: ${value.width}`,
                      value.height != null && `H: ${value.height}`,
                      value.weight != null && `${value.weight} kg`,
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
                  value={numVal(value.length)}
                  onChange={e => onChange({ ...value, length: parseNum(e.target.value) })}
                />
                <TextField
                  label="Width"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.width)}
                  onChange={e => onChange({ ...value, width: parseNum(e.target.value) })}
                />
                <TextField
                  label="Height"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.height)}
                  onChange={e => onChange({ ...value, height: parseNum(e.target.value) })}
                />
                <TextField
                  label="Weight"
                  size="small"
                  type="number"
                  fullWidth
                  value={numVal(value.weight)}
                  onChange={e => onChange({ ...value, weight: parseNum(e.target.value) })}
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
    </Box>
  );
}
