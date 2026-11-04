// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FieldSpec } from '../../collection/types.ts';
import { resolveSections } from '../utils/sections.ts';
import { FormSections } from './FormSections.tsx';

const FIELDS: Record<string, FieldSpec> = {
  name: { kind: 'name', path: ['name'] },
  length: { kind: 'number', path: ['length'] },
  built: { kind: 'date', path: ['built'] },
};
const field = ({ key }: { key: string }) => <span>{key}</span>;

describe('FormSections', () => {
  it('draws a single section flat: no landmark, no heading', () => {
    render(<FormSections sections={resolveSections(FIELDS)} renderField={field} />);
    expect(screen.queryAllByRole('region')).toEqual([]);
    expect(screen.queryAllByRole('heading')).toEqual([]);
    expect(screen.getByText('length')).toBeTruthy();
  });

  it('names each stacked section by its heading, fields in layout order', () => {
    const layout = { General: ['name'], Size: ['built', 'length'] };
    render(<FormSections sections={resolveSections(FIELDS, layout)} renderField={field} />);
    const size = screen.getByRole('region', { name: 'Size' });
    expect(size.textContent).toBe('Sizebuiltlength');
    expect(screen.getByRole('region', { name: 'General' })).toBeTruthy();
  });

  it('sizes each field by its resolved width', () => {
    const layout = { All: ['name', { field: 'length', width: '1/4' as const }, 'built'] };
    const { container } = render(
      <FormSections sections={resolveSections(FIELDS, layout)} renderField={field} />
    );
    const widths = [...container.querySelectorAll('[data-width]')].map(n =>
      n.getAttribute('data-width')
    );
    expect(widths).toEqual(['full', '1/4', '1/2']);
  });
});
