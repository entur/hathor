import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NEW_SELECTION } from '../hooks/useEntityEditor.ts';

interface NewEntityFabProps {
  /** Displayed label and aria-label. */
  label: string;
  /** Target route — typically `<feature>?selected=new` for the sidebar create flow. */
  to: string;
  /** `data-testid` for e2e selectors (e.g. `create-vehicle-fab`). */
  testid: string;
  /** Shown instead of `label` below the `sm` breakpoint, so the button stays one line. */
  shortLabel?: string;
}

/**
 * Generic "New &lt;Entity&gt;" call-to-action button. Routes to the supplied
 * `to` URL (the `?selected=new` sidebar editor for every current entity);
 * shared between Vehicle and VehicleType create flows.
 */
export default function NewEntityFab({ label, to, testid, shortLabel }: NewEntityFabProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={() => navigate(to)}
      data-testid={testid}
      aria-label={label}
      // Closing the create pane hands focus back here (`CollectionShell`).
      data-edit-id={NEW_SELECTION}
      sx={{ textTransform: 'none' }}
    >
      {shortLabel ? (
        <>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {label}
          </Box>
          <Box component="span" sx={{ display: { sm: 'none' } }}>
            {shortLabel}
          </Box>
        </>
      ) : (
        label
      )}
    </Button>
  );
}
