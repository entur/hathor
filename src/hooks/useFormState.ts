import { useReducer, useCallback, useMemo } from 'react';

export interface FormState<T> {
  form: T;
  /** Last hydrated value — what Cancel restores. */
  baseline: T;
  hydratedKey: string;
}

export interface FormStateActions<T, S> {
  initial: FormState<T>;
  hydrate: (state: FormState<T>, src: S | null | undefined) => FormState<T>;
  edit: (state: FormState<T>, form: T) => FormState<T>;
  restore: (state: FormState<T>) => FormState<T>;
  /** Adopt `form` as both the current value and the new baseline (clean). */
  commit: (state: FormState<T>, form: T) => FormState<T>;
  isDirty: (state: FormState<T>) => boolean;
}

export interface CreateFormStateOpts<T, S> {
  /** Empty/initial form value; also the baseline when hydrate is called with null/undefined. */
  blank: T;
  /** Map a freshly-fetched source object (e.g. parsed XML) into a form value. */
  formFromSource: (src: S | null | undefined) => T;
  /** Canonicalise a form before the dirty compare (applied to both sides), e.g. `false` flag → absent. */
  normalise?: (form: T) => T;
}

/**
 * Factory for the dirty-aware form-state reducers. State carries the current
 * `form` value, the last hydrated `baseline` and its `hydratedKey`. `hydrate`
 * advances all three atomically so the load → render transition never produces
 * a brief `isDirty === true` frame; `edit` preserves the baseline so
 * divergence is the only dirty signal; `restore` drops an in-progress edit
 * back to the baseline (Cancel) — which may be a value hydrated without a
 * fetched source, e.g. a just-created record bridged until its read-back.
 *
 * Use the factory directly for pure reducer tests; components use the
 * companion {@link useFormState} hook (e.g. via {@link useEntityEditor}).
 */
export function createFormState<T, S>({
  blank,
  formFromSource,
  normalise = f => f,
}: CreateFormStateOpts<T, S>): FormStateActions<T, S> {
  const cache = new WeakMap<object, string>();
  /** Normalised dirty key; memoised per object identity so repeat calls skip stringify. */
  const keyOf = (v: T): string => {
    if (typeof v !== 'object' || v === null) return JSON.stringify(normalise(v));
    const hit = cache.get(v);
    if (hit !== undefined) return hit;
    const key = JSON.stringify(normalise(v));
    cache.set(v, key);
    return key;
  };
  return {
    initial: { form: blank, baseline: blank, hydratedKey: keyOf(blank) },
    hydrate(_state, src) {
      const form = formFromSource(src);
      return { form, baseline: form, hydratedKey: keyOf(form) };
    },
    edit(state, form) {
      return { ...state, form };
    },
    restore(state) {
      return { ...state, form: state.baseline };
    },
    commit(_state, form) {
      return { form, baseline: form, hydratedKey: keyOf(form) };
    },
    isDirty(state) {
      return keyOf(state.form) !== state.hydratedKey;
    },
  };
}

interface UseFormStateReturn<T, S> {
  state: FormState<T>;
  /** Apply a freshly-fetched source as the new baseline. */
  hydrate: (src: S | null | undefined) => void;
  /** Apply a user edit. Baseline preserved so `isDirty` tracks divergence. */
  setForm: (form: T) => void;
  /** Drop an in-progress edit back to the baseline (Cancel). */
  restore: () => void;
  /** Adopt `form` as both the current value and the new baseline (clean). */
  commit: (form: T) => void;
  /** True iff the form has diverged from the last hydrated baseline. */
  isDirty: boolean;
}

type FormAction<T, S> =
  | { type: 'hydrate'; src: S | null | undefined }
  | { type: 'edit'; form: T }
  | { type: 'restore' }
  | { type: 'commit'; form: T };

/**
 * React hook wrapping {@link createFormState} + `useReducer`.
 *
 * `opts` is captured at mount (the form's shape is treated as fixed for
 * the lifetime of the consumer). If `blank` or `formFromSource` need to
 * change dynamically, prefer the factory + `useReducer` directly.
 *
 * @param {CreateFormStateOpts<T, S>} opts - Blank form, source mapping and dirty normaliser.
 * @param {S | null} [initialSrc] - Source to hydrate the first state from (default: `blank`).
 * @returns {UseFormStateReturn<T, S>} State, stable actions and `isDirty`.
 */
export function useFormState<T, S>(
  opts: CreateFormStateOpts<T, S>,
  initialSrc?: S | null
): UseFormStateReturn<T, S> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actions = useMemo(() => createFormState(opts), []);

  const reducer = useCallback(
    (state: FormState<T>, action: FormAction<T, S>): FormState<T> => {
      switch (action.type) {
        case 'hydrate':
          return actions.hydrate(state, action.src);
        case 'edit':
          return actions.edit(state, action.form);
        case 'restore':
          return actions.restore(state);
        case 'commit':
          return actions.commit(state, action.form);
      }
    },
    [actions]
  );

  const [state, dispatch] = useReducer(reducer, initialSrc, src =>
    src == null ? actions.initial : actions.hydrate(actions.initial, src)
  );

  return {
    state,
    hydrate: useCallback((src: S | null | undefined) => dispatch({ type: 'hydrate', src }), []),
    setForm: useCallback((form: T) => dispatch({ type: 'edit', form }), []),
    restore: useCallback(() => dispatch({ type: 'restore' }), []),
    commit: useCallback((form: T) => dispatch({ type: 'commit', form }), []),
    isDirty: actions.isDirty(state),
  };
}
