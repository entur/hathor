import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NewVehicleFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = t('vehicles.actions.new', 'New Vehicle');
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={() => navigate('/vehicles?selected=new')}
      data-testid="create-vehicle-fab"
      aria-label={label}
      sx={{ textTransform: 'none' }}
    >
      {label}
    </Button>
  );
}
