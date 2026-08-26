import { useReducer, useCallback, useMemo } from 'react';

export interface FormState<T> {
  form: T;
  hydratedKey: string;
}

export interface FormStateActions<T, S> {
  initial: FormState<T>;
  hydrate: (state: FormState<T>, src: S | null | undefined) => FormState<T>;
  edit: (state: FormState<T>, form: T) => FormState<T>;
  isDirty: (state: FormState<T>) => boolean;
}

export interface CreateFormStateOpts<T, S> {
  /** Empty/initial form value; also the baseline when hydrate is called with null/undefined. */
  blank: T;
  /** Map a freshly-fetched source object (e.g. parsed XML) into a form value. */
  formFromSource: (src: S | null | undefined) => T;
}

/**
 * Factory for the dirty-aware form-state reducer trio. State carries
 * both the current `form` value and a baseline `hydratedKey`. `hydrate`
 * advances both atomically so the load → render transition never produces
 * a brief `isDirty === true` frame; `edit` preserves the baseline so
 * divergence is the only dirty signal.
 *
 * Use the factory directly with `useReducer` when you want module-level
 * exports consumed by tests (the vehicles feature does this); use the
 * companion {@link useFormState} hook when the consumer just needs a
 * drop-in form-state primitive without the reducer boilerplate.
 */
export function createFormState<T, S>({
  blank,
  formFromSource,
}: CreateFormStateOpts<T, S>): FormStateActions<T, S> {
  const keyOf = (v: T): string => JSON.stringify(v);
  return {
    initial: { form: blank, hydratedKey: keyOf(blank) },
    hydrate(_state, src) {
      const form = formFromSource(src);
      return { form, hydratedKey: keyOf(form) };
    },
    edit(state, form) {
      return { ...state, form };
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
  /** True iff the form has diverged from the last hydrated baseline. */
  isDirty: boolean;
}

type FormAction<T, S> = { type: 'hydrate'; src: S | null | undefined } | { type: 'edit'; form: T };

/**
 * React hook wrapping {@link createFormState} + `useReducer`. Returns
 * `{ state, hydrate, setForm, isDirty }` — drop into a sidebar editor
 * with no boilerplate.
 *
 * `opts` is captured at mount (the form's shape is treated as fixed for
 * the lifetime of the consumer). If `blank` or `formFromSource` need to
 * change dynamically, prefer the factory + `useReducer` directly.
 */
export function useFormState<T, S>(opts: CreateFormStateOpts<T, S>): UseFormStateReturn<T, S> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actions = useMemo(() => createFormState(opts), []);

  const reducer = useCallback(
    (state: FormState<T>, action: FormAction<T, S>): FormState<T> =>
      action.type === 'hydrate'
        ? actions.hydrate(state, action.src)
        : actions.edit(state, action.form),
    [actions]
  );

  const [state, dispatch] = useReducer(reducer, actions.initial);

  return {
    state,
    hydrate: useCallback((src: S | null | undefined) => dispatch({ type: 'hydrate', src }), []),
    setForm: useCallback((form: T) => dispatch({ type: 'edit', form }), []),
    isDirty: actions.isDirty(state),
  };
}
