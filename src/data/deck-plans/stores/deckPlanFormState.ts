import type { DeckPlan } from '../types/deckPlanTypes.ts';
import { netexName } from '../../netex/multilingualString.ts';

/** Empty draft used before a row resolves, and as the create factory's base. */
const BLANK: DeckPlan = { id: '' };

export interface FormState {
  form: DeckPlan;
  baseline: DeckPlan;
}

export const initialFormState: FormState = { form: BLANK, baseline: BLANK };

/** Editable projection of a DeckPlan — the only fields this editor writes. */
const normalise = (dp: DeckPlan): DeckPlan => ({
  ...dp,
  name: netexName(dp.name),
  description: netexName(dp.description),
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
 * The baseline is the re-fetched record after a save, or the submitted values
 * when that re-fetch failed — never the pre-save row.
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
