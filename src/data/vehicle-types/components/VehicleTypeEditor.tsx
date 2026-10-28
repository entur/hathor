import type { ReactNode } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import {
  useEntityEditor,
  type EntityEditorApi,
  type EntityWrite,
} from '../../../hooks/useEntityEditor.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { fetchVehicleTypeById } from '../api/fetchVehicleTypes.ts';
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import { useVehicleTypeDeactivate } from '../hooks/useVehicleTypeDeactivate.ts';
import { useCodeValues } from '../../code-values/hooks/useCodeValues.ts';
import { EMISSION_STANDARD, type CodeValue } from '../../code-values/types/codeValueTypes.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

const BLANK_NAME = 'unnamed';
const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };
// A created vehicle type's first version, shown until Sobek's record lands.
const CREATED_VERSION = 1;
const SKELETON_ROWS = 6;

const toForm = (record: VehicleType | null): VehicleType => record ?? EMPTY_VTYPE;

const withNewId = (form: VehicleType, newId: string): VehicleType => ({
  ...form,
  id: newId,
  version: CREATED_VERSION,
});

/**
 * Coerce flag booleans so a Switch's `false` (off) compares equal to an absent
 * baseline (a null-backed flag projects to `undefined`). Without this, toggling
 * a null-baseline `lowFloor`/`selfPropelled` on then off reads as dirty.
 */
const normalizeForDirty = (vt: VehicleType): VehicleType => ({
  ...vt,
  lowFloor: vt.lowFloor || undefined,
  selfPropelled: vt.selfPropelled || undefined,
});

interface VehicleTypeEditorProps {
  /** VehicleType netexId to load, or `NEW_SELECTION` for the create form. */
  id: string;
  /** Mode on open (default `'view'`). */
  mode?: 'view' | 'edit';
  /** Leave the editor (after a deactivate's success is dismissed). */
  onClose: () => void;
  /** Move the editor to the id a create just minted. */
  onCreated: (newId: string) => void;
  /** Fire-and-forget report of each committed write (e.g. to refresh a list). */
  onWritten?: (write: EntityWrite<VehicleType>) => void;
  /** The host's controls (e.g. the sidebar rail), rendered after the body. */
  actions: (api: EntityEditorApi<VehicleType>) => ReactNode;
}

/**
 * Host-agnostic VehicleType editor: loads the record by id
 * ({@link useEntityRecord}) and drives the tabbed {@link VehicleTypeForm} with
 * {@link useEntityEditor} — title, the form and its save / deactivate
 * snackbars. Save fires `createOrUpdateVehicleType` ({@link useVehicleTypeSave}).
 * The host supplies navigation (`onClose`, `onCreated`) and its controls
 * through `actions(api)`.
 *
 * @param {VehicleTypeEditorProps} props - Id, initial mode, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function VehicleTypeEditor({
  id,
  mode,
  onClose,
  onCreated,
  onWritten,
  actions,
}: VehicleTypeEditorProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const record = useEntityRecord(isCreate ? null : id, fetchVehicleTypeById);
  const { save } = useVehicleTypeSave();
  const { deactivate } = useVehicleTypeDeactivate();
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);

  const api = useEntityEditor<VehicleType, VehicleType>({
    id,
    record,
    toForm,
    normalise: normalizeForDirty,
    withNewId,
    initialMode: mode,
    save,
    deactivate,
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
        <VehicleTypeFormBody api={api} euroClasses={euroClasses} />
      ) : record.error || record.notFound ? (
        <VehicleTypeLoadFailure id={id} error={record.error} />
      ) : (
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS }]}
        />
      )}
      <SaveErrorSnackbar error={api.saveError} onClose={api.clearSaveError} />
      <SaveErrorSnackbar error={api.warning} severity="warning" onClose={api.clearWarning} />
      <SaveSuccessSnackbar
        open={api.savedOpen}
        message={t('vehicleType.saveSuccess')}
        onClose={api.closeSaved}
      />
      <SaveSuccessSnackbar
        open={api.deactivatedOpen}
        message={t('vehicleType.deactivateSuccess')}
        onClose={api.closeDeactivated}
      />
      {actions(api)}
    </>
  );
}

interface VehicleTypeFormBodyProps {
  api: EntityEditorApi<VehicleType>;
  /** Emission-class choices (Sobek `EMISSION_STANDARD` code list). */
  euroClasses: readonly CodeValue[];
}

/** The editor body with a form: title, NeTEx id and the tabbed fields. */
function VehicleTypeFormBody({ api, euroClasses }: VehicleTypeFormBodyProps) {
  const { form } = api;
  const name = form.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={name || undefined}
          data-testid="vehicle-type-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {name || (
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
        {form.id && (
          <NetexId
            id={form.id}
            version={form.version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={form}
          onChange={api.setForm}
          mode={api.mode}
          euroClasses={euroClasses}
        />
      </Stack>
    </Box>
  );
}

/** The editor body for a by-id load that failed (`error`) or found nothing. */
function VehicleTypeLoadFailure({ id, error }: { id: string; error: string | null }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t('vehicleType.detailsTitle')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* A failed request is not a missing record: show why it failed. */}
      {error ? (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('vehicleType.notFound')}
        </Typography>
      )}
      <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
        {id}
      </Typography>
    </Box>
  );
}
