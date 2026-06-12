import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSearch } from '../components/search';
import { useResizableSidebar } from '../hooks/useResizableSidebar.ts';
import { useEditingItem } from '../contexts/EditingContext.tsx';
import { Sidebar, type Side } from '../components/sidebar/Sidebar.tsx';
import LoadingPage from '../components/common/LoadingPage.tsx';
import ErrorPage from '../components/common/ErrorPage.tsx';
import type { ViewConfig, UrlFilterInfo } from './viewConfigTypes.ts';

const DETAILS_PANE_WIDTH_FACTOR = 0.25;
const DETAILS_PANE_GUTTER_PX = 4;
const DETAILS_PANE_SIDE: Side = 'right';
const DETAILS_PANE_MARGIN = DETAILS_PANE_SIDE === 'right' ? 'marginRight' : 'marginLeft';
const MARGIN_TRANSITION = `${DETAILS_PANE_MARGIN} 0.2s ease`;
const APP_HEADER_HEIGHT_PX = 64;
// Matches EditorRail's SEGMENT_SIZE — rail is a 40px-wide fixed-position
// vertical strip floating over the content's right edge once an editor is
// open. Published as `--editor-rail-clear` so right-aligned chrome (the
// add/import actions) can gutter past it via `mr: var(--editor-rail-clear)`.
const EDITOR_RAIL_WIDTH_PX = 40;

/** Stable no-op so `useUrlEffect` can be invoked unconditionally — keeps hook order intact. */
const noopUrlEffect = () => {};

/** Stable no-op so `useRowClick` can be invoked unconditionally — keeps hook order intact. */
const noopRowClick = () => undefined;

interface GenericDataViewPageProps<T, K extends string> {
  viewConfig: ViewConfig<T, K>;
  urlFilterInfo?: UrlFilterInfo;
}

export default function GenericDataViewPage<T, K extends string>({
  viewConfig,
  urlFilterInfo,
}: GenericDataViewPageProps<T, K>) {
  const {
    useData,
    useSearchRegistration,
    useTableLogic,
    PageContentComponent,
    columns,
    getFilterKey,
    getSortValue,
    filters,
    addAction,
    importAction,
  } = viewConfig;

  const theme = useTheme();

  const initWidth = Math.round(window.innerWidth * DETAILS_PANE_WIDTH_FACTOR);
  const {
    width: sidebarWidth,
    collapsed: sidebarCollapsed,
    setIsResizing: setIsSidebarResizing,
    toggle: toggleSidebar,
  } = useResizableSidebar(initWidth, true, DETAILS_PANE_SIDE);

  const { editingItem } = useEditingItem();
  const prevEditingIdRef = useRef<string | null>(null);

  const {
    searchResults,
    searchQuery,
    activeSearchContext,
    selectedItem,
    activeFilters,
    registerFilterConfig,
  } = useSearch();

  const {
    allData,
    totalCount: originalTotalCount,
    loading: dataLoading,
    error: dataError,
    order,
    orderBy,
    handleRequestSort,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    refetch,
  } = useData();

  useSearchRegistration(allData, dataLoading);

  useEffect(() => {
    registerFilterConfig('data', filters && allData ? filters(allData) : []);
    return () => {
      registerFilterConfig('data', null);
    };
  }, [registerFilterConfig, filters, allData]);

  const { dataForTable, currentTotalForTable } = useTableLogic({
    allData: allData,
    originalTotalCount,
    searchResults,
    searchQuery,
    selectedItem,
    activeSearchContext,
    order,
    orderBy,
    page,
    rowsPerPage,
    activeFilters,
    getFilterKey,
    getSortValue,
  });

  // Optional per-page URL→state reconciler (e.g. `/vehicles?selected=…`).
  // Pages that don't opt in pass `useUrlEffect: undefined`; the no-op fallback
  // keeps hook order stable across renders.
  (viewConfig.useUrlEffect ?? noopUrlEffect)({
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading: dataLoading,
    refetch,
  });

  const onRowClick = (viewConfig.useRowClick ?? noopRowClick)();

  // Open the sidebar when a new editor is set; collapse it when the editor
  // is cleared (e.g. the editor's Close button → `setEditingItem(null)`, or
  // a URL-driven page like `/vehicles?selected=…` dropping its param).
  useEffect(() => {
    const prevId = prevEditingIdRef.current;
    if (editingItem && editingItem.id !== prevId) {
      if (sidebarCollapsed) toggleSidebar();
    } else if (!editingItem && prevId !== null) {
      if (!sidebarCollapsed) toggleSidebar();
    }
    prevEditingIdRef.current = editingItem?.id ?? null;
  }, [editingItem, sidebarCollapsed, toggleSidebar]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, activeSearchContext, selectedItem, setPage, activeFilters]);

  const isLoadingDisplay = dataLoading && !(activeSearchContext === 'data' && searchQuery.trim());
  const isErrorDisplay = dataError && !(activeSearchContext === 'data' && searchQuery.trim());

  if (isLoadingDisplay && dataForTable.length === 0) return <LoadingPage />;
  if (isErrorDisplay && dataForTable.length === 0) return <ErrorPage message={dataError} />;

  return (
    <Box
      sx={{
        display: 'flex',
        height: `calc(100dvh - ${APP_HEADER_HEIGHT_PX}px)`,
        position: 'relative',
        '--sidebar-width': sidebarCollapsed ? '0px' : `${sidebarWidth}px`,
        '--app-header-height': `${APP_HEADER_HEIGHT_PX}px`,
        '--editor-rail-clear': editingItem ? `${EDITOR_RAIL_WIDTH_PX}px` : '0px',
      }}
    >
      <Sidebar
        width={sidebarWidth}
        collapsed={sidebarCollapsed}
        onMouseDownResize={() => setIsSidebarResizing(true)}
        theme={theme}
        toggleCollapse={toggleSidebar}
        side={DETAILS_PANE_SIDE}
      />
      <Box
        className="data-overview-content"
        sx={{
          flexGrow: 1,
          height: '100%',
          [DETAILS_PANE_MARGIN]: sidebarCollapsed
            ? '0px'
            : `${sidebarWidth + DETAILS_PANE_GUTTER_PX}px`,
          transition: MARGIN_TRANSITION,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageContentComponent
          data={dataForTable}
          loading={isLoadingDisplay}
          error={isErrorDisplay ? dataError : null}
          totalCount={currentTotalForTable}
          order={order}
          orderBy={orderBy}
          handleRequestSort={handleRequestSort}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          columns={columns}
          title={viewConfig.title}
          titleKey={viewConfig.titleKey}
          handleColumnEvent={viewConfig.handleColumnEvent}
          onRowClick={onRowClick}
          selectedId={editingItem?.id ?? null}
          addAction={addAction}
          importAction={importAction}
          urlFilterInfo={urlFilterInfo}
          sortLocked={!!editingItem}
        />
      </Box>
    </Box>
  );
}
