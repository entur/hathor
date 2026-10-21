import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import type { FeatureFlag } from '../../config/featureFlags.ts';

interface ColumnDefinitionBase<T> {
  headerLabel: string;
  renderCell: (item: T, handleColumnEvent: (event: string, item: T) => void) => ReactNode;
  align?: 'left' | 'center' | 'right';
  display?: 'always' | 'desktop-only';
  sx?: SxProps<Theme>;
  /** Hides the column unless this feature flag is on in config.json. */
  flag?: FeatureFlag;
}

interface SortableColumn<T, K extends string> extends ColumnDefinitionBase<T> {
  isSortable: true;
  id: K;
}

interface NonSortableColumn<T> extends ColumnDefinitionBase<T> {
  isSortable?: false;
  id: string;
}

/**
 * Defines the structure of a column. It's a union of the two possibilities,
 * allowing TypeScript to infer the correct type for 'id' based on 'isSortable'.
 * @template T The type of the data item for the row.
 * @template K The union type of valid sortable column IDs.
 */
export type ColumnDefinition<T, K extends string> = SortableColumn<T, K> | NonSortableColumn<T>;

export type Order = 'asc' | 'desc';
