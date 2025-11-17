import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { useEditing } from '../../../contexts/EditingContext.tsx';
import type { VehicleType } from '../vehicleTypeTypes.ts';
import VehicleTypeEditor from '../VehicleTypeEditor.tsx';

interface EditActionCellProps {
  item: VehicleType;
}

export default function EditActionCell({ item }: EditActionCellProps) {
  const { setEditingItem } = useEditing();
  const { t } = useTranslation();

  return (
    <Tooltip title={t('data.table.row.editTooltip', 'Edit Vehicle Type')}>
      <IconButton
        onClick={() => setEditingItem({ id: item.id, EditorComponent: VehicleTypeEditor })}
        color="primary"
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
