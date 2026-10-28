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
import { fetchDeckPlanById } from '../api/fetchDeckPlans.ts';
import { useDeckPlanXml } from '../hooks/useDeckPlanXml.ts';
import { useDeckPlanSave } from '../hooks/useDeckPlanSave.ts';
import { useDeckPlanDeactivate } from '../hooks/useDeckPlanDeactivate.ts';
import { normaliseDeckPlan } from '../utils/normaliseDeckPlan.ts';
import { patchDeckPlanXml } from '../utils/patchDeckPlanXml.ts';
import DeckPlanForm from './DeckPlanForm.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

const BLANK_NAME = 'unnamed';
const SKELETON_ROWS = 2;
/** Create pane's starting form. */
const EMPTY_DECK_PLAN: DeckPlan = { id: '' };

// Trimmed on hydrate: Sobek re-pads <Text> on serialize, so an untrimmed
// baseline would read as dirty the moment the editor opens (sobek#180).
const toForm = (record: DeckPlan | null): DeckPlan => normaliseDeckPlan(record ?? EMPTY_DECK_PLAN);

const withNewId = (form: DeckPlan, newId: string): DeckPlan =>
  normaliseDeckPlan({ ...form, id: newId });

interface DeckPlanEditorProps {
  /** DeckPlan netexId to load, or `NEW_SELECTION` for the create form. */
  id: string;
  /** Mode on open (default: `'edit'` for a create, else `'view'`). */
  mode?: 'view' | 'edit';
  /** Leave the editor (after a deactivate's success is dismissed). */
  onClose: () => void;
  /** Move the editor to the id a create just minted. */
  onCreated: (newId: string) => void;
  /** Fire-and-forget report of each committed write (e.g. to refresh a list). */
  onWritten?: (write: EntityWrite<DeckPlan>) => void;
  /** The host's controls (e.g. the sidebar rail), rendered after the body. */
  actions: (api: EntityEditorApi<DeckPlan>) => ReactNode;
}

/**
 * Host-agnostic DeckPlan editor: loads name + description by id
 * ({@link useEntityRecord}) and the read-only NeTEx body ({@link useDeckPlanXml}),
 * and drives the {@link DeckPlanForm} tab pair with {@link useEntityEditor} —
 * title, the form and its save / deactivate snackbars.
 *
 * Save takes one of two paths. A create fires the `createOrUpdateDeckPlan`
 * mutation, which mints the new NeTEx id. An edit patches the typed
 * name/description into the fetched NeTEx document ({@link patchDeckPlanXml},
 * which also drops `keyList`) and POSTs the whole body to the import endpoint —
 * the only write path that preserves deck geometry, which `DeckPlanInput`
 * cannot carry — then re-pulls the body so the XML tab shows what was stored.
 * An edit can only be saved on a loaded, current body. The host supplies
 * navigation (`onClose`, `onCreated`) and its controls through `actions(api)`.
 *
 * @param {DeckPlanEditorProps} props - Id, initial mode, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function DeckPlanEditor({
  id,
  mode,
  onClose,
  onCreated,
  onWritten,
  actions,
}: DeckPlanEditorProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const record = useEntityRecord(isCreate ? null : id, fetchDeckPlanById);
  const { xml, loading, error: fetchError, refetch } = useDeckPlanXml(isCreate ? null : id);
  const { save: saveXml, saveGQL } = useDeckPlanSave();
  const { deactivate } = useDeckPlanDeactivate();

  const save = async (form: DeckPlan) => {
    if (isCreate) return saveGQL(form);
    // `xml` is the last body that arrived, not necessarily the current one: a
    // post-save refetch that failed leaves the pre-save document there, and
    // POSTing it back would resurrect what the save replaced. `canSubmit`
    // already blocks this; reaching here means some other submit path did.
    if (fetchError) return { error: fetchError };
    // A throw (e.g. the id not in the document) is folded into `{ error }`.
    const result = await saveXml(patchDeckPlanXml(xml, id, form.name, form.description));
    // Re-pull the persisted body; `refetch` bumps a tick, it returns no promise.
    // Unguarded on purpose: if the selection moved during the POST, the bump
    // only re-fetches the new id's own body once — nothing is written for it.
    if (!result.error) refetch();
    return result;
  };

  const api = useEntityEditor<DeckPlan, DeckPlan>({
    id,
    record,
    toForm,
    normalise: normaliseDeckPlan,
    withNewId,
    initialMode: mode ?? (isCreate ? 'edit' : 'view'),
    save,
    deactivate,
    // An edit patches the fetched document, so block save until the body is
    // here — otherwise patchDeckPlanXml throws a misleading "not found in
    // document" for what is really "not loaded yet". `fetchError` blocks it
    // too: the body may be present but stale. Create has no body.
    canSubmit: () => isCreate || (!loading && !fetchError && !!xml),
    onClose,
    onCreated,
    onWritten,
  });

  // A failed same-key reload keeps `record.data` (and sets `record.error`):
  // the form stays up with the stale warning. Only an editor with nothing to
  // show renders the load error, not-found, or the skeleton. The snackbars and
  // `actions(api)` sit outside that branch, so a write's outcome shows whatever
  // the body and the rail keeps its state.
  return (
    <>
      {api.hasRecord ? (
        <DeckPlanFormBody
          api={api}
          isCreate={isCreate}
          xml={xml}
          loading={loading}
          fetchError={fetchError}
          onRetry={refetch}
        />
      ) : record.error || record.notFound ? (
        <DeckPlanLoadFailure id={id} error={record.error} />
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
        message={t('deckPlans.saveSuccess')}
        onClose={api.closeSaved}
      />
      <SaveSuccessSnackbar
        open={api.deactivatedOpen}
        message={t('deckPlan.deactivateSuccess')}
        onClose={api.closeDeactivated}
      />
      {actions(api)}
    </>
  );
}

interface DeckPlanFormBodyProps {
  api: EntityEditorApi<DeckPlan>;
  isCreate: boolean;
  /** The NeTEx body and its fetch state ({@link useDeckPlanXml}). */
  xml: string;
  loading: boolean;
  fetchError: string | null;
  onRetry: () => void;
}

/** The editor body with a form: title, NeTEx id and the Identity / XML tabs. */
function DeckPlanFormBody({
  api,
  isCreate,
  xml,
  loading,
  fetchError,
  onRetry,
}: DeckPlanFormBodyProps) {
  const { form } = api;
  // The title mirrors the typed name so it updates as the user edits — in
  // create mode there is no persisted name until save.
  const name = form.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={name || undefined}
          data-testid="deck-plan-details-title"
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
          <NetexId id={form.id} copy="onHover" size="small" sx={{ justifySelf: 'start' }} />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <Stack data-testid="deck-plan-context">
        <DeckPlanForm
          value={form}
          onChange={api.setForm}
          mode={api.mode}
          isCreate={isCreate}
          xml={xml}
          loading={loading}
          fetchError={fetchError}
          onRetry={onRetry}
        />
      </Stack>
    </Box>
  );
}

/** The editor body for a by-id load that failed (`error`) or found nothing. */
function DeckPlanLoadFailure({ id, error }: { id: string; error: string | null }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t('deckPlans.detailsTitle')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* A failed request is not a missing record: show why it failed. */}
      {error ? (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('deckPlans.notFound')}
        </Typography>
      )}
      <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
        {id}
      </Typography>
    </Box>
  );
}
