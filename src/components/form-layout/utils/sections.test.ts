import { describe, it, expect } from 'vitest';
import { gridSize, resolveSections, tocSections } from './sections.ts';
import type { FieldSpec } from '../../collection/types.ts';

const FIELDS: Record<string, FieldSpec> = {
  name: { kind: 'name', path: ['name', 'value'] },
  range: { kind: 'number', path: ['range'], patched: true },
  count: { kind: 'number', path: ['count'] },
};

const keys = (sections: ReturnType<typeof resolveSections>) =>
  sections.map(s => [s.id, s.fields.map(f => f.key)]);

describe('resolveSections — patched display', () => {
  it('keeps patched fields unless told to hide them', () => {
    expect(keys(resolveSections(FIELDS))).toEqual([['', ['name', 'range', 'count']]]);
    expect(keys(resolveSections(FIELDS, undefined, 'plain'))).toEqual([
      ['', ['name', 'range', 'count']],
    ]);
  });

  it("'hide' drops them with no layout", () => {
    expect(keys(resolveSections(FIELDS, undefined, 'hide'))).toEqual([['', ['name', 'count']]]);
  });

  it("'hide' drops a section left empty, so no heading or tab is drawn over nothing", () => {
    const layout = { General: ['name'], Future: ['range'], Size: ['count', 'range'] };
    expect(keys(resolveSections(FIELDS, layout, 'hide'))).toEqual([
      ['General', ['name']],
      ['Size', ['count']],
    ]);
  });
});

describe('tocSections — what a table of contents can navigate', () => {
  const layout = { General: ['name'], Future: ['range'], Size: ['count'] };

  it('lists three or more sections, in page order', () => {
    expect(tocSections(resolveSections(FIELDS, layout))).toEqual(['General', 'Future', 'Size']);
  });

  it('lists nothing below three sections — two headings are already in view', () => {
    expect(tocSections(resolveSections(FIELDS, { A: ['name'], B: ['count'] }))).toEqual([]);
    expect(tocSections(resolveSections(FIELDS, { Only: ['name', 'count'] }))).toEqual([]);
    expect(tocSections(resolveSections(FIELDS))).toEqual([]);
  });

  it('follows the patched display, so a hidden section is not counted', () => {
    expect(tocSections(resolveSections(FIELDS, layout, 'hide'))).toEqual([]);
  });
});

describe('resolveSections — width', () => {
  const WIDE: Record<string, FieldSpec> = {
    ...FIELDS,
    built: { kind: 'date', path: ['built'] },
    active: { kind: 'switch', path: ['active'] },
  };
  const widths = (sections: ReturnType<typeof resolveSections>) =>
    Object.fromEntries(sections.flatMap(s => s.fields.map(f => [f.key, f.width])));

  it('defaults by kind, on a zero-config form too', () => {
    expect(widths(resolveSections(WIDE))).toEqual({
      name: 'full',
      range: '1/3',
      count: '1/3',
      built: '1/2',
      active: '1/2',
    });
  });

  it('takes a form-level width per kind over the default', () => {
    const got = widths(resolveSections(WIDE, undefined, 'mark', { number: '1/4', name: '1/2' }));
    expect(got).toMatchObject({ name: '1/2', range: '1/4', count: '1/4', built: '1/2' });
  });

  it("lets a layout entry's width win over both", () => {
    const layout = { All: [{ field: 'count', width: 'full' as const }, 'range'] };
    expect(widths(resolveSections(WIDE, layout, 'mark', { number: '1/4' }))).toEqual({
      count: 'full',
      range: '1/4',
    });
  });
});

describe('gridSize — the responsive span', () => {
  it('is full below sm and the fraction of 12 columns from there up', () => {
    expect(gridSize('full')).toEqual({ xs: 12, sm: 12 });
    expect(gridSize('1/2')).toEqual({ xs: 12, sm: 6 });
    expect(gridSize('1/3')).toEqual({ xs: 12, sm: 4 });
    expect(gridSize('1/4')).toEqual({ xs: 12, sm: 3 });
  });
});
