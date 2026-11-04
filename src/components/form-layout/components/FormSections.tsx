import { useId, type ReactNode } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useSectionSpy } from '../hooks/useSectionSpy.ts';
import { gridSize, tocSections, type ResolvedField, type Section } from '../utils/sections.ts';

// Theme spacing: between fields (room for a floating label's notch), between sections,
// and kept above a section scrolled into view.
const FIELD_GAP = 2,
  SECTION_GAP = 4,
  SCROLL_MARGIN = 2;

export interface FormSectionsProps {
  /** From `resolveSections`; the same call feeds the skeleton and the TOC. */
  sections: readonly Section[];
  /** Draws one field's control. The host owns it, view mode (`readOnly`) included. */
  renderField: (field: ResolvedField) => ReactNode;
  /** The section the host wants in view, e.g. the TOC's pick. */
  active?: string;
  /** Reports the section the reader has scrolled to. */
  onActiveChange?: (label: string) => void;
}

/**
 * Stacked form sections on a 12-column grid, each field as wide as its resolved
 * `width` from `sm` up. One section renders flat, with no heading. With a table
 * of contents' worth of sections (`tocSections`), scrolling and `active` are
 * linked both ways through `useSectionSpy`.
 *
 * @param {FormSectionsProps} props sections, the field renderer and the controlled `active` pair
 * @returns {JSX.Element} the laid-out form body
 */
export function FormSections({ sections, renderField, active, onActiveChange }: FormSectionsProps) {
  const idPrefix = useId();
  const register = useSectionSpy({
    labels: sections.map(s => s.label),
    enabled: tocSections(sections).length > 0,
    active,
    onActiveChange,
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

  if (sections.length < 2) return <Box sx={{ minWidth: 0 }}>{rows(sections[0]?.fields ?? [])}</Box>;

  return (
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
}
