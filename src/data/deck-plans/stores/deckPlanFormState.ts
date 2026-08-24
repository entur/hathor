import type { DeckPlan, Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Empty draft used before a row resolves, and as the create factory's base. */
const BLANK: DeckPlan = { id: '' };

export interface FormState {
  form: DeckPlan;
  baseline: DeckPlan;
}

export const initialFormState: FormState = { form: BLANK, baseline: BLANK };

/**
 * Trim a NeTEx name, dropping it entirely when nothing survives. Sobek re-pads
 * `<Text>` on serialize, so every fetched value arrives whitespace-wrapped
 * while `fast-xml-parser` hands back the same field trimmed — normalising here
 * keeps the two surfaces comparable (sobek#180 probe).
 */
const trimName = (n?: Name): Name | undefined => {
  const value = n?.value?.trim();
  if (!value) return undefined;
  return n?.lang ? { value, lang: n.lang } : { value };
};

/** Editable projection of a DeckPlan — the only fields this editor writes. */
const normalise = (dp: DeckPlan): DeckPlan => ({
  ...dp,
  name: trimName(dp.name),
  description: trimName(dp.description),
});

/**
 * Re-baseline the form from a persisted row. Both halves are normalised so a
 * freshly-opened editor is never dirty.
 *
 * @param dp Resolved row, or the blank create factory.
 */
export const hydrate = (_state: FormState, dp: DeckPlan | null | undefined): FormState => {
  const next = normalise(dp ?? BLANK);
  return { form: next, baseline: next };
};

/**
 * Record a user edit, leaving the baseline untouched.
 *
 * @param form Next form value straight from the controlled inputs.
 */
export const edit = (state: FormState, form: DeckPlan): FormState => ({ ...state, form });

/**
 * Drop an in-progress edit, restoring the last baselined values.
 *
 * Distinct from re-hydrating off the `deckPlan` prop: after an in-place save
 * `useUrlEditorSelection` does not re-commit the editor (the id is unchanged),
 * so that prop still holds the pre-save row. Cancelling onto it would show —
 * and re-baseline against — values that are no longer what is stored.
 */
export const restore = (state: FormState): FormState => ({ ...state, form: state.baseline });

/** True when the trimmed name or description differs from the baseline. */
export const isDirty = ({ form, baseline }: FormState): boolean => {
  const n = normalise(form);
  return (
    n.name?.value !== baseline.name?.value ||
    n.name?.lang !== baseline.name?.lang ||
    n.description?.value !== baseline.description?.value ||
    n.description?.lang !== baseline.description?.lang
  );
};
