// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SectionToc } from './SectionToc';
import { REDUCED_MOTION_QUERY } from '../utils/motion';

const sections = ['Edit', 'Dim.', 'Cargo'];

describe('SectionToc', () => {
  it('lists the sections in order inside a named landmark', () => {
    render(<SectionToc sections={sections} onSelect={() => {}} />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect([...nav.querySelectorAll('[role="button"]')].map(b => b.textContent)).toEqual(sections);
  });

  it('marks only the active section', () => {
    render(<SectionToc sections={sections} active="Dim." onSelect={() => {}} />);
    const current = screen.getAllByRole('button').filter(b => b.getAttribute('aria-current'));
    expect(current.map(b => b.textContent)).toEqual(['Dim.']);
    expect(current[0].getAttribute('aria-current')).toBe('location');
    expect(current[0].classList.contains('Mui-selected')).toBe(true);
  });

  it('marks nothing for an active section it does not list', () => {
    render(<SectionToc sections={sections} active="Gone" onSelect={() => {}} />);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('reports the picked section and changes nothing itself', () => {
    const onSelect = vi.fn();
    render(<SectionToc sections={sections} active="Edit" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cargo' }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('Cargo');
    // Stateless: the mark moves only when the host moves `active`.
    expect(screen.getByRole('button', { name: 'Edit' }).getAttribute('aria-current')).toBe(
      'location'
    );
  });

  it('takes a localized landmark name', () => {
    render(<SectionToc sections={sections} label="Innhold" onSelect={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Innhold' })).toBeTruthy();
  });

  it('renders nothing without sections', () => {
    const { container } = render(<SectionToc sections={[]} onSelect={() => {}} />);
    expect(container.innerHTML).toBe('');
  });
});

describe("SectionToc variant='dropdown'", () => {
  const open = () => fireEvent.mouseDown(screen.getByRole('combobox'));

  it('is a select inside the same named landmark, showing the active section', () => {
    render(<SectionToc variant="dropdown" sections={sections} active="Dim." onSelect={() => {}} />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.contains(screen.getByRole('combobox'))).toBe(true);
    expect(screen.getByRole('combobox').textContent).toContain('Dim.');
  });

  it('offers the sections in order', () => {
    render(<SectionToc variant="dropdown" sections={sections} active="Edit" onSelect={() => {}} />);
    open();
    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(sections);
  });

  it('reports the picked section and changes nothing itself', () => {
    const onSelect = vi.fn();
    render(<SectionToc variant="dropdown" sections={sections} active="Edit" onSelect={onSelect} />);
    open();
    fireEvent.click(screen.getByRole('option', { name: 'Cargo' }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('Cargo');
    expect(screen.getByRole('combobox').textContent).toContain('Edit');
  });

  it('reports a pick of the active section too, as the list does', () => {
    const onSelect = vi.fn();
    render(<SectionToc variant="dropdown" sections={sections} active="Dim." onSelect={onSelect} />);
    open();
    fireEvent.click(screen.getByRole('option', { name: 'Dim.' }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('Dim.');
  });

  it('shows nothing for an active section it does not list', () => {
    render(<SectionToc variant="dropdown" sections={sections} active="Gone" onSelect={() => {}} />);
    expect(screen.getByRole('combobox').textContent).not.toMatch(/\w/);
  });

  it('renders nothing without sections', () => {
    const { container } = render(
      <SectionToc variant="dropdown" sections={[]} onSelect={() => {}} />
    );
    expect(container.innerHTML).toBe('');
  });
});

describe('SectionToc loading', () => {
  it('keeps one placeholder per section, as large as its label, and offers nothing to pick', () => {
    const onSelect = vi.fn();
    render(<SectionToc sections={sections} onSelect={onSelect} loading />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.getAttribute('aria-busy')).toBe('true');
    // The skeleton wraps the label itself, so it takes the label's size.
    const bones = [...nav.querySelectorAll('.MuiSkeleton-root')];
    expect(bones.map(b => b.textContent)).toEqual(sections);
    expect(screen.queryAllByRole('button')).toEqual([]);
    fireEvent.click(bones[1]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('draws the dropdown as a skeleton of the field', () => {
    render(<SectionToc sections={sections} onSelect={() => {}} variant="dropdown" loading />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.querySelector('.MuiSkeleton-root .MuiTextField-root')).not.toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('still renders nothing without sections', () => {
    const { container } = render(<SectionToc sections={[]} onSelect={() => {}} loading />);
    expect(container.innerHTML).toBe('');
  });
});

/** Every CSS rule emotion injected, as text (jsdom has no media matching).
 *  Injected styles outlive a test, so a rule only counts for the classes the
 *  rendered tree carries. */
const injectedCss = () =>
  [...document.querySelectorAll('style')].map(s => s.textContent ?? '').join('\n');
const MEDIA = `@media ${REDUCED_MOTION_QUERY}`;

/** The selectors whose wave stops under reduced motion, scoped to `root`'s classes. */
const stilled = (root: HTMLElement): string[] => {
  const mine = new Set([...root.querySelectorAll('*')].flatMap(e => [...e.classList]));
  return injectedCss()
    .split(MEDIA)
    .slice(1)
    .flatMap(b => [...b.matchAll(/([^{}]+)\{[^{}]*\banimation:none[^{}]*\}/g)].map(m => m[1]))
    .filter(sel => mine.has(sel.match(/^\.([\w-]+)/)?.[1] ?? ''));
};

// MUI's wave runs on the skeleton's ::after, and `animation` is not inherited:
// a guard on the root alone leaves the shimmer running.
describe('SectionToc loading under reduced motion stops the skeleton wave', () => {
  it.each(['list', 'dropdown'] as const)('%s', variant => {
    const { container } = render(
      <SectionToc sections={['A', 'B']} onSelect={() => {}} variant={variant} loading />
    );
    const still = stilled(container);
    expect(still.length).toBeGreaterThan(0); // this tree's guard is found at all
    expect(still.some(sel => /\.MuiSkeleton-root::after/.test(sel))).toBe(true);
  });
});
