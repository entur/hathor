// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CollectionShell from './CollectionShell.tsx';

const ID = 'NMR:VehicleType:1';

/** The shell over one Edit link, arrived at with `focusEditId` = {@link ID}. */
const tree = (loading: boolean) => (
  <MemoryRouter initialEntries={[{ pathname: '/x', state: { focusEditId: ID } }]}>
    <CollectionShell titleKey="title" loading={loading} error={null}>
      <a href="#e" data-edit-id={ID}>
        Edit
      </a>
    </CollectionShell>
  </MemoryRouter>
);

describe('CollectionShell focus return (#291)', () => {
  // jsdom has no CSS.escape; the id here needs none.
  beforeAll(() => vi.stubGlobal('CSS', { escape: (s: string) => s }));
  afterEach(cleanup);

  it('focuses the Edit link on arrival, and not again after a later load', () => {
    const { rerender } = render(tree(false));
    expect(document.activeElement).toBe(screen.getByRole('link'));

    // The reader moves on; a refetch swaps the list out and back in.
    screen.getByRole('heading').focus();
    (document.activeElement as HTMLElement).blur();
    rerender(tree(true));
    rerender(tree(false));
    expect(document.activeElement).toBe(document.body);
  });

  it('leaves focus where the reader put it while the list loaded', () => {
    const { rerender } = render(tree(true));
    screen.getByRole('heading').focus();
    rerender(tree(false));
    expect(document.activeElement).toBe(screen.getByRole('heading'));
  });
});
