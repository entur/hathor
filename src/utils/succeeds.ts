/**
 * Run one async step and report whether it succeeded, without rejecting. Lets
 * a post-write continuation run independent refreshes (record re-fetch, list
 * refresh) each to completion, whatever the other's outcome.
 *
 * @param {() => unknown} run - The step; may return a promise, or throw synchronously.
 * @returns {Promise<boolean>} `true` once it resolved, `false` if it threw or rejected.
 */
export const succeeds = (run: () => unknown): Promise<boolean> =>
  Promise.resolve()
    .then(run)
    .then(
      () => true,
      () => false
    );
