// @vitest-environment jsdom
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { FieldSpec } from '../types.ts';
import { DEFAULT_LABELS, defaultCollectionQuery, type CollectionQuery } from '../types.ts';
import { resolveColumns } from '../utils/columns.ts';
import { QueryField } from './QueryField.tsx';

const FIELDS: Record<string, FieldSpec> = {
  netexId: { kind: 'text', path: ['netexId'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'], options: ['bus', 'rail', 'tram'] },
  length: { kind: 'number', path: ['length'] },
};
const COLS = resolveColumns(FIELDS);
const FF = {
  netexId: { arg: 'netexIds', op: 'anyOf' },
  name: { arg: 'name', op: 'contains' },
  transportMode: { arg: 'transportModes', op: 'anyOf' },
} as const;

/** Render a query field; `rerender` swaps in a new query, as a host echoing `onQuery` would. */
const mountField = (
  over: { search?: boolean; filter?: boolean; query?: Partial<CollectionQuery> } = {}
) => {
  const onQuery = vi.fn();
  const field = (query: Partial<CollectionQuery>) => (
    <QueryField
      search={over.search ?? true}
      filter={over.filter ?? true}
      columns={COLS}
      filterFields={FF}
      query={{ ...defaultCollectionQuery, ...query }}
      onQuery={onQuery}
      labels={DEFAULT_LABELS}
    />
  );
  const { rerender } = render(field(over.query ?? {}));
  return { onQuery, rerender: (query: Partial<CollectionQuery>) => rerender(field(query)) };
};

const mount = (over: Parameters<typeof mountField>[0] = {}) => mountField(over).onQuery;

const field = (): HTMLElement =>
  screen.getByRole('textbox', { name: 'Search' }).closest('.MuiInputBase-root') as HTMLElement;

describe('QueryField', () => {
  it('says what the search covers in its placeholder, with no caption beneath', () => {
    mount();
    expect(screen.getByRole('textbox', { name: 'Search' }).getAttribute('placeholder')).toBe(
      'Search these rows'
    );
    expect(document.querySelector('.MuiFormHelperText-root')).toBeNull();
  });

  it('reports typing as a search patch', () => {
    const onQuery = mount();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'fli' } });
    expect(onQuery).toHaveBeenCalledWith({ search: 'fli' });
  });

  it('carries active filters inside the search field, ahead of the text', () => {
    mount({ query: { filters: { name: 'fli' } } });
    const tokens = within(field()).getByRole('group', { name: 'Active filters' });
    expect(within(tokens).getByText('Name: fli')).toBeTruthy();
    expect(
      tokens.compareDocumentPosition(screen.getByRole('textbox', { name: 'Search' })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('puts the filter button inside the field and counts active filters on it', () => {
    mount({ query: { filters: { name: 'fli', transportMode: ['rail'] } } });
    const button = within(field()).getByRole('button', { name: 'Filters' });
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(within(button.parentElement as HTMLElement).getByText('2')).toBeTruthy();
  });

  it('opens the filter panel from the button', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    // The open popover hides its siblings from the accessibility tree.
    expect(
      screen.getByRole('button', { name: 'Filters', hidden: true }).getAttribute('aria-expanded')
    ).toBe('true');
  });

  it('shows at most two filters and folds the rest into a +N chip that opens the panel', () => {
    mount({ query: { filters: { netexId: ['T:1'], name: 'fli', transportMode: ['rail'] } } });
    const tokens = screen.getByRole('group', { name: 'Active filters' });
    expect(within(tokens).getByText('Id: ::1')).toBeTruthy();
    expect(within(tokens).getByText('Name: fli')).toBeTruthy();
    expect(within(tokens).queryByText(/Transport mode/)).toBeNull();
    fireEvent.click(within(tokens).getByRole('button', { name: '1 more filter' }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });

  it('captions an id filter "Id" and compacts its values, full ids on hover', () => {
    mount({ query: { filters: { netexId: ['VEH:VehicleType:1004', 'VEH:VehicleType:7'] } } });
    const chip = screen.getByText(/^Id: /).closest('.MuiChip-root') as HTMLElement;
    expect(chip.textContent).toBe('Id: ::1004, ::7');
    expect(chip.getAttribute('title')).toBe('Id: VEH:VehicleType:1004, VEH:VehicleType:7');
  });

  it('shows a typed bare number in the same ::NUM form as a full id', () => {
    mount({ query: { filters: { netexId: ['1004', 'VEH:VehicleType:7'] } } });
    expect(screen.getByText(/^Id: /).closest('.MuiChip-root')?.textContent).toBe('Id: ::1004, ::7');
  });

  it('shows compact id tags inside the filter panel', () => {
    mount({ query: { filters: { netexId: ['VEH:VehicleType:1004'] } } });
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const panel = screen.getByRole('dialog', { name: 'Filters' });
    expect(within(panel).getByRole('combobox', { name: 'Id' })).toBeTruthy();
    expect(within(panel).getByText('::1004')).toBeTruthy();
  });

  describe('on a narrow screen', () => {
    // MUI's useMediaQuery reads window.matchMedia; jsdom has none, so stub a
    // phone-width screen: every max-width query matches.
    const real = window.matchMedia;
    beforeEach(() => {
      window.matchMedia = ((query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })) as typeof window.matchMedia;
    });
    afterEach(() => {
      window.matchMedia = real;
    });

    it('shows one filter chip and folds the rest into +N', () => {
      mount({ query: { filters: { name: 'fli', transportMode: ['rail'] } } });
      const tokens = screen.getByRole('group', { name: 'Active filters' });
      expect(within(tokens).getByText('Name: fli')).toBeTruthy();
      expect(within(tokens).queryByText(/Transport mode/)).toBeNull();
      expect(within(tokens).getByRole('button', { name: '1 more filter' })).toBeTruthy();
    });
  });

  it('shortens a long filter value and keeps the full text on hover', () => {
    mount({ query: { filters: { transportMode: ['bus', 'rail', 'tram'] } } });
    const chip = screen.getByText(/^Transport mode: /).closest('.MuiChip-root') as HTMLElement;
    expect(chip.textContent).toBe('Transport mode: bus, rail, tr…');
    expect(chip.getAttribute('title')).toBe('Transport mode: bus, rail, tram');
  });

  it('says on each chip that it removes the filter, keeping the visible text in the name', () => {
    mount({ query: { filters: { name: 'fli' } } });
    const chip = within(screen.getByRole('group', { name: 'Active filters' })).getByRole('button', {
      name: /Name: fli/,
    });
    expect(chip.getAttribute('aria-label')).toBe('Name: fli, remove filter');
  });

  it('moves focus to the next chip after one is removed from the keyboard', () => {
    const { onQuery, rerender } = mountField({
      query: { filters: { name: 'fli', transportMode: ['rail'] } },
    });
    const first = screen.getByRole('button', { name: 'Name: fli, remove filter' });
    first.focus();
    fireEvent.keyUp(first, { key: 'Backspace' });
    expect(onQuery).toHaveBeenCalledWith({ filters: { transportMode: ['rail'] } });
    rerender({ filters: { transportMode: ['rail'] } });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Transport mode: rail, remove filter' })
    );
  });

  it('moves focus to a folded chip that becomes visible when a shown one is removed', () => {
    const { rerender } = mountField({
      query: { filters: { netexId: ['T:1'], name: 'fli', transportMode: ['rail'] } },
    });
    const second = screen.getByRole('button', { name: 'Name: fli, remove filter' });
    second.focus();
    fireEvent.keyUp(second, { key: 'Backspace' });
    rerender({ filters: { netexId: ['T:1'], transportMode: ['rail'] } });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Transport mode: rail, remove filter' })
    );
  });

  it('moves focus to the search field when the last chip is removed', () => {
    const { rerender } = mountField({ query: { filters: { name: 'fli' } } });
    const chip = screen.getByRole('button', { name: 'Name: fli, remove filter' });
    chip.focus();
    fireEvent.keyUp(chip, { key: 'Delete' });
    rerender({});
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Search' }));
  });

  it('removes a filter from its chip', () => {
    const onQuery = mount({ query: { filters: { name: 'fli', transportMode: ['rail'] } } });
    const chip = screen.getByText('Name: fli').closest('.MuiChip-root') as HTMLElement;
    fireEvent.click(chip.querySelector('.MuiChip-deleteIcon') as Element);
    expect(onQuery).toHaveBeenCalledWith({ filters: { transportMode: ['rail'] } });
  });

  it('removes the last filter on Backspace in an empty field, and only then', () => {
    const onQuery = mount({ query: { filters: { name: 'fli', transportMode: ['rail'] } } });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search' }), { key: 'Backspace' });
    expect(onQuery).toHaveBeenCalledWith({ filters: { name: 'fli' } });
  });

  it('leaves the filters alone on Backspace while text remains', () => {
    const onQuery = mount({ query: { search: 'x', filters: { name: 'fli' } } });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search' }), { key: 'Backspace' });
    expect(onQuery).not.toHaveBeenCalled();
  });

  it('commits a typed id when the id field loses focus, not only on Enter', () => {
    const onQuery = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const ids = within(screen.getByRole('dialog', { name: 'Filters' })).getByRole('combobox', {
      name: 'Id',
    });
    fireEvent.change(ids, { target: { value: 'T:1' } });
    fireEvent.blur(ids);
    expect(onQuery).toHaveBeenCalledWith({ filters: { netexId: ['T:1'] } });
  });

  it('trims a typed id before it becomes a filter', () => {
    const onQuery = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const ids = within(screen.getByRole('dialog', { name: 'Filters' })).getByRole('combobox', {
      name: 'Id',
    });
    fireEvent.change(ids, { target: { value: '  T:1 ' } });
    fireEvent.keyDown(ids, { key: 'Enter' });
    expect(onQuery).toHaveBeenCalledWith({ filters: { netexId: ['T:1'] } });
  });

  it('shows no chip for an empty condition', () => {
    mount({ query: { filters: { name: '  ', transportMode: [] } } });
    expect(screen.queryByRole('group', { name: 'Active filters' })).toBeNull();
  });

  it('is a plain search field when filtering is trimmed away', () => {
    mount({ filter: false, query: { filters: { name: 'fli' } } });
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Filters' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Active filters' })).toBeNull();
  });

  it('keeps the filter button and its chips on one row when search is trimmed away', () => {
    mount({ search: false, query: { filters: { name: 'fli' } } });
    expect(screen.queryByRole('textbox', { name: 'Search' })).toBeNull();
    const button = screen.getByRole('button', { name: 'Filters' });
    const tokens = screen.getByRole('group', { name: 'Active filters' });
    expect(button.closest('[data-query-field]')).toBe(tokens.closest('[data-query-field]'));
    expect(button.closest('[data-query-field]')).not.toBeNull();
  });

  it('renders nothing with both tools trimmed', () => {
    const { container } = render(
      <QueryField
        search={false}
        filter={false}
        columns={COLS}
        filterFields={FF}
        query={defaultCollectionQuery}
        onQuery={vi.fn()}
        labels={DEFAULT_LABELS}
      />
    );
    expect(container.innerHTML).toBe('');
  });
});
