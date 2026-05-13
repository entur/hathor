import { Add } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NewVehicleFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = t('vehicles.actions.new', 'New Vehicle');
  return (
    <Tooltip title={label}>
      <Fab
        size="small"
        color="primary"
        onClick={() => navigate('/vehicle/new')}
        data-testid="create-vehicle-fab"
        aria-label={label}
      >
        <Add />
      </Fab>
    </Tooltip>
  );
}
