import { SobekProvider, VehicleTypeForm, type VehicleTypeLayout } from '@entur/mui-comps-nmr';
import { Box } from '@mui/material';
import type { TFunction } from 'i18next';
import { useMemo, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../../auth';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';
import VehicleTypeHeader from './VehicleTypeHeader.tsx';

/** Padded, self-scrolling shell, matching the legacy editor's. */
const EDITOR_SHELL_SX = {
  p: 2,
  height: '100%',
  overflowY: 'auto',
  boxSizing: 'border-box',
} as const;

/** `VehicleTypeFormProps` is not exported by the package, so derive it from the
 *  component. Every field on it is optional, so the defaults below stay overridable. */
type ElemProps = ComponentProps<typeof VehicleTypeForm> & {
  /**
   * Header title. Fed from the resolved list row, not the form: `VehicleTypeForm`
   * omits `value`/`onChange`, so its live state is not observable from here and
   * the title cannot track typing the way the legacy editor's does.
   */
  name?: string;
  /** Header version badge, likewise row-derived. */
  version?: number;
};

export default function Elem({ name, version, ...props }: ElemProps) {
  const { applicationBaseUrl } = useConfig();
  const auth = useAuth();
  const { currentOrganisation } = useOrganisationsContext();
  const { t } = useTranslation();
  const layout = useMemo(() => mkLayout(t), [t]);
  // The package ships English defaults and carries no i18n runtime, so every
  // footer string is the host's to supply — including the two status texts that
  // are off-screen right now (`clean`/`dirty`/`saving` share one slot).
  const footerProps = useMemo(
    () => ({
      labels: {
        save: t('save'),
        cancel: t('cancel'),
        clean: t('common.editFooter.clean'),
        dirty: t('common.editFooter.dirty'),
        saving: t('common.editFooter.saving'),
      },
    }),
    [t]
  );
  // Same deal for the load skeleton: only its aria-label is the host's — the
  // shape is derived from the field registry so it cannot drift from the form.
  const skeletonProps = useMemo(() => ({ ariaLabel: t('common.formSkeleton.ariaLabel') }), [t]);

  const getHeaders = async (): Promise<Record<string, string>> => ({
    Authorization: `Bearer ${await auth.getAccessToken()}`,
  });

  // `applicationBaseUrl` lands async from public/config.json and the org comes
  // from the picker — both are legitimately absent on first paint, so gate the
  // provider instead of asserting the required SobekCtx fields non-null.
  if (!applicationBaseUrl || !currentOrganisation) return null;

  return (
    <SobekProvider
      value={{
        endpoint: applicationBaseUrl,
        getHeaders,
        dataOwnerRef: currentOrganisation.id,
      }}
    >
      <Box sx={EDITOR_SHELL_SX}>
        <VehicleTypeHeader name={name} id={props.netexId} version={version} />
        <VehicleTypeForm
          mode="edit"
          layout={layout}
          variant="tabs"
          footerProps={footerProps}
          skeletonProps={skeletonProps}
          {...props}
        />
      </Box>
    </SobekProvider>
  );
}

/**
 * Build the tabbed field layout with translated section and field labels.
 *
 * Section names are the record's own keys — `VehicleTypeForm` renders them as
 * tab labels — so they are translated too, not just the field entries. Fields
 * the VehicleType bundle has no key for (`manufacturer`, `range`, `fullCharge`,
 * the vehicle-list columns) reuse the `vehicles.*` keys, whose rendered values
 * are identical; duplicating them under `vehicleType.*` would only add drift.
 *
 * The first tab is "General" — identity plus the three inlined vehicleModel
 * props — mirroring the legacy editor's first tab rather than splitting the
 * model fields off, so the two editors read the same when toggled between.
 *
 * @param t i18next translator from `useTranslation()`.
 * @returns Layout consumed by `VehicleTypeForm`'s `layout` prop.
 */
const mkLayout = (t: TFunction): VehicleTypeLayout => ({
  [t('vehicleType.tab.general')]: [
    { field: 'name', label: t('vehicleType.field.name') },
    { field: 'transportMode', label: t('vehicleType.field.transportMode') },
    {
      field: 'deckPlan',
      label: t('vehicleType.field.deckPlan'),
      options: () => [] /* TODO */,
    },
    { field: 'manufacturer', label: t('vehicles.field.manufacturer') },
    { field: 'range', label: t('vehicles.field.range') },
    { field: 'fullCharge', label: t('vehicles.field.fullCharge') },
  ],
  [t('vehicleType.field.dimensions')]: [
    { field: 'length', label: t('vehicleType.field.length') },
    { field: 'width', label: t('vehicleType.field.width') },
    { field: 'height', label: t('vehicleType.field.height') },
    { field: 'weight', label: t('vehicleType.field.weight') },
  ],
  [t('vehicleType.tab.accessibility')]: [
    { field: 'lowFloor', label: t('vehicleType.field.lowFloor') },
  ],
  [t('vehicleType.tab.environment')]: [
    { field: 'selfPropelled', label: t('vehicleType.field.selfPropelled') },
    { field: 'propulsionTypes', label: t('vehicleType.field.propulsionTypes') },
    { field: 'fuelTypes', label: t('vehicleType.field.fuelTypes') },
    { field: 'maximumVelocity', label: t('vehicleType.field.maximumVelocity') },
    { field: 'maximumRange', label: t('vehicleType.field.maximumRange') },
    { field: 'formDragCoefficient', label: t('vehicleType.field.formDragCoefficient') },
    {
      field: 'rollResistanceCoefficient',
      label: t('vehicleType.field.rollResistanceCoefficient'),
    },
    { field: 'maximumEngineEffectKW', label: t('vehicleType.field.maximumEngineEffectKW') },
    { field: 'hybridCategory', label: t('vehicleType.field.hybridCategory') },
  ],
  [t('vehicleType.tab.capacity')]: [
    { field: 'fareClass', label: t('vehicleType.field.fareClass') },
    { field: 'totalCapacity', label: t('vehicleType.field.totalCapacity') },
    { field: 'seatingCapacity', label: t('vehicleType.field.seatingCapacity') },
    { field: 'standingCapacity', label: t('vehicleType.field.standingCapacity') },
    { field: 'specialPlaceCapacity', label: t('vehicleType.field.specialPlaceCapacity') },
    {
      field: 'wheelchairPlaceCapacity',
      label: t('vehicleType.field.wheelchairPlaceCapacity'),
    },
  ],
  [t('vehicleType.tab.cargo')]: [
    { field: 'pushchairCapacity', label: t('vehicleType.field.pushchairCapacity') },
    { field: 'pramPlaceCapacity', label: t('vehicleType.field.pramPlaceCapacity') },
    { field: 'bicycleRackCapacity', label: t('vehicleType.field.bicycleRackCapacity') },
    { field: 'carLoading', label: t('vehicleType.field.carLoading') },
  ],
  [t('vehicleType.tab.vehicles')]: [
    {
      field: 'vehicles',
      entries: [
        { field: 'name', label: t('vehicles.field.name') },
        { field: 'operationalNumber', label: t('vehicles.field.operationalNumber') },
      ],
    },
  ],
});
