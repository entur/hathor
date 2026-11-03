import { Divider, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../../components/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../../hooks/useEntityEditor.ts';
import { deactivateVehicleRequest } from '../../../graphql/vehicles/mutations/deactivateVehicle.ts';
import { vehicleMode } from '../types/vehicle.ts';
import VehicleEditForm from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import { fetchVehicle } from '../api/fetchVehicles.ts';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { canSubmit, vehicleForm } from '../stores/vehicleFormState.ts';

const COPY: EditorCopy = {
  title: 'vehicles.detailsTitle',
  notFound: 'vehicles.notFound',
  saved: 'vehicles.saveSuccess',
  deactivated: 'vehicles.deactivateSuccess',
  deactivateTitle: 'vehicle.deactivateConfirmTitle',
  deactivateMessage: 'vehicle.deactivateConfirmMessage',
};

/**
 * Vehicle editor: the shared {@link useEntityEditor} + {@link EditorFrame}
 * with the vehicle's context rows (parent type, transport mode) and
 * {@link VehicleEditForm} as the body.
 *
 * @param {EntityEditorHostProps} host Id, initial mode and the host's list reload / URL writes.
 * @returns {JSX.Element} The vehicle editor pane.
 */
export default function VehicleDetails(host: EntityEditorHostProps) {
  const { t } = useTranslation();
  const { save } = useVehiclePairSave();
  const editor = useEntityEditor({
    ...host,
    fetchById: fetchVehicle,
    formState: vehicleForm,
    write: form => save(form),
    withNewId: (form, newId) => ({ vehicle: { ...form.vehicle, id: newId, version: 1 } }),
    deactivateRequest: deactivateVehicleRequest,
  });
  const { form, record } = editor;

  return (
    <EditorFrame
      editor={editor}
      entity={form.vehicle}
      testId="vehicle"
      copy={COPY}
      skeleton={<VehicleDetailsSkeleton />}
      // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
      // silently excludes refless vehicles from the list (create-but-invisible).
      // Existing rows already carry a ref, so only the create flow needs the gate.
      canSubmit={!editor.isCreate || canSubmit(form)}
    >
      <FormLayout rowGap={0.5} sx={{ mb: 2 }} data-testid="vehicle-context">
        <MetaRow label={t('vehicles.field.parentVehicleType')}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <span>{record?.transportType?.name?.value ?? '—'}</span>
            {record?.transportType?.id && (
              <NetexId id={record.transportType.id} copy="only" size="medium" />
            )}
          </Stack>
        </MetaRow>
        <MetaRow label={t('vehicles.field.parentTransportMode')}>
          <TransportModeIcon mode={vehicleMode(record ?? { id: '' })} iconPosition="left" />
        </MetaRow>
      </FormLayout>
      <Divider sx={{ mb: 2 }} />
      <VehicleEditForm value={form} onChange={editor.setForm} mode={editor.rail.mode} />
    </EditorFrame>
  );
}
