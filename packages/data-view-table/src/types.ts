import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

interface ColumnDefinitionBase<T> {
  headerLabel: string;
  renderCell: (item: T, handleColumnEvent: (event: string, item: T) => void) => ReactNode;
  align?: 'left' | 'center' | 'right';
  display?: 'always' | 'desktop-only';
  sx?: SxProps<Theme>;
}

interface SortableColumn<T, K extends string> extends ColumnDefinitionBase<T> {
  isSortable: true;
  id: K;
}

interface NonSortableColumn<T> extends ColumnDefinitionBase<T> {
  isSortable?: false;
  id: string;
}

export type ColumnDefinition<T, K extends string> = SortableColumn<T, K> | NonSortableColumn<T>;

export type Order = 'asc' | 'desc';
