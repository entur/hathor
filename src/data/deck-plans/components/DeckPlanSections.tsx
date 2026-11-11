import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormSections, resolveSections } from '../../../components/form-layout/index.ts';
import { useDeckPlanControls } from '../hooks/useDeckPlanControls.tsx';
import { deckPlanFields, deckPlanLayout } from '../types/deckPlanFields.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import DeckStrip from './DeckStrip.tsx';

const SECTIONS = resolveSections(deckPlanFields, deckPlanLayout);

interface DeckPlanSectionsProps {
  value: DeckPlan;
  onChange: (next: DeckPlan) => void;
  mode: 'view' | 'edit';
  /** A create: no persisted body, so no decks and no XML. */
  isCreate: boolean;
  /** NeTEx XML body the decks draw from. */
  xml: string;
  /** Body fetch in flight. */
  loading: boolean;
  /** Body fetch error, shown with a Retry. */
  fetchError: string | null;
  /** Refetch trigger from the parent hook. */
  onRetry: () => void;
}

/**
 * The form page's DeckPlan body (#287): `deckPlanLayout`'s one flat section, with the
 * decks drawn upright in column 3 and a "Show XML" button under them — "No decks yet"
 * on a create. View mode is read-only, not greyed out.
 *
 * @param {DeckPlanSectionsProps} props value, onChange, mode, create flag and the body
 * @returns {JSX.Element} the section and the decks
 */
export default function DeckPlanSections({
  isCreate,
  xml,
  loading,
  fetchError,
  onRetry,
  ...form
}: DeckPlanSectionsProps) {
  const { t } = useTranslation();
  const control = useDeckPlanControls(form);

  return (
    <FormSections
      sections={SECTIONS}
      renderField={f => control(f.key)}
      aside={
        isCreate ? (
          <Box
            data-testid="deck-plan-decks-placeholder"
            sx={{ py: 4, borderRadius: 1, bgcolor: 'action.hover', textAlign: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('deckPlans.noDecks')}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1} alignItems="flex-start">
            <DeckStrip
              xml={xml}
              id={form.value.id || undefined}
              loading={loading}
              fetchError={fetchError}
              onRetry={onRetry}
            />
            {/* shortcut: no-op in epic #252, wire to an XML view after the cut-over */}
            <Button size="small" data-testid="deck-plan-show-xml">
              {t('deckPlans.showXml')}
            </Button>
          </Stack>
        )
      }
    />
  );
}
