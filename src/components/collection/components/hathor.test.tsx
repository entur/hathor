// @vitest-environment jsdom
/**
 * Hathor's deviations from the sandbox collection (#261): the identity under
 * `id`, a field's `render`, the muted identity, the Edit link per record and
 * `aria-sort` on sorted headers. The ported suites cover the rest.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { defaultCollectionQuery, type EntityCollectionProps, type FieldSpec } from '../types.ts';
import { resolveColumns } from '../utils/columns.ts';
import { createEntityCollection } from './collection.tsx';

beforeAll(async () => {
  await import('@mui/x-data-grid');
});

const FIELDS = {
  id: { kind: 'text', path: ['id'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'] },
} satisfies Record<string, FieldSpec>;
interface Row {
  id: string;
  version?: number;
  name: { value: string } | null;
  transportMode: string;
}
const ROWS: Row[] = [
  { id: 'NMR:VehicleType:1', version: 2, name: { value: 'Flirt' }, transportMode: 'rail' },
  { id: 'NMR:VehicleType:2', name: { value: 'Citea' }, transportMode: 'bus' },
];
const GRID_SLOT = { dataGrid: { disableVirtualization: true } };
const MUTED = 'rgba(0, 0, 0, 0.6)'; // default theme's text.secondary
const Collection = createEntityCollection(FIELDS);

const mount = async (props: Partial<EntityCollectionProps<Row, keyof typeof FIELDS>> = {}) => {
  await act(async () => {
    render(
      <MemoryRouter>
        <Collection rows={ROWS} slotProps={GRID_SLOT} {...props} />
      </MemoryRouter>
    );
  });
};
const gridRows = async () => (await screen.findAllByRole('row')).slice(1);
/** A mode as a badge: proves the cell / card shows `render`'s output, not the text. */
const MODE_BADGE = {
  field: 'transportMode' as const,
  render: (r: Row) => <b data-testid="mode">{r.transportMode.toUpperCase()}</b>,
};

describe('identity under `id`', () => {
  it('is compacted like `netexId`, matching on its last segment', () => {
    const [id] = resolveColumns(FIELDS, ['id']);
    expect(id.label).toBe('Id');
    expect(id.display('NMR:VehicleType:1')).toBe('::1');
    expect(id.matches('NMR:VehicleType:1', '1')).toBe(true);
  });

  it('is muted in the grid and on a card', async () => {
    await mount({ view: 'grid' });
    const cell = within((await gridRows())[0]).getByText('::1');
    expect(getComputedStyle(cell).color).toBe(MUTED);
    cleanup();
    await mount({ view: 'cards' });
    expect(getComputedStyle(screen.getByText('::1/ver2')).color).toBe(MUTED);
  });
});

describe('render', () => {
  it.each(['grid', 'cards'] as const)(
    'takes a replaced render on the next render (%s)',
    async view => {
      const ui = (mark: string) => (
        <MemoryRouter>
          <Collection
            rows={ROWS}
            slotProps={GRID_SLOT}
            view={view}
            columns={[{ field: 'transportMode', render: (r: Row) => `${mark}${r.transportMode}` }]}
          />
        </MemoryRouter>
      );
      const { rerender } = await act(async () => render(ui('A:')));
      expect(await screen.findByText('A:rail')).toBeTruthy();
      await act(async () => rerender(ui('B:')));
      expect(await screen.findByText('B:rail')).toBeTruthy();
    }
  );

  it('fills the grid cell, while search still reads the text', async () => {
    await mount({
      view: 'grid',
      columns: ['name', MODE_BADGE],
      query: { ...defaultCollectionQuery, search: 'bus' },
    });
    const rows = await gridRows();
    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByTestId('mode').textContent).toBe('BUS');
  });

  it('fills a card field and an explicit card title', async () => {
    await mount({
      view: 'cards',
      columns: [
        { field: 'name', render: r => <i data-testid="title">{r.name?.value}!</i> },
        MODE_BADGE,
      ],
      card: { title: 'name', fields: ['transportMode'] },
    });
    const [first] = screen.getAllByRole('listitem');
    expect(within(first).getByTestId('title').textContent).toBe('Flirt!');
    expect(within(first).getByTestId('mode').textContent).toBe('RAIL');
  });
});

