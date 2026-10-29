import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import {
  EntityEditorBody,
  EntityEditorFrame,
  type EntityEditorProps,
} from '../../../components/entity-editor/EntityEditorFrame.tsx';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { useEntityEditor, type EntityEditorApi } from '../../../hooks/useEntityEditor.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { fetchDeckPlanById } from '../api/fetchDeckPlans.ts';
import { useDeckPlanXml } from '../hooks/useDeckPlanXml.ts';
import { useDeckPlanSave } from '../hooks/useDeckPlanSave.ts';
import { useDeckPlanDeactivate } from '../hooks/useDeckPlanDeactivate.ts';
import { normaliseDeckPlan } from '../utils/normaliseDeckPlan.ts';
import { patchDeckPlanXml } from '../utils/patchDeckPlanXml.ts';
import DeckPlanForm from './DeckPlanForm.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

const SKELETON_ROWS = 2;
/** Create pane's starting form. */
const EMPTY_DECK_PLAN: DeckPlan = { id: '' };

// Trimmed on hydrate: Sobek re-pads <Text> on serialize, so an untrimmed
// baseline would read as dirty the moment the editor opens (sobek#180).
const toForm = (record: DeckPlan | null): DeckPlan => normaliseDeckPlan(record ?? EMPTY_DECK_PLAN);

const withNewId = (form: DeckPlan, newId: string): DeckPlan =>
  normaliseDeckPlan({ ...form, id: newId });

/**
 * Host-agnostic DeckPlan editor: loads name + description by id
 * ({@link useEntityRecord}) and the read-only NeTEx body ({@link useDeckPlanXml}),
 * and drives the {@link DeckPlanForm} tab pair with {@link useEntityEditor} —
 * title, the form and its save / deactivate snackbars inside the shared
 * {@link EntityEditorFrame}.
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
 * @param {EntityEditorProps<DeckPlan, DeckPlan>} props - Id, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function DeckPlanEditor({
  id,
  onClose,
  onCreated,
  onWritten,
  actions,
}: EntityEditorProps<DeckPlan, DeckPlan>) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const record = useEntityRecord(id, fetchDeckPlanById);
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

  return (
    <EntityEditorFrame
      id={id}
      api={api}
      record={record}
      labels={{
        detailsTitle: t('deckPlans.detailsTitle'),
        notFound: t('deckPlans.notFound'),
        saved: t('deckPlans.saveSuccess'),
        deactivated: t('deckPlan.deactivateSuccess'),
      }}
      skeleton={
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS }]}
        />
      }
      actions={actions}
    >
      <DeckPlanFormBody
        api={api}
        isCreate={isCreate}
        xml={xml}
        loading={loading}
        fetchError={fetchError}
        onRetry={refetch}
      />
    </EntityEditorFrame>
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
  return (
    <EntityEditorBody
      name={form.name?.value}
      netexId={form.id}
      titleTestId="deck-plan-details-title"
    >
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
    </EntityEditorBody>
  );
}
