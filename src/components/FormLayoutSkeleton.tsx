import { Fragment } from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import { FormLayout, FormStack } from './FormLayout.tsx';

const INPUT_HEIGHT = 37;
const TITLE_HEIGHT = 28;
const ID_PILL_WIDTH = 144;
const ID_PILL_HEIGHT = 24;
const ANIM = 'wave' as const;

interface SectionBase {
  /** Number of rows in this section. */
  rowCount: number;
  /** Height of each row's rounded block. Defaults to 37 (input height). */
  rowHeight?: number;
}

/** Read-only label+value rows, as `FormLayout` lays them out. */
interface RowsSection extends SectionBase {
  stacked?: false;
  /** Vertical gap between rows. Defaults to FormLayout's `rowGap` default. */
  rowGap?: number;
}

/** Editable fields in a `FormStack` — one full-width block per row, label included. */
interface StackedSection extends SectionBase {
  stacked: true;
}

export type FormLayoutSkeletonSection = RowsSection | StackedSection;

interface FormLayoutSkeletonProps {
  /** Loading text for screen readers — caller-localised. */
  ariaLabel: string;
  /** Render an h6 + id-pill skeleton row at the top, with a divider below. */
  showTitle?: boolean;
  /** Each section is its own form container; Dividers auto-rendered between. */
  sections: FormLayoutSkeletonSection[];
}

function SkeletonBlock({ height = INPUT_HEIGHT }: { height?: number }) {
  return <Skeleton animation={ANIM} variant="rounded" height={height} />;
}

function SkeletonRow({ height }: { height?: number }) {
  return (
    <Box sx={{ display: 'contents' }}>
      <Skeleton animation={ANIM} variant="text" width="60%" />
      <SkeletonBlock height={height} />
    </Box>
  );
}

/**
 * Wave-animated loading skeleton for any sidebar editor. Each section is
 * wrapped in the container the live editor uses — {@link FormLayout} for
 * read-only label+value rows, {@link FormStack} for editable fields — so the
 * skeleton's shape tracks the form without a separate template to keep in sync.
 */
export default function FormLayoutSkeleton({
  ariaLabel,
  showTitle,
  sections,
}: FormLayoutSkeletonProps) {
  return (
    <Box
      role="status"
      aria-label={ariaLabel}
      sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}
    >
      {showTitle && (
        <>
          <FormLayout sx={{ mb: 1 }}>
            <Skeleton animation={ANIM} variant="text" height={TITLE_HEIGHT} width="70%" />
            <Skeleton
              animation={ANIM}
              variant="rounded"
              width={ID_PILL_WIDTH}
              height={ID_PILL_HEIGHT}
            />
          </FormLayout>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      {sections.map((section, sIdx) => {
        const isLast = sIdx === sections.length - 1;
        const gapBelow = isLast ? undefined : { mb: 2 };
        const rows = (Row: typeof SkeletonBlock) =>
          Array.from({ length: section.rowCount }, (_, rIdx) => (
            <Row key={rIdx} height={section.rowHeight} />
          ));
        return (
          <Fragment key={sIdx}>
            {section.stacked ? (
              <FormStack sx={gapBelow}>{rows(SkeletonBlock)}</FormStack>
            ) : (
              <FormLayout rowGap={section.rowGap} sx={gapBelow}>
                {rows(SkeletonRow)}
              </FormLayout>
            )}
            {!isLast && <Divider sx={{ mb: 2 }} />}
          </Fragment>
        );
      })}
    </Box>
  );
}
