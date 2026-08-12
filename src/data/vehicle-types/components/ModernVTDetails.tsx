import { SobekProvider, VehicleTypeForm, type VehicleTypeLayout } from '@entur/mui-comps-nmr';
import type { ComponentProps } from 'react';

import { useAuth } from '../../../auth';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';

/** `VehicleTypeFormProps` is not exported by the package, so derive it from the
 *  component. Every field on it is optional, so the defaults below stay overridable. */
type ElemProps = ComponentProps<typeof VehicleTypeForm>;

export default function Elem(props: ElemProps) {
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
      <h2>Header here</h2>
      <VehicleTypeForm layout={vehicleTypeLayout} variant="tabs" {...props} />
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
