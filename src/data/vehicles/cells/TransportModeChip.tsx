import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey } from '../../netex/transportMode.ts';
import type { TransportMode } from '../../netex/transportMode.ts';

interface TransportModeChipProps {
  mode: TransportMode | undefined;
}

/** Chip rendering a localized NeTEx TransportMode label; em-dash when absent. */
export default function TransportModeChip({ mode }: TransportModeChipProps) {
  const { t } = useTranslation();
  if (!mode) return <>—</>;
  return <Chip label={t(transportModeLabelKey(mode), mode)} size="small" variant="outlined" />;
}
