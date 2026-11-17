import type { ReactNode } from 'react';
import { Box, ButtonBase, type ButtonBaseProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { HOVER_FILL, PRESSED_FILL } from '../theme/createThemeFromConfig.ts';

// Linje SquareButton, secondary (`@entur/button` SquareButton.scss; `button/height`,
// `button/radius`, `button/gap`, `button/border`, `Square secondary/Standard/*` tokens).
const SIZES = {
  medium: { box: 48, radius: 8, gap: 1, font: 'body1' },
  small: { box: 32, radius: 6, gap: 0.5, font: 'body2' },
} as const;
const BORDER_PX = 2,
  BORDER = '#8284ab', // Square secondary/Standard/Border
  FOCUS_PX = 2; // outlines.focus, outlineOffsets.focus
const SQUARE = 'SquareButton-square';

export interface SquareButtonProps extends Omit<ButtonBaseProps, 'children'> {
  /** Drawn inside the square. */
  icon: ReactNode;
  /** The label beside the square; also the accessible name unless `aria-label` is set. */
  children: ReactNode;
  size?: keyof typeof SIZES;
  /** A route: the button is then a router link. */
  to?: string;
}

/**
 * Linje's secondary SquareButton, which MUI lacks: an icon in a bordered square, its label
 * beside it. Hover and press fill the square; the focus ring sits on the square only.
 *
 * @param {SquareButtonProps} props `icon`, the label as `children`, `size`, an optional `to`,
 *   and any `ButtonBase` prop (`onClick`, `data-*`, `aria-label`, `sx`)
 * @returns {JSX.Element} the button, or a router link with `to`
 */
export default function SquareButton({
  icon,
  children,
  size = 'medium',
  to,
  sx,
  ...rest
}: SquareButtonProps) {
  const s = SIZES[size];
  return (
    <ButtonBase
      {...(to ? { component: RouterLink, to } : {})}
      {...rest}
      sx={[
        {
          gap: s.gap,
          typography: s.font,
          color: 'primary.main',
          '&.Mui-focusVisible': { outline: 'none' },
          [`& .${SQUARE}`]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: s.box,
            height: s.box,
            border: `${BORDER_PX}px solid ${BORDER}`,
            borderRadius: `${s.radius}px`,
          },
          '@media (hover: hover)': { [`&:hover .${SQUARE}`]: { bgcolor: HOVER_FILL } },
          [`&:active .${SQUARE}`]: { bgcolor: PRESSED_FILL, borderColor: 'primary.main' },
          [`&.Mui-focusVisible .${SQUARE}`]: {
            outline: `${FOCUS_PX}px solid`,
            outlineColor: 'primary.main',
            outlineOffset: FOCUS_PX,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" className={SQUARE}>
        {icon}
      </Box>
      <span>{children}</span>
    </ButtonBase>
  );
}
