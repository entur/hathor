/**
 * Hand-maintained structural data for the two generic wrapper pages —
 * architecture layers L2 (wrappers) and L3 (opt-in widgets).
 *
 * Wrapper props are stable structural facts that drift far less than feature
 * views, so they are curated here rather than parsed from source. Keep each
 * widget `key` aligned with an optional field of `ViewConfig`
 * (src/pages/viewConfigTypes.ts) or an optional prop of the wrapper — the
 * generator matches these keys against feature-view source to derive `usedBy`.
 */

/** App-shell providers/components wrapping every route — read off src/App.tsx. */
export const APP_SHELL = [
  'BrowserRouter',
  'SearchProvider',
  'ThemeProvider',
  'EditingProvider',
  'CssBaseline',
  'Header',
  'SessionExpiredDialog',
];

/** The two generic wrapper pages, with always-on features and opt-in widgets. */
export const WRAPPERS = [
  {
    id: 'GenericDataViewPage',
    name: 'GenericDataViewPage',
    file: 'src/pages/GenericDataViewPage.tsx',
    summary:
      'Reusable list-view page — search bar, sortable & paginated data table, resizable sidebar editor.',
    alwaysOn: [
      'Resizable sidebar editor — opens/closes from EditingContext',
      'Global search registration',
      'Filter registration with SearchContext',
      'Table logic — client-side filter, sort, paginate',
      'Loading & error pages',
      'Sort lock while the sidebar editor holds a selection',
    ],
    widgets: [
      {
        key: 'PageContentComponent',
        type: 'ComponentType<PageContentComponentProps<T,K>>',
        desc: 'Concrete component rendering the table body. Today every view supplies DataPageContent.',
        structural: true,
      },
      {
        key: 'EditorComponent',
        type: 'ComponentType<{itemId:string}>',
        desc: 'Sidebar editor body for the selected row. Set via EditingContext.setEditingItem, not viewConfig.',
        structural: true,
        source: 'editing-context',
      },
      {
        key: 'useData',
        type: '() => UseDataReturn<T,K>',
        desc: 'Per-entity dataset hook.',
        structural: true,
      },
      {
        key: 'useSearchRegistration',
        type: '(allData, dataLoading) => void',
        desc: 'Per-entity search-context wiring.',
        structural: true,
      },
      {
        key: 'filters',
        type: 'FilterDefinition[]',
        desc: 'Filter chips in the search bar; registered via registerFilterConfig when defined.',
      },
      {
        key: 'floatingAction',
        type: 'ReactNode',
        desc: 'Floating action (FAB / SpeedDial) rendered bottom-right of the content area.',
      },
      {
        key: 'useUrlEffect',
        type: 'hook',
        desc: 'Per-page URL-to-state reconciler — reconciles ?selected= deep links with the editor. Falls back to a stable no-op.',
      },
      {
        key: 'useRowClick',
        type: 'hook',
        desc: 'Returns a whole-row click handler, invoked inside the page so it can use router context. Non-compact mode only.',
      },
      {
        key: 'getFilterKey',
        type: '(item) => string',
        desc: 'Derives a filter key from a row, matched against the active filter chips.',
      },
      {
        key: 'handleColumnEvent',
        type: 'callback',
        desc: 'Column-level action callback (e.g. inline edit), forwarded to the table.',
      },
      {
        key: 'title',
        type: 'string',
        desc: 'Optional page title rendered above the table.',
      },
      {
        key: 'urlFilterInfo',
        type: 'UrlFilterInfo',
        desc: 'Surfaces a clear-filters chip after a bulk import deep-links the list.',
      },
    ],
  },
  {
    id: 'GenericDetailsPage',
    name: 'GenericDetailsPage',
    file: 'src/pages/GenericDetailsPage.tsx',
    summary: 'Reusable details / create page — a titled form container with an async Save button.',
    alwaysOn: [
      'Centered Container (maxWidth md)',
      'Save button — async, shows a spinner and a "Saving" label',
      'Inline error display on a failed save',
    ],
    widgets: [
      {
        key: 'detailsChildren',
        type: 'ReactNode (JSX child)',
        desc: 'Form / editor body the detail view passes as <GenericDetailsPage>…</GenericDetailsPage> child.',
        structural: true,
        source: 'jsx-child',
      },
      {
        key: 'onBack',
        type: '() => void',
        desc: 'Back affordance — an arrow IconButton left of the title. Caller owns dirty-form confirmation.',
      },
      {
        key: 'saveDisabled',
        type: 'boolean',
        desc: 'Lets the caller disable the Save button (e.g. an invalid form).',
      },
    ],
  },
];

/**
 * Wrapper module basename -> wrapper id, derived from WRAPPERS[].file so the
 * id the generator emits is always the canonical WRAPPERS id — never a
 * basename that merely happens to coincide with it.
 */
export const WRAPPER_ID_BY_BASENAME = new Map(
  WRAPPERS.map(w => [w.file.replace(/.*\//, '').replace(/\.tsx?$/, ''), w.id])
);
