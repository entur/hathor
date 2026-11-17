// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import MultiImportColumnMapper from './MultiImportColumnMapper.tsx';

/** A sheet whose second header cell is blank: the registrations sit under ''. */
const TABLE = {
  kind: 'table' as const,
  headers: ['Model', ''],
  rows: [{ Model: 'Volvo 8900', '': 'EB12345' }],
  rowCount: 1,
};

describe('MultiImportColumnMapper', () => {
  it('maps a blank-header column when picked, named by its position', () => {
    const onConfirm = vi.fn();
    render(<MultiImportColumnMapper tableMeta={TABLE} onConfirm={onConfirm} />);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Registration number' }));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Column 2' }));
    expect(onConfirm).toHaveBeenLastCalledWith({ regNumberCol: '', operationalRefCol: null });
  });
});
