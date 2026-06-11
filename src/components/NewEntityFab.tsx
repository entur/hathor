import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NewEntityFabProps {
  /** Displayed label and aria-label. */
  label: string;
  /** Target route — typically `<feature>?selected=new` for the sidebar create flow. */
  to: string;
  /** `data-testid` for e2e selectors (e.g. `create-vehicle-fab`). */
  testid: string;
}

/**
 * Generic "New &lt;Entity&gt;" call-to-action button. Routes to the supplied
 * `to` URL (the `?selected=new` sidebar editor for every current entity);
 * shared between Vehicle and VehicleType create flows.
 */
export default function NewEntityFab({ label, to, testid }: NewEntityFabProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={() => navigate(to)}
      data-testid={testid}
      aria-label={label}
      sx={{ textTransform: 'none' }}
    >
      {label}
    </Button>
  );
}
