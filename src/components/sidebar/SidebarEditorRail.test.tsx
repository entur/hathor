// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarEditorRail from './SidebarEditorRail.tsx';
import { EditingProvider } from '../../contexts/EditingContext.tsx';
import type { EntityEditorApi } from '../../hooks/useEntityEditor.ts';

vi.mock('../../hooks/useLiftEditorDirty.ts', () => ({ useLiftEditorDirty: () => {} }));

const KEY_A = 'NMR:Authority:1|NMR:Vehicle:1',
  KEY_B = 'NMR:Authority:1|NMR:Vehicle:2';
const CONFIRM = { title: 'Deactivate?', message: 'Really?' };

const apiFor = (
  selectionKey: string,
  deactivate: () => Promise<void>,
  hasRecord = true
): EntityEditorApi<unknown> => ({
  form: {},
  setForm: () => {},
  hasRecord,
  selectionKey,
  mode: 'view',
  enterEdit: () => {},
  cancel: () => {},
  save: async () => {},
  saving: false,
  isDirty: false,
  canSubmit: true,
  deactivate: hasRecord ? deactivate : undefined,
  saveError: null,
  clearSaveError: () => {},
  warning: null,
  clearWarning: () => {},
  savedOpen: false,
  closeSaved: () => {},
  deactivatedOpen: false,
  closeDeactivated: () => {},
});

const rail = (api: EntityEditorApi<unknown>) => (
  <EditingProvider>
    <SidebarEditorRail api={api} onCollapse={() => {}} deactivateConfirm={CONFIRM} />
  </EditingProvider>
);

describe('SidebarEditorRail', () => {
  it('a Deactivate confirmation opened for one record closes when the selection moves', () => {
    const deactivateA = vi.fn(async () => {}),
      deactivateB = vi.fn(async () => {});
    const { rerender } = render(rail(apiFor(KEY_A, deactivateA)));

    fireEvent.click(screen.getByTestId('editor-rail-deactivate'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    rerender(rail(apiFor(KEY_B, deactivateB)));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(deactivateB).not.toHaveBeenCalled();
  });

  it('the confirmation does not survive the loading placeholder between two records', () => {
    const deactivateA = vi.fn(async () => {}),
      deactivateB = vi.fn(async () => {});
    const { rerender } = render(rail(apiFor(KEY_A, deactivateA)));

    fireEvent.click(screen.getByTestId('editor-rail-deactivate'));
    rerender(rail(apiFor(KEY_B, deactivateB, false)));
    rerender(rail(apiFor(KEY_B, deactivateB)));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(deactivateB).not.toHaveBeenCalled();
  });

  it('keeps the confirmation open while the same selection re-renders', () => {
    const deactivate = vi.fn(async () => {});
    const { rerender } = render(rail(apiFor(KEY_A, deactivate)));

    fireEvent.click(screen.getByTestId('editor-rail-deactivate'));
    rerender(rail(apiFor(KEY_A, deactivate)));

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
