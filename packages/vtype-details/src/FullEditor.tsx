import type React from 'react';
import type {
  VehicleType,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirement,
  KeyValueStructure,
  AllPublicTransportModesEnumeration,
  PropulsionTypeEnumeration,
} from './generated/VehicleType.js';
import {
  ALL_PUBLIC_TRANSPORT_MODES,
  PROPULSION_TYPE,
  FUEL_TYPE,
  FARE_CLASS,
} from './generated/VehicleType.js';
import Box from '@mui/material/Box';
import { EnumMultiSelect } from './EnumMultiSelect.js';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import './Editor.css';

export interface FullEditorProps {
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
        placeholder="Value"
        value={item.value ?? ''}
        onChange={e => onChange({ ...item, value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="lang"
        value={item.$lang ?? ''}
        onChange={e => onChange({ ...item, $lang: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="textIdType"
        value={item.$textIdType ?? ''}
        onChange={e => onChange({ ...item, $textIdType: e.target.value })}
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
        placeholder="Value"
        value={item.value ?? ''}
        onChange={e => onChange({ ...item, value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="type"
        value={item.$type ?? ''}
        onChange={e => onChange({ ...item, $type: e.target.value })}
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
        value={item.FareClass ?? ''}
        onChange={e =>
          onChange({
            ...item,
            FareClass: (e.target.value || undefined) as (typeof FARE_CLASS)[number],
          })
        }
      >
        <option value=""></option>
        {FARE_CLASS.map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </TextField>
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="TotalCapacity"
        value={item.TotalCapacity != null ? String(item.TotalCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            TotalCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="SeatingCapacity"
        value={item.SeatingCapacity != null ? String(item.SeatingCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            SeatingCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="StandingCapacity"
        value={item.StandingCapacity != null ? String(item.StandingCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            StandingCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="SpecialPlaceCapacity"
        value={item.SpecialPlaceCapacity != null ? String(item.SpecialPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            SpecialPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="PushchairCapacity"
        value={item.PushchairCapacity != null ? String(item.PushchairCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            PushchairCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="WheelchairPlaceCapacity"
        value={item.WheelchairPlaceCapacity != null ? String(item.WheelchairPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            WheelchairPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="PramPlaceCapacity"
        value={item.PramPlaceCapacity != null ? String(item.PramPlaceCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            PramPlaceCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="BicycleRackCapacity"
        value={item.BicycleRackCapacity != null ? String(item.BicycleRackCapacity) : ''}
        onChange={e =>
          onChange({
            ...item,
            BicycleRackCapacity: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
    </div>
  );
}

function VehicleManoeuvringRequirementRow({
  item,
  onChange,
}: {
  item: Partial<VehicleManoeuvringRequirement>;
  onChange: (next: Partial<VehicleManoeuvringRequirement>) => void;
}): React.JSX.Element {
  return (
    <div className="vte-sub-fields">
      <label className="vte-label">
        <input
          className="vte-checkbox"
          type="checkbox"
          checked={!!item.Reversible}
          onChange={e => onChange({ ...item, Reversible: e.target.checked })}
        />
        Reversible
      </label>
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="MinimumTurningCircle"
        value={item.MinimumTurningCircle != null ? String(item.MinimumTurningCircle) : ''}
        onChange={e =>
          onChange({
            ...item,
            MinimumTurningCircle: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="MinimumOvertakingWidth"
        value={item.MinimumOvertakingWidth != null ? String(item.MinimumOvertakingWidth) : ''}
        onChange={e =>
          onChange({
            ...item,
            MinimumOvertakingWidth: e.target.value === '' ? undefined : Number(e.target.value),
          })
        }
      />
      <input
        className="vte-input vte-input--sub"
        type="number"
        placeholder="MinimumLength"
        value={item.MinimumLength != null ? String(item.MinimumLength) : ''}
        onChange={e =>
          onChange({
            ...item,
            MinimumLength: e.target.value === '' ? undefined : Number(e.target.value),
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
        placeholder="Key"
        value={item.Key ?? ''}
        onChange={e => onChange({ ...item, Key: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="Value"
        value={item.Value ?? ''}
        onChange={e => onChange({ ...item, Value: e.target.value })}
      />
      <input
        className="vte-input vte-input--sub"
        type="text"
        placeholder="typeOfKey"
        value={item.$typeOfKey ?? ''}
        onChange={e => onChange({ ...item, $typeOfKey: e.target.value })}
      />
    </div>
  );
}

export function FullEditor({ value, onChange }: FullEditorProps): React.JSX.Element {
  return (
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
              {(value.Name ?? []).map((item, idx) => (
                <div key={idx} className="vte-sub-row">
                  <span className="vte-sub-index">{idx + 1}</span>
                  <TextTypeRow
                    item={item}
                    onChange={next => {
                      const arr = [...(value.Name ?? [])];
                      arr[idx] = next;
                      onChange({ ...value, Name: arr });
                    }}
                  />
                  <button
                    type="button"
                    className="vte-btn-remove"
                    onClick={() => {
                      const arr = (value.Name ?? []).filter((_, i) => i !== idx);
                      onChange({ ...value, Name: arr });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="vte-btn-add"
                onClick={() => onChange({ ...value, Name: [...(value.Name ?? []), {}] })}
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
              {(value.ShortName ?? []).map((item, idx) => (
                <div key={idx} className="vte-sub-row">
                  <span className="vte-sub-index">{idx + 1}</span>
                  <TextTypeRow
                    item={item}
                    onChange={next => {
                      const arr = [...(value.ShortName ?? [])];
                      arr[idx] = next;
                      onChange({ ...value, ShortName: arr });
                    }}
                  />
                  <button
                    type="button"
                    className="vte-btn-remove"
                    onClick={() => {
                      const arr = (value.ShortName ?? []).filter((_, i) => i !== idx);
                      onChange({ ...value, ShortName: arr });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="vte-btn-add"
                onClick={() => onChange({ ...value, ShortName: [...(value.ShortName ?? []), {}] })}
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
              {(value.Description ?? []).map((item, idx) => (
                <div key={idx} className="vte-sub-row">
                  <span className="vte-sub-index">{idx + 1}</span>
                  <TextTypeRow
                    item={item}
                    onChange={next => {
                      const arr = [...(value.Description ?? [])];
                      arr[idx] = next;
                      onChange({ ...value, Description: arr });
                    }}
                  />
                  <button
                    type="button"
                    className="vte-btn-remove"
                    onClick={() => {
                      const arr = (value.Description ?? []).filter((_, i) => i !== idx);
                      onChange({ ...value, Description: arr });
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
                  onChange({ ...value, Description: [...(value.Description ?? []), {}] })
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
                item={value.PrivateCode ?? {}}
                onChange={next => onChange({ ...value, PrivateCode: next })}
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
              value={value.TransportMode ?? ''}
              onChange={e =>
                onChange({
                  ...value,
                  TransportMode: (e.target.value ||
                    undefined) as AllPublicTransportModesEnumeration,
                })
              }
            >
              <option value=""></option>
              {ALL_PUBLIC_TRANSPORT_MODES.map(v => (
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
              value={value.DeckPlanRef ?? ''}
              onChange={e => onChange({ ...value, DeckPlanRef: e.target.value })}
            />
          </Box>
          <Box>
            <TextField
              label="EuroClass"
              size="small"
              fullWidth
              value={value.EuroClass ?? ''}
              onChange={e => onChange({ ...value, EuroClass: e.target.value })}
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
                checked={!!value.ReversingDirection}
                onChange={e => onChange({ ...value, ReversingDirection: e.target.checked })}
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
                checked={!!value.SelfPropelled}
                onChange={e => onChange({ ...value, SelfPropelled: e.target.checked })}
              />
              <Typography variant="body2" fontWeight={500} component="span">
                SelfPropelled
              </Typography>
            </Box>
          </Box>
          <Box>
            <EnumMultiSelect
              label="PropulsionTypes"
              options={PROPULSION_TYPE}
              value={value.PropulsionTypes}
              onChange={selected => onChange({ ...value, PropulsionTypes: selected })}
            />
          </Box>
          <Box>
            <TextField
              label="PropulsionType"
              select
              size="small"
              fullWidth
              SelectProps={{ native: true }}
              value={value.PropulsionType ?? ''}
              onChange={e =>
                onChange({
                  ...value,
                  PropulsionType: (e.target.value || undefined) as PropulsionTypeEnumeration,
                })
              }
            >
              <option value=""></option>
              {PROPULSION_TYPE.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </TextField>
          </Box>
          <Box>
            <EnumMultiSelect
              label="FuelTypes"
              options={FUEL_TYPE}
              value={value.FuelTypes}
              onChange={selected => onChange({ ...value, FuelTypes: selected })}
            />
          </Box>
          <Box>
            <TextField
              label="MaximumRange"
              size="small"
              fullWidth
              type="number"
              value={value.MaximumRange != null ? String(value.MaximumRange) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, MaximumRange: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="MaximumVelocity"
              size="small"
              fullWidth
              type="number"
              value={value.MaximumVelocity != null ? String(value.MaximumVelocity) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, MaximumVelocity: n });
              }}
            />
          </Box>
          <Box>
            <Typography component="label" variant="body2" fontWeight={500}>
              PassengerCapacity
            </Typography>
            <div className="vte-sub-table">
              <PassengerCapacityStructureRow
                item={value.PassengerCapacity ?? {}}
                onChange={next => onChange({ ...value, PassengerCapacity: next })}
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
              value={value.$id ?? ''}
              onChange={e => onChange({ ...value, $id: e.target.value })}
            />
          </Box>
          <Box>
            <TextField
              label="IncludedIn"
              size="small"
              fullWidth
              value={value.IncludedIn ?? ''}
              onChange={e => onChange({ ...value, IncludedIn: e.target.value })}
            />
          </Box>
          <Box>
            <TextField
              label="ClassifiedAsRef"
              size="small"
              fullWidth
              value={value.ClassifiedAsRef ?? ''}
              onChange={e => onChange({ ...value, ClassifiedAsRef: e.target.value })}
            />
          </Box>
          <Box>
            <TextField
              label="facilities"
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
                checked={!!value.Monitored}
                onChange={e => onChange({ ...value, Monitored: e.target.checked })}
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
                checked={!!value.LowFloor}
                onChange={e => onChange({ ...value, LowFloor: e.target.checked })}
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
                checked={!!value.HasLiftOrRamp}
                onChange={e => onChange({ ...value, HasLiftOrRamp: e.target.checked })}
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
                checked={!!value.HasHoist}
                onChange={e => onChange({ ...value, HasHoist: e.target.checked })}
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
              value={value.HoistOperatingRadius != null ? String(value.HoistOperatingRadius) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, HoistOperatingRadius: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="BoardingHeight"
              size="small"
              fullWidth
              type="number"
              value={value.BoardingHeight != null ? String(value.BoardingHeight) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, BoardingHeight: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="GapToPlatform"
              size="small"
              fullWidth
              type="number"
              value={value.GapToPlatform != null ? String(value.GapToPlatform) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, GapToPlatform: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Length"
              size="small"
              fullWidth
              type="number"
              value={value.Length != null ? String(value.Length) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, Length: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Width"
              size="small"
              fullWidth
              type="number"
              value={value.Width != null ? String(value.Width) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, Width: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Height"
              size="small"
              fullWidth
              type="number"
              value={value.Height != null ? String(value.Height) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, Height: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Weight"
              size="small"
              fullWidth
              type="number"
              value={value.Weight != null ? String(value.Weight) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, Weight: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="FirstAxleHeight"
              size="small"
              fullWidth
              type="number"
              value={value.FirstAxleHeight != null ? String(value.FirstAxleHeight) : ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value);
                onChange({ ...value, FirstAxleHeight: n });
              }}
            />
          </Box>
          <Box>
            <TextField
              label="canCarry"
              size="small"
              fullWidth
              value={value.canCarry ?? ''}
              onChange={e => onChange({ ...value, canCarry: e.target.value })}
            />
          </Box>
          <Box>
            <Typography component="label" variant="body2" fontWeight={500}>
              canManoeuvre
            </Typography>
            <div className="vte-sub-table">
              <VehicleManoeuvringRequirementRow
                item={value.canManoeuvre ?? {}}
                onChange={next => onChange({ ...value, canManoeuvre: next })}
              />
            </div>
          </Box>
          <Box>
            <TextField
              label="satisfiesFacilityRequirements"
              size="small"
              fullWidth
              value={value.satisfiesFacilityRequirements ?? ''}
              onChange={e => onChange({ ...value, satisfiesFacilityRequirements: e.target.value })}
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
              keyList
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
              privateCodes
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
              value={value.BrandingRef ?? ''}
              onChange={e => onChange({ ...value, BrandingRef: e.target.value })}
            />
          </Box>
          <Box>
            <TextField
              label="ResponsibilitySetRef"
              size="small"
              fullWidth
              value={value.$responsibilitySetRef ?? ''}
              onChange={e => onChange({ ...value, $responsibilitySetRef: e.target.value })}
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
