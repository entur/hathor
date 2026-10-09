import { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { cachedCodeValues, loadCodeValues } from '../utils/loadCodeValues.ts';
import type { CodeValue, CodeValueType } from '../types/codeValueTypes.ts';

const NO_CODES: readonly CodeValue[] = [];

/**
 * A Sobek code list, fetched once per session on first use and served from
 * cache to every later mount. Empty until the fetch lands and when it fails —
 * a failure is logged and retried on the next mount.
 *
 * @param valueType Code list key, e.g. `EMISSION_STANDARD`.
 * @returns The list's `{ value, label }` entries, in Sobek's order.
 */
export function useCodeValues(valueType: CodeValueType): readonly CodeValue[] {
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const [codes, setCodes] = useState<readonly CodeValue[]>(
    () => cachedCodeValues(valueType) ?? NO_CODES
  );

  useEffect(() => {
    if (!applicationBaseUrl) return;
    let live = true;
    loadCodeValues(applicationBaseUrl, getAccessToken, valueType)
      .then(loaded => live && setCodes(loaded))
      .catch((err: unknown) => console.warn(`Code values "${valueType}" failed to load`, err));
    return () => {
      live = false;
    };
  }, [applicationBaseUrl, getAccessToken, valueType]);

  return codes;
}
