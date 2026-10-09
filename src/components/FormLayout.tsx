import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

const LABEL_COL_MAX = '12rem';
const STACK_BELOW = '22rem';
const COL_GAP = 2;
const ROW_GAP = 1.25;
// Room for a floating label's notch above each outlined field.
const STACK_ROW_GAP = 2;

interface FormLayoutProps {
  children: ReactNode;
  rowGap?: number;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
}

/**
 * Container-query-aware two-column form grid. Stacks (single column) when the
 * nearest inline-size container is narrower than `STACK_BELOW`; otherwise
 * renders a content-sized label column (capped at 12rem via `fit-content`) and
 * gives all remaining width to the value column. Short labels collapse to
 * their natural width so the input gets the room it needs.
 *
 * The wrapper sets `containerType: inline-size` on itself so the inner grid
 * queries this component's own width — drop a `<FormLayout>` anywhere and it
 * will track its host's width, not the viewport's.
 *
 * @param rowGap Override the default vertical row spacing (`1.25`).
 * @param sx     Forwarded to the outer Box for caller-side spacing/margin.
 */
export function FormLayout({
  children,
  rowGap = ROW_GAP,
  sx,
  'data-testid': testId,
}: FormLayoutProps) {
  return (
    <Box
      data-testid={testId}
      sx={
        [
          { containerType: 'inline-size', width: '100%' },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] as SxProps<Theme>
      }
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          [`@container (min-width: ${STACK_BELOW})`]: {
            gridTemplateColumns: `fit-content(${LABEL_COL_MAX}) 1fr`,
          },
          columnGap: COL_GAP,
          rowGap,
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

interface FormStackProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
}

/**
 * Single-column stack for an editable form whose fields carry their own
 * floating label (see `FormFields.tsx`). Every field spans the full width, so
 * input width no longer depends on the longest label in the form.
 *
 * Sets `containerType: inline-size` on itself, like {@link FormLayout}, so
 * fields can size against this component's width rather than the viewport's.
 *
 * @param sx Forwarded to the outer Box for caller-side spacing/margin.
 * @returns The stacked form container.
 */
export function FormStack({ children, sx, 'data-testid': testId }: FormStackProps) {
  return (
    <Box
      data-testid={testId}
      sx={
        [
          { containerType: 'inline-size', width: '100%' },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] as SxProps<Theme>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: STACK_ROW_GAP }}>
        {children}
      </Box>
    </Box>
  );
}

interface MetaRowProps {
  label: string;
  children: ReactNode;
}

/**
 * Read-only row inside {@link FormLayout}: a label `<Typography>` paired with
 * a value node. Uses `display: contents` so both halves become direct grid
 * items of the parent — column alignment is owned by the parent grid.
 */
export function MetaRow({ label, children }: MetaRowProps) {
  return (
    <Box sx={{ display: 'contents' }}>
      <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', minWidth: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" component="div" sx={{ minWidth: 0 }}>
        {children}
      </Typography>
    </Box>
  );
}
