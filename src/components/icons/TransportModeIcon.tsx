import { Tooltip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey, type TransportMode } from '../../data/netex/transportMode.ts';
import { colorVarFor } from './transportModeIconHelpers.ts';

const ICON_SIZE = 16;

type TransportModeIconProps = {
  mode: TransportMode;
  /**
   * When set, render the localized label inline with the icon on the given
   * side. When omitted, render icon only — the label is exposed as
   * `aria-label` and surfaced via a MUI tooltip on hover.
   */
  iconPosition?: 'left' | 'right';
};

/**
 * Render a NeTEx TransportMode glyph. Backed by the inline SVG sprite in
 * {@link TransportModeSprite}. Three rendering modes:
 *
 * - `iconPosition` omitted → icon only with tooltip + `aria-label`
 * - `iconPosition === 'left'`  → `[icon] [label]`
 * - `iconPosition === 'right'` → `[label] [icon]`
 *
 * The visible / tooltip label comes from the existing `transportMode.*`
 * i18n keys via {@link transportModeLabelKey}. No `label` prop override —
 * the locale bundle is the single source of truth.
 *
 * @param mode A NeTEx TransportMode (incl. synthetic `'unknown'`).
 * @param iconPosition Optional inline-label layout; omit for icon-only.
 * @returns The icon (with tooltip) or icon+label inline group.
 */
export default function TransportModeIcon({ mode, iconPosition }: TransportModeIconProps) {
  const { t } = useTranslation();
  const label = t(transportModeLabelKey(mode), mode);

  const svg = (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      role="img"
      aria-hidden={iconPosition !== undefined ? true : undefined}
      aria-label={iconPosition === undefined ? label : undefined}
      style={{ color: colorVarFor(mode), flexShrink: 0 }}
    >
      <use href={`#tm-${mode}`} />
    </svg>
  );

  if (iconPosition === undefined) {
    return <Tooltip title={label}>{svg}</Tooltip>;
  }

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {iconPosition === 'left' ? svg : null}
      <span>{label}</span>
      {iconPosition === 'right' ? svg : null}
    </Box>
  );
}
