import { useTranslation } from 'react-i18next';
import EditorRail from './EditorRail.tsx';
import { useLiftEditorDirty } from '../../hooks/useLiftEditorDirty.ts';
import type { EntityEditorApi } from '../../hooks/useEntityEditor.ts';

const RAIL_SIDE = 'right' as const;

interface SidebarEditorRailProps<F> {
  /** The editor's state and actions ({@link useEntityEditor}). */
  api: EntityEditorApi<F>;
  /** Collapse the sidebar pane (e.g. drop `?selected=`); the rail confirms when dirty. */
  onCollapse: () => void;
  /** The deactivate confirmation dialog's heading and body. */
  deactivateConfirm: { title: string; message: string };
}

/**
 * The sidebar host's {@link EditorRail}, wired to an entity editor's api: Edit,
 * Cancel, Save and Deactivate come from `api` (each hidden while the api
 * withholds it), and the editor's dirty signal is lifted onto EditingContext
 * for the page chrome. Until there is a record to show (first load, load
 * error, not-found) it is the bare collapse rail — the hook already withholds
 * Edit and Save then (and Deactivate has no target); this also keeps Cancel off
 * a body with no form. The rail remounts per selection (`api.selectionKey`),
 * so no dialog carries over to another record.
 *
 * @param {SidebarEditorRailProps<F>} props - `api`, `onCollapse` and the deactivate dialog copy.
 * @returns {JSX.Element} The right-side editor rail.
 */
export default function SidebarEditorRail<F>({
  api,
  onCollapse,
  deactivateConfirm,
}: SidebarEditorRailProps<F>) {
  const { t } = useTranslation();
  useLiftEditorDirty(api.isDirty);

  // Keyed on the selection so a confirmation opened for one record (Deactivate,
  // Discard) closes when the selection moves instead of acting on the next one.
  if (!api.hasRecord)
    return <EditorRail key={api.selectionKey} onCollapse={onCollapse} side={RAIL_SIDE} />;

  return (
    <EditorRail
      key={api.selectionKey}
      side={RAIL_SIDE}
      onCollapse={onCollapse}
      mode={api.mode}
      onEnterEdit={api.enterEdit}
      onCancelEdit={api.cancel}
      onSave={api.save}
      isDirty={api.isDirty}
      saving={api.saving}
      canSubmit={api.canSubmit}
      onDeactivate={api.deactivate}
      deactivateConfirmTitle={deactivateConfirm.title}
      deactivateConfirmMessage={deactivateConfirm.message}
      deactivateConfirmActionLabel={t('common.deactivate')}
    />
  );
}
