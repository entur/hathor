import { useEffect, useRef } from 'react';
import type { EntityRecord } from './useEntityRecord.ts';

/**
 * Warn when a create's read-back fails. After a create advances to its minted
 * id the editor keeps the bridged form up in place of the record gate, so a
 * failed or empty by-id fetch would otherwise pass silently under the success
 * snackbar. `warn` fires once per failure while the bridge is up; the bridged
 * form (and its created id) stays.
 *
 * @param {Pick<EntityRecord<unknown>, 'error' | 'notFound'>} record - The by-id record for the advanced id.
 * @param {boolean} bridged - The bridged create form is showing for that id.
 * @param {string} notFoundLabel - Warning when Sobek has no such record.
 * @param {(warning: string) => void} warn - Swaps the success snackbar for the warning; may be an inline closure.
 * @returns {void}
 */
export function useBridgeReadBack(
  record: Pick<EntityRecord<unknown>, 'error' | 'notFound'>,
  bridged: boolean,
  notFoundLabel: string,
  warn: (warning: string) => void
): void {
  const warnRef = useRef(warn);
  useEffect(() => {
    warnRef.current = warn;
  });
  const failure = bridged ? (record.error ?? (record.notFound ? notFoundLabel : null)) : null;
  useEffect(() => {
    if (failure) warnRef.current(failure);
  }, [failure]);
}
