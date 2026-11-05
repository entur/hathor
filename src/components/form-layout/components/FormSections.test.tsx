// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FieldSpec } from '../../collection/types.ts';
import { resolveSections } from '../utils/sections.ts';
import { FormSections } from './FormSections.tsx';
import { FormFooterContext } from '../formFooterContext.ts';

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

describe('FormSections across widths and changes', () => {
  const ABC = { General: ['name'], Size: ['length'], Dates: ['built'] };
  const MORE: Record<string, FieldSpec> = { ...FIELDS, extra: { kind: 'text', path: ['extra'] } };
  let wide = false;
  const listeners = new Set<() => void>();
  const pick = (label: string) => {
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: label }));
  };

  beforeEach(() => {
    wide = false;
    listeners.clear();
    // MUI's useMediaQuery reads `matchMedia`; only the `lg` query (min-width) follows `wide`.
    vi.stubGlobal('matchMedia', (media: string) => ({
      media,
      get matches() {
        return media.includes('min-width') && wide; // live: MUI re-reads the list it kept
      },
      addEventListener: (_: string, l: () => void) => listeners.add(l),
      removeEventListener: (_: string, l: () => void) => listeners.delete(l),
    }));
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the form mounted when the viewport crosses lg', () => {
    render(<FormSections sections={resolveSections(FIELDS, ABC)} renderField={field} />);
    const size = screen.getByRole('region', { name: 'Size' });
    expect(screen.getByRole('combobox')).toBeTruthy(); // narrow: the dropdown
    wide = true;
    act(() => listeners.forEach(l => l()));
    expect(screen.queryByRole('combobox')).toBeNull(); // wide: the list
    expect(screen.getByRole('region', { name: 'Size' })).toBe(size);
  });

  it('keeps the form mounted when the aside comes and goes', () => {
    const sections = resolveSections(FIELDS, { General: ['name'], Size: ['length'] });
    const { rerender } = render(<FormSections sections={sections} renderField={field} />);
    const size = screen.getByRole('region', { name: 'Size' });
    rerender(<FormSections sections={sections} renderField={field} aside={<figure />} />);
    expect(screen.getByRole('region', { name: 'Size' })).toBe(size);
  });

  it('marks the first section when the picked one is gone', () => {
    const { rerender } = render(
      <FormSections sections={resolveSections(MORE, ABC)} renderField={field} />
    );
    pick('Dates');
    expect(screen.getByRole('combobox').textContent).toContain('Dates');
    const swapped = { General: ['name'], Size: ['length'], Extra: ['extra'] };
    rerender(<FormSections sections={resolveSections(MORE, swapped)} renderField={field} />);
    expect(screen.getByRole('combobox').textContent).toContain('General');
  });

  it('labels sections by id; a new language keeps the marked section (#293)', () => {
    const ids = { general: ['name'], size: ['length'], dates: ['built'] };
    const en = { general: 'General', size: 'Size', dates: 'Dates' } as Record<string, string>;
    const nb = { general: 'Generelt', size: 'Størrelse', dates: 'Datoer' } as Record<
      string,
      string
    >;
    const sections = resolveSections(FIELDS, ids);
    const { rerender } = render(
      <FormSections sections={sections} renderField={field} sectionLabel={id => en[id]} />
    );
    expect(screen.getByRole('region', { name: 'Size' })).toBeTruthy();
    pick('Dates');
    rerender(<FormSections sections={sections} renderField={field} sectionLabel={id => nb[id]} />);
    expect(screen.getByRole('region', { name: 'Størrelse' })).toBeTruthy();
    expect(screen.getByRole('combobox').textContent).toContain('Datoer');
  });

  it('draws the footer last in the form column: its own, else the context one', () => {
    const sections = resolveSections(FIELDS);
    const { rerender } = render(
      <FormFooterContext.Provider value={<footer>context</footer>}>
        <FormSections sections={sections} renderField={field} />
      </FormFooterContext.Provider>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toBe('context');
    expect(footer.parentElement?.lastElementChild).toBe(footer);
    rerender(
      <FormFooterContext.Provider value={<footer>context</footer>}>
        <FormSections sections={sections} renderField={field} footer={<footer>own</footer>} />
      </FormFooterContext.Provider>
    );
    expect(screen.getByRole('contentinfo').textContent).toBe('own');
  });

  it('scrolls back to the marked section when it is picked again', () => {
    render(<FormSections sections={resolveSections(FIELDS, ABC)} renderField={field} />);
    pick('General');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
  });
});
