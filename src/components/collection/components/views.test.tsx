// @vitest-environment jsdom
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { FieldSpec } from '../types.ts';
import { DEFAULT_LABELS, defaultCollectionQuery } from '../types.ts';
import { resolveCard, resolveColumns } from '../utils/columns.ts';
import { keyRows } from '../utils/values.ts';
import { CardsView, type CardsViewProps } from './CardsView.tsx';
import { GridView } from './GridView.tsx';

// The grid is lazily imported. Load its module once up front, so the first
// grid test in this file doesn't spend its whole `findBy` wait importing it
// (borderline when every test file runs in parallel).
beforeAll(async () => {
  await import('@mui/x-data-grid');
});

const FIELDS: Record<string, FieldSpec> = {
  netexId: { kind: 'text', path: ['netexId'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'] },
  propulsionTypes: { kind: 'enumMulti', path: ['propulsionTypes'] },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
};
const COLS = resolveColumns(FIELDS);
const ROWS = [
  {
    netexId: 'T:1',
    name: { value: 'Flirt' },
    transportMode: 'rail',
    propulsionTypes: ['electric', 'diesel'],
    lowFloor: true,
  },
  { netexId: 'T:2', name: null, transportMode: null, propulsionTypes: null, lowFloor: null },
];

/** Cards for `rows`, keyed as the collection keys them. */
const renderCards = (rows: unknown[], over: Partial<CardsViewProps> = {}) =>
  render(
    <CardsView
      rows={keyRows(rows)}
      card={resolveCard(FIELDS, COLS)}
      labels={DEFAULT_LABELS}
      {...over}
    />
  );
const mediaAreas = (el: HTMLElement) => el.querySelectorAll('[data-card-media]');

/** A grid for `rows` (rendered inside an awaited act: the grid loads lazily). */
const renderGrid = async (
  rows: unknown[],
  over: {
    onQuery?: () => void;
    hidden?: Record<string, boolean>;
    total?: number;
    dataGrid?: Record<string, unknown>;
  } = {}
) => {
  const onQuery = over.onQuery ?? vi.fn();
  await act(async () => {
    render(
      <GridView
        rows={keyRows(rows)}
        columns={COLS}
        total={over.total ?? rows.length}
        page={0}
        query={defaultCollectionQuery}
        onQuery={onQuery}
        density="standard"
        hidden={over.hidden ?? {}}
        labels={DEFAULT_LABELS}
        dataGrid={{ disableVirtualization: true, ...over.dataGrid }}
      />
    );
  });
  return onQuery;
};

describe('CardsView', () => {
  const mount = () => renderCards(ROWS);

  it('leaves no picture area on a card without media', () => {
    const { container } = mount();
    expect(mediaAreas(container)).toHaveLength(0);
  });

  it('leaves a picture area at the top of every card with media, blank and hidden when unfilled', () => {
    const { container } = renderCards(ROWS, { media: () => null });
    const items = screen.getAllByRole('listitem');
    expect(mediaAreas(container)).toHaveLength(items.length);
    for (const item of items) {
      const area = item.querySelector('[data-card-media]')!;
      expect(item.firstElementChild?.contains(area)).toBe(true);
      expect(area.childNodes).toHaveLength(0);
      expect(area.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it("lays a card's title and subtitle over its picture, outside the hidden media", () => {
    const card = resolveCard(FIELDS, COLS, {
      title: 'name',
      subtitle: 'transportMode',
      fields: ['lowFloor'],
    });
    renderCards(ROWS, { media: () => null, card });
    const first = screen.getAllByRole('listitem')[0];
    const top = first.firstElementChild!;
    const heading = top.querySelector('[data-card-heading]')!;
    expect(within(heading as HTMLElement).getByText('Flirt')).toBeTruthy();
    expect(within(heading as HTMLElement).getByText('rail')).toBeTruthy();
    expect(heading.closest('[aria-hidden]')).toBeNull();
    // Once, in the picture: the text below starts with the fields.
    expect(within(first).getAllByText('Flirt')).toHaveLength(1);
    expect(first.querySelector('.MuiCardContent-root')?.firstElementChild?.tagName).toBe('DL');
  });

  it("keeps a text card's heading in its text", () => {
    renderCards(ROWS);
    const first = screen.getAllByRole('listitem')[0];
    expect(first.querySelector('[data-card-heading]')).toBeNull();
    expect(
      within(first.querySelector('.MuiCardContent-root') as HTMLElement).getByText('Flirt')
    ).toBeTruthy();
  });

  it("puts the host's media in a card's picture area, exposed", () => {
    renderCards(ROWS, {
      media: row => <img alt={(row as { netexId: string }).netexId} />,
    });
    const [first, second] = screen.getAllByRole('listitem');
    expect(
      within(first).getByRole('img', { name: 'T:1' }).parentElement?.hasAttribute('aria-hidden')
    ).toBe(false);
    expect(within(second).getByRole('img', { name: 'T:2' })).toBeTruthy();
  });

  it("gives a card's picture only the reserved height, standing on its bottom edge, the top cut", () => {
    renderCards(ROWS, { media: () => null, reservedHeightForImg: 120 });
    for (const item of screen.getAllByRole('listitem')) {
      const area = item.firstElementChild as HTMLElement;
      expect(getComputedStyle(area).height).toBe('120px');
      // The card's full width, not 120px × 16/10 from the ratio.
      expect(getComputedStyle(area).width).toBe('100%');
      // Media measures what shows (`cqh`), not the whole picture.
      expect(getComputedStyle(area).getPropertyValue('container-type')).toBe('size');
      expect(getComputedStyle(area).overflow).toBe('hidden');
      const media = getComputedStyle(area.querySelector('[data-card-media]')!);
      // Its own 16:10 at the card's width, on the bottom edge — not stretched to the area.
      expect(media.getPropertyValue('aspect-ratio')).toBe('16/10');
      expect(media.bottom).toBe('0px');
    }
  });

  it("sizes a card's picture area by the picture's shape when no height is reserved", () => {
    renderCards(ROWS, { media: () => null });
    const area = getComputedStyle(screen.getAllByRole('listitem')[0].firstElementChild!);
    expect(area.getPropertyValue('aspect-ratio')).toBe('16/10');
    expect(area.height).not.toMatch(/px$/); // no height reserved
  });

  it('renders one list item per row with its title', () => {
    mount();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('Flirt')).toBeTruthy();
  });

  it('labels every body field and formats each kind', () => {
    mount();
    const first = screen.getAllByRole('listitem')[0];
    expect(within(first).getByText('Transport mode')).toBeTruthy();
    expect(within(first).getByText('rail')).toBeTruthy();
    expect(within(first).getByText('electric')).toBeTruthy();
    expect(within(first).getByText('diesel')).toBeTruthy();
    expect(within(first).getByText('Yes')).toBeTruthy();
  });

  it('shows a dash for a missing title and missing values, without throwing', () => {
    mount();
    const second = screen.getAllByRole('listitem')[1];
    expect(within(second).getAllByText('—').length).toBeGreaterThanOrEqual(3);
  });
});

const VERSIONS = [
  { netexId: 'T:1', version: '1', name: { value: 'First version' } },
  { netexId: 'T:2', version: '1', name: { value: 'Other' } },
  { netexId: 'T:1', version: '2', name: { value: 'Second version' } },
];

describe('compact id', () => {
  const ROWS_IDS = [{ netexId: 'VEH:VehicleType:1004', name: { value: 'Flirt' } }];

  it('heads the identity column "Id" and shows ::NUM, with the full id on hover', async () => {
    await renderGrid(ROWS_IDS);
    await screen.findByText('Flirt');
    expect(screen.getByRole('columnheader', { name: 'Id' })).toBeTruthy();
    expect(screen.getByText('::1004').closest('[title]')?.getAttribute('title')).toBe(
      'VEH:VehicleType:1004'
    );
    expect(screen.queryByText('VEH:VehicleType:1004')).toBeNull();
  });

  it('reads the id on a card as ::NUM/verNUM when the row has a version', () => {
    renderCards([{ netexId: 'VEH:VehicleType:1004', version: '3', name: { value: 'Flirt' } }]);
    expect(screen.getByText('::1004/ver3').closest('[title]')?.getAttribute('title')).toBe(
      'VEH:VehicleType:1004'
    );
  });

  it('leaves the version off the grid cell, which has its own Version column', async () => {
    await renderGrid([{ netexId: 'VEH:VehicleType:1004', version: '3', name: { value: 'Flirt' } }]);
    await screen.findByText('Flirt');
    expect(screen.getByText('::1004')).toBeTruthy();
    expect(screen.queryByText('::1004/ver3')).toBeNull();
  });

  it('shows ::NUM on a card, with the full id on hover', () => {
    renderCards(ROWS_IDS);
    expect(screen.getByText('::1004').closest('[title]')?.getAttribute('title')).toBe(
      'VEH:VehicleType:1004'
    );
  });
});

describe('owned grid props', () => {
  it('keeps its footer and filtering off whatever the host passes', async () => {
    await renderGrid(ROWS, {
      total: 40,
      dataGrid: {
        hideFooter: false,
        disableColumnFilter: false,
        // A host filter model must not filter the page: the pipeline already did.
        filterModel: {
          items: [{ field: 'transportMode', operator: 'contains', value: 'no-such-mode' }],
        },
      },
    });
    await screen.findByText('Flirt');
    expect(screen.getAllByRole('row', { hidden: true })).toHaveLength(ROWS.length + 1);
    // The collection's own pager sits under the grid; the grid draws none.
    expect(screen.queryByRole('combobox', { name: /rows per page/i, hidden: true })).toBeNull();
  });
});

describe('switch cells', () => {
  it('shows a missing switch as a dash in the grid, as cards do, and names yes/no', async () => {
    await renderGrid([
      { netexId: 'T:1', name: { value: 'On' }, lowFloor: true },
      { netexId: 'T:2', name: { value: 'Off' }, lowFloor: false },
      { netexId: 'T:3', name: { value: 'Unknown' }, lowFloor: null },
    ]);
    await screen.findByText('Unknown');
    const cell = (name: string) =>
      within(screen.getByText(name).closest('[role=row]') as HTMLElement)
        .getAllByRole('gridcell')
        .at(-1)!;
    expect(within(cell('On')).getByTitle('Yes')).toBeTruthy();
    expect(within(cell('Off')).getByTitle('No')).toBeTruthy();
    expect(cell('Unknown').textContent).toBe('—');
  });
});

describe('versioned rows', () => {
  it('shows two versions of one entity as two grid rows, each with its own data', async () => {
    await renderGrid(VERSIONS);
    await screen.findByText('Other');
    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(screen.getByText('First version')).toBeTruthy();
    expect(screen.getByText('Second version')).toBeTruthy();
  });

  it('renders a repeated identity as two grid rows, each with its own data', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await renderGrid([
      { netexId: 'T:1', version: '1', name: { value: 'First copy' } },
      { netexId: 'T:1', version: '1', name: { value: 'Second copy' } },
    ]);
    await screen.findByText('First copy');
    expect(screen.getByText('Second copy')).toBeTruthy();
    warn.mockRestore();
  });

  it('renders two versions as two cards without a React key warning', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderCards(VERSIONS);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(error.mock.calls.map(c => String(c[0])).join('\n')).not.toMatch(/same key/);
    error.mockRestore();
  });
});

describe('GridView', () => {
  const mount = async () => {
    const onQuery = await renderGrid(ROWS, { total: 40, hidden: { lowFloor: false } });
    await screen.findByText('Flirt');
    return onQuery;
  };

  it('renders a header row plus one row per given row', async () => {
    await mount();
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('heads columns with their labels and omits hidden ones', async () => {
    await mount();
    expect(screen.getByRole('columnheader', { name: 'Transport mode' })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: 'Low floor' })).toBeNull();
  });

  it('reports a header click as a sort patch instead of sorting itself', async () => {
    const onQuery = await mount();
    fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(onQuery).toHaveBeenCalledWith({ sort: { field: 'name', dir: 'asc' } });
    expect(screen.getAllByRole('row')[1].textContent).toContain('Flirt');
  });
});
