import { Box, Divider, Skeleton } from '@mui/material';

const INPUT_HEIGHT = 37;
const ROW_GAP = 1.25;
const TITLE_HEIGHT = 28;
const ID_PILL_WIDTH = 144;
const ID_PILL_HEIGHT = 24;
const LABEL_COL_MIN = '8rem';
const LABEL_COL_MAX = '12rem';
const COL_GAP = 2;
const ANIM = 'wave' as const;

const gridSx = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: `minmax(${LABEL_COL_MIN}, ${LABEL_COL_MAX}) 1fr`,
  },
  columnGap: COL_GAP,
  alignItems: 'center',
};

export interface FormLayoutSkeletonSection {
  /** Number of label+value rows in this grid. */
  rowCount: number;
  /** Height of the value-cell rounded block. Defaults to 37 (input height). */
  rowHeight?: number;
  /** Vertical gap between rows. Defaults to 1.25. */
  rowGap?: number;
}

interface FormLayoutSkeletonProps {
  /** Loading text for screen readers — caller-localised. */
  ariaLabel: string;
  /** Render an h6 + id-pill skeleton row at the top, with a divider below. */
  showTitle?: boolean;
  /** Each section is its own grid; Dividers auto-rendered between sections. */
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
 * two-column form-layout grid. Mirrors the live form's column shape
 * (`minmax(8rem, 12rem) 1fr`) so the swap from skeleton → form is
 * visually static.
 *
 * The grid template is hardcoded here to keep parity with the current
 * `VehicleEditForm` pre-#98. Once #98 lands (FormLayout primitives in
 * `src/components/FormLayout.tsx`), the rebase can swap each inner grid
 * for `<FormLayout>` so they share one source of truth.
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
          <Box sx={{ ...gridSx, mb: 1 }}>
            <Skeleton animation={ANIM} variant="text" height={TITLE_HEIGHT} width="70%" />
            <Skeleton
              animation={ANIM}
              variant="rounded"
              width={ID_PILL_WIDTH}
              height={ID_PILL_HEIGHT}
            />
          </Box>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      {sections.map((section, sIdx) => {
        const isLast = sIdx === sections.length - 1;
        return (
          <Box key={sIdx}>
            <Box
              sx={{
                ...gridSx,
                mb: isLast ? 0 : 2,
                rowGap: section.rowGap ?? ROW_GAP,
              }}
            >
              {Array.from({ length: section.rowCount }).map((_, rIdx) => (
                <SkeletonRow key={rIdx} height={section.rowHeight} />
              ))}
            </Box>
            {!isLast && <Divider sx={{ mb: 2 }} />}
          </Box>
        );
      })}
    </Box>
  );
}
