import { Divider, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import {
  EntityEditorBody,
  EntityEditorFrame,
  type EntityEditorProps,
} from '../../../components/entity-editor/EntityEditorFrame.tsx';
import { vehicleMode, type Vehicle } from '../types/vehicle.ts';
import { UNKNOWN_TRANSPORT_MODE } from '../../netex/transportMode.ts';
import { fetchVehicleById } from '../api/fetchVehicles.ts';
import VehicleEditForm, { type VehicleEditFormValue } from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { useVehicleDeactivate } from '../hooks/useVehicleDeactivate.ts';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { useEntityEditor, type EntityEditorApi } from '../../../hooks/useEntityEditor.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { BLANK_FORM } from '../utils/vehicleFormDefaults.ts';
import { canSubmit as hasRequiredFields } from '../utils/vehicleCanSubmit.ts';

// A created vehicle's first version, shown until Sobek's record lands.
const CREATED_VERSION = 1;

const toForm = (record: Vehicle | null): VehicleEditFormValue =>
  record ? { vehicle: record } : BLANK_FORM;

const withNewId = (form: VehicleEditFormValue, newId: string): VehicleEditFormValue => ({
  vehicle: { ...form.vehicle, id: newId, version: CREATED_VERSION },
});

/**
 * Host-agnostic Vehicle editor: loads the record by id ({@link useEntityRecord})
 * and drives it with {@link useEntityEditor} inside the shared
 * {@link EntityEditorFrame} — title, context rows, the form and its save /
 * deactivate snackbars. The host supplies navigation (`onClose`, `onCreated`)
 * and its controls through `actions(api)`.
 *
 * @param {EntityEditorProps<Vehicle, VehicleEditFormValue>} props - Id, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function VehicleEditor({
  id,
  onClose,
  onCreated,
  onWritten,
  actions,
}: EntityEditorProps<Vehicle, VehicleEditFormValue>) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const record = useEntityRecord(id, fetchVehicleById);
  const { save } = useVehiclePairSave();
  const { deactivate } = useVehicleDeactivate();

  const api = useEntityEditor<Vehicle, VehicleEditFormValue>({
    id,
    record,
    toForm,
    withNewId,
    save,
    deactivate,
    // Only the create flow is gated — see `vehicleCanSubmit`.
    canSubmit: form => !isCreate || hasRequiredFields(form),
    onClose,
    onCreated,
    onWritten,
  });

  return (
    <EntityEditorFrame
      id={id}
      api={api}
      record={record}
      labels={{
        detailsTitle: t('vehicles.detailsTitle'),
        notFound: t('vehicles.notFound'),
        saved: t('vehicles.saveSuccess'),
        deactivated: t('vehicles.deactivateSuccess'),
      }}
      skeleton={<VehicleDetailsSkeleton />}
      actions={actions}
    >
      <VehicleFormBody api={api} record={record.data} />
    </EntityEditorFrame>
  );
}

interface VehicleFormBodyProps {
  api: EntityEditorApi<VehicleEditFormValue>;
  /** Sobek's record (the parent VehicleType context); `null` while creating or bridging. */
  record: Vehicle | null;
}

/** The editor body with a form: title, read-only context rows and the fields. */
function VehicleFormBody({ api, record }: VehicleFormBodyProps) {
  const { t } = useTranslation();
  const { vehicle } = api.form;
  const parentType = record?.transportType;
  const tmode = record ? vehicleMode(record) : UNKNOWN_TRANSPORT_MODE;

  return (
    <EntityEditorBody
      name={vehicle.name?.value}
      netexId={vehicle.id}
      version={vehicle.version}
      titleTestId="vehicle-details-title"
    >
      <FormLayout rowGap={0.5} sx={{ mb: 2 }} data-testid="vehicle-context">
        <MetaRow label={t('vehicles.field.parentVehicleType')}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <span>{parentType?.name?.value ?? '—'}</span>
            {parentType?.id && <NetexId id={parentType.id} copy="only" size="medium" />}
          </Stack>
        </MetaRow>
        <MetaRow label={t('vehicles.field.parentTransportMode')}>
          <TransportModeIcon mode={tmode} iconPosition="left" />
        </MetaRow>
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <VehicleEditForm value={api.form} onChange={api.setForm} mode={api.mode} />
    </EntityEditorBody>
  );
}
