import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { useEditing } from '../../../contexts/EditingContext.tsx';
import type { Vehicle } from '../vehicleTypes.ts';
import VehicleDetails from '../VehicleDetails.tsx';

interface RowClickCellProps {
  item: Vehicle;
}

/**
 * Per-row trigger that opens the Vehicle details panel in the existing
 * `EditingContext`-driven sidebar. Mirrors
 * `vehicle-types/cells/EditActionCell.tsx`. Iteration 2 may switch this to a
 * whole-row click once `DataTable` grows an `onRowClick` prop.
 */
export default function RowClickCell({ item }: RowClickCellProps) {
  const { setEditingItem } = useEditing();
  const { t } = useTranslation();

  return (
    <Tooltip title={t('vehicles.detailsTooltip', 'View details')}>
      <IconButton
        onClick={() => setEditingItem({ id: item.id, EditorComponent: VehicleDetails })}
        color="primary"
        size="small"
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
