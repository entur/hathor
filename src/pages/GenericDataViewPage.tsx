import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSearch } from '../components/search';
import { useResizableSidebar } from '../hooks/useResizableSidebar.ts';
import { useEditing } from '../contexts/EditingContext.tsx';
import { Sidebar } from '../components/sidebar/Sidebar.tsx';
import { ToggleButton } from '../components/sidebar/ToggleButton.tsx';
import LoadingPage from '../components/common/LoadingPage.tsx';
import ErrorPage from '../components/common/ErrorPage.tsx';
import type { ViewConfig, UrlFilterInfo } from '../types/viewConfigTypes.ts';

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
    floatingAction,
  } = viewConfig;

  const theme = useTheme();

  const {
    width: sidebarWidth,
    collapsed: sidebarCollapsed,
    setIsResizing: setIsSidebarResizing,
    toggle: toggleSidebar,
  } = useResizableSidebar(250, true);

  // Change is here: use `editingItem` from the context
  const { editingItem } = useEditing();
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
  } = useData();

  useSearchRegistration(allData, dataLoading);

  useEffect(() => {
    registerFilterConfig('data', filters || []);
    return () => {
      registerFilterConfig('data', null);
    };
  }, [registerFilterConfig, filters]);

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

  // This logic now correctly checks if a new item is being edited
  useEffect(() => {
    if (editingItem && editingItem.id !== prevEditingIdRef.current) {
      if (sidebarCollapsed) {
        toggleSidebar();
      }
    }
    // Update the ref with the current item's ID
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
        height: 'calc(100dvh - 64px)',
        position: 'relative',
      }}
    >
      <Sidebar
        width={sidebarWidth}
        collapsed={sidebarCollapsed}
        onMouseDownResize={() => setIsSidebarResizing(true)}
        theme={theme}
        toggleCollapse={toggleSidebar}
      />
      <ToggleButton
        collapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
        onClick={toggleSidebar}
      />
      <Box
        className="data-overview-content"
        sx={{
          flexGrow: 1,
          height: '100%',
          marginLeft: sidebarCollapsed ? '0px' : `${sidebarWidth + 4}px`,
          transition: 'margin-left 0.2s ease',
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
          handleColumnEvent={viewConfig.handleColumnEvent}
          floatingAction={floatingAction}
          urlFilterInfo={urlFilterInfo}
        />
      </Box>
    </Box>
  );
}
