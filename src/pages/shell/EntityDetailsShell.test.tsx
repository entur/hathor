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
  const Where = () => <output data-testid="where">{useLocation().pathname}</output>;
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

  it('maps `new` to the create pane in edit mode', () => {
    const { last } = renderAt(`${LIST}/new`);
    expect(last()).toMatchObject({ id: '', initialMode: 'edit' });
  });

  it('opens a deep-linked record in view mode', () => {
    const { last } = renderAt(`${LIST}/NMR:VehicleType:1`);
    expect(last()).toMatchObject({ id: 'NMR:VehicleType:1', initialMode: 'view' });
  });

  it('opens in edit mode when the link asks for it', () => {
    const { last } = renderAt({
      pathname: `${LIST}/NMR:VehicleType:1`,
      state: { initialMode: 'edit' },
    });
    expect(last()).toMatchObject({ id: 'NMR:VehicleType:1', initialMode: 'edit' });
  });

  it('onClose navigates to the list', () => {
    renderAt(`${LIST}/NMR:VehicleType:1`);
    fireEvent.click(screen.getByText('close'));
    expect(screen.getByTestId('where').textContent).toBe(LIST);
  });

  it('onCreated replaces the create URL with the new id', () => {
    const { last } = renderAt(`${LIST}/new`);
    fireEvent.click(screen.getByText('created'));
    expect(screen.getAllByTestId('where')[0].textContent).toBe(
      `${LIST}/${encodeURIComponent(MINTED_ID)}`
    );
    expect(last()).toMatchObject({ id: MINTED_ID, initialMode: 'view' });
  });
});
