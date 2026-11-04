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

describe('FormSections table of contents', () => {
  const MORE: Record<string, FieldSpec> = { ...FIELDS, extra: { kind: 'text', path: ['extra'] } };

  it('draws its TOC from three sections up', () => {
    const layout = { General: ['name'], Size: ['length'], Dates: ['built'] };
    render(<FormSections sections={resolveSections(MORE, layout)} renderField={field} />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeTruthy();
  });

  it('draws none below three', () => {
    const layout = { General: ['name'], Size: ['length', 'built'] };
    render(<FormSections sections={resolveSections(MORE, layout)} renderField={field} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});

describe('FormSections aside', () => {
  const picture = <figure data-testid="picture" />;

  it('draws the aside before the TOC', () => {
    const layout = { General: ['name'], Size: ['length'], Dates: ['built'] };
    render(
      <FormSections
        sections={resolveSections(FIELDS, layout)}
        renderField={field}
        aside={picture}
      />
    );
    const nav = screen.getByRole('navigation');
    const pic = screen.getByTestId('picture');
    expect(pic.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('keeps the aside on a form too small for a TOC', () => {
    render(<FormSections sections={resolveSections(FIELDS)} renderField={field} aside={picture} />);
    expect(screen.getByTestId('picture')).toBeTruthy();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
