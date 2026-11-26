import { describe, it, expect } from 'vitest';
import { over } from './colorOver.ts';

describe('over', () => {
  it('composites a translucent colour over an opaque one', () => {
    expect(over('#ffffff', 'rgba(0, 0, 0, 0.5)')).toBe('rgb(128, 128, 128)');
  });

  it('keeps an opaque colour as it is', () => {
    expect(over('#ffffff', '#aeb7e2')).toBe('rgb(174, 183, 226)');
  });

  it('reads hsl() as a colour, not as r, g, b', () => {
    expect(over('#000000', 'hsl(0, 100%, 50%)')).toBe('rgb(255, 0, 0)');
  });

  it('passes a colour it cannot parse through instead of throwing', () => {
    expect(over('#ffffff', 'transparent')).toBe('transparent');
    expect(over('var(--paper)', 'rgba(0, 0, 0, 0.04)')).toBe('rgba(0, 0, 0, 0.04)');
  });
});
