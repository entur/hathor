import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NewVehicleTypeFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = t('vehicleTypes.actions.new', 'New Vehicle Type');
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={() => navigate('/vehicle-types?selected=new')}
      data-testid="create-vehicle-type-fab"
      aria-label={label}
      sx={{ textTransform: 'none' }}
    >
      {label}
    </Button>
  );
}
