import { describe, expect, it } from 'vitest';
import { succeeds } from './succeeds';

describe('succeeds', () => {
  it('resolves true when the step resolves', async () => {
    await expect(succeeds(() => Promise.resolve('x'))).resolves.toBe(true);
  });

  it('resolves true for a synchronous or absent step', async () => {
    await expect(succeeds(() => undefined)).resolves.toBe(true);
  });

  it('resolves false when the step rejects', async () => {
    await expect(succeeds(() => Promise.reject(new Error('x')))).resolves.toBe(false);
  });

  it('resolves false when the step throws synchronously', async () => {
    await expect(
      succeeds(() => {
        throw new Error('x');
      })
    ).resolves.toBe(false);
  });
});
