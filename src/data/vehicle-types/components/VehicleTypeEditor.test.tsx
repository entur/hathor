// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VehicleTypeEditor from './VehicleTypeEditor.tsx';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

const mocks = vi.hoisted(() => ({
  fetchVehicleTypeById: vi.fn(),
  save: vi.fn(),
  deactivate: vi.fn(),
}));

vi.mock('../api/fetchVehicleTypes.ts', () => ({
  fetchVehicleTypeById: mocks.fetchVehicleTypeById,
}));
vi.mock('../hooks/useVehicleTypeSave.ts', () => ({
  useVehicleTypeSave: () => ({ save: mocks.save }),
}));
vi.mock('../hooks/useVehicleTypeDeactivate.ts', () => ({
  useVehicleTypeDeactivate: () => ({ deactivate: mocks.deactivate }),
}));
vi.mock('../../code-values/hooks/useCodeValues.ts', () => ({ useCodeValues: () => [] }));
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
// The real form is tabbed MUI with router links; a name field and the
// Low Floor flag are enough here.
vi.mock('./VehicleTypeForm.tsx', () => ({
  default: ({ value, onChange }: { value: VehicleType; onChange: (v: VehicleType) => void }) => (
    <>
      <input
        aria-label="name"
        value={value.name?.value ?? ''}
        onChange={e => onChange({ ...value, name: { value: e.target.value } })}
      />
      <button onClick={() => onChange({ ...value, lowFloor: false })}>low floor off</button>
      <span data-testid="form-identity">{`${value.id}|${value.version}`}</span>
    </>
  ),
}));

const ID = 'NMR:VehicleType:1',
  NEW_ID = 'NMR:VehicleType:99';
// `lowFloor` absent: a null-backed flag projects to `undefined`.
const stored: VehicleType = { id: ID, version: 1, name: { value: 'Type Alpha' } };

const NOT_FOUND = i18next.t('vehicleType.notFound'),
  STALE = i18next.t('common.saveRecordStale'),
  SAVED = i18next.t('vehicleType.saveSuccess');

const renderEditor = (id = ID, onCreated = vi.fn()) =>
  render(
    <VehicleTypeEditor
      id={id}
      onClose={vi.fn()}
      onCreated={onCreated}
      actions={api => (
        <>
          <button onClick={api.enterEdit} disabled={!api.enterEdit}>
            edit
          </button>
          <button onClick={() => void api.save()}>save</button>
          <button onClick={api.cancel}>cancel</button>
          <span data-testid="dirty">{String(api.isDirty)}</span>
        </>
      )}
    />
  );

/** Open the stored type, rename it and save; the next by-id fetch is `reload`. */
const saveWithReload = async (reload: () => Promise<VehicleType | null>) => {
  renderEditor();
  const name = await screen.findByLabelText('name');
  mocks.fetchVehicleTypeById.mockImplementationOnce(reload);
  fireEvent.click(screen.getByText('edit'));
  fireEvent.change(name, { target: { value: 'renamed' } });
  await act(async () => fireEvent.click(screen.getByText('save')));
};

describe('VehicleTypeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.save.mockResolvedValue({ newId: ID, error: null });
  });

  it('a failed first load shows the error, not not-found', async () => {
    mocks.fetchVehicleTypeById.mockRejectedValue(new Error('boom'));
    renderEditor();
    expect(await screen.findByText('boom')).toBeTruthy();
    expect(screen.queryByText(NOT_FOUND)).toBeNull();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('an empty first load shows not-found', async () => {
    mocks.fetchVehicleTypeById.mockResolvedValue(null);
    renderEditor();
    expect(await screen.findByText(NOT_FOUND)).toBeTruthy();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('a failed reload after save keeps the saved form with the stale warning', async () => {
    mocks.fetchVehicleTypeById.mockResolvedValueOnce(stored);
    await saveWithReload(() => Promise.reject(new Error('reload failed')));
    expect(await screen.findByText(STALE)).toBeTruthy();
    expect((screen.getByLabelText('name') as HTMLInputElement).value).toBe('renamed');
    expect(screen.getByTestId('dirty').textContent).toBe('false');
    expect(screen.queryByText('reload failed')).toBeNull();
    expect(screen.queryByText(SAVED)).toBeNull();
  });

  it('a record gone after its save shows not-found and still the stale warning', async () => {
    mocks.fetchVehicleTypeById.mockResolvedValueOnce(stored);
    await saveWithReload(() => Promise.resolve(null));
    expect(await screen.findByText(NOT_FOUND)).toBeTruthy();
    expect(screen.getByText(STALE)).toBeTruthy();
    expect(screen.queryByText(SAVED)).toBeNull();
  });

  it('a create bridges the new id at version 1, and Cancel keeps both', async () => {
    mocks.save.mockResolvedValue({ newId: NEW_ID, error: null });
    const onCreated = vi.fn();
    renderEditor(NEW_SELECTION, onCreated);
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Brand new' } });
    await act(async () => fireEvent.click(screen.getByText('save')));
    expect(onCreated).toHaveBeenCalledExactlyOnceWith(NEW_ID);

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.getByTestId('form-identity').textContent).toBe(`${NEW_ID}|1`);
    expect((screen.getByLabelText('name') as HTMLInputElement).value).toBe('Brand new');
    expect(screen.getByTestId('dirty').textContent).toBe('false');
  });

  it('a Low Floor off over an absent baseline flag is not dirty', async () => {
    mocks.fetchVehicleTypeById.mockResolvedValue(stored);
    renderEditor();
    await screen.findByLabelText('name');
    fireEvent.click(screen.getByText('edit'));
    fireEvent.click(screen.getByText('low floor off'));
    expect(screen.getByTestId('dirty').textContent).toBe('false');
    // The compare still sees real edits.
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'renamed' } });
    expect(screen.getByTestId('dirty').textContent).toBe('true');
  });
});
