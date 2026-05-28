import { Fragment } from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import { FormLayout } from './FormLayout.tsx';

const INPUT_HEIGHT = 37;
const TITLE_HEIGHT = 28;
const ID_PILL_WIDTH = 144;
const ID_PILL_HEIGHT = 24;
const ANIM = 'wave' as const;

export interface FormLayoutSkeletonSection {
  /** Number of label+value rows in this grid. */
  rowCount: number;
  /** Height of the value-cell rounded block. Defaults to 37 (input height). */
  rowHeight?: number;
  /** Vertical gap between rows. Defaults to FormLayout's `rowGap` default. */
  rowGap?: number;
}

interface FormLayoutSkeletonProps {
  /** Loading text for screen readers — caller-localised. */
  ariaLabel: string;
  /** Render an h6 + id-pill skeleton row at the top, with a divider below. */
  showTitle?: boolean;
  /** Each section is its own <FormLayout> grid; Dividers auto-rendered between. */
  sections: FormLayoutSkeletonSection[];
}

function SkeletonRow({ height = INPUT_HEIGHT }: { height?: number }) {
  return (
    <Box sx={{ display: 'contents' }}>
      <Skeleton animation={ANIM} variant="text" width="60%" />
      <Skeleton animation={ANIM} variant="rounded" height={height} />
    </Box>
  );
}

/**
 * Wave-animated loading skeleton for any sidebar editor built on the
 * {@link FormLayout} two-column grid. Internally wraps each section in
 * `<FormLayout>` so the skeleton's grid shape (and container-query
 * stacking) tracks the live form automatically — no separate grid
 * template to keep in sync.
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
        return (
          <Fragment key={sIdx}>
            <FormLayout rowGap={section.rowGap} sx={isLast ? undefined : { mb: 2 }}>
              {Array.from({ length: section.rowCount }).map((_, rIdx) => (
                <SkeletonRow key={rIdx} height={section.rowHeight} />
              ))}
            </FormLayout>
            {!isLast && <Divider sx={{ mb: 2 }} />}
          </Fragment>
        );
      })}
    </Box>
  );
}
