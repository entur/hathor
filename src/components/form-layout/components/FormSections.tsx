import { useId, useState, type ReactNode } from 'react';
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SectionToc } from '../../SectionToc.tsx';
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
  const toc = tocSections(sections);
  const [active, setActive] = useState(toc[0]);
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const register = useSectionSpy({
    labels: toc,
    enabled: toc.length > 0,
    active,
    onActiveChange: setActive,
  });

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
    sections.length < 2 ? (
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
            sx={{ minWidth: 0, scrollMarginTop: t => t.spacing(SCROLL_MARGIN) }}
          >
            <Typography id={`${idPrefix}-${i}`} variant="h6" component="h2" sx={{ mb: FIELD_GAP }}>
              {s.label}
            </Typography>
            {rows(s.fields)}
          </Box>
        ))}
      </Stack>
    );
  if (toc.length === 0 && !aside) return body;

  // Column-3 width at every breakpoint, so the picture never outgrows its slot.
  const side = aside && <Box sx={{ width: '100%', maxWidth: TOC_WIDTH }}>{aside}</Box>;
  const nav = toc.length > 0 && (
    <SectionToc
      sections={toc}
      active={active}
      onSelect={setActive}
      variant={wide ? 'list' : 'dropdown'}
      // Below `lg` the dropdown pins itself; from `lg` up the whole column is sticky.
      sx={
        wide
          ? undefined
          : {
              position: 'sticky',
              top: 0,
              pt: 1, // room for the dropdown's floating label
              zIndex: 2, // above outlined field labels, which carry z-index 1
              bgcolor: 'background.default',
            }
      }
    />
  );
  return wide ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `minmax(0, 1fr) ${TOC_WIDTH}`,
        gap: SECTION_GAP,
        alignItems: 'start',
      }}
    >
      {body}
      <Stack spacing={FIELD_GAP} sx={{ position: 'sticky', top: TOC_TOP, minWidth: 0 }}>
        {side}
        {nav}
      </Stack>
    </Box>
  ) : (
    <Stack spacing={FIELD_GAP} sx={{ minWidth: 0 }}>
      {side}
      {nav}
      {body}
    </Stack>
  );
}
