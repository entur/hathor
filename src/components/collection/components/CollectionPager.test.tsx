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
    const onQuery = mount(50, 0);
    const current = screen.getByRole('button', { name: 'Go to page 1' });
    expect(current.getAttribute('aria-current')).toBe('page');
    const previous = screen.getByRole('button', { name: 'Go to previous page' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(current);
    fireEvent.click(previous);
    expect(onQuery).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Go to page 5, last page' })).toBeTruthy();
  });

  it('emits the page picked, by number or arrow', () => {
    const onQuery = mount(50, 1);
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onQuery.mock.calls).toEqual([[{ page: 3 }], [{ page: 2 }]]);
  });

  // Browsers blur a button that turns disabled (jsdom does not): no pager button ever
  // does, and each keeps its node across the re-render, so focus stays put.
  it('keeps focus on a page button, or Next, once it reaches its end', () => {
    const onQuery = vi.fn();
    const pager = (page: number) => (
      <CollectionPager
        total={50}
        page={page}
        pageSize={10}
        onQuery={onQuery}
        labels={DEFAULT_LABELS}
      />
    );
    const { rerender } = render(pager(0));
    const third = screen.getByRole('button', { name: 'Go to page 3' });
    third.focus();
    fireEvent.click(third);
    rerender(pager(onQuery.mock.calls[0][0].page));
    expect(third.getAttribute('aria-current')).toBe('page');
    expect((third as HTMLButtonElement).disabled).toBe(false);
    expect(document.activeElement).toBe(third);

    rerender(pager(3));
    const next = screen.getByRole('button', { name: 'Go to next page' });
    next.focus();
    fireEvent.click(next);
    rerender(pager(onQuery.mock.calls[1][0].page));
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect((next as HTMLButtonElement).disabled).toBe(false);
    expect(document.activeElement).toBe(next);
  });

  it('keeps the page when the current size is picked again', () => {
    const onQuery = mount(120, 2, 25);
    fireEvent.click(screen.getByRole('button', { name: '25 rows per page, change' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: '25' }));
    expect(onQuery).not.toHaveBeenCalled();
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
