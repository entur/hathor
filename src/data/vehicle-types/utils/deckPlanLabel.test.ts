import { describe, it, expect } from 'vitest';
import { deckPlanLabel } from './deckPlanLabel.ts';

describe('deckPlanLabel', () => {
  it('returns the deck-plan name when present', () => {
    expect(deckPlanLabel({ id: 'NMR:DeckPlan:1', name: { value: 'Plan A' } })).toBe('Plan A');
  });

  it('falls back to (netexId) when the name is empty or whitespace (sobek#121)', () => {
    expect(deckPlanLabel({ id: 'NMR:DeckPlan:8', name: { value: '\n   ' } })).toBe(
      '(NMR:DeckPlan:8)'
    );
    expect(deckPlanLabel({ id: 'NMR:DeckPlan:8', name: { value: '' } })).toBe('(NMR:DeckPlan:8)');
    expect(deckPlanLabel({ id: 'NMR:DeckPlan:8' })).toBe('(NMR:DeckPlan:8)');
  });

  it('is empty when there is no deck plan', () => {
    expect(deckPlanLabel(undefined)).toBe('');
  });
});
