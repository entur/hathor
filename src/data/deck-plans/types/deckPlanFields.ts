import type { FieldSpec, FilterFields } from '../../../components/collection/index.ts';
import type { Layout } from '../../../components/form-layout/index.ts';

/**
 * Field mapping of `DeckPlan`: field key → kind and path into the row. A key doubles
 * as its `deckPlans.field.<key>` label.
 */
export const deckPlanFields = {
  id: { kind: 'text', path: ['id'] },
  name: { kind: 'name', path: ['name'] },
  description: { kind: 'name', path: ['description'] },
} satisfies Record<string, FieldSpec>;

export type DeckPlanField = keyof typeof deckPlanFields;

/** Filter mapping: which fields filter, through which `DeckPlanFilter` argument. Its
 *  `transportModes` has no field on `DeckPlan`, so it is left out. */
export const deckPlanFilterFields = {
  id: { arg: 'netexIds', op: 'anyOf' },
  name: { arg: 'name', op: 'contains' },
} satisfies FilterFields;

/** The deck-plan form: one flat section (#287); the decks sit in column 3, the XML
 *  behind a button. The key is never shown — one section draws no heading. */
export const deckPlanLayout: Layout<DeckPlanField> = {
  deckPlan: ['name', 'description'],
};
