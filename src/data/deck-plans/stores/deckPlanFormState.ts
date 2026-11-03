/**
 * Form state for the DeckPlan editor: the generic `createFormState` factory
 * bound to `DeckPlan`, with name/description trimmed on both sides of the
 * dirty compare — Sobek re-pads `<Text>` on serialize (sobek#180).
 */
import {
  createFormState,
  type FormState as GenericFormState,
} from '../../../hooks/useFormState.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import { netexName } from '../../netex/multilingualString.ts';

/** Empty draft used before a row resolves, and as the create factory's base. */
const BLANK: DeckPlan = { id: '' };

/** Editable projection of a DeckPlan — the only fields this editor writes. */
const normalise = (dp: DeckPlan): DeckPlan => ({
  ...dp,
  name: netexName(dp.name),
  description: netexName(dp.description),
});

const deckPlanForm = createFormState<DeckPlan, DeckPlan>({
  blank: BLANK,
  formFromSource: dp => normalise(dp ?? BLANK),
  normalise,
});

export type FormState = GenericFormState<DeckPlan>;
export const initialFormState = deckPlanForm.initial;
export const hydrate = deckPlanForm.hydrate;
export const rebase = deckPlanForm.rebase;
export const edit = deckPlanForm.edit;
export const restore = deckPlanForm.restore;
export const isDirty = deckPlanForm.isDirty;
export { deckPlanForm };
