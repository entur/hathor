import { useLocation } from 'react-router-dom';
import type { CollectionLinkState } from './CollectionShell.tsx';

/** The record the details page handed back, for the collection's `focusEditId` (#291). */
export const useFocusEditId = (): string | undefined =>
  (useLocation().state as CollectionLinkState | null)?.focusEditId;
