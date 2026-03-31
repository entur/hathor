# @entur/data-view-table

A self-contained, embeddable data table for React + MUI. Supports sortable columns, pagination, category filtering, text search, and responsive compact mode -- all without depending on any app-level context or state library.

Drop it into a page, a tab, a dialog, or a sidebar. It manages its own state by default, or you can control it from the outside.

## Quick start

```bash
npm install
npm run build -w @entur/data-view-table
```

```tsx
import { DataViewTable, type ColumnDefinition } from '@entur/data-view-table';

interface Vehicle {
  id: string;
  name: string;
  length: number;
}

type SortKey = 'name' | 'length';

const columns: ColumnDefinition<Vehicle, SortKey>[] = [
  { id: 'name',   headerLabel: 'Name',   isSortable: true, renderCell: v => v.name,   display: 'always' },
  { id: 'length', headerLabel: 'Length',  isSortable: true, renderCell: v => v.length, display: 'always' },
];

const getSortValue = (item: Vehicle, key: SortKey) =>
  key === 'name' ? item.name : item.length;

function MyPage() {
  const vehicles: Vehicle[] = [
    { id: '1', name: 'Flirt', length: 75 },
    { id: '2', name: 'Zefiro', length: 200 },
    { id: '3', name: 'Stadler', length: 105 },
  ];

  return (
    <DataViewTable
      data={vehicles}
      columns={columns}
      getSortValue={getSortValue}
      defaultSort={{ order: 'asc', orderBy: 'name' }}
      title="Vehicles"
    />
  );
}
```

That's it. Sorting, pagination, and responsive layout work out of the box.

## Uncontrolled vs controlled

By default the table manages sort and pagination state internally. Pass `defaultSort` and `defaultRowsPerPage` to set initial values.

To control state from the outside (e.g. syncing with URL params or a parent component), pass the controlled props instead:

```tsx
<DataViewTable
  data={data}
  columns={columns}
  getSortValue={getSortValue}
  // Controlled sort
  order={order}
  orderBy={orderBy}
  onSortChange={(newOrder, newOrderBy) => { /* update your state */ }}
  // Controlled pagination
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={setPage}
  onRowsPerPageChange={setRowsPerPage}
/>
```

When controlled props are present, the table defers to them. You can mix and match -- e.g. control sort but let pagination be internal.

## Filtering

### Category filter

Pass `activeFilters` (an array of category keys) and `getFilterKey` (extracts the category from each row). Only rows whose key is in the active list are shown.

```tsx
<DataViewTable
  data={vehicles}
  columns={columns}
  getSortValue={getSortValue}
  activeFilters={['rail', 'bus']}
  getFilterKey={v => v.transportMode}
/>
```

### Text search

Pass a `searchQuery` string. Rows are kept if the current sort column's value contains the query (case-insensitive).

```tsx
const [query, setQuery] = useState('');

<TextField value={query} onChange={e => setQuery(e.target.value)} />
<DataViewTable
  data={vehicles}
  columns={columns}
  getSortValue={getSortValue}
  searchQuery={query}
/>
```

## Responsive layout

The table automatically switches to compact mode when its container is narrower than 700px. Columns marked `display: 'desktop-only'` collapse into an expandable detail row per item. No breakpoint config needed -- it uses a `ResizeObserver` on its own container.

## i18n

The component has no dependency on i18next or any translation library. Instead it accepts text props with English defaults:

| Prop | Default | Purpose |
|------|---------|---------|
| `noDataLabel` | `"No data to display."` | Shown when the table is empty |
| `totalLabel` | `` n => `${n} entries` `` | Renders the count above the table |

```tsx
<DataViewTable
  data={data}
  columns={columns}
  getSortValue={getSortValue}
  noDataLabel={t('table.empty')}
  totalLabel={n => t('table.count', { count: n })}
/>
```

## `useTableSort` hook

If you need the sort/filter/paginate logic without the table UI, import the hook directly:

```tsx
import { useTableSort } from '@entur/data-view-table';

const { rows, filteredCount } = useTableSort({
  data: myData,
  order: 'asc',
  orderBy: 'name',
  page: 0,
  rowsPerPage: 25,
  getSortValue: (item, key) => item[key],
});
```

Returns `{ rows, filteredCount }` -- a memoized, sorted, filtered, paginated slice of your data.

## Column definition

```ts
interface ColumnDefinition<T, K extends string> {
  id: K | string;        // sortable columns must use K (the sort key union)
  headerLabel: string;
  isSortable?: boolean;  // enables click-to-sort on the header
  renderCell: (item: T, onEvent: (event: string, item: T) => void) => ReactNode;
  align?: 'left' | 'center' | 'right';
  display?: 'always' | 'desktop-only';   // desktop-only collapses in compact mode
  sx?: SxProps<Theme>;
}
```

The `renderCell` callback receives the row item and an event emitter. Fire events to communicate actions (edit, delete, etc.) to the parent via `handleColumnEvent`.

## Props reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `T[] \| null` | yes | Row data. `null` shows loading/empty state. |
| `columns` | `ColumnDefinition<T, K>[]` | yes | Column config array |
| `getSortValue` | `(item: T, key: K) => string \| number` | yes | Extracts the sortable value for a column |
| `totalCount` | `number` | | Override row count (e.g. from server). Ignored when filtering locally. |
| `loading` | `boolean` | | Suppresses "no data" message while true |
| `error` | `string \| null` | | Error message (reserved for future use) |
| `defaultSort` | `{ order, orderBy }` | | Initial sort (uncontrolled) |
| `order` | `Order` | | Current sort direction (controlled) |
| `orderBy` | `K` | | Current sort column (controlled) |
| `onSortChange` | `(order, orderBy) => void` | | Called when sort changes |
| `defaultRowsPerPage` | `number` | | Initial rows per page (default: 10) |
| `page` | `number` | | Current page (controlled, 0-indexed) |
| `rowsPerPage` | `number` | | Rows per page (controlled) |
| `onPageChange` | `(page) => void` | | Called when page changes |
| `onRowsPerPageChange` | `(rpp) => void` | | Called when rows-per-page changes |
| `rowsPerPageOptions` | `number[]` | | Options in the dropdown (default: `[10, 25, 100]`) |
| `searchQuery` | `string` | | Client-side text filter |
| `activeFilters` | `string[]` | | Active category filter keys |
| `getFilterKey` | `(item: T) => string` | | Extracts category key from a row |
| `title` | `string` | | Optional heading above the table |
| `noDataLabel` | `string` | | Empty-state text |
| `totalLabel` | `(n: number) => string` | | Count label formatter |
| `handleColumnEvent` | `(event, col, item) => void` | | Column event handler |
| `floatingAction` | `ReactNode` | | Element rendered next to pagination (e.g. FAB) |

## Scripts

```bash
npm run build -w @entur/data-view-table   # vite lib build -> dist/
npm run test  -w @entur/data-view-table   # vitest
```

## Peer dependencies

React 18+, MUI v7, Emotion. These are expected to come from the host app.
