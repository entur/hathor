import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { Editor, validate, normalizeGraphQL, vehicleTypeToXmlShape } from '@entur/vtype-details';
import type { VehicleType as EditorVehicleType, ExtraTab } from '@entur/vtype-details';
import { DataViewTable, type ColumnDefinition } from '@entur/data-view-table';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { importAsNetexToBackend } from '../../vehicle-imports/vehicleImportServices';
import { buildPublicationDeliveryXml } from '../../netex/publicationDeliveryXml';
import { useVehicleType } from './useVehicleType';
import type { Vehicle, DeckPlan } from '../types/vehicleTypeTypes';
import { getDeckPlanSortValue } from '../../deck-plans/deckPlanSortValue';
import type { OrderBy as DeckPlanSortKey } from '../../deck-plans/useDeckPlans';
import LoadingPage from '../../../components/common/LoadingPage';
import ErrorPage from '../../../components/common/ErrorPage';
import GenericDetailsPage from '../../../pages/GenericDetailsPage';

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

  const [value, setValue] = useState<Partial<EditorVehicleType>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();

  const { data: vtype, loading, error } = useVehicleType(id);

  useEffect(() => {
    if (vtype) setValue(normalizeGraphQL(vtype));
  }, [vtype]);

  const handleSave = async () => {
    const result = validate(value);
    setErrors(result.errors);
    if (result.errors.length > 0) throw new Error('Validation failed');

    if (!applicationImportBaseUrl) {
      throw new Error('Application import base URL is not configured');
    }

    const xml = buildPublicationDeliveryXml({
      vehicleTypes: [vehicleTypeToXmlShape(value as Record<string, unknown>)],
    });
    const token = await getAccessToken();
    await importAsNetexToBackend(applicationImportBaseUrl, xml, token);
  };

  if (!isNew && loading) return <LoadingPage />;
  if (!isNew && error) return <ErrorPage message={error} />;

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
      saveDisabled={isEmpty || !applicationImportBaseUrl}
    >
      <Paper sx={{ p: 3, mb: 2 }}>
        <Editor value={value} onChange={setValue} extraTabs={extraTabs} />
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
