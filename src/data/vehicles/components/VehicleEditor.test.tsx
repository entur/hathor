// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VehicleEditor from './VehicleEditor.tsx';
import type { Vehicle } from '../types/vehicle.ts';

const mocks = vi.hoisted(() => ({
  fetchVehicleById: vi.fn(),
  save: vi.fn(),
  deactivate: vi.fn(),
}));

vi.mock('../api/fetchVehicles.ts', () => ({ fetchVehicleById: mocks.fetchVehicleById }));
vi.mock('../hooks/useVehiclePairSave.ts', () => ({
  useVehiclePairSave: () => ({ save: mocks.save }),
}));
vi.mock('../hooks/useVehicleDeactivate.ts', () => ({
  useVehicleDeactivate: () => ({ deactivate: mocks.deactivate }),
}));
vi.mock('../../../contexts/configContext.ts', () => ({
  useConfig: () => ({ applicationBaseUrl: 'http://sobek.test/' }),
}));
vi.mock('../../../auth/authUtils.ts', async importOriginal => ({
  ...(await importOriginal<typeof import('../../../auth/authUtils.ts')>()),
  useAuth: () => ({ getAccessToken: async () => 'token' }),
}));
vi.mock('../../../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: { id: 'NMR:Authority:1' } }),
}));
// The real form pulls the VehicleType picker's list; a name field is enough here.
vi.mock('./VehicleEditForm.tsx', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: { vehicle: Vehicle };
    onChange: (v: { vehicle: Vehicle }) => void;
  }) => (
    <input
      aria-label="name"
      value={value.vehicle.name?.value ?? ''}
      onChange={e => onChange({ vehicle: { ...value.vehicle, name: { value: e.target.value } } })}
    />
  ),
}));

const ID = 'NMR:Vehicle:1';
const stored: Vehicle = { id: ID, version: 1, name: { value: 'Oslo Tram 4' } };

const NOT_FOUND = i18next.t('vehicles.notFound'),
  STALE = i18next.t('common.saveRecordStale'),
  SAVED = i18next.t('vehicles.saveSuccess');

const renderEditor = () =>
  render(
    <VehicleEditor
      id={ID}
      onClose={vi.fn()}
      onCreated={vi.fn()}
      actions={api => (
        <>
          <button onClick={api.enterEdit} disabled={!api.enterEdit}>
            edit
          </button>
          <button onClick={() => void api.save()}>save</button>
        </>
      )}
    />
  );

/** Open the stored vehicle, rename it and save; the next by-id fetch is `reload`. */
const saveWithReload = async (reload: () => Promise<Vehicle | null>) => {
  renderEditor();
  const name = await screen.findByLabelText('name');
  mocks.fetchVehicleById.mockImplementationOnce(reload);
  fireEvent.click(screen.getByText('edit'));
  fireEvent.change(name, { target: { value: 'renamed' } });
  await act(async () => fireEvent.click(screen.getByText('save')));
};

describe('VehicleEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.save.mockResolvedValue({ newId: ID, error: null });
  });

  it('a failed first load shows the error, not not-found', async () => {
    mocks.fetchVehicleById.mockRejectedValue(new Error('boom'));
    renderEditor();
    expect(await screen.findByText('boom')).toBeTruthy();
    expect(screen.queryByText(NOT_FOUND)).toBeNull();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('an empty first load shows not-found', async () => {
    mocks.fetchVehicleById.mockResolvedValue(null);
    renderEditor();
    expect(await screen.findByText(NOT_FOUND)).toBeTruthy();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('a failed reload after save keeps the saved form with the stale warning', async () => {
    mocks.fetchVehicleById.mockResolvedValueOnce(stored);
    await saveWithReload(() => Promise.reject(new Error('reload failed')));
    expect(await screen.findByText(STALE)).toBeTruthy();
    expect((screen.getByLabelText('name') as HTMLInputElement).value).toBe('renamed');
    expect(screen.queryByText('reload failed')).toBeNull();
    expect(screen.queryByText(SAVED)).toBeNull();
  });

  it('a record gone after its save shows not-found and still the stale warning', async () => {
    mocks.fetchVehicleById.mockResolvedValueOnce(stored);
    await saveWithReload(() => Promise.resolve(null));
    expect(await screen.findByText(NOT_FOUND)).toBeTruthy();
    expect(screen.getByText(STALE)).toBeTruthy();
    expect(screen.queryByText(SAVED)).toBeNull();
  });
});
