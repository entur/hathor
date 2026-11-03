// @vitest-environment jsdom
/**
 * The pager under both views, after Linje's `Pagination` (@entur/menu): one
 * <nav> with the rows shown and a rows-per-page menu, then the page buttons.
 */
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { DEFAULT_LABELS } from '../types.ts';
import { CollectionPager } from './CollectionPager.tsx';

const mount = (total: number, page: number, pageSize = 10) => {
  const onQuery = vi.fn();
  render(
    <CollectionPager
      total={total}
      page={page}
      pageSize={pageSize}
      onQuery={onQuery}
      labels={DEFAULT_LABELS}
    />
  );
  return onQuery;
};
/** The page entries in order: numbers and ellipses (the arrows hold only an icon). */
const entries = (): string[] =>
  Array.from(screen.getByRole('button', { name: 'Go to previous page' }).parentElement!.children)
    .map(e => e.textContent ?? '')
    .filter(Boolean);

describe('CollectionPager', () => {
  it('says which rows show, and of how many', () => {
    mount(120, 1, 25);
    expect(screen.getByRole('navigation', { name: 'Pagination' }).textContent).toContain(
      'Showing rows 26–50 of 120'
    );
  });

  it.each([
    [0, ['1', '2', '3', '4', '5', '…', '100']],
    [49, ['1', '…', '49', '50', '51', '…', '100']],
    [98, ['1', '…', '96', '97', '98', '99', '100']],
  ])('lists the pages as Linje does (page index %i)', (page, want) => {
    mount(1000, page);
    expect(entries()).toEqual(want);
  });

  it('lists every page up to seven', () => {
    mount(70, 0);
    expect(entries()).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('marks the current page, and stops at the ends', () => {
    mount(50, 0);
    const current = screen.getByRole('button', { name: 'Go to page 1' });
    expect(current.getAttribute('aria-current')).toBe('page');
    expect((current as HTMLButtonElement).disabled).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'Go to previous page' }) as HTMLButtonElement).disabled
    ).toBe(true);
    expect(screen.getByRole('button', { name: 'Go to page 5, last page' })).toBeTruthy();
  });

  it('emits the page picked, by number or arrow', () => {
    const onQuery = mount(50, 1);
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onQuery.mock.calls).toEqual([[{ page: 3 }], [{ page: 2 }]]);
  });

  it('changes the rows per page from its menu', () => {
    const onQuery = mount(120, 0, 25);
    fireEvent.click(screen.getByRole('button', { name: '25 rows per page, change' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: '10' }));
    expect(onQuery).toHaveBeenCalledWith({ pageSize: 10 });
  });

  it('shows nothing when there are no rows', () => {
    mount(0, 0);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
