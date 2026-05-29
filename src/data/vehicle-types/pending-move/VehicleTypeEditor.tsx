import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { Editor } from '@entur/vtype-details';
import type { ExtraTab } from '@entur/vtype-details';
import { DataViewTable, type ColumnDefinition } from '@entur/data-view-table';
import { useAuth } from '../../auth/authUtils';
import { useConfig } from '../../contexts/configContext';
import { useVehicleType } from './useVehicleType';
import type { Vehicle, DeckPlan, VehicleType } from './vehicleTypeTypes';
import { getDeckPlanSortValue } from '../deck-plans/deckPlanSortValue';
import type { OrderBy as DeckPlanSortKey } from '../deck-plans/useDeckPlans';
import LoadingPage from '../../components/common/LoadingPage';
import ErrorPage from '../../components/common/ErrorPage';
import GenericDetailsPage from '../../pages/GenericDetailsPage';
import { createOrUpdateVehicleTypeRequest } from '../../graphql/vehicles/mutations/createOrUpdateVehicleType';
import type { VehicleTypeWire } from './fetchVehicleTypes';

type VehicleSortKey = 'id' | 'registrationNumber';

const vehicleCols: ColumnDefinition<Vehicle, VehicleSortKey>[] = [
  { id: 'id', headerLabel: 'ID', isSortable: true, renderCell: v => v.id, display: 'always' },
  {
    id: 'registrationNumber',
    headerLabel: 'Reg. Number',
    isSortable: true,
    renderCell: v => v.registrationNumber,
    display: 'always',
  },
];

const vehicleSortVal = (v: Vehicle, k: VehicleSortKey) =>
  k === 'id' ? v.id : v.registrationNumber;

const deckPlanCols: ColumnDefinition<DeckPlan, DeckPlanSortKey>[] = [
  { id: 'id', headerLabel: 'ID', isSortable: true, renderCell: d => d.id, display: 'always' },
  {
    id: 'name',
    headerLabel: 'Name',
    isSortable: true,
    renderCell: d => d.name?.value,
    display: 'always',
  },
];

export default function VehicleTypeDetails() {
  const { id } = useParams();
  const isNew = !id;

  const [value, setValue] = useState<Partial<VehicleType>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();

  const { data: vtype, loading, error } = useVehicleType(id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vtype) setValue(vtype);
  }, [vtype]);

  const handleSave = async () => {
    if (!applicationBaseUrl) {
      throw new Error('Application base URL is not configured');
    }

    setSaving(true);
    try {
      const wireVehicleType = {
        netexId: value.id,
        name: value.name,
        description: value.description,
        shortName: value.shortName,
        transportMode: value.transportMode,
        length: value.length,
        width: value.width,
        height: value.height,
        weight: value.weight,
        lowFloor: value.lowFloor,
        selfPropelled: value.selfPropelled,
        hybridCategory: value.hybridCategory,
        euroClass: value.euroClass,
        propulsionTypes: value.propulsionTypes,
        fuelTypes: value.fuelTypes,
        passengerCapacity: value.passengerCapacity,
        formDragCoefficient: value.formDragCoefficient,
        rollResistanceCoefficient: value.rollResistanceCoefficient,
        maximumEngineEffectKW: value.maximumEngineEffectKW,
        maximumVelocity: value.maximumVelocity,
        maximumRange: value.maximumRange,
        deckPlan: value.deckPlan?.id ? { netexId: value.deckPlan?.id } : undefined,
      } as VehicleTypeWire;
      const token = await getAccessToken();
      const body = await createOrUpdateVehicleTypeRequest(
        applicationBaseUrl,
        token,
        wireVehicleType
      );
      if (body.error) {
        setErrors([body.error]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrors([message]);
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && loading) return <LoadingPage />;
  if (!isNew && error) return <ErrorPage message={error} />;
  if (saving) return <LoadingPage />;

  const extraTabs: ExtraTab[] = [];

  if (vtype?.vehicles?.length) {
    extraTabs.push({
      label: `Vehicles (${vtype.vehicles.length})`,
      content: (
        <DataViewTable
          data={vtype.vehicles}
          columns={vehicleCols}
          getSortValue={vehicleSortVal}
          defaultSort={{ order: 'asc', orderBy: 'registrationNumber' }}
        />
      ),
    });
  }

  if (vtype?.deckPlan) {
    extraTabs.push({
      label: 'Deck Plan',
      content: (
        <DataViewTable
          data={[vtype.deckPlan]}
          columns={deckPlanCols}
          getSortValue={getDeckPlanSortValue}
          defaultSort={{ order: 'asc', orderBy: 'name' }}
        />
      ),
    });
  }

  const isEmpty = Object.keys(value).length === 0;
  const title = isNew ? 'New VehicleType' : (vtype?.name?.value ?? id ?? 'VehicleType');

  return (
    <GenericDetailsPage
      title={title}
      onSave={handleSave}
      saveDisabled={isEmpty || !applicationBaseUrl}
    >
      <Paper sx={{ p: 3, mb: 2 }}>
        <Editor value={value} onChange={setValue} />
      </Paper>
      {errors.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="subtitle2" gutterBottom>
            Validation errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
            {errors.map(e => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Paper>
      )}
    </GenericDetailsPage>
  );
}
