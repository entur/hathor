import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { useEditing } from '../../../contexts/EditingContext.tsx';
import VehicleDetails from '../VehicleDetails.tsx';
import type { VehicleRow } from '../vehicleTypes.ts';

interface RowClickCellProps {
  item: VehicleRow;
}

/**
 * Per-row trigger that opens the Vehicle details panel in the existing
 * `EditingContext`-driven sidebar. The `EditorComponent` closure captures the
 * row data, so the sidebar renders without re-fetching the dataset.
 */
export default function RowClickCell({ item }: RowClickCellProps) {
  const { setEditingItem } = useEditing();
  const { t } = useTranslation();

  return (
    <Tooltip title={t('vehicles.detailsTooltip', 'View details')}>
      <IconButton
        onClick={() =>
          setEditingItem({
            id: item.id,
            EditorComponent: () => <VehicleDetails vehicle={item} />,
          })
        }
        color="primary"
        size="small"
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