describe('Edit link', () => {
  const editHref = (r: Row) => `/next/vehicle-types/${encodeURIComponent(r.id)}`;

  it('is a real link per grid row, named for the record, with its focus-return id', async () => {
    await mount({ view: 'grid', editHref });
    const link = within((await gridRows())[0]).getByRole('link', { name: 'Edit Flirt' });
    expect(link.getAttribute('href')).toBe('/next/vehicle-types/NMR%3AVehicleType%3A1');
    expect(link.getAttribute('data-edit-id')).toBe('NMR:VehicleType:1');
    expect(link.textContent).toBe('Edit');
  });

  it("carries the host's router state to the details page", async () => {
    const Where = () => <output data-testid="state">{JSON.stringify(useLocation().state)}</output>;
    await act(async () => {
      render(
        <MemoryRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Collection
                  rows={ROWS}
                  view="cards"
                  editHref={editHref}
                  editState={{ initialMode: 'edit' }}
                />
              }
            />
            <Route path="/next/vehicle-types/:id" element={<Where />} />
          </Routes>
        </MemoryRouter>
      );
    });
    fireEvent.click(screen.getByRole('link', { name: 'Edit Citea' }));
    expect(screen.getByTestId('state').textContent).toBe('{"initialMode":"edit"}');
  });

  it('is on every card', async () => {
    await mount({ view: 'cards', editHref });
    const links = screen.getAllByRole('link', { name: /^Edit / });
    expect(links.map(l => l.getAttribute('data-edit-id'))).toEqual(ROWS.map(r => r.id));
  });

  it('is named by rowTitle when set: an unnamed record\'s link is not just "Edit"', async () => {
    const rows = [{ ...ROWS[0], name: null }];
    await mount({ rows, view: 'cards', editHref, rowTitle: r => r.name?.value || r.id });
    screen.getByRole('link', { name: 'Edit NMR:VehicleType:1' });
  });

  it('is absent without editHref', async () => {
    await mount({ view: 'grid' });
    await gridRows();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('is never offered as a column to hide', async () => {
    await mount({ view: 'grid', editHref });
    await gridRows();
    await act(async () => screen.getByRole('button', { name: 'Columns' }).click());
    const items = screen.getAllByRole('menuitemcheckbox').map(i => i.textContent);
    expect(items).toEqual(['Id', 'Name', 'Transport mode']);
  });
});

describe('filter dropdown', () => {
  it("draws options and picked tags with the field's render, as the cell does", async () => {
    const Filterable = createEntityCollection(
      { ...FIELDS, transportMode: { ...FIELDS.transportMode, options: ['bus', 'rail'] } },
      { filterFields: { transportMode: { arg: 'transportModes', op: 'anyOf' } } }
    );
    await act(async () => {
      render(<Filterable rows={ROWS} view="cards" columns={['name', MODE_BADGE]} />);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const modes = within(screen.getByRole('dialog', { name: 'Filters' })).getByRole('combobox', {
      name: 'Transport mode',
    });
    fireEvent.mouseDown(modes);
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.map(o => within(o).getByTestId('mode').textContent)).toEqual(['BUS', 'RAIL']);
    fireEvent.click(options[0]);
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(
      within(dialog)
        .getAllByTestId('mode')
        .map(t => t.textContent)
    ).toContain('BUS');
  });
});

describe('sort headers', () => {
  it('carry aria-sort for the sorted column', async () => {
    await mount({
      view: 'grid',
      query: { ...defaultCollectionQuery, sort: { field: 'name', dir: 'asc' } },
    });
    await gridRows();
    expect(screen.getByRole('columnheader', { name: /Name/ }).getAttribute('aria-sort')).toBe(
      'ascending'
    );
  });
});
