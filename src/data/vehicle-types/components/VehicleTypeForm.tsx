import { useState, type ReactNode } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import { transportModeFilters } from '../../netex/transportMode.ts';
import { vehicleSelectedHref } from '../../vehicles/utils/vehicleUrlParams.ts';
import {
  PROPULSION_TYPES,
  FUEL_TYPES,
  HYBRID_CATEGORIES,
  type VehicleType,
  type PassengerCapacity,
  type PropulsionType,
  type FuelType,
  type HybridCategory,
} from '../types/vehicleTypeTypes.ts';

/** Editor tabs — Edit (identity + dimensions) first, then the field-group tabs. */
type TabKey = 'edit' | 'propulsion' | 'capacity' | 'environment' | 'vehicles';

interface VehicleTypeFormProps {
  value: VehicleType;
  onChange: (next: VehicleType) => void;
  mode: 'view' | 'edit';
}

const numVal = (n?: number): number | '' => (n == null ? '' : n);
const numOr = (s: string): number | undefined => (s === '' ? undefined : Number(s));
const textOr = (s: string): string | undefined => (s === '' ? undefined : s);

/**
 * Reusable, presentational VehicleType editor — a tabbed FormLayout driven by
 * `value`/`onChange`/`mode`. Tabs: Edit (identity + dimensions) · Propulsion/perf.
 * · Passenger Capacity · Environment · Vehicles (read-only links to the vehicles
 * route). Holds no fetch/save logic so it can back both the sidebar editor and a
 * future `/vehicle-types/new` create flow.
 *
 * @param value    Current VehicleType (gql-shaped).
 * @param onChange Fired with the merged next value on every field edit.
 * @param mode     `'view'` disables all inputs; `'edit'` enables them.
 */
