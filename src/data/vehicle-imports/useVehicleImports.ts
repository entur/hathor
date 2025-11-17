import { useState } from 'react';
import type { Order } from '../../components/data/dataTableTypes.ts';
import type { VehicleImport } from './vehicleImportTypes.ts';

export type OrderBy = 'registrationNumber' | 'operationalId';

export function useVehicleImports() {
  const [data, setData] = useState<VehicleImport[]>([
    { id: '1', status: 'PENDING' } as VehicleImport,
  ]);
  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('registrationNumber');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const addRow = (newRow: VehicleImport) => {
    setData(prevData => [...prevData, newRow]);
  };

  const updateRow = (updatedRow: VehicleImport) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.id === updatedRow.id);
    if (index !== -1) {
      newData[index] = updatedRow;
    }
    setData(newData);
  };

  const sorted = data;

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const doImport = async () => {};

  return {
    allData: sorted,
    data: paginated,
    totalCount: data.length,
    error,
    loading,
    order,
    orderBy,
    handleRequestSort,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    addRow,
    updateRow,
    doImport,
  };
}
