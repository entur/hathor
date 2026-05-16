import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey } from '../../../netex/transportMode.ts';
import type { TransportMode } from '../../../netex/transportMode.ts';

interface TransportModeChipProps {
  mode: TransportMode;
}

/** Chip rendering a localized NeTEx TransportMode label (incl. `'unknown'`). */
export default function TransportModeChip({ mode }: TransportModeChipProps) {
  const { t } = useTranslation();
  return <Chip label={t(transportModeLabelKey(mode), mode)} size="small" variant="outlined" />;
}
