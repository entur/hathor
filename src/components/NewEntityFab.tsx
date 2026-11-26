import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import { NEW_SELECTION } from '../hooks/useEntityEditor.ts';
import SquareButton from './SquareButton.tsx';

interface NewEntityFabProps {
  /** Displayed label and aria-label. */
  label: string;
  /** Target route — the entity's create page, `/<entity>/new`. */
  to: string;
  /** `data-testid` for e2e selectors (e.g. `create-vehicle-fab`). */
  testid: string;
  /** Shown instead of `label` below the `sm` breakpoint, so the button stays one line. */
  shortLabel?: string;
}

/**
 * Generic "New &lt;Entity&gt;" call to action: Linje's SquareButton, a link to the supplied
 * `to` URL (the entity's create page); shared by every collection page.
 */
export default function NewEntityFab({ label, to, testid, shortLabel }: NewEntityFabProps) {
  return (
    <SquareButton
      icon={<Add />}
      to={to}
      data-testid={testid}
      aria-label={label}
      // Closing the create pane hands focus back here (`CollectionShell`).
      data-edit-id={NEW_SELECTION}
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
    </SquareButton>
  );
}
