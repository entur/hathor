// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import EntityDetailsShell from './EntityDetailsShell.tsx';
import type { EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';

vi.mock('../../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: { id: 'ORG' } }),
}));

const LIST = '/x';
const MINTED_ID = 'NMR:VehicleType:9';

/** Render the shell at `entry`; the spy editor exposes the host it got. */
function renderAt(entry: string | { pathname: string; state: unknown }) {
  const hosts: EntityEditorHostProps[] = [];
  const Where = () => {
    const { pathname, state } = useLocation();
    return (
      <output data-testid="where" data-state={JSON.stringify(state)}>
        {pathname}
      </output>
    );
  };
  render(
    <MemoryRouter initialEntries={[LIST, entry]} initialIndex={1}>
      <Routes>
        <Route path={LIST} element={<Where />} />
        <Route
          path={`${LIST}/:id`}
          element={
            <>
              <Where />
              <EntityDetailsShell
                listPath={LIST}
                renderEditor={host => {
                  hosts.push(host);
                  return (
                    <>
                      <button onClick={host.onClose}>close</button>
                      <button onClick={() => host.onCreated(MINTED_ID)}>created</button>
                    </>
                  );
                }}
              />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
  return { last: () => hosts[hosts.length - 1] };
}

describe('EntityDetailsShell', () => {
  afterEach(cleanup);

  it('maps `new` to the create pane, edit-only', () => {
    const { last } = renderAt(`${LIST}/new`);
    expect(last()).toMatchObject({ id: '', editOnly: true });
  });

  it('opens a deep-linked record edit-only too: a form page has no View (#282)', () => {
    const { last } = renderAt(`${LIST}/NMR:VehicleType:1`);
    expect(last()).toMatchObject({ id: 'NMR:VehicleType:1', editOnly: true });
  });

  it('onClose navigates to the list', () => {
    renderAt(`${LIST}/NMR:VehicleType:1`);
    fireEvent.click(screen.getByText('close'));
    expect(screen.getByTestId('where').textContent).toBe(LIST);
  });

  it('closing the create pane asks the list to refocus New', () => {
    renderAt(`${LIST}/new`);
    fireEvent.click(screen.getByText('close'));
    expect(JSON.parse(screen.getByTestId('where').dataset.state!)).toEqual({
      focusEditId: 'new',
    });
  });

  it('onCreated replaces the create URL with the new id and hands its editor the saved toast', () => {
    const { last } = renderAt(`${LIST}/new`);
    fireEvent.click(screen.getByText('created'));
    expect(screen.getAllByTestId('where')[0].textContent).toBe(
      `${LIST}/${encodeURIComponent(MINTED_ID)}`
    );
    expect(last()).toMatchObject({ id: MINTED_ID, editOnly: true, initialSaved: true });
  });
});
