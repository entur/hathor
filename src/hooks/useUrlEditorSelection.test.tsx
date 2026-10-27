// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { MemoryRouter, useSearchParams, type SetURLSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EditingProvider, useEditingItem, type EditingItem } from '../contexts/EditingContext.tsx';
import { useUrlEditorSelection } from './useUrlEditorSelection.tsx';

const PARAM = 'selected',
  ROWS_PER_PAGE = 10,
  ROW_COUNT = 25;

type Row = { id: string };
const ROWS: Row[] = Array.from({ length: ROW_COUNT }, (_, i) => ({ id: `NMR:Thing:${i}` }));

interface HarnessProps {
  allData: Row[] | null;
  dataForTable: Row[];
  loading: boolean;
  setPage: (page: number) => void;
}

/** Captured from inside the router so tests can drive and observe it. */
const probe = {
  setSearchParams: null as SetURLSearchParams | null,
  editingItem: null as EditingItem | null,
  mounts: 0,
};

function Editor({ id, mode }: { id: string; mode: 'view' | 'edit' }) {
  useEffect(() => {
    probe.mounts += 1;
  }, []);
  return <div data-testid="editor">{`${id}|${mode}`}</div>;
}

function Harness({ allData, dataForTable, loading, setPage }: HarnessProps) {
  const [, setSearchParams] = useSearchParams();
  probe.setSearchParams = setSearchParams;
  useUrlEditorSelection<Row>({
    paramKey: PARAM,
    allData,
    dataForTable,
    rowsPerPage: ROWS_PER_PAGE,
    setPage,
    loading,
    getId: r => r.id,
    renderEditor: (id, mode) => <Editor id={id} mode={mode} />,
  });
  const { editingItem } = useEditingItem();
  probe.editingItem = editingItem;
  // Mirrors Sidebar.tsx: no key, so only a new component type remounts.
  return editingItem && <editingItem.EditorComponent itemId={editingItem.id} />;
}

const renderAt = (search: string, props: HarnessProps) => {
  const ui = (p: HarnessProps) => (
    <MemoryRouter initialEntries={[`/things${search}`]}>
      <EditingProvider>
        <Harness {...p} />
      </EditingProvider>
    </MemoryRouter>
  );
  const view = render(ui(props));
  return { rerender: (p: HarnessProps) => view.rerender(ui(p)) };
};

const select = (id: string | null) =>
  act(() =>
    probe.setSearchParams!(params => {
      if (id === null) params.delete(PARAM);
      else params.set(PARAM, id);
      return params;
    })
  );

describe('useUrlEditorSelection', () => {
  const unloaded = (): HarnessProps => ({
    allData: null,
    dataForTable: [],
    loading: true,
    setPage: vi.fn(),
  });
  const loaded = (setPage = vi.fn()): HarnessProps => ({
    allData: [...ROWS],
    dataForTable: ROWS.slice(0, ROWS_PER_PAGE),
    loading: false,
    setPage,
  });

  beforeEach(() => {
    probe.setSearchParams = null;
    probe.editingItem = null;
    probe.mounts = 0;
  });

  it('commits the editor before the list has loaded', () => {
    renderAt('?selected=NMR:Thing:3', unloaded());
    expect(probe.editingItem?.id).toBe('NMR:Thing:3');
    expect(screen.getByTestId('editor').textContent).toBe('NMR:Thing:3|view');
  });

  it('opens the create pane in edit mode', () => {
    renderAt('?selected=new', unloaded());
    expect(screen.getByTestId('editor').textContent).toBe('new|edit');
  });

  it('does not re-commit on a list refetch with the same id', () => {
    const view = renderAt('?selected=NMR:Thing:3', loaded());
    const committed = probe.editingItem;
    view.rerender(loaded());
    expect(probe.editingItem).toBe(committed);
    expect(probe.mounts).toBe(1);
  });

  it('updates editingItem.id without remounting the editor on id change', () => {
    renderAt('?selected=NMR:Thing:3', loaded());
    const Component = probe.editingItem?.EditorComponent;
    select('NMR:Thing:4');
    expect(probe.editingItem?.id).toBe('NMR:Thing:4');
    expect(probe.editingItem?.EditorComponent).toBe(Component);
    expect(screen.getByTestId('editor').textContent).toBe('NMR:Thing:4|view');
    expect(probe.mounts).toBe(1);
  });

  it("jumps to the row's page once the list arrives", () => {
    const setPage = vi.fn();
    const view = renderAt('?selected=NMR:Thing:12', { ...unloaded(), setPage });
    expect(setPage).not.toHaveBeenCalled();
    view.rerender(loaded(setPage));
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it('clears the editor when the param is removed', () => {
    renderAt('?selected=NMR:Thing:3', loaded());
    select(null);
    expect(probe.editingItem).toBeNull();
    expect(screen.queryByTestId('editor')).toBeNull();
  });
});
