import type { ReactNode } from 'react';
import { Box, ButtonBase, type ButtonBaseProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  BUTTON_HEIGHT_PX,
  BUTTON_HEIGHT_SMALL_PX,
  BUTTON_RADIUS_PX,
  BUTTON_RADIUS_SMALL_PX,
  CAN_HOVER,
  DISABLED_STROKE,
  DISABLED_TEXT,
  FIELD_BORDER,
  FIELD_BORDER_PX,
  HOVER_FILL,
  PRESSED_FILL,
  ringOn,
} from '../theme/createThemeFromConfig.ts';

// Linje SquareButton, secondary (`@entur/button` SquareButton.scss): the square at the button
// heights and radii, `button/gap` to its label, `Square secondary/Standard/Border` = the field
// border.
const SIZES = {
  medium: { box: BUTTON_HEIGHT_PX, radius: BUTTON_RADIUS_PX, gap: 1, font: 'body1' },
  small: { box: BUTTON_HEIGHT_SMALL_PX, radius: BUTTON_RADIUS_SMALL_PX, gap: 0.5, font: 'body2' },
} as const;
const SQUARE = 'SquareButton-square';

export interface SquareButtonProps extends Omit<ButtonBaseProps, 'children'> {
  /** Drawn inside the square. */
  icon: ReactNode;
  /** The label beside the square; also the accessible name. Omit it for an icon-only square,
   * which then needs `aria-label`. */
  children?: ReactNode;
  size?: keyof typeof SIZES;
  /** A route: the button is then a router link. */
  to?: string;
}

/**
 * Linje's secondary SquareButton, which MUI lacks: an icon in a bordered square, its label
 * beside it (or none: icon only). Hover and press fill the square; the focus ring sits on the
 * square only. Disabled: a dashed grey square.
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
          [`& .${SQUARE}`]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: s.box,
            height: s.box,
            border: `${FIELD_BORDER_PX}px solid ${FIELD_BORDER}`,
            borderRadius: `${s.radius}px`,
          },
          [CAN_HOVER]: { [`&:hover .${SQUARE}`]: { bgcolor: HOVER_FILL } },
          [`&:active .${SQUARE}`]: { bgcolor: PRESSED_FILL, borderColor: 'primary.main' },
          '&.Mui-disabled': { color: DISABLED_TEXT },
          [`&.Mui-disabled .${SQUARE}`]: { borderColor: DISABLED_STROKE, borderStyle: 'dashed' },
          ...ringOn(SQUARE),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" className={SQUARE}>
        {icon}
      </Box>
      {children != null && <span>{children}</span>}
    </ButtonBase>
  );
}
