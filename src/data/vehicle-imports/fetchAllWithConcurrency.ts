import type { AutosysFetchResult } from './assembleAutosysResults';

/** Fetch multiple registration numbers with bounded concurrency.
 *  Results are positionally aligned with the input array. */
export async function fetchAllWithConcurrency(
  queryRegNumbers: string[],
  fetchFn: (rn: string) => Promise<string>,
  concurrency: number,
  onProgress: (completed: number) => void
): Promise<AutosysFetchResult[]> {
  const results: AutosysFetchResult[] = [];
  let completed = 0;
  let index = 0;

  async function worker() {
    while (index < queryRegNumbers.length) {
      const i = index++;
      const queryRegNumber = queryRegNumbers[i];
      try {
        const xml = await fetchFn(queryRegNumber);
        results[i] = { queryRegNumber, xml, error: null };
      } catch (e) {
        results[i] = {
          queryRegNumber,
          xml: '',
          error: e instanceof Error ? e.message : 'Unknown error',
        };
      }
      completed++;
      onProgress(completed);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, queryRegNumbers.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}
