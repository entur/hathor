import type { ReactNode } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { vehicleMode, type Vehicle } from '../types/vehicle.ts';
import { UNKNOWN_TRANSPORT_MODE } from '../../netex/transportMode.ts';
import { fetchVehicleById } from '../api/fetchVehicles.ts';
import VehicleEditForm, { type VehicleEditFormValue } from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { useVehicleDeactivate } from '../hooks/useVehicleDeactivate.ts';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import {
  useEntityEditor,
  type EntityEditorApi,
  type EntityWrite,
} from '../../../hooks/useEntityEditor.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { BLANK_FORM } from '../utils/vehicleFormDefaults.ts';
import { canSubmit as hasRequiredFields } from '../utils/vehicleCanSubmit.ts';

const BLANK_NAME = 'unnamed';
// A created vehicle's first version, shown until Sobek's record lands.
const CREATED_VERSION = 1;

const toForm = (record: Vehicle | null): VehicleEditFormValue =>
  record ? { vehicle: record } : BLANK_FORM;

const withNewId = (form: VehicleEditFormValue, newId: string): VehicleEditFormValue => ({
  vehicle: { ...form.vehicle, id: newId, version: CREATED_VERSION },
});

interface VehicleEditorProps {
  /** Vehicle netexId to load, or `NEW_SELECTION` for the create form. */
  id: string;
  /** Mode on open (default `'view'`). */
  mode?: 'view' | 'edit';
  /** Leave the editor (after a deactivate's success is dismissed). */
  onClose: () => void;
  /** Move the editor to the id a create just minted. */
  onCreated: (newId: string) => void;
  /** Fire-and-forget report of each committed write (e.g. to refresh a list). */
  onWritten?: (write: EntityWrite<Vehicle>) => void;
  /** The host's controls (e.g. the sidebar rail), rendered after the body. */
  actions: (api: EntityEditorApi<VehicleEditFormValue>) => ReactNode;
}

/**
 * Host-agnostic Vehicle editor: loads the record by id ({@link useEntityRecord})
 * and drives it with {@link useEntityEditor} — title, context rows, the form
 * and its save / deactivate snackbars. The host supplies navigation
 * (`onClose`, `onCreated`) and its controls through `actions(api)`.
 *
 * @param {VehicleEditorProps} props - Id, initial mode, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function VehicleEditor({
  id,
  mode,
  onClose,
  onCreated,
  onWritten,
  actions,
}: VehicleEditorProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const record = useEntityRecord(isCreate ? null : id, fetchVehicleById);
  const { save } = useVehiclePairSave();
  const { deactivate } = useVehicleDeactivate();

  const api = useEntityEditor<Vehicle, VehicleEditFormValue>({
    id,
    record,
    toForm,
    withNewId,
    initialMode: mode,
    save,
    deactivate,
    // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
    // silently excludes refless vehicles from the list (create-but-invisible).
    // Existing rows already carry a ref, so only the create flow is gated.
    canSubmit: form => !isCreate || hasRequiredFields(form),
    onClose,
    onCreated,
    onWritten,
  });

  // A failed same-key reload keeps `record.data` (and sets `record.error`):
  // the form stays up with the stale warning. Only an editor with nothing to
  // show renders the load error, not-found, or the skeleton. The snackbars and
  // `actions(api)` sit outside that branch, so a write's outcome shows whatever
  // the body (e.g. a record gone after its save) and the rail keeps its state.
  return (
    <>
      {api.hasRecord ? (
        <VehicleFormBody api={api} record={record.data} />
      ) : record.error || record.notFound ? (
        <VehicleLoadFailure id={id} error={record.error} />
      ) : (
        <VehicleDetailsSkeleton />
      )}
      <SaveErrorSnackbar error={api.saveError} onClose={api.clearSaveError} />
      <SaveErrorSnackbar error={api.warning} severity="warning" onClose={api.clearWarning} />
      <SaveSuccessSnackbar
        open={api.savedOpen}
        message={t('vehicles.saveSuccess')}
        onClose={api.closeSaved}
      />
      <SaveSuccessSnackbar
        open={api.deactivatedOpen}
        message={t('vehicles.deactivateSuccess')}
        onClose={api.closeDeactivated}
      />
      {actions(api)}
    </>
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
  const { form } = api;
  const trimmedName = form.vehicle.name?.value?.trim();
  const parentType = record?.transportType;
  const tmode = record ? vehicleMode(record) : UNKNOWN_TRANSPORT_MODE;

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={trimmedName || undefined}
          data-testid="vehicle-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {trimmedName || (
            <>
              {'[ '}
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                {BLANK_NAME}
              </Box>
              {' ]'}
            </>
          )}
        </Typography>
        {form.vehicle.id && (
          <NetexId
            id={form.vehicle.id}
            version={form.vehicle.version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

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

      <VehicleEditForm value={form} onChange={api.setForm} mode={api.mode} />
    </Box>
  );
}

/** The editor body for a by-id load that failed (`error`) or found nothing. */
function VehicleLoadFailure({ id, error }: { id: string; error: string | null }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">{t('vehicles.detailsTitle')}</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {/* A failed request is not a missing record: show why it failed. */}
      {error ? (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('vehicles.notFound')}
        </Typography>
      )}
      <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
        {id}
      </Typography>
    </Box>
  );
}
