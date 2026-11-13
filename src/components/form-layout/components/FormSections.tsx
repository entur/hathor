import { useContext, useId, useRef, useState, type ReactNode } from 'react';
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SectionToc } from '../../SectionToc.tsx';
import { REDUCED_MOTION_QUERY } from '../../../utils/motion.ts';
import { useSectionSpy } from '../hooks/useSectionSpy.ts';
import { FormFooterContext } from '../formFooterContext.ts';
import { SCROLL_PAD, SECTION_GAP, TOC_WIDTH, formColumnWidth } from '../utils/formWidth.ts';
import { gridSize, tocSections, type ResolvedField, type Section } from '../utils/sections.ts';

// Theme spacing: between fields (room for a floating label's notch), and kept above a
// section scrolled into view.
const FIELD_GAP = 2,
  SCROLL_MARGIN = 2;
// From `lg`, the form column scrolls: room at its top for the first row's floating labels.
const FORM_TOP_PAD = 1;
// Below `lg`: room above the dropdown for its floating label (theme spacing), and its
// total height, which a section scrolled to must clear (small TextField 40px + that room).
const DROPDOWN_PAD = 1,
  DROPDOWN_H_PX = 48;
const TOC_Z = 2; // above outlined field labels, which carry z-index 1
const STACKED_MIN_SECTIONS = 2; // fewer → one flat group with no heading

export interface FormSectionsProps<K extends string = string> {
  /** From `resolveSections`. */
  sections: readonly Section<K>[];
  /** Draws one field's control. The host owns it, view mode (`readOnly`) included. */
  renderField: (field: ResolvedField<K>) => ReactNode;
  /** Drawn above the TOC in column 3, e.g. the iteru-3dbus picture; the host sizes it.
   *  Below `lg` it sits above the form. Column 3 shows for it even without a TOC. */
  aside?: ReactNode;
  /** The table of contents' name (its `nav` label and dropdown label); `SectionToc`'s
   *  "Sections" when omitted. */
  tocLabel?: string;
  /** A section's heading and TOC entry, from its id (the layout key); the id itself when
   *  omitted. Keep ids stable: a changed id is a new section to the TOC (#293). */
  sectionLabel?: (id: string) => string;
  /** Drawn last in the form column, e.g. the form page's sticky `EditFooter`; from
   *  `FormFooterContext` when omitted. */
  footer?: ReactNode;
}

/**
 * Stacked form sections on a 12-column grid, each field as wide as its resolved
 * `width` from `sm` up. One section renders flat, with no heading. With a table
 * of contents' worth of sections (`tocSections`) it also draws the `SectionToc`:
 * a sticky column on the right from `lg` up, a dropdown above the form below it,
 * linked to scrolling both ways through `useSectionSpy`. An `aside` stacks above
 * the TOC in that column. From `lg` up, in a host of fixed height (a form page), the
 * form column and column 3 each scroll on their own: picture and TOC stay put while the
 * form, its `footer` sticking to the bottom, scrolls (#293).
 *
 * @param {FormSectionsProps} props the sections, the field renderer, the column-3 aside, the
 *   TOC's label, the section labels and the footer
 * @returns {JSX.Element} the laid-out form body, with its TOC and aside when it has them
 */
export function FormSections<K extends string>({
  sections,
  renderField,
  aside,
  tocLabel,
  sectionLabel = id => id,
  footer: ownFooter,
}: FormSectionsProps<K>) {
  const contextFooter = useContext(FormFooterContext);
  const footer = ownFooter ?? contextFooter;
  const idPrefix = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toc = tocSections(sections);
  const [active, setActive] = useState<string>();
  // Late-loading or reshaped sections: an unknown pick falls back to the first.
  const shown = active !== undefined && toc.includes(active) ? active : toc[0];
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('lg'));
  const formColumn = `minmax(0, ${formColumnWidth(theme)})`;
  const register = useSectionSpy({
    labels: toc,
    enabled: toc.length > 0,
    active,
    onActiveChange: setActive,
  });
  const column = toc.length > 0 || !!aside;
  const pinned = toc.length > 0 && !wide; // the dropdown sits over the top of the form

  // The TOC speaks labels; everything else, ids (a language switch keeps the mark).
  const tocLabels = toc.map(sectionLabel);
  // A pick of the section already marked: the spy sees no change, so scroll to its heading here.
  const select = (id: string) => {
    if (id !== shown) return setActive(id);
    const sections = rootRef.current?.querySelectorAll<HTMLElement>('[data-section]') ?? [];
    [...sections]
      .find(n => n.dataset.section === id)
      ?.scrollIntoView({
        behavior: window.matchMedia?.(REDUCED_MOTION_QUERY).matches ? 'auto' : 'smooth',
        block: 'start',
      });
  };

  const rows = (fields: readonly ResolvedField<K>[]) => (
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
            key={s.id}
            component="section"
            ref={register(s.id)}
            data-section={s.id}
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
              {sectionLabel(s.id)}
            </Typography>
            {rows(s.fields)}
          </Box>
        ))}
      </Stack>
    );

  // One tree at every width and with or without an aside, so neither crossing `lg` nor
  // toggling the aside remounts the form (its fields, the spy's observed sections).
  // From `lg` up column 3 is one stack scrolling on its own; below it the stack dissolves
  // (`display: contents`), so the aside and the dropdown stack above the form and the
  // dropdown pins itself across the whole form.
  return (
    <Box
      ref={rootRef}
      sx={{
        display: 'grid',
        // No column 3 (no aside, no TOC): the form takes the whole page width.
        gridTemplateColumns: column ? (wide ? `${formColumn} ${TOC_WIDTH}` : formColumn) : '1fr',
        columnGap: SECTION_GAP,
        rowGap: FIELD_GAP,
        alignItems: 'start',
        // Fills a fixed-height host (a form page): one row, each column its own scroller.
        ...(wide && {
          flex: '1 1 0',
          minHeight: 0,
          gridTemplateRows: 'minmax(0, 1fr)',
          alignItems: 'stretch',
        }),
      }}
    >
      {column && (
        <Stack
          spacing={FIELD_GAP}
          useFlexGap // a gap, not child margins: dissolved below `lg`, it must add no spacing
          sx={
            wide
              ? { gridColumn: 2, gridRow: 1, minWidth: 0, minHeight: 0, overflowY: 'auto' }
              : { display: 'contents' }
          }
        >
          {aside && <Box sx={{ width: '100%', maxWidth: TOC_WIDTH }}>{aside}</Box>}
          {toc.length > 0 && (
            <SectionToc
              sections={tocLabels}
              active={shown === undefined ? undefined : sectionLabel(shown)}
              onSelect={label => select(toc[tocLabels.indexOf(label)])}
              label={tocLabel}
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
      <Box
        sx={{
          minWidth: 0,
          pr: SCROLL_PAD, // the fields keep clear of the column's own scrollbar
          ...(wide && { minHeight: 0, overflowY: 'auto', pt: FORM_TOP_PAD }),
          ...(wide && column && { gridColumn: 1, gridRow: 1 }),
        }}
      >
        {body}
        {footer}
      </Box>
    </Box>
  );
}
