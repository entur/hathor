import { Box, type SxProps, type Theme } from '@mui/material';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import type { BrokenRule } from '../utils/busSpec.ts';
import type { BusFallback } from '../utils/standardBus.ts';

/**
 * "Drawn with standard length, shape: <why>": what of the picture is the standard bus's, not
 * the record's, and the rules that made the shape so. Nothing when all is the record's.
 *
 * @param {{ fallback: BusFallback[], broken?: BrokenRule[], sx?: SxProps<Theme> }} props
 *   `toBusInput`'s fallback and broken rules, and where the host places the note
 * @returns {JSX.Element | null} the note
 */
export function StandardNote({
  fallback,
  broken = [],
  sx,
}: {
  fallback: BusFallback[];
  broken?: BrokenRule[];
  sx?: SxProps<Theme>;
}) {
  const { t } = useTranslation();
  if (fallback.length === 0) return null;
  return (
    <Box
      role="note"
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.25,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          typography: 'caption',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <WarningAmberRounded fontSize="inherit" sx={{ color: 'warning.main' }} aria-hidden />
      {t('busPicture.standard', {
        dims: fallback.map(d => t(`busPicture.dim.${d}`)).join(', '),
      })}
      {broken.length > 0 && `: ${broken.map(r => t(`busView.rule.${r.key}`, { ...r })).join('; ')}`}
    </Box>
  );
}
