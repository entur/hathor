/**
 * Public surface of the entity collection (grid / cards list).
 */
export { createEntityCollection } from './components/collection.tsx';
export type { EntityCollection } from './components/collection.tsx';
export { toSobekFilter } from './utils/filters.ts';
export { CARD_MEDIA_ASPECT, defaultCollectionQuery } from './types.ts';
export type {
  CollectionView,
  CollectionTool,
  CollectionQuery,
  CollectionSort,
  CollectionLabels,
  CollectionSlotProps,
  CollectionOptions,
  CardSpec,
  EntityCollectionProps,
  FilterFields,
  FilterFieldSpec,
  FilterOp,
  FieldEntry,
  FieldSpec,
  FilterValue,
} from './types.ts';
