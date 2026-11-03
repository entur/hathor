export interface FormState<T> {
  form: T;
  /** Last committed value — what Cancel restores and dirtiness is measured against. */
  baseline: T;
}

export interface FormStateActions<T, S> {
  initial: FormState<T>;
  /** Re-baseline from a freshly-read source (e.g. the by-id record). */
  hydrate: (state: FormState<T>, src: S | null | undefined) => FormState<T>;
  /** Re-baseline on a form value already in hand (e.g. the one just written). */
  rebase: (state: FormState<T>, form: T) => FormState<T>;
  edit: (state: FormState<T>, form: T) => FormState<T>;
  /** Drop the in-progress edit: form ← baseline. */
  restore: (state: FormState<T>) => FormState<T>;
  isDirty: (state: FormState<T>) => boolean;
}

export interface CreateFormStateOpts<T, S> {
  /** Empty/initial form value; also the baseline when hydrate is called with null/undefined. */
  blank: T;
  /** Map a freshly-fetched source object (e.g. parsed XML) into a form value. */
  formFromSource: (src: S | null | undefined) => T;
  /** Projection applied to both sides before the dirty compare (e.g. trim, coerce flags). */
  normalise?: (v: T) => T;
}

/**
 * Factory for the dirty-aware form-state reducer set. State carries the
 * current `form` and its committed `baseline`. `hydrate` / `rebase` advance
 * both atomically so a load never produces a brief dirty frame; `edit` keeps
 * the baseline so divergence is the only dirty signal.
 *
 * @param {CreateFormStateOpts<T, S>} opts `blank`, `formFromSource`, optional `normalise`.
 * @returns {FormStateActions<T, S>} `{ initial, hydrate, rebase, edit, restore, isDirty }`.
 */
export function createFormState<T, S>({
  blank,
  formFromSource,
  normalise = v => v,
}: CreateFormStateOpts<T, S>): FormStateActions<T, S> {
  const keyOf = (v: T): string => JSON.stringify(normalise(v));
  const rebase = (_state: FormState<T>, form: T): FormState<T> => ({ form, baseline: form });
  return {
    initial: { form: blank, baseline: blank },
    hydrate: (state, src) => rebase(state, formFromSource(src)),
    rebase,
    edit: (state, form) => ({ ...state, form }),
    restore: state => ({ ...state, form: state.baseline }),
    isDirty: state => keyOf(state.form) !== keyOf(state.baseline),
  };
}