export default function VehicleTypeForm({ value, onChange, mode }: VehicleTypeFormProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>('edit');
  const ro = mode === 'view';

  const setField = (patch: Partial<VehicleType>) => onChange({ ...value, ...patch });
  const setCapacity = (patch: Partial<PassengerCapacity>) => {
    const merged = { ...value.passengerCapacity, ...patch };
    // Collapse back to `undefined` when every count is cleared so the object
    // doesn't linger as `{}` and read as dirty vs an absent baseline.
    const hasAny = Object.values(merged).some(v => v != null);
    onChange({ ...value, passengerCapacity: hasAny ? merged : undefined });
  };

  /** A read-only-aware number FieldRow bound to a top-level VehicleType key. */
  const numRow = (key: keyof VehicleType, label: string): ReactNode => (
    <FieldRow id={`vtype-${key}`} label={label}>
      <TextField
        id={`vtype-${key}`}
        type="number"
        value={numVal(value[key] as number | undefined)}
        onChange={e => setField({ [key]: numOr(e.target.value) })}
        disabled={ro}
        size="small"
        fullWidth
      />
    </FieldRow>
  );

  /** A read-only-aware number FieldRow bound to a passengerCapacity key. */
  const capRow = (key: keyof PassengerCapacity, label: string): ReactNode => (
    <FieldRow id={`vtype-cap-${key}`} label={label}>
      <TextField
        id={`vtype-cap-${key}`}
        type="number"
        value={numVal(value.passengerCapacity?.[key])}
        onChange={e => setCapacity({ [key]: numOr(e.target.value) })}
        disabled={ro}
        size="small"
        fullWidth
      />
    </FieldRow>
  );

  return (
    <Box>
      {/* Pill/segmented tabs: the sliding underline indicator misaligns once
          the tabs wrap onto a second line in a narrow rail, so hide it and mark
          the active tab with a filled background. Tabs still wrap (no chevrons). */}
      <Tabs
        value={tab}
        onChange={(_e, v: TabKey) => setTab(v)}
        sx={{
          mb: 1.5,
          minHeight: 0,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTabs-flexContainer': { flexWrap: 'wrap', gap: 0.75 },
          '& .MuiTab-root': {
            minHeight: 30,
            px: 1.25,
            py: 0.25,
            borderRadius: 1,
            textTransform: 'none',
            bgcolor: 'action.hover',
            color: 'text.secondary',
          },
          '& .MuiTab-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          },
        }}
      >
        <Tab value="edit" label={t('vehicleType.tab.edit', 'Edit')} />
        <Tab value="propulsion" label={t('vehicleType.tab.propulsion', 'Propulsion/perf.')} />
        <Tab value="capacity" label={t('vehicleType.tab.capacity', 'Passenger Capacity')} />
        <Tab value="environment" label={t('vehicleType.tab.environment', 'Environment')} />
        <Tab value="vehicles" label={t('vehicleType.tab.vehicles', 'Vehicles')} />
      </Tabs>

      {tab === 'edit' && (
        <FormLayout data-testid="vtype-tab-edit">
          <FieldRow id="vtype-id" label={t('vehicles.field.id', 'ID')}>
            <TextField id="vtype-id" value={value.id} disabled size="small" fullWidth />
          </FieldRow>
          <FieldRow id="vtype-name" label={t('vehicleType.field.name', 'Name')}>
            <TextField
              id="vtype-name"
              value={value.name?.value ?? ''}
              onChange={e =>
                setField({
                  name: textOr(e.target.value)
                    ? { ...value.name, value: e.target.value }
                    : undefined,
                })
              }
              disabled={ro}
              size="small"
              fullWidth
            />
          </FieldRow>
          <FieldRow
            id="vtype-transport-mode"
            label={t('vehicleType.field.transportMode', 'Transport Mode')}
          >
            <TextField
              id="vtype-transport-mode"
              select
              // `transportMode` is normalised to a canonical mode (or undefined)
              // at projection, so it always matches an option or the blank one
              // below — no MUI out-of-range value, no read/write skew.
              value={value.transportMode ?? ''}
              onChange={e => setField({ transportMode: e.target.value || undefined })}
              disabled={ro}
              size="small"
              fullWidth
            >
              <MenuItem value="">
                <em>{t('common.none', 'None')}</em>
              </MenuItem>
              {transportModeFilters.map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {t(f.labelKey, f.defaultLabel)}
                </MenuItem>
              ))}
            </TextField>
          </FieldRow>
          <FieldRow id="vtype-low-floor" label={t('vehicleType.field.lowFloor', 'Low Floor')}>
            <FormControlLabel
              control={
                <Switch
                  id="vtype-low-floor"
                  checked={!!value.lowFloor}
                  onChange={e => setField({ lowFloor: e.target.checked })}
                  disabled={ro}
                  size="small"
                />
              }
              label=""
            />
          </FieldRow>
          <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />
          {numRow('length', t('vehicleType.field.length', 'Length'))}
          {numRow('width', t('vehicleType.field.width', 'Width'))}
          {numRow('height', t('vehicleType.field.height', 'Height'))}
          {numRow('weight', t('vehicleType.field.weight', 'Weight'))}
        </FormLayout>
      )}

      {tab === 'propulsion' && (
        <FormLayout data-testid="vtype-tab-propulsion">
          <FieldRow
            id="vtype-propulsion-types"
            label={t('vehicleType.field.propulsionTypes', 'Propulsion Types')}
          >
            <Autocomplete<PropulsionType, true>
              multiple
              options={[...PROPULSION_TYPES]}
              value={value.propulsionTypes ?? []}
              onChange={(_e, v) => setField({ propulsionTypes: v.length ? v : undefined })}
              disabled={ro}
              size="small"
              disableCloseOnSelect
              renderInput={params => (
                <TextField {...params} id="vtype-propulsion-types" size="small" />
              )}
            />
          </FieldRow>
          <FieldRow id="vtype-fuel-types" label={t('vehicleType.field.fuelTypes', 'Fuel Types')}>
            <Autocomplete<FuelType, true>
              multiple
              options={[...FUEL_TYPES]}
              value={value.fuelTypes ?? []}
              onChange={(_e, v) => setField({ fuelTypes: v.length ? v : undefined })}
              disabled={ro}
              size="small"
              disableCloseOnSelect
              renderInput={params => <TextField {...params} id="vtype-fuel-types" size="small" />}
            />
          </FieldRow>
          <FieldRow
            id="vtype-self-propelled"
            label={t('vehicleType.field.selfPropelled', 'Self Propelled')}
          >
            <FormControlLabel
              control={
                <Switch
                  id="vtype-self-propelled"
                  checked={!!value.selfPropelled}
                  onChange={e => setField({ selfPropelled: e.target.checked })}
                  disabled={ro}
                  size="small"
                />
              }
              label=""
            />
          </FieldRow>
          <FieldRow id="vtype-euro-class" label={t('vehicleType.field.euroClass', 'Euro Class')}>
            <TextField
              id="vtype-euro-class"
              value={value.euroClass ?? ''}
              onChange={e => setField({ euroClass: textOr(e.target.value) })}
              disabled={ro}
              size="small"
              fullWidth
            />
          </FieldRow>
          {numRow('maximumVelocity', t('vehicleType.field.maximumVelocity', 'Maximum Velocity'))}
          {numRow('maximumRange', t('vehicleType.field.maximumRange', 'Maximum Range'))}
        </FormLayout>
      )}

      {tab === 'capacity' && (
        <FormLayout data-testid="vtype-tab-capacity">
          {capRow('totalCapacity', t('vehicleType.field.totalCapacity', 'Total Capacity'))}
          {capRow('seatingCapacity', t('vehicleType.field.seatingCapacity', 'Seating Capacity'))}
          {capRow('standingCapacity', t('vehicleType.field.standingCapacity', 'Standing Capacity'))}
          {capRow(
            'pushchairCapacity',
            t('vehicleType.field.pushchairCapacity', 'Pushchair Capacity')
          )}
          {capRow(
            'wheelchairPlaceCapacity',
            t('vehicleType.field.wheelchairPlaceCapacity', 'Wheelchair Places')
          )}
          {capRow('pramPlaceCapacity', t('vehicleType.field.pramPlaceCapacity', 'Pram Places'))}
          {capRow(
            'bicycleRackCapacity',
            t('vehicleType.field.bicycleRackCapacity', 'Bicycle Racks')
          )}
        </FormLayout>
      )}

      {tab === 'environment' && (
        <FormLayout data-testid="vtype-tab-environment">
          {numRow(
            'formDragCoefficient',
            t('vehicleType.field.formDragCoefficient', 'Form Drag Coefficient')
          )}
          {numRow(
            'rollResistanceCoefficient',
            t('vehicleType.field.rollResistanceCoefficient', 'Roll Resistance Coefficient')
          )}
          {numRow(
            'maximumEngineEffectKW',
            t('vehicleType.field.maximumEngineEffectKW', 'Max Engine Effect (kW)')
          )}
          <FieldRow
            id="vtype-hybrid-category"
            label={t('vehicleType.field.hybridCategory', 'Hybrid Category')}
          >
            <TextField
              id="vtype-hybrid-category"
              select
              value={value.hybridCategory ?? ''}
              onChange={e =>
                setField({
                  hybridCategory: (e.target.value || undefined) as HybridCategory | undefined,
                })
              }
              disabled={ro}
              size="small"
              fullWidth
            >
              <MenuItem value="">
                <em>{t('common.none', 'None')}</em>
              </MenuItem>
              {HYBRID_CATEGORIES.map(c => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </FieldRow>
        </FormLayout>
      )}

      {tab === 'vehicles' && (
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, py: 0.5 }}
          data-testid="vtype-tab-vehicles"
        >
          {value.vehicles?.length ? (
            value.vehicles.map(v => (
              <Chip
                key={v.id}
                component={RouterLink}
                to={vehicleSelectedHref(v.id)}
                clickable
                size="small"
                variant="outlined"
                label={
                  <>
                    {v.registrationNumber}
                    {v.operationalNumber && (
                      <Box component="span" sx={{ color: 'primary.main', ml: 0.5 }}>
                        ({v.operationalNumber})
                      </Box>
                    )}
                  </>
                }
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('vehicleType.noVehicles', 'No vehicles')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
