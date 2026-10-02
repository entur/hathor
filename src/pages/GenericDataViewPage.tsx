import { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSearch } from '../components/search';
import { useResizableSidebar } from '../hooks/useResizableSidebar.ts';
import { useEditingItem } from '../contexts/EditingContext.tsx';
import { Sidebar, type Side } from '../components/sidebar/Sidebar.tsx';
import LoadingPage from '../components/common/LoadingPage.tsx';
import ErrorPage from '../components/common/ErrorPage.tsx';
import type { ViewConfig, UrlFilterInfo } from './viewConfigTypes.ts';

const DETAILS_PANE_SIDE: Side = 'right';
const APP_HEADER_HEIGHT_PX = 64;

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

  const { ratio: paneRatio, setIsResizing: setIsSidebarResizing } =
    useResizableSidebar(DETAILS_PANE_SIDE);

  const { editingItem } = useEditingItem();

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
      }}
    >
      <Sidebar
        ratio={paneRatio}
        onMouseDownResize={() => setIsSidebarResizing(true)}
        theme={theme}
        side={DETAILS_PANE_SIDE}
      />
      <Box
        className="data-overview-content"
        sx={{
          flexGrow: 1,
          height: '100%',
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
        />
      </Box>
    </Box>
  );
}
