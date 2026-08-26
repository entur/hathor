import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Add, LibraryAdd } from '@mui/icons-material';
import { Box, Button, Chip } from '@mui/material';
import DataPageContent from './DataPageContent';
import type { ColumnDefinition, Order } from './dataTableTypes';

/** Demo row shape — minimal stand-in for a real entity (Vehicle, VehicleType…). */
interface DemoRow {
  id: string;
  version?: number;
  name: string;
  mode: string;
  capacity: number;
}

type DemoKey = 'name' | 'mode' | 'capacity';

const PANEL_HEIGHT_PX = 560;

const ROWS: DemoRow[] = [
  { id: 'NSR:Type:1', name: 'FLIRT 74', mode: 'rail', capacity: 232 },
  { id: 'NSR:Type:2', name: 'Type 73', mode: 'rail', capacity: 250 },
  { id: 'NSR:Type:3', name: 'Citaro G', mode: 'bus', capacity: 149 },
  { id: 'NSR:Type:4', name: 'Solaris Urbino 12', mode: 'bus', capacity: 90 },
  { id: 'NSR:Type:5', name: 'MF 2000', mode: 'metro', capacity: 469 },
  { id: 'NSR:Type:6', name: 'Variobahn', mode: 'tram', capacity: 212 },
  { id: 'NSR:Type:7', name: 'MS Tideprins', mode: 'water', capacity: 296 },
  { id: 'NSR:Type:8', name: 'eCanter', mode: 'bus', capacity: 76 },
  { id: 'NSR:Type:9', name: 'Type 75', mode: 'rail', capacity: 240 },
  { id: 'NSR:Type:10', name: 'SD202', mode: 'tram', capacity: 88 },
  { id: 'NSR:Type:11', name: 'Lint 41', mode: 'rail', capacity: 160 },
  { id: 'NSR:Type:12', name: 'Urbino 18', mode: 'bus', capacity: 138 },
];

const COLUMNS: ColumnDefinition<DemoRow, DemoKey>[] = [
  { id: 'name', headerLabel: 'Name', isSortable: true, renderCell: r => r.name },
  { id: 'mode', headerLabel: 'Transport mode', isSortable: true, renderCell: r => r.mode },
  {
    id: 'capacity',
    headerLabel: 'Capacity',
    isSortable: true,
    align: 'right',
    renderCell: r => r.capacity,
  },
  {
    id: 'edit',
    headerLabel: '',
    align: 'right',
    renderCell: () => <Chip size="small" label="Edit" variant="outlined" />,
  },
];

/** Lightweight stand-ins for the real NewVehicleFab / AutosysImportFloatingMenu — contained Buttons, icon + text, no nav/dialog. */
const AddFab = (
  <Button variant="contained" color="primary" startIcon={<Add />} sx={{ textTransform: 'none' }}>
    New vehicle type
  </Button>
);
const ImportFab = (
  <Button
    variant="contained"
    color="primary"
    startIcon={<LibraryAdd />}
    sx={{ textTransform: 'none' }}
  >
    Import
  </Button>
);

/** Feature toggles surfaced as Storybook controls. */
interface DemoProps {
  /** List-head title (also the breadcrumb leaf). */
  title?: string;
  /** Render the right-aligned "add new" slot. */
  showAdd?: boolean;
  /** Render the right-aligned "import" slot. */
  showImport?: boolean;
  /** When > 0, shows the url-filter-chip with this count. */
  filterCount?: number;
  /** Render an empty dataset (shows the no-data row). */
  empty?: boolean;
}

/**
 * Wraps {@link DataPageContent} with mock data and live sort/pagination state
 * so the generic table renders standalone in Storybook.
 */
function PageContentDemo({ title, showAdd, showImport, filterCount = 0, empty }: DemoProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<DemoKey>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(filterCount);

  const rows = empty ? [] : ROWS;
  const sorted = [...rows].sort((a, b) => {
    const av = a[orderBy];
    const bv = b[orderBy];
    const cmp =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
    return order === 'asc' ? cmp : -cmp;
  });
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRequestSort = (property: DemoKey) => {
    if (property === orderBy) setOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setOrderBy(property);
      setOrder('asc');
    }
  };

  return (
    <Box
      sx={{
        height: PANEL_HEIGHT_PX,
        display: 'flex',
        flexDirection: 'column',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <DataPageContent<DemoRow, DemoKey>
        data={paged}
        loading={false}
        error={null}
        totalCount={empty ? 0 : rows.length}
        order={order}
        orderBy={orderBy}
        handleRequestSort={handleRequestSort}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        columns={COLUMNS}
        title={title}
        addAction={showAdd ? AddFab : undefined}
        importAction={showImport ? ImportFab : undefined}
        urlFilterInfo={
          count > 0
            ? { hasUrlFilters: true, filterCount: count, clearUrlFilters: () => setCount(0) }
            : undefined
        }
      />
    </Box>
  );
}

const meta: Meta<typeof PageContentDemo> = {
  title: 'components/data/DataPageContent',
  component: PageContentDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The shared list-head + data table for every Generic data view page (`/vehicles`, `/vehicle-types`, `/deck-plans`). The list-head (#88) is a single row: breadcrumbs above, then `title` (h5, left) + total-entries count + optional url-filter-chip on the left, with the right-aligned `addAction` / `importAction` slots. Pagination sits alone in the bottom bar. Rendered here via a demo wrapper that supplies mock rows, columns, and live sort/pagination state.',
      },
    },
  },
  // HeadBreadcrumbs (inside the head) renders a RouterLink → needs a router.
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/vehicle-types']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { title: 'Vehicle types', showAdd: false, showImport: false, filterCount: 0, empty: false },
  argTypes: {
    title: { control: 'text' },
    showAdd: { control: 'boolean' },
    showImport: { control: 'boolean' },
    filterCount: { control: { type: 'number', min: 0, max: 12 } },
    empty: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof PageContentDemo>;

/** Baseline: breadcrumbs + h5 left-aligned title + count, sortable table, pagination. */
export const Default: Story = {};

/** `/vehicles` head: right-aligned add-new slot. */
export const WithAddAction: Story = { args: { title: 'Vehicles', showAdd: true } };

/** `/vehicle-types` head: right-aligned import slot. */
export const WithImportAction: Story = { args: { showImport: true } };

/** Both action slots filled — add then import, right-aligned. */
export const WithBothActions: Story = { args: { showAdd: true, showImport: true } };

/** Post-import state: the url-filter-chip sits beside the count; its delete clears it. */
export const WithUrlFilterChip: Story = { args: { filterCount: 2 } };

/** Empty dataset — head still renders; table shows the no-data row. */
export const Empty: Story = { args: { empty: true } };
