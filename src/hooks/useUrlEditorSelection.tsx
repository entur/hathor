import { useEffect, useRef, type ComponentType, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEditingItem } from '../contexts/EditingContext.tsx';

/** `?<paramKey>=` value (and `editingItem.id`) of the create pane — not a row id. */
export const NEW_SELECTION = 'new';

interface UrlEditorSelectionParams<T> {
  /** URL search param key holding the selected id (e.g. 'selected'). */
  paramKey: string;
  /** Full unfiltered/unsorted dataset; `null` while the initial fetch is in flight. */
  allData: T[] | null;
  /** Current page slice; used to detect when the deep-link target needs a page jump. */
  dataForTable: T[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  /** List fetch in flight — the page jump waits it out; the editor does not. */
  loading: boolean;
  /** Extract the comparable id from an item. */
  getId: (item: T) => string;
  /**
   * Render the editor for the selected id. `id` is the param value —
   * `NEW_SELECTION` for the create pane. The editor loads its own record;
   * the list row is never handed over. The rendered editor stays mounted
   * across id changes and must reset itself.
   */
  renderEditor: (id: string) => ReactNode;
}

/**
 * Reconciles a `?<paramKey>=<id>` URL search param with `EditingContext`
 * and pagination. Generic over the row type so any sidebar-edit consumer
 * can adopt deep-link selection.
 *
 * **Id-only.** The editor commits to `EditingContext` immediately; the page
 * decides when the sidebar renders (`GenericDataViewPage` shows `LoadingPage`
 * during the first list load). It is never given a row: it fetches its own
 * record by id.
 *
 * **One editor per selection session.** A single `EditorComponent` is
 * committed when the param appears; later `?selected=` changes only move
 * `editingItem.id`, so the editor is not remounted (it resets itself on id
 * change). A list refetch with the same id commits nothing.
 *
 * **Page jump.** Once the list has loaded, a selected row that is off the
 * current page moves the pager to it.
 *
 * `getId` and `renderEditor` are stashed in refs so the consumer is free to
 * pass inline closures without triggering effect re-runs.
 *
 * @param {UrlEditorSelectionParams<T>} params - Param key, list state, pager and editor factory.
 * @returns {void}
 */
export function useUrlEditorSelection<T>({
  paramKey,
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
  getId,
  renderEditor,
}: UrlEditorSelectionParams<T>): void {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get(paramKey);
  const { setEditingItem } = useEditingItem();

  const getIdRef = useRef(getId);
  getIdRef.current = getId;
  const renderEditorRef = useRef(renderEditor);
  renderEditorRef.current = renderEditor;

  // The session's editor; `null` while no selection is open.
  const editorRef = useRef<ComponentType<{ itemId: string }> | null>(null);

  useEffect(() => {
    if (!selected) {
      if (editorRef.current !== null) {
        setEditingItem(null);
        editorRef.current = null;
      }
      return;
    }
    editorRef.current ??= function SelectionEditor({ itemId }: { itemId: string }) {
      // Read the param directly: `itemId` trails it by one commit.
      const [params] = useSearchParams();
      const id = params.get(paramKey) ?? itemId;
      return <>{renderEditorRef.current(id)}</>;
    };
    setEditingItem({ id: selected, EditorComponent: editorRef.current });
  }, [selected, paramKey, setEditingItem]);

  useEffect(() => {
    if (!selected || selected === NEW_SELECTION || loading || allData === null) return;
    const idx = allData.findIndex(v => getIdRef.current(v) === selected);
    if (idx >= 0 && !dataForTable.some(v => getIdRef.current(v) === selected)) {
      setPage(Math.floor(idx / rowsPerPage));
    }
  }, [selected, loading, allData, dataForTable, rowsPerPage, setPage]);

  useEffect(() => {
    return () => {
      setEditingItem(null);
    };
  }, [setEditingItem]);
}
