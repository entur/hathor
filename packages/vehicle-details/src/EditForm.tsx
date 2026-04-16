import { useState } from 'react';
import type React from 'react';
import type { Vehicle, TextType } from './generated/Vehicle.js';
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
import { ReferencesAccordion } from './ReferencesAccordion.js';
import { ValidityAccordion } from './ValidityAccordion.js';
import { KeyValuesTab } from './KeyValuesTab.js';

export interface ExtraTab {
  label: string;
  content: React.ReactNode;
}

export interface EditFormProps {
  value: Partial<Vehicle>;
  onChange: (next: Partial<Vehicle>) => void;
  extraTabs?: ExtraTab[];
}

// TextType[] ↔ single string (first item, lang=nb) — same idiom as vtype-details.
const textVal = (arr?: TextType[]) => arr?.[0]?.value ?? '';
const textSet = (text: string): TextType[] | undefined =>
  text ? [{ value: text, $lang: 'nb' }] : undefined;

export function EditForm({ value, onChange, extraTabs }: EditFormProps): React.JSX.Element {
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
                onChange={e => onChange({ ...value, $id: e.target.value || undefined })}
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
            </Stack>
          </Paper>

          {/* Card: Registration */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" gutterBottom display="block">
              Registration
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                label="RegistrationNumber"
                size="small"
                fullWidth
                value={value.RegistrationNumber ?? ''}
                onChange={e =>
                  onChange({ ...value, RegistrationNumber: e.target.value || undefined })
                }
              />
              <TextField
                label="ChassisNumber"
                size="small"
                fullWidth
                value={value.ChassisNumber ?? ''}
                onChange={e => onChange({ ...value, ChassisNumber: e.target.value || undefined })}
              />
              <TextField
                label="OperationalNumber"
                size="small"
                fullWidth
                value={value.OperationalNumber ?? ''}
                onChange={e =>
                  onChange({ ...value, OperationalNumber: e.target.value || undefined })
                }
              />
              <TextField
                label="RegistrationDate"
                size="small"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={value.RegistrationDate?.slice(0, 10) ?? ''}
                onChange={e =>
                  onChange({ ...value, RegistrationDate: e.target.value || undefined })
                }
              />
              <TextField
                label="BuildDate"
                size="small"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={value.BuildDate?.slice(0, 10) ?? ''}
                onChange={e => onChange({ ...value, BuildDate: e.target.value || undefined })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!value.Monitored}
                    onChange={e => onChange({ ...value, Monitored: e.target.checked })}
                    size="small"
                  />
                }
                label="Monitored"
              />
            </Stack>
          </Paper>

          {/* Row 2: References + Validity accordions */}
          <ReferencesAccordion value={value} onChange={onChange} />
          <ValidityAccordion value={value} onChange={onChange} />
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
        <Box sx={{ width: 40, height: 3, borderRadius: 1, bgcolor: 'text.disabled' }} />
      </Box>

      {/* ── Bottom pane: Tabs ── */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Tabs value={bottomTab} onChange={(_, v) => setBottomTab(v)}>
          <Tab label="Key-values & private codes" />
          {extraTabs?.map(t => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        {bottomTab === 0 && <KeyValuesTab value={value} onChange={onChange} />}
        {extraTabs?.map((t, i) =>
          bottomTab === i + 1 ? (
            <Box key={t.label} sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              {t.content}
            </Box>
          ) : null
        )}
      </Box>
    </Box>
  );
}
