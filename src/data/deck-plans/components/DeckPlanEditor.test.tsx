// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeckPlanEditor from './DeckPlanEditor.tsx';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

const mocks = vi.hoisted(() => ({
  fetchDeckPlanById: vi.fn(),
  saveXml: vi.fn(),
  saveGQL: vi.fn(),
  deactivate: vi.fn(),
  refetchXml: vi.fn(),
  body: { xml: '<doc/>', loading: false, error: null as string | null },
}));

vi.mock('../api/fetchDeckPlans.ts', () => ({ fetchDeckPlanById: mocks.fetchDeckPlanById }));
vi.mock('../hooks/useDeckPlanSave.ts', () => ({
  useDeckPlanSave: () => ({ save: mocks.saveXml, saveGQL: mocks.saveGQL }),
}));
vi.mock('../hooks/useDeckPlanDeactivate.ts', () => ({
  useDeckPlanDeactivate: () => ({ deactivate: mocks.deactivate }),
}));
vi.mock('../hooks/useDeckPlanXml.ts', () => ({
  useDeckPlanXml: () => ({ ...mocks.body, refetch: mocks.refetchXml }),
}));
// The document patch is unit-tested on its own; here it only tags the body.
vi.mock('../utils/patchDeckPlanXml.ts', () => ({
  patchDeckPlanXml: (xml: string, id: string, name?: { value?: string }) =>
    `${xml}|${id}|${name?.value ?? ''}`,
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
// The real form is tabbed MUI with the deck renderer; a name field is enough.
vi.mock('./DeckPlanForm.tsx', () => ({
  default: ({ value, onChange }: { value: DeckPlan; onChange: (v: DeckPlan) => void }) => (
    <>
      <input
        aria-label="name"
        value={value.name?.value ?? ''}
        onChange={e => onChange({ ...value, name: { value: e.target.value } })}
      />
      <span data-testid="form-id">{value.id}</span>
    </>
  ),
}));

const ID = 'NMR:DeckPlan:5',
  NEW_ID = 'NMR:DeckPlan:99';
// Sobek re-pads `<Text>` on serialize (sobek#180).
const stored: DeckPlan = { id: ID, version: 2, name: { value: '\n  Plan Alpha\n  ' } };

const NOT_FOUND = i18next.t('deckPlans.notFound'),
  STALE = i18next.t('common.saveRecordStale'),
  SAVED = i18next.t('deckPlans.saveSuccess');

const actions = (api: Parameters<React.ComponentProps<typeof DeckPlanEditor>['actions']>[0]) => (
  <>
    <button onClick={api.enterEdit} disabled={!api.enterEdit}>
      edit
    </button>
    <button onClick={() => void api.save()}>save</button>
    <button onClick={api.cancel}>cancel</button>
    <span data-testid="dirty">{String(api.isDirty)}</span>
    <span data-testid="can-submit">{String(api.canSubmit)}</span>
  </>
);

const renderEditor = (id = ID, onCreated = vi.fn()) => {
  const props = { id, onClose: vi.fn(), onCreated, actions };
  const view = render(<DeckPlanEditor {...props} />);
  return { ...view, rerender: () => view.rerender(<DeckPlanEditor {...props} />) };
};

const nameInput = () => screen.getByLabelText('name') as HTMLInputElement;

/** Open the stored plan and rename it (edit mode, dirty). */
const openAndRename = async (value = 'renamed') => {
  const view = renderEditor();
  await screen.findByLabelText('name');
  fireEvent.click(screen.getByText('edit'));
  fireEvent.change(nameInput(), { target: { value } });
  return view;
};

describe('DeckPlanEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.body = { xml: '<doc/>', loading: false, error: null };
    mocks.saveXml.mockResolvedValue({ error: null });
    mocks.saveGQL.mockResolvedValue({ newId: NEW_ID, error: null });
  });

  it('a failed first load shows the error, not not-found', async () => {
    mocks.fetchDeckPlanById.mockRejectedValue(new Error('boom'));
    renderEditor();
    expect(await screen.findByText('boom')).toBeTruthy();
    expect(screen.queryByText(NOT_FOUND)).toBeNull();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('an empty first load shows not-found', async () => {
    mocks.fetchDeckPlanById.mockResolvedValue(null);
    renderEditor();
    expect(await screen.findByText(NOT_FOUND)).toBeTruthy();
    expect(screen.queryByLabelText('name')).toBeNull();
  });

  it('hydrates a padded record trimmed and clean', async () => {
    mocks.fetchDeckPlanById.mockResolvedValue(stored);
    renderEditor();
    expect(await screen.findByDisplayValue('Plan Alpha')).toBe(nameInput());
    expect(screen.getByTestId('dirty').textContent).toBe('false');
  });

  it('an edit save POSTs the patched body, then re-pulls it and reloads the record', async () => {
    mocks.fetchDeckPlanById.mockResolvedValue(stored);
    await openAndRename();
    mocks.fetchDeckPlanById.mockResolvedValueOnce({ ...stored, name: { value: 'renamed' } });
    await act(async () => fireEvent.click(screen.getByText('save')));

    expect(mocks.saveXml).toHaveBeenCalledExactlyOnceWith(`<doc/>|${ID}|renamed`);
    expect(mocks.saveGQL).not.toHaveBeenCalled();
    expect(mocks.refetchXml).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(SAVED)).toBeTruthy();
    expect(nameInput().value).toBe('renamed');
    expect(screen.getByTestId('dirty').textContent).toBe('false');
  });

  it('a failed edit save keeps the edit and does not re-pull the body', async () => {
    mocks.fetchDeckPlanById.mockResolvedValue(stored);
    mocks.saveXml.mockResolvedValue({ error: 'import rejected' });
    await openAndRename();
    await act(async () => fireEvent.click(screen.getByText('save')));

    expect(await screen.findByText('import rejected')).toBeTruthy();
    expect(mocks.refetchXml).not.toHaveBeenCalled();
    expect(screen.getByTestId('dirty').textContent).toBe('true');
  });

  it('a failed reload after save keeps the saved form with the stale warning', async () => {
    mocks.fetchDeckPlanById.mockResolvedValueOnce(stored);
    await openAndRename();
    mocks.fetchDeckPlanById.mockRejectedValueOnce(new Error('reload failed'));
    await act(async () => fireEvent.click(screen.getByText('save')));

    expect(await screen.findByText(STALE)).toBeTruthy();
    expect(nameInput().value).toBe('renamed');
    expect(screen.getByTestId('dirty').textContent).toBe('false');
    expect(screen.queryByText('reload failed')).toBeNull();
    expect(screen.queryByText(SAVED)).toBeNull();
  });

  describe('canSubmit', () => {
    it('an edit needs a loaded, current XML body', async () => {
      mocks.fetchDeckPlanById.mockResolvedValue(stored);
      mocks.body = { xml: '', loading: true, error: null };
      const view = renderEditor();
      await screen.findByLabelText('name');
      const canSubmit = () => screen.getByTestId('can-submit').textContent;
      expect(canSubmit()).toBe('false');

      mocks.body = { xml: '', loading: false, error: null };
      view.rerender();
      expect(canSubmit()).toBe('false');

      mocks.body = { xml: '<doc/>', loading: false, error: null };
      view.rerender();
      expect(canSubmit()).toBe('true');

      // A failed re-pull leaves the stale pre-save body in place: still blocked.
      mocks.body = { xml: '<doc/>', loading: false, error: 'body fetch failed' };
      view.rerender();
      expect(canSubmit()).toBe('false');
    });

    it('a create has no body and may always submit', () => {
      mocks.body = { xml: '', loading: false, error: null };
      renderEditor(NEW_SELECTION);
      expect(screen.getByTestId('can-submit').textContent).toBe('true');
    });
  });

  it('a create saves via GQL, advances, and Cancel keeps the new id', async () => {
    const onCreated = vi.fn();
    renderEditor(NEW_SELECTION, onCreated);
    // A create opens in edit.
    fireEvent.change(nameInput(), { target: { value: '  Brand New Plan  ' } });
    await act(async () => fireEvent.click(screen.getByText('save')));

    expect(mocks.saveGQL).toHaveBeenCalledExactlyOnceWith({
      id: '',
      name: { value: '  Brand New Plan  ' },
    });
    expect(mocks.saveXml).not.toHaveBeenCalled();
    expect(mocks.refetchXml).not.toHaveBeenCalled();
    expect(onCreated).toHaveBeenCalledExactlyOnceWith(NEW_ID);

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.getByTestId('form-id').textContent).toBe(NEW_ID);
    expect(nameInput().value).toBe('Brand New Plan');
  });
});
