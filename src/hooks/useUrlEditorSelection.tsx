import { useEffect, useRef, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEditingItem } from '../contexts/EditingContext.tsx';

interface UrlEditorSelectionParams<T> {
  /** URL search param key holding the selected id (e.g. 'selected'). */
  paramKey: string;
  /** Full unfiltered/unsorted dataset; `null` while the initial fetch is in flight. */
  allData: T[] | null;
  /** Current page slice; used to detect when the deep-link target needs a page jump. */
  dataForTable: T[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
  /** Extract the comparable id from an item. */
  getId: (item: T) => string;
  /** Return a new empty item for the "new" selection (id='new'). Optional. */
  getEmptyRow?: () => T;
  /**
   * Render the editor for a resolved item. The argument is `null` when the
   * id was not found in `allData` after the initial fetch completed (the
   * editor is still opened and should display a not-found body).
   */
  renderEditor: (item: T | null, mode: 'edit' | 'view') => ReactNode;
}

/**
 * Reconciles a `?<paramKey>=<id>` URL search param with `EditingContext`
 * and pagination. Generic over the row type — lifted from the
 * vehicles-specific `useVehicleUrlSelection` so any sidebar-edit
 * consumer can adopt deep-link selection without rewriting the
 * wait-for-fetch / commit-guard / page-jump dance.
 *
 * **Wait for the initial fetch.** Cross-page nav (e.g. a chip on another
 * route linking here) lands while `loading === true` and `allData === null`.
 * Committing in that window captures `item=null` in the editor closure,
 * and the commit guard then locks the slider on the not-found body forever.
 *
 * **Commit guard.** After the first commit, the editor only re-mounts
 * when the resolved id changes (a new deep-link) or when a previously
 * not-found row resolves to found on a later list refetch. Fresh
 * `allData` / `dataForTable` references each render (e.g. from an
 * unmemoised client-side sort) must NOT replace the editor — remounting
 * would wipe its view/edit mode and drop any in-flight snackbar.
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
  loading,
  getId,
  getEmptyRow,
  renderEditor,
}: UrlEditorSelectionParams<T>): void {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get(paramKey);
  const { setEditingItem } = useEditingItem();

  const getIdRef = useRef(getId);
  getIdRef.current = getId;
  const renderEditorRef = useRef(renderEditor);
  renderEditorRef.current = renderEditor;

  const lastCommittedIdRef = useRef<string | null>(null);
  const lastCommittedRowRef = useRef<T | null>(null);

  useEffect(() => {
    if (!selected) {
      if (lastCommittedIdRef.current !== null) {
        setEditingItem(null);
        lastCommittedIdRef.current = null;
        lastCommittedRowRef.current = null;
      }
      return;
    }
    if (loading) return;
    if (allData === null) return;

    const isNew = selected === 'new';
    const idx = isNew ? -1 : allData.findIndex(v => getIdRef.current(v) === selected);
    const row = isNew ? (getEmptyRow?.() ?? null) : idx >= 0 ? allData[idx] : null;

    const idChanged = lastCommittedIdRef.current !== selected;
    const resolvedFromMissing = lastCommittedRowRef.current === null && row !== null;
    if (idChanged || resolvedFromMissing) {
      setEditingItem({
        id: selected,
        EditorComponent: () => (
          <>{renderEditorRef.current(row, selected === 'new' ? 'edit' : 'view')}</>
        ),
      });
      lastCommittedIdRef.current = selected;
      lastCommittedRowRef.current = row;
    }

    if (idx >= 0 && !dataForTable.some(v => getIdRef.current(v) === selected)) {
      setPage(Math.floor(idx / rowsPerPage));
    }
  }, [selected, loading, allData, dataForTable, rowsPerPage, setPage, setEditingItem, getEmptyRow]);

  useEffect(() => {
    return () => {
      setEditingItem(null);
    };
  }, [setEditingItem]);
}
