import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Visual parity with {@link NewEntityFab} on `/vehicle-types` and `/vehicles`:
 * a primary "New deck plan" button in the list-head action row. Clicking it
 * fires a "Coming soon" info snackbar instead of opening a create UI — the
 * real create flow does not exist yet (today, deck plans land via the NeTEx
 * import path).
 */
export default function DeckPlanNewComingSoonButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const label = t('deckPlans.actions.new', 'New Deck Plan');
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        data-testid="create-deck-plan-coming-soon"
        aria-label={label}
        sx={{ textTransform: 'none' }}
      >
        {label}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          onClose={() => setOpen(false)}
          data-testid="deck-plan-new-coming-soon-snackbar"
        >
          {t('deckPlans.newComingSoon', 'Coming soon')}
        </Alert>
      </Snackbar>
    </>
  );
}
