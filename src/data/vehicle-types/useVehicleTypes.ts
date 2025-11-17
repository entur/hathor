import { useEffect, useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import type { VehicleType, VehicleTypeContext } from './vehicleTypeTypes.js';
import { fetchVehicleTypes } from './fetchVehicleTypes.tsx';
import type { Order } from '../../components/data/dataTableTypes.ts';

export type OrderBy = 'name' | 'id' | 'length' | 'height' | 'width' | 'deckPlanName';

export function useVehicleTypes() {
  const [data, setData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationBaseUrl) return;
    fetchVehicleTypes(applicationBaseUrl, '')
      .then((ctx: VehicleTypeContext) => {
        setData(ctx.vehicleTypes);
      })
      .catch(() => {
        setError('Failed to fetch data');
      })
      .finally(() => setLoading(false));
  }, [applicationBaseUrl]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sorted = [...data].sort((a, b) => {
    const v1 = orderBy === 'name' ? a.name?.value?.toLowerCase() : a.id.toLowerCase();
    const v2 = orderBy === 'name' ? b.name?.value?.toLowerCase() : b.id.toLowerCase();
    if (v1 < v2) return order === 'asc' ? -1 : 1;
    if (v1 > v2) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
  };
}
