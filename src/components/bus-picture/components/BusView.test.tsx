// @vitest-environment jsdom
/** What BusView draws as text takes no shot: no queue, no package load, no WebGL context. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BusView, type BusViewProps } from './BusView.tsx';

const shots = vi.hoisted(() => ({
  holdBusShot: vi.fn(() => ({ url: new Promise<string>(() => undefined), release: vi.fn() })),
}));
vi.mock('../utils/busShots.ts', async real => ({
  ...(await real<typeof import('../utils/busShots.ts')>()),
  ...shots,
}));

const DIMS = { length: 12, width: 2.55, height: 3.2 };

describe('BusView', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each<[string, Partial<BusViewProps>]>([
    ['a placeholder', { placeholder: 'Select type' }],
    ['a mode not drawn', { mode: 'RAIL' }],
  ])('takes no shot for %s', (_name, props) => {
    render(<BusView dims={DIMS} paint="vehicleType" {...props} />);
    expect(screen.queryByTestId('bus-view')).toBeNull();
    expect(shots.holdBusShot).not.toHaveBeenCalled();
  });

  it('says so when the shot fails, and takes no second one', async () => {
    shots.holdBusShot.mockReturnValueOnce({
      url: Promise.reject(new Error('no WebGL')),
      release: vi.fn(),
    });
    render(<BusView dims={DIMS} paint="vehicleType" />);
    expect(await screen.findByText('Picture unavailable')).toBeTruthy();
    expect(shots.holdBusShot).toHaveBeenCalledTimes(1);
  });

  it('takes the shot for a bus', () => {
    render(<BusView dims={DIMS} paint="vehicleType" mode="BUS" />);
    expect(screen.getByTestId('bus-view')).toBeTruthy();
    expect(shots.holdBusShot).toHaveBeenCalledTimes(1);
  });
});
