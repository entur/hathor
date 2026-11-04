import { useId, useRef, useState, type ReactNode } from 'react';
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SectionToc } from '../../SectionToc.tsx';
import { REDUCED_MOTION_QUERY } from '../../../utils/motion.ts';
import { useSectionSpy } from '../hooks/useSectionSpy.ts';
import { gridSize, tocSections, type ResolvedField, type Section } from '../utils/sections.ts';

// Theme spacing: between fields (room for a floating label's notch), between sections,
// and kept above a section scrolled into view.
const FIELD_GAP = 2,
  SECTION_GAP = 4,
  SCROLL_MARGIN = 2;
// Linje docs TOC: `max-width: 15rem`, sticky with a 2rem gap.
const TOC_WIDTH = '15rem',
  TOC_TOP = '2rem';
// Below `lg`: room above the dropdown for its floating label (theme spacing), and its
// total height, which a section scrolled to must clear (small TextField 40px + that room).
const DROPDOWN_PAD = 1,
  DROPDOWN_H_PX = 48;
const TOC_Z = 2; // above outlined field labels, which carry z-index 1
const STACKED_MIN_SECTIONS = 2; // fewer → one flat group with no heading

export interface FormSectionsProps {
  /** From `resolveSections`. */
  sections: readonly Section[];
  /** Draws one field's control. The host owns it, view mode (`readOnly`) included. */
  renderField: (field: ResolvedField) => ReactNode;
  /** Drawn above the TOC in column 3, e.g. the iteru-3dbus picture; the host sizes it.
   *  Below `lg` it sits above the form. Column 3 shows for it even without a TOC. */
  aside?: ReactNode;
}

/**
 * Stacked form sections on a 12-column grid, each field as wide as its resolved
 * `width` from `sm` up. One section renders flat, with no heading. With a table
 * of contents' worth of sections (`tocSections`) it also draws the `SectionToc`:
 * a sticky column on the right from `lg` up, a dropdown above the form below it,
 * linked to scrolling both ways through `useSectionSpy`. An `aside` stacks above
 * the TOC in that column and scrolls with it.
 *
 * @param {FormSectionsProps} props the sections, the field renderer and the column-3 aside
 * @returns {JSX.Element} the laid-out form body, with its TOC and aside when it has them
 */
export function FormSections({ sections, renderField, aside }: FormSectionsProps) {
  const idPrefix = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toc = tocSections(sections);
  const [active, setActive] = useState<string>();
  // Late-loading or reshaped sections: an unknown pick falls back to the first.
  const shown = active !== undefined && toc.includes(active) ? active : toc[0];
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const register = useSectionSpy({
    labels: toc,
    enabled: toc.length > 0,
    active,
    onActiveChange: setActive,
  });
  const column = toc.length > 0 || !!aside;
  const pinned = toc.length > 0 && !wide; // the dropdown sits over the top of the form

  // A pick of the section already marked: the spy sees no change, so scroll to its heading here.
  const select = (label: string) => {
    if (label !== shown) return setActive(label);
    const sections = rootRef.current?.querySelectorAll<HTMLElement>('[data-section]') ?? [];
    [...sections]
      .find(n => n.dataset.section === label)
      ?.scrollIntoView({
        behavior: window.matchMedia?.(REDUCED_MOTION_QUERY).matches ? 'auto' : 'smooth',
        block: 'start',
      });
  };

  const rows = (fields: readonly ResolvedField[]) => (
    <Grid container spacing={FIELD_GAP}>
      {fields.map(f => (
        <Grid key={f.key} size={gridSize(f.width)} data-width={f.width} sx={{ minWidth: 0 }}>
          {renderField(f)}
        </Grid>
      ))}
    </Grid>
  );

  const body =
    sections.length < STACKED_MIN_SECTIONS ? (
      <Box sx={{ minWidth: 0 }}>{rows(sections[0]?.fields ?? [])}</Box>
    ) : (
      <Stack spacing={SECTION_GAP} sx={{ minWidth: 0 }}>
        {sections.map((s, i) => (
          <Box
            key={s.label}
            component="section"
            ref={register(s.label)}
            data-section={s.label}
            aria-labelledby={`${idPrefix}-${i}`}
            sx={{
              minWidth: 0,
              scrollMarginTop: t =>
                pinned
                  ? `calc(${DROPDOWN_H_PX}px + ${t.spacing(SCROLL_MARGIN)})`
                  : t.spacing(SCROLL_MARGIN),
            }}
          >
            <Typography id={`${idPrefix}-${i}`} variant="h6" component="h2" sx={{ mb: FIELD_GAP }}>
              {s.label}
            </Typography>
            {rows(s.fields)}
          </Box>
        ))}
      </Stack>
    );

  // One tree at every width and with or without an aside, so neither crossing `lg` nor
  // toggling the aside remounts the form (its fields, the spy's observed sections).
  // From `lg` up column 3 is one sticky stack; below it the stack dissolves
  // (`display: contents`), so the aside and the dropdown stack above the form and the
  // dropdown pins itself across the whole form.
  return (
    <Box
      ref={rootRef}
      sx={{
        display: 'grid',
        gridTemplateColumns: wide && column ? `minmax(0, 1fr) ${TOC_WIDTH}` : 'minmax(0, 1fr)',
        columnGap: SECTION_GAP,
        rowGap: FIELD_GAP,
        alignItems: 'start',
      }}
    >
      {column && (
        <Stack
          spacing={FIELD_GAP}
          useFlexGap // a gap, not child margins: dissolved below `lg`, it must add no spacing
          sx={
            wide
              ? { gridColumn: 2, gridRow: 1, position: 'sticky', top: TOC_TOP, minWidth: 0 }
              : { display: 'contents' }
          }
        >
          {aside && <Box sx={{ width: '100%', maxWidth: TOC_WIDTH }}>{aside}</Box>}
          {toc.length > 0 && (
            <SectionToc
              sections={toc}
              active={shown}
              onSelect={select}
              variant={wide ? 'list' : 'dropdown'}
              sx={
                pinned
                  ? {
                      position: 'sticky',
                      top: 0,
                      pt: DROPDOWN_PAD,
                      zIndex: TOC_Z,
                      bgcolor: 'background.default',
                    }
                  : undefined
              }
            />
          )}
        </Stack>
      )}
      <Box sx={{ minWidth: 0, ...(wide && column && { gridColumn: 1, gridRow: 1 }) }}>{body}</Box>
    </Box>
  );
}
