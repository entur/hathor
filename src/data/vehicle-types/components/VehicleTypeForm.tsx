import { useMemo, useState, type ReactNode } from 'react';
import { Box, Chip, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormStack } from '../../../components/FormLayout.tsx';
import {
  FormAutocompleteField,
  FormNumberField,
  FormSelectField,
  FormSwitchField,
  FormTextField,
} from '../../../components/FormFields.tsx';
import { blankToUndefined } from '../../../utils/blankToUndefined.ts';
import {
  TRANSPORT_MODES,
  transportModeLabelKey,
  type TransportMode,
} from '../../netex/transportMode.ts';
import { vehicleSelectedHref } from '../../vehicles/utils/vehicleUrlParams.ts';
import { mergeNameText } from '../../netex/multilingualString.ts';
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

const HYBRID_CATEGORY_OPTIONS = HYBRID_CATEGORIES.map(c => ({ value: c, label: c }));

/** Editor tabs — Edit (identity + dimensions) first, then the field-group tabs. */
type TabKey = 'general' | 'propulsion' | 'capacity' | 'environment' | 'vehicles';

interface VehicleTypeFormProps {
  value: VehicleType;
  onChange: (next: VehicleType) => void;
  mode: 'view' | 'edit';
}

/**
 * Reusable, presentational VehicleType editor — a tabbed FormStack driven by
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
  const [tab, setTab] = useState<TabKey>('general');
  const ro = mode === 'view';
  const transportModeOptions = useMemo(
    () => TRANSPORT_MODES.map(m => ({ value: m, label: t(transportModeLabelKey(m), m) })),
    [t]
  );

  const setField = (patch: Partial<VehicleType>) => onChange({ ...value, ...patch });
  const setCapacity = (patch: Partial<PassengerCapacity>) => {
    const merged = { ...value.passengerCapacity, ...patch };
    // Collapse back to `undefined` when every count is cleared so the object
    // doesn't linger as `{}` and read as dirty vs an absent baseline.
    const hasAny = Object.values(merged).some(v => v != null);
    onChange({ ...value, passengerCapacity: hasAny ? merged : undefined });
  };

  /** A read-only-aware number field bound to a top-level VehicleType key. */
  const numRow = (key: keyof VehicleType, label: string): ReactNode => (
    <FormNumberField
      id={`vtype-${key}`}
      label={label}
      value={value[key] as number | undefined}
      onChange={n => setField({ [key]: n })}
      disabled={ro}
    />
  );

  /** A read-only-aware number field bound to a passengerCapacity key. */
  const capRow = (key: keyof PassengerCapacity, label: string): ReactNode => (
    <FormNumberField
      id={`vtype-cap-${key}`}
      label={label}
      value={value.passengerCapacity?.[key]}
      onChange={n => setCapacity({ [key]: n })}
      disabled={ro}
    />
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
        <Tab value="general" label={t('vehicleType.tab.general')} />
        <Tab value="propulsion" label={t('vehicleType.tab.propulsion')} />
        <Tab value="capacity" label={t('vehicleType.tab.capacity')} />
        <Tab value="environment" label={t('vehicleType.tab.environment')} />
        <Tab value="vehicles" label={t('vehicleType.tab.vehicles')} />
      </Tabs>

      {tab === 'general' && (
        <FormStack data-testid="vtype-tab-general">
          <FormTextField
            id="vtype-name"
            label={t('vehicleType.field.name')}
            value={value.name?.value ?? ''}
            onChange={text => setField({ name: mergeNameText(value.name, text) })}
            disabled={ro}
          />
          <FormSelectField<TransportMode>
            id="vtype-transport-mode"
            label={t('vehicleType.field.transportMode')}
            // `transportMode` is normalised to a canonical mode (or undefined)
            // at projection, so it always matches an option or the blank one
            // — no MUI out-of-range value, no read/write skew.
            value={value.transportMode}
            options={transportModeOptions}
            noneLabel={t('common.none')}
            onChange={transportMode => setField({ transportMode })}
            disabled={ro}
          />
          <FormSwitchField
            id="vtype-low-floor"
            label={t('vehicleType.field.lowFloor')}
            checked={!!value.lowFloor}
            onChange={lowFloor => setField({ lowFloor })}
            disabled={ro}
          />
          <Divider />
          {numRow('length', t('vehicleType.field.length'))}
          {numRow('width', t('vehicleType.field.width'))}
          {numRow('height', t('vehicleType.field.height'))}
          {numRow('weight', t('vehicleType.field.weight'))}
        </FormStack>
      )}

      {tab === 'propulsion' && (
        <FormStack data-testid="vtype-tab-propulsion">
          <FormAutocompleteField<PropulsionType, true>
            id="vtype-propulsion-types"
            label={t('vehicleType.field.propulsionTypes')}
            multiple
            options={PROPULSION_TYPES}
            value={value.propulsionTypes ?? []}
            onChange={(_e, v) => setField({ propulsionTypes: v.length ? v : undefined })}
            disabled={ro}
            disableCloseOnSelect
          />
          <FormAutocompleteField<FuelType, true>
            id="vtype-fuel-types"
            label={t('vehicleType.field.fuelTypes')}
            multiple
            options={FUEL_TYPES}
            value={value.fuelTypes ?? []}
            onChange={(_e, v) => setField({ fuelTypes: v.length ? v : undefined })}
            disabled={ro}
            disableCloseOnSelect
          />
          <FormSwitchField
            id="vtype-self-propelled"
            label={t('vehicleType.field.selfPropelled')}
            checked={!!value.selfPropelled}
            onChange={selfPropelled => setField({ selfPropelled })}
            disabled={ro}
          />
          <FormTextField
            id="vtype-euro-class"
            label={t('vehicleType.field.euroClass')}
            value={value.euroClass ?? ''}
            onChange={text => setField({ euroClass: blankToUndefined(text) })}
            disabled={ro}
          />
          {numRow('maximumVelocity', t('vehicleType.field.maximumVelocity'))}
          {numRow('maximumRange', t('vehicleType.field.maximumRange'))}
        </FormStack>
      )}

      {tab === 'capacity' && (
        <FormStack data-testid="vtype-tab-capacity">
          {capRow('totalCapacity', t('vehicleType.field.totalCapacity'))}
          {capRow('seatingCapacity', t('vehicleType.field.seatingCapacity'))}
          {capRow('standingCapacity', t('vehicleType.field.standingCapacity'))}
          {capRow('pushchairCapacity', t('vehicleType.field.pushchairCapacity'))}
          {capRow('wheelchairPlaceCapacity', t('vehicleType.field.wheelchairPlaceCapacity'))}
          {capRow('pramPlaceCapacity', t('vehicleType.field.pramPlaceCapacity'))}
          {capRow('bicycleRackCapacity', t('vehicleType.field.bicycleRackCapacity'))}
        </FormStack>
      )}

      {tab === 'environment' && (
        <FormStack data-testid="vtype-tab-environment">
          {numRow('formDragCoefficient', t('vehicleType.field.formDragCoefficient'))}
          {numRow('rollResistanceCoefficient', t('vehicleType.field.rollResistanceCoefficient'))}
          {numRow('maximumEngineEffectKW', t('vehicleType.field.maximumEngineEffectKW'))}
          <FormSelectField<HybridCategory>
            id="vtype-hybrid-category"
            label={t('vehicleType.field.hybridCategory')}
            value={value.hybridCategory}
            options={HYBRID_CATEGORY_OPTIONS}
            noneLabel={t('common.none')}
            onChange={hybridCategory => setField({ hybridCategory })}
            disabled={ro}
          />
        </FormStack>
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
              {t('vehicleType.noVehicles')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
