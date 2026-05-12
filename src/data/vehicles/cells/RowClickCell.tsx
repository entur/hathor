import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { vehicleSelectedHref } from '../vehicleUrlParams.ts';
import type { VehicleRow } from '../vehicleTypes.ts';

interface RowClickCellProps {
  item: VehicleRow;
}

/**
 * Per-row trigger that opens the Vehicle details panel via the URL contract:
 * pushes `/vehicle?selected=<id>`. `VehicleView` watches `?selected=` and
 * sets `EditingContext.editingItem` accordingly — see FORK_DECISIONS.md
 * (Vehicle deep-link section) for why the URL is the source of truth.
 */
export default function RowClickCell({ item }: RowClickCellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Tooltip title={t('vehicles.detailsTooltip', 'View details')}>
      <IconButton
        onClick={() => navigate(vehicleSelectedHref(item.id))}
        color="primary"
        size="small"
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
