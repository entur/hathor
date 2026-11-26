import { useEffect, useState } from 'react';

/**
 * A value that follows `value` once it has held still for `ms`: the first
 * render gets it at once, later changes wait for a pause.
 *
 * @param {T} value the live value (compared by identity)
 * @param {number} ms how long it must hold still
 * @returns {T} the last value that held still
 */
export function useDebouncedValue<T>(value: T, ms: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}
