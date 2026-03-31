import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Add, FileUpload } from '@mui/icons-material';
import { Box, Chip, Skeleton, Typography } from '@mui/material';
import { DataViewTable, type ColumnDefinition } from '@entur/data-view-table';
import { Editor, normalizeGraphQL } from '@entur/vtype-details';
import type { VehicleType as EditorVehicleType, ExtraTab } from '@entur/vtype-details';
import { useVehicleTypes } from '../data/vehicle-types/useVehicleTypes.ts';
import type { VehicleType, Vehicle, DeckPlan } from '../data/vehicle-types/vehicleTypeTypes.ts';
import LoadingPage from '../components/common/LoadingPage.tsx';
import ErrorPage from '../components/common/ErrorPage.tsx';

type SortKey = 'id' | 'name' | 'dimensions';

const fmtDim = (v: VehicleType) => {
  const p = [
    v.length != null && `L:${v.length}`,
    v.width != null && `W:${v.width}`,
    v.height != null && `H:${v.height}`,
  ].filter(Boolean);
  return p.length ? p.join(', ') : '';
};

const cols: ColumnDefinition<VehicleType, SortKey>[] = [
  {
    id: 'id',
    headerLabel: 'ID',
    isSortable: true,
    renderCell: item => <Chip label={item.id} size="small" variant="outlined" />,
    display: 'always',
  },
  {
    id: 'name',
    headerLabel: 'Name',
    isSortable: true,
    renderCell: item => item.name?.value,
    display: 'always',
  },
  {
    id: 'dimensions',
    headerLabel: 'Dims',
    isSortable: true,
    renderCell: item => (
      <Typography variant="body2" noWrap>
        {fmtDim(item)}
      </Typography>
    ),
    display: 'desktop-only',
  },
  {
    id: 'deckPlanCount',
    headerLabel: 'DPlans',
    isSortable: false,
    renderCell: item => (item.deckPlan ? 1 : 0),
    display: 'desktop-only',
  },
  {
    id: 'vehicleCount',
    headerLabel: 'Vehicles',
    isSortable: false,
    renderCell: item => item.vehicles?.length ?? 0,
    display: 'desktop-only',
  },
];

const sortVal = (item: VehicleType, key: SortKey): string | number => {
  switch (key) {
    case 'id':
      return item.id;
    case 'name':
      return item.name?.value || '';
    case 'dimensions':
      return item.length;
  }
};

// Vehicles extra tab columns
const vehCols: ColumnDefinition<Vehicle, 'id' | 'registrationNumber'>[] = [
  { id: 'id', headerLabel: 'ID', isSortable: true, renderCell: v => v.id, display: 'always' },
  {
    id: 'registrationNumber',
    headerLabel: 'Reg. Nr',
    isSortable: true,
    renderCell: v => v.registrationNumber,
    display: 'always',
  },
];

const vehSortVal = (v: Vehicle, k: 'id' | 'registrationNumber') =>
  k === 'id' ? v.id : v.registrationNumber;

const dpCols: ColumnDefinition<DeckPlan, 'id' | 'name'>[] = [
  { id: 'id', headerLabel: 'ID', isSortable: true, renderCell: d => d.id, display: 'always' },
  {
    id: 'name',
    headerLabel: 'Name',
    isSortable: true,
    renderCell: d => d.name?.value,
    display: 'always',
  },
];

const dpSortVal = (d: DeckPlan, k: 'id' | 'name') => (k === 'id' ? d.id : (d.name?.value ?? ''));

function EditorSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, height: '100%' }}>
      <Box
        sx={{
          flex: '1 1 50%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto repeat(6, 1fr)',
          gap: 1,
        }}
      >
        <Box
          sx={{
            gridColumn: '1 / -1',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} variant="rounded" animation={false} sx={{ height: '100%' }} />
        ))}
      </Box>
      <Skeleton variant="rounded" animation={false} sx={{ flex: '1 1 50%' }} />
    </Box>
  );
}

export default function CompoundVehicleTypeView() {
  const { allData, loading, error } = useVehicleTypes();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => allData?.find(vt => vt.id === selectedId) ?? null,
    [allData, selectedId]
  );

  const editorVal = useMemo<Partial<EditorVehicleType> | null>(
    () => (selected ? normalizeGraphQL(selected) : null),
    [selected]
  );

  const extraTabs = useMemo(() => {
    if (!selected) return [];
    const tabs: ExtraTab[] = [];
    if (selected.vehicles?.length) {
      tabs.push({
        label: `Vehicles (${selected.vehicles.length})`,
        content: (
          <DataViewTable
            data={selected.vehicles}
            columns={vehCols}
            getSortValue={vehSortVal}
            defaultSort={{ order: 'asc', orderBy: 'registrationNumber' }}
          />
        ),
      });
    }
    if (selected.deckPlan) {
      tabs.push({
        label: 'Deck Plan',
        content: (
          <DataViewTable
            data={[selected.deckPlan]}
            columns={dpCols}
            getSortValue={dpSortVal}
            defaultSort={{ order: 'asc', orderBy: 'name' }}
          />
        ),
      });
    }
    return tabs;
  }, [selected]);

  if (loading && !allData?.length) return <LoadingPage />;
  if (error && !allData?.length) return <ErrorPage message={error} />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: 'calc(100dvh - 64px)',
        overflow: 'hidden',
      }}
    >
      {/* Col 1 — list */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0 0 55%' },
          minHeight: { xs: 300, md: 0 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRight: { md: 1 },
          borderColor: { md: 'divider' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1.5, gap: 1 }}>
          <Typography variant="h5" sx={{ mr: 'auto' }}>
            Types
          </Typography>
          <Chip
            icon={<Add />}
            label="New Type..."
            clickable
            component={Link}
            to="/vehicle-type/new"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<FileUpload />}
            label="Bulk import..."
            clickable
            variant="outlined"
            size="small"
          />
        </Box>
        <DataViewTable
          data={allData}
          columns={cols}
          getSortValue={sortVal}
          defaultSort={{ order: 'asc', orderBy: 'name' }}
          onRowClick={item => setSelectedId(item.id)}
          selectedId={selectedId ?? undefined}
        />
      </Box>

      {/* Col 2 — editor or skeleton */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '1 1 45%' },
          minHeight: { xs: 300, md: 0 },
          overflow: 'auto',
        }}
      >
        {editorVal ? (
          <Box key={selectedId} sx={{ p: 2 }}>
            <Editor value={editorVal} onChange={() => {}} extraTabs={extraTabs} />
          </Box>
        ) : (
          <EditorSkeleton />
        )}
      </Box>
    </Box>
  );
}
