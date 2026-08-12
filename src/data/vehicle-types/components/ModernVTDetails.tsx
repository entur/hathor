import { SobekProvider, VehicleTypeForm, type VehicleTypeLayout } from '@entur/mui-comps-nmr';
import { Box } from '@mui/material';
import type { ComponentProps } from 'react';

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
        <VehicleTypeForm mode="edit" layout={vehicleTypeLayout} variant="tabs" {...props} />
      </Box>
    </SobekProvider>
  );
}

const vehicleTypeLayout: VehicleTypeLayout = {
  Edit: [
    'name',
    'transportMode',
    { field: 'deckPlan', options: () => [] /* TODO */ },
    'manufacturer',
    'range',
    'fullCharge',
  ],
  'Dim.': ['length', 'width', 'height', 'weight'],
  Accessibility: ['lowFloor'],
  Environment: [
    'selfPropelled',
    'propulsionTypes',
    'fuelTypes',
    'maximumVelocity',
    'maximumRange',
    'formDragCoefficient',
    'rollResistanceCoefficient',
    'maximumEngineEffectKW',
    'hybridCategory',
  ],
  Passenger: [
    'fareClass',
    'totalCapacity',
    'seatingCapacity',
    'standingCapacity',
    'specialPlaceCapacity',
    'wheelchairPlaceCapacity',
  ],
  Cargo: ['pushchairCapacity', 'pramPlaceCapacity', 'bicycleRackCapacity', 'carLoading'],
  Vehicles: [
    {
      field: 'vehicles',
      entries: [
        { field: 'name', label: 'Name' },
        { field: 'operationalNumber', label: 'Op. No.' },
      ],
    },
  ],
};
