import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEditingItem } from '../contexts/EditingContext.tsx';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { useCloseSliderParam } from './useCloseSliderParam.ts';
import { NEW_SELECTION, type EntityEditorHostProps } from './useEntityEditor.ts';
import { useSidebarCreateAdvance } from './useSidebarCreateAdvance.ts';

interface UrlEditorSelectionParams<T> {
  /** URL search param key holding the selected id (e.g. 'selected'). */
  paramKey: string;
  /** Full unfiltered/unsorted dataset; `null` while the initial fetch is in flight. */
  allData: T[] | null;
  /** Current page slice; used to detect when the deep-link target needs a page jump. */
  dataForTable: T[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  /** Extract the comparable id from an item. */
  getId: (item: T) => string;
  /**
   * Render the editor from its host props: `id` (`''` is the create pane,
   * `?<paramKey>=new`), `initialMode`, and the URL writes `onClose` /
   * `onCreated`. The editor reads its own record by id — the list row is never
   * handed over, so the editor needs no list to mount.
   */
  renderEditor: (host: Omit<EntityEditorHostProps, 'onSaved'>) => ReactNode;
}

/**
 * Reconciles a `?<paramKey>=<id>` URL search param with `EditingContext`
 * and pagination. Generic over the row type so any sidebar-edit consumer
 * can adopt deep-link selection.
 *
 * **Commit on id change only.** The editor is (re)mounted when the
 * selected id or the organisation changes, never on a list refetch: it owns
 * its record, so fresh `allData` references must not replace it — remounting
 * would wipe its view/edit mode and drop any in-flight snackbar.
 *
 * **Page jump.** Once the list holds the selected row, the pager moves to
 * the page that shows it (row highlight).
 *
 * `getId` and `renderEditor` are stashed in refs so the consumer is free
 * to pass inline closures without triggering effect re-runs.
 */
export function useUrlEditorSelection<T>({
  paramKey,
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  getId,
  renderEditor,
}: UrlEditorSelectionParams<T>): void {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get(paramKey);
  const { setEditingItem } = useEditingItem();
  const onClose = useCloseSliderParam(paramKey);
  const onCreated = useSidebarCreateAdvance(paramKey);
  const hostRef = useRef({ onClose, onCreated });
  hostRef.current = { onClose, onCreated };

  const getIdRef = useRef(getId);
  getIdRef.current = getId;
  const renderEditorRef = useRef(renderEditor);
  renderEditorRef.current = renderEditor;

  const lastCommittedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (selected === lastCommittedIdRef.current) return;
    lastCommittedIdRef.current = selected;
    if (!selected) {
      setEditingItem(null);
      return;
    }
    const isNew = selected === NEW_SELECTION;
    setEditingItem({
      id: selected,
      // Keyed on the org: an org switch re-mounts a record's editor, so nothing
      // from the previous org's record, form or in-flight save carries over.
      // The create pane has no record to lose, so its unsaved draft stays
      // (useEntityEditor still invalidates its in-flight create on the switch).
      EditorComponent: function SelectedEditor() {
        const orgId = useOrganisationsContext().currentOrganisation?.id;
        return (
          <Fragment key={isNew ? NEW_SELECTION : orgId}>
            {renderEditorRef.current({
              id: isNew ? '' : selected,
              initialMode: isNew ? 'edit' : 'view',
              ...hostRef.current,
            })}
          </Fragment>
        );
      },
    });
  }, [selected, setEditingItem]);

  useEffect(() => {
    if (!selected || !allData) return;
    const idx = allData.findIndex(v => getIdRef.current(v) === selected);
    if (idx >= 0 && !dataForTable.some(v => getIdRef.current(v) === selected)) {
      setPage(Math.floor(idx / rowsPerPage));
    }
  }, [selected, allData, dataForTable, rowsPerPage, setPage]);

  useEffect(() => {
    return () => {
      // Reset the guard too, so StrictMode's re-mount commits the editor again.
      lastCommittedIdRef.current = null;
      setEditingItem(null);
    };
  }, [setEditingItem]);
}
