import { describe, it, expect } from 'vitest';
import { humanize } from './humanize.ts';

describe('humanize', () => {
  it('splits camelCase into a sentence-cased label', () => {
    expect(humanize('seatingCapacity')).toBe('Seating capacity');
  });
  it('capitalizes a single word', () => {
    expect(humanize('name')).toBe('Name');
  });
  it('splits trailing acronym runs', () => {
    expect(humanize('maximumEngineEffectKW')).toBe('Maximum engine effect kw');
  });
});
