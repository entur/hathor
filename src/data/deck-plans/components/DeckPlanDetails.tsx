import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import { useEntityEditor, type EditorMode } from '../../../hooks/useEntityEditor.ts';
import type { WriteResult } from '../../../hooks/entityEditorFlow.ts';
import { deactivateDeckPlanRequest } from '../../../graphql/vehicles/mutations/deactivateDeckPlan.ts';
import { fetchDeckPlan } from '../api/fetchDeckPlans.ts';
import { useDeckPlanXml } from '../hooks/useDeckPlanXml.ts';
import { useDeckPlanSave } from '../hooks/useDeckPlanSave.ts';
import { patchDeckPlanXml } from '../utils/patchDeckPlanXml.ts';
import { deckPlanForm } from '../stores/deckPlanFormState.ts';
import DeckPlanForm from './DeckPlanForm.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

const SKELETON_ROWS = 2; // name + description

const COPY: EditorCopy = {
  title: 'deckPlans.detailsTitle',
  notFound: 'deckPlans.notFound',
  saved: 'deckPlans.saveSuccess',
  deactivated: 'deckPlan.deactivateSuccess',
  deactivateTitle: 'deckPlan.deactivateConfirmTitle',
  deactivateMessage: 'deckPlan.deactivateConfirmMessage',
};

interface DeckPlanDetailsProps {
  /** NeTEx id to edit; `''` is the create pane. The editor reads the record itself. */
  id: string;
  /**
   * List-side refetch fired after a successful save or deactivate (table
   * freshness); a rejection shows a stale-list warning instead.
   */
  onSaved?: () => Promise<void>;
  /** Initial mode ('view' or 'edit'). */
  mode?: EditorMode;
  /** Host: collapse the editor. */
  onClose: () => void;
  /** Host: move the selection from the create pane to the new id. */
  onCreated: (newId: string) => void;
}

/**
 * Editable sidebar for a DeckPlan, opened via `/deck-plans?selected=<id>`:
 * the shared {@link useEntityEditor} + {@link EditorFrame} around the
 * {@link DeckPlanForm} tab pair — Identity (name + description, editable) and
 * XML (the read-only NeTEx body, a separate by-id read).
 *
 * Save takes one of two paths. A create fires the `createOrUpdateDeckPlan`
 * mutation, which mints the new NeTEx id the sidebar then advances to. An edit
 * patches the typed name/description into the fetched NeTEx document and POSTs
 * the whole body to the import endpoint — the only write path that preserves
 * deck geometry, which `DeckPlanInput` cannot carry.
 *
 * @param props {@link DeckPlanDetailsProps}
 */
export default function DeckPlanDetails({
  id,
  onSaved,
  mode,
  onClose,
  onCreated,
}: DeckPlanDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === '';
  const { xml, loading, error: xmlError, refetch: refetchXml } = useDeckPlanXml(id);
  const { save, saveGQL } = useDeckPlanSave();

  const write = async (form: DeckPlan, record: DeckPlan | null): Promise<WriteResult> => {
    if (isCreate) return saveGQL(form);
    if (!record) return { error: t('deckPlans.notFound') };
    // The body the hook holds is the last one that arrived, not necessarily the
    // current one: a post-save refetch that failed leaves the pre-save document
    // there, and POSTing it back would resurrect what the save replaced. Save is
    // already disabled for this, so reaching here means some other submit path
    // did — fail loud rather than write the wrong document.
    if (xmlError) return { error: xmlError };
    let patched: string;
    try {
      patched = patchDeckPlanXml(xml, id, form.name, form.description);
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
    const result = await save(patched);
    // Re-pull the persisted body so the XML tab stops showing the pre-save
    // document. Fire-and-forget: `refetchXml` bumps a tick, it returns no promise.
    if (!result.error) refetchXml();
    return { error: result.error };
  };

  const editor = useEntityEditor({
    id,
    initialMode: mode,
    fetchById: fetchDeckPlan,
    formState: deckPlanForm,
    write,
    withNewId: (form, newId) => ({ ...form, id: newId, version: 1 }),
    deactivateRequest: deactivateDeckPlanRequest,
    onSaved,
    onClose,
    onCreated,
  });
  const { form } = editor;

  return (
    <EditorFrame
      editor={editor}
      // The title mirrors the typed name so it updates as the user edits.
      name={form.name?.value}
      netexId={form.id ? { id: form.id, version: form.version } : undefined}
      testId="deck-plan"
      copy={COPY}
      skeleton={
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS, stacked: true }]}
        />
      }
      // An edit patches the fetched document, so block save until the body is
      // here — otherwise patchDeckPlanXml throws a misleading "not found in
      // document" for what is really "not loaded yet". `xmlError` blocks it
      // too: the body may be present but stale (see `write`). Create has no body.
      canSubmit={isCreate || (!loading && !xmlError && !!xml)}
    >
      <Stack data-testid="deck-plan-context">
        <DeckPlanForm
          value={form}
          onChange={editor.setForm}
          mode={editor.rail.mode}
          isCreate={isCreate}
          xml={xml}
          loading={loading}
          fetchError={xmlError}
          onRetry={refetchXml}
        />
      </Stack>
    </EditorFrame>
  );
}
