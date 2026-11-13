// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ConfigContext, type Config } from '../../../contexts/configContext.ts';
import type { Vehicle } from '../types/vehicle.ts';
import VehicleSections from './VehicleSections.tsx';

// A WebGL shot has no place in jsdom: the frame is a stub that only says it was drawn.
vi.mock('../../../components/bus-picture/index.ts', () => ({
  BusPictureFrame: () => <div data-testid="bus-picture-frame" />,
  BusPicture: () => <div data-testid="bus-picture" />,
}));
vi.mock('../../vehicle-types/hooks/useVehicleTypes.ts', () => ({
  useVehicleTypes: () => ({ allData: [], loading: false, error: null, refetch: vi.fn() }),
}));

const renderSections = (config: Config) =>
  render(
    <ConfigContext.Provider value={config}>
      <MemoryRouter>
        <VehicleSections value={{} as Vehicle} onChange={vi.fn()} mode="view" />
      </MemoryRouter>
    </ConfigContext.Provider>
  );

describe('VehicleSections bus picture flag', () => {
  it('draws the picture when BusPictures is on', () => {
    renderSections({ sandboxFeatures: { BusPictures: true } });
    expect(screen.getByTestId('bus-picture-frame')).toBeTruthy();
  });

  it('draws no picture when BusPictures is off or missing', () => {
    const { unmount } = renderSections({ sandboxFeatures: { BusPictures: false } });
    expect(screen.queryByTestId('bus-picture-frame')).toBeNull();
    unmount();
    renderSections({});
    expect(screen.queryByTestId('bus-picture-frame')).toBeNull();
  });
});
