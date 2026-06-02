import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Returns a stable callback that drops a single search param — collapsing the
 * `?selected=` editor slider — via a replace-history navigation (no new entry).
 *
 * @param paramKey The search param to delete (a feature's `selected` key).
 * @returns A `closeSlider` callback.
 */
export function useCloseSliderParam(paramKey: string): () => void {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    () =>
      setSearchParams(
        params => {
          params.delete(paramKey);
          return params;
        },
        { replace: true }
      ),
    [paramKey, setSearchParams]
  );
}
