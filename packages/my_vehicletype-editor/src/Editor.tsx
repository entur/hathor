import { useState, useMemo } from 'react';
import type React from 'react';
import type {
  VehicleType,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirements_STUB,
  KeyValueStructure,
  AllPublicTransportModesEnumeration,
  PropulsionTypeEnumeration,
} from './generated/types.js';
import { TRANSPORT_MODES, PROPULSION_TYPES, FUEL_TYPES, FARE_CLASSES } from './generated/types.js';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { serialize } from './serialize.js';
import './Editor.css';

function EnumMultiSelect<T extends string>({
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

export interface EditorProps {
  value: Partial<VehicleType>;
  onChange: (next: Partial<VehicleType>) => void;
}

function TextTypeRow({
  item,
  onChange,
}: {
  item: Partial<TextType>;
  onChange: (next: Partial<TextType>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="value"
        value={item.value ?? ''}
        onChange={e => onChange({ ...item, value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="lang"
        value={item.lang ?? ''}
        onChange={e => onChange({ ...item, lang: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="textIdType"
        value={item.textIdType ?? ''}
        onChange={e => onChange({ ...item, textIdType: e.target.value })}
      />
    </div>
  );
}

function PrivateCodeStructureRow({
  item,
  onChange,
}: {
  item: Partial<PrivateCodeStructure>;
  onChange: (next: Partial<PrivateCodeStructure>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="value"
        value={item.value ?? ''}
        onChange={e => onChange({ ...item, value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="type"
        value={item.type ?? ''}
        onChange={e => onChange({ ...item, type: e.target.value })}
      />
    </div>
  );
}

function PassengerCapacityStructureRow({
  item,
  onChange,
}: {
  item: Partial<PassengerCapacityStructure>;
  onChange: (next: Partial<PassengerCapacityStructure>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <TextField
        select
        size="small"
        SelectProps={{ native: true }}
        sx={{ minWidth: 120 }}
        value={item.fareClass ?? ''}
        onChange={e =>
          onChange({
            ...item,
            fareClass: (e.target.value || undefined) as (typeof FARE_CLASSES)[number],
          })
        }
      >
        <option value=""></option>
        {FARE_CLASSES.map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </TextField>
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="totalCapacity"
        value={item.totalCapacity != null ? String(item.totalCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            totalCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="seatingCapacity"
        value={item.seatingCapacity != null ? String(item.seatingCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            seatingCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="standingCapacity"
        value={item.standingCapacity != null ? String(item.standingCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            standingCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="specialPlaceCapacity"
        value={item.specialPlaceCapacity != null ? String(item.specialPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            specialPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="pushchairCapacity"
        value={item.pushchairCapacity != null ? String(item.pushchairCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            pushchairCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="wheelchairPlaceCapacity"
        value={item.wheelchairPlaceCapacity != null ? String(item.wheelchairPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            wheelchairPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="pramPlaceCapacity"
        value={item.pramPlaceCapacity != null ? String(item.pramPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            pramPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="bicycleRackCapacity"
        value={item.bicycleRackCapacity != null ? String(item.bicycleRackCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            bicycleRackCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
    </div>
  );
}

function VehicleManoeuvringRequirements_STUBRow({
  item,
  onChange,
}: {
  item: Partial<VehicleManoeuvringRequirements_STUB>;
  onChange: (next: Partial<VehicleManoeuvringRequirements_STUB>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <label className="vte-label">
        <input
          className="vte-checkbox"
          type="checkbox"
          checked={!!item.reversible}
          onChange={e => onChange({ ...item, reversible: e.target.checked })}
        />
        reversible
      </label>
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="minimumTurningCircle"
        value={item.minimumTurningCircle != null ? String(item.minimumTurningCircle) : ''}
        onChange={e =>
          onChange({
            ...item,
            minimumTurningCircle: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="minimumOvertakingWidth"
        value={item.minimumOvertakingWidth != null ? String(item.minimumOvertakingWidth) : ''}
        onChange={e =>
          onChange({
            ...item,
            minimumOvertakingWidth: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="minimumLength"
        value={item.minimumLength != null ? String(item.minimumLength) : ''}
        onChange={e =>
          onChange({
            ...item,
            minimumLength: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
    </div>
  );
}

function KeyValueStructureRow({
  item,
  onChange,
}: {
  item: Partial<KeyValueStructure>;
  onChange: (next: Partial<KeyValueStructure>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="key"
        value={item.key ?? ''}
        onChange={e => onChange({ ...item, key: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="value"
        value={item.value ?? ''}
        onChange={e => onChange({ ...item, value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="typeOfKey"
        value={item.typeOfKey ?? ''}
        onChange={e => onChange({ ...item, typeOfKey: e.target.value })}
      />
    </div>
  );
}

export function Editor({ value, onChange }: EditorProps): React.JSX.Element {
  const [tab, setTab] = useState(0);
  const xml = useMemo(() => serialize(value), [value]);

  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Edit" />
        <Tab label="Preview" />
      </Tabs>
      {tab === 1 && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, overflow: 'auto' }}>
          <pre
            style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {xml}
          </pre>
        </Box>
      )}
      {tab === 0 && (
        <Stack spacing={1.5}>
          <Paper variant="outlined" component="fieldset" sx={{ p: '12px 16px', m: 0 }}>
            <Typography component="legend" variant="overline" sx={{ px: 0.75 }}>
              type
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  Name
                </Typography>
                <div className="vte-sub-table">
                  {(value.name ?? []).map((item, idx) => (
                    <div key={idx} className="vte-sub-row">
                      <span className="vte-sub-index">{idx + 1}</span>
                      <TextTypeRow
                        item={item}
                        onChange={next => {
                          const arr = [...(value.name ?? [])];
                          arr[idx] = next;
                          onChange({ ...value, name: arr });
                        }}
                      />
                      <button
                        type="button"
                        className="vte-btn-remove"
                        onClick={() => {
                          const arr = (value.name ?? []).filter((_, i) => i !== idx);
                          onChange({ ...value, name: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vte-btn-add"
                    onClick={() => onChange({ ...value, name: [...(value.name ?? []), {}] })}
                  >
                    + Add TextType
                  </button>
                </div>
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  ShortName
                </Typography>
                <div className="vte-sub-table">
                  {(value.shortName ?? []).map((item, idx) => (
                    <div key={idx} className="vte-sub-row">
                      <span className="vte-sub-index">{idx + 1}</span>
                      <TextTypeRow
                        item={item}
                        onChange={next => {
                          const arr = [...(value.shortName ?? [])];
                          arr[idx] = next;
                          onChange({ ...value, shortName: arr });
                        }}
                      />
                      <button
                        type="button"
                        className="vte-btn-remove"
                        onClick={() => {
                          const arr = (value.shortName ?? []).filter((_, i) => i !== idx);
                          onChange({ ...value, shortName: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vte-btn-add"
                    onClick={() =>
                      onChange({ ...value, shortName: [...(value.shortName ?? []), {}] })
                    }
                  >
                    + Add TextType
                  </button>
                </div>
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  Description
                </Typography>
                <div className="vte-sub-table">
                  {(value.description ?? []).map((item, idx) => (
                    <div key={idx} className="vte-sub-row">
                      <span className="vte-sub-index">{idx + 1}</span>
                      <TextTypeRow
                        item={item}
                        onChange={next => {
                          const arr = [...(value.description ?? [])];
                          arr[idx] = next;
                          onChange({ ...value, description: arr });
                        }}
                      />
                      <button
                        type="button"
                        className="vte-btn-remove"
                        onClick={() => {
                          const arr = (value.description ?? []).filter((_, i) => i !== idx);
                          onChange({ ...value, description: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vte-btn-add"
                    onClick={() =>
                      onChange({ ...value, description: [...(value.description ?? []), {}] })
                    }
                  >
                    + Add TextType
                  </button>
                </div>
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  PrivateCode
                </Typography>
                <div className="vte-sub-table">
                  <PrivateCodeStructureRow
                    item={value.privateCode ?? {}}
                    onChange={next => onChange({ ...value, privateCode: next })}
                  />
                </div>
              </Box>
              <Box>
                <TextField
                  label="TransportMode"
                  select
                  size="small"
                  fullWidth
                  SelectProps={{ native: true }}
                  value={value.transportMode ?? ''}
                  onChange={e =>
                    onChange({
                      ...value,
                      transportMode: (e.target.value ||
                        undefined) as AllPublicTransportModesEnumeration,
                    })
                  }
                >
                  <option value=""></option>
                  {TRANSPORT_MODES.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box>
                <TextField
                  label="DeckPlanRef"
                  size="small"
                  fullWidth
                  value={value.deckPlanRef ?? ''}
                  onChange={e => onChange({ ...value, deckPlanRef: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label="EuroClass"
                  size="small"
                  fullWidth
                  value={value.euroClass ?? ''}
                  onChange={e => onChange({ ...value, euroClass: e.target.value })}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.reversingDirection}
                    onChange={e => onChange({ ...value, reversingDirection: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    ReversingDirection
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.selfPropelled}
                    onChange={e => onChange({ ...value, selfPropelled: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    SelfPropelled
                  </Typography>
                </Box>
              </Box>
              <Box>
                <EnumMultiSelect
                  label="PropulsionTypes"
                  options={PROPULSION_TYPES}
                  value={value.propulsionTypes}
                  onChange={selected => onChange({ ...value, propulsionTypes: selected })}
                />
              </Box>
              <Box>
                <TextField
                  label="PropulsionType"
                  select
                  size="small"
                  fullWidth
                  SelectProps={{ native: true }}
                  value={value.propulsionType ?? ''}
                  onChange={e =>
                    onChange({
                      ...value,
                      propulsionType: (e.target.value || undefined) as PropulsionTypeEnumeration,
                    })
                  }
                >
                  <option value=""></option>
                  {PROPULSION_TYPES.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box>
                <EnumMultiSelect
                  label="FuelTypes"
                  options={FUEL_TYPES}
                  value={value.fuelTypes}
                  onChange={selected => onChange({ ...value, fuelTypes: selected })}
                />
              </Box>
              <Box>
                <TextField
                  label="MaximumRange"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.maximumRange != null ? String(value.maximumRange) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, maximumRange: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="MaximumVelocity"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.maximumVelocity != null ? String(value.maximumVelocity) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, maximumVelocity: n });
                  }}
                />
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  PassengerCapacity
                </Typography>
                <div className="vte-sub-table">
                  <PassengerCapacityStructureRow
                    item={value.passengerCapacity ?? {}}
                    onChange={next => onChange({ ...value, passengerCapacity: next })}
                  />
                </div>
              </Box>
            </Stack>
          </Paper>
          <Paper variant="outlined" component="fieldset" sx={{ p: '12px 16px', m: 0 }}>
            <Typography component="legend" variant="overline" sx={{ px: 0.75 }}>
              core
            </Typography>
            <Stack spacing={1}>
              <Box>
                <TextField
                  label="Id"
                  size="small"
                  fullWidth
                  value={value.id ?? ''}
                  onChange={e => onChange({ ...value, id: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label="IncludedIn"
                  size="small"
                  fullWidth
                  value={value.includedIn ?? ''}
                  onChange={e => onChange({ ...value, includedIn: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label="ClassifiedAsRef"
                  size="small"
                  fullWidth
                  value={value.classifiedAsRef ?? ''}
                  onChange={e => onChange({ ...value, classifiedAsRef: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label="Facilities"
                  size="small"
                  fullWidth
                  value={value.facilities ?? ''}
                  onChange={e => onChange({ ...value, facilities: e.target.value })}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.monitored}
                    onChange={e => onChange({ ...value, monitored: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    Monitored
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.lowFloor}
                    onChange={e => onChange({ ...value, lowFloor: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    LowFloor
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.hasLiftOrRamp}
                    onChange={e => onChange({ ...value, hasLiftOrRamp: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    HasLiftOrRamp
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <input
                    className="vte-checkbox"
                    type="checkbox"
                    checked={!!value.hasHoist}
                    onChange={e => onChange({ ...value, hasHoist: e.target.checked })}
                  />
                  <Typography variant="body2" fontWeight={500} component="span">
                    HasHoist
                  </Typography>
                </Box>
              </Box>
              <Box>
                <TextField
                  label="HoistOperatingRadius"
                  size="small"
                  fullWidth
                  type="number"
                  value={
                    value.hoistOperatingRadius != null ? String(value.hoistOperatingRadius) : ''
                  }
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, hoistOperatingRadius: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="BoardingHeight"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.boardingHeight != null ? String(value.boardingHeight) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, boardingHeight: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="GapToPlatform"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.gapToPlatform != null ? String(value.gapToPlatform) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, gapToPlatform: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Length"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.length != null ? String(value.length) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, length: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Width"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.width != null ? String(value.width) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, width: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Height"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.height != null ? String(value.height) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, height: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Weight"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.weight != null ? String(value.weight) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, weight: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="FirstAxleHeight"
                  size="small"
                  fullWidth
                  type="number"
                  value={value.firstAxleHeight != null ? String(value.firstAxleHeight) : ''}
                  onChange={e => {
                    const n = e.target.value === '' ? undefined : Number(e.target.value);
                    onChange({ ...value, firstAxleHeight: n });
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="CanCarry"
                  size="small"
                  fullWidth
                  value={value.canCarry ?? ''}
                  onChange={e => onChange({ ...value, canCarry: e.target.value })}
                />
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  CanManoeuvre
                </Typography>
                <div className="vte-sub-table">
                  <VehicleManoeuvringRequirements_STUBRow
                    item={value.canManoeuvre ?? {}}
                    onChange={next => onChange({ ...value, canManoeuvre: next })}
                  />
                </div>
              </Box>
              <Box>
                <TextField
                  label="SatisfiesFacilityRequirements"
                  size="small"
                  fullWidth
                  value={value.satisfiesFacilityRequirements ?? ''}
                  onChange={e =>
                    onChange({ ...value, satisfiesFacilityRequirements: e.target.value })
                  }
                />
              </Box>
            </Stack>
          </Paper>
          <Paper variant="outlined" component="fieldset" sx={{ p: '12px 16px', m: 0 }}>
            <Typography component="legend" variant="overline" sx={{ px: 0.75 }}>
              extra
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  KeyList
                </Typography>
                <div className="vte-sub-table">
                  {(value.keyList ?? []).map((item, idx) => (
                    <div key={idx} className="vte-sub-row">
                      <span className="vte-sub-index">{idx + 1}</span>
                      <KeyValueStructureRow
                        item={item}
                        onChange={next => {
                          const arr = [...(value.keyList ?? [])];
                          arr[idx] = next;
                          onChange({ ...value, keyList: arr });
                        }}
                      />
                      <button
                        type="button"
                        className="vte-btn-remove"
                        onClick={() => {
                          const arr = (value.keyList ?? []).filter((_, i) => i !== idx);
                          onChange({ ...value, keyList: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vte-btn-add"
                    onClick={() => onChange({ ...value, keyList: [...(value.keyList ?? []), {}] })}
                  >
                    + Add KeyValueStructure
                  </button>
                </div>
              </Box>
              <Box>
                <Typography component="label" variant="body2" fontWeight={500}>
                  PrivateCodes
                </Typography>
                <div className="vte-sub-table">
                  {(value.privateCodes ?? []).map((item, idx) => (
                    <div key={idx} className="vte-sub-row">
                      <span className="vte-sub-index">{idx + 1}</span>
                      <PrivateCodeStructureRow
                        item={item}
                        onChange={next => {
                          const arr = [...(value.privateCodes ?? [])];
                          arr[idx] = next;
                          onChange({ ...value, privateCodes: arr });
                        }}
                      />
                      <button
                        type="button"
                        className="vte-btn-remove"
                        onClick={() => {
                          const arr = (value.privateCodes ?? []).filter((_, i) => i !== idx);
                          onChange({ ...value, privateCodes: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="vte-btn-add"
                    onClick={() =>
                      onChange({ ...value, privateCodes: [...(value.privateCodes ?? []), {}] })
                    }
                  >
                    + Add PrivateCodeStructure
                  </button>
                </div>
              </Box>
              <Box>
                <TextField
                  label="BrandingRef"
                  size="small"
                  fullWidth
                  value={value.brandingRef ?? ''}
                  onChange={e => onChange({ ...value, brandingRef: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  label="ResponsibilitySetRef"
                  size="small"
                  fullWidth
                  value={value.responsibilitySetRef ?? ''}
                  onChange={e => onChange({ ...value, responsibilitySetRef: e.target.value })}
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      )}
    </>
  );
}
