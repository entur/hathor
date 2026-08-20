import { useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import { mergeNameText } from '../../netex/multilingualString.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import { useDeckRenderer } from '../hooks/useDeckRenderer.ts';
import DeckRendering from './DeckRendering.tsx';

/** Editor tabs — Edit (the editable fields) first, then the NeTEx source. */
type TabKey = 'edit' | 'xml';

/** Pill/segmented tab styling, matching the VehicleType editor's rail-safe tabs. */
const TAB_SX = {
  mb: 1.5,
  minHeight: 0,
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { flexWrap: 'wrap', gap: 0.75 },
  '& .MuiTab-root': {
    minHeight: 30,
    px: 1.25,
    py: 0.25,
    borderRadius: 1,
    textTransform: 'none',
    bgcolor: 'action.hover',
    color: 'text.secondary',
  },
  '& .MuiTab-root.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
};

const TEXTAREA_STYLE = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  borderColor: 'rgba(0, 0, 0, 0.23)',
  borderWidth: '1px',
  borderStyle: 'solid',
  fontSize: '14px',
  fontFamily: 'monospace',
  boxSizing: 'border-box' as const,
};

interface DeckPlanFormProps {
  /** Current deck plan — the editable name/description fields. */
  value: DeckPlan;
  /** Fired with the merged next value on every field edit. */
  onChange: (next: DeckPlan) => void;
  /** `'view'` disables the inputs; `'edit'` enables them. */
  mode: 'view' | 'edit';
  /** Create flow — hides the tab strip; there is no persisted body yet. */
  isCreate: boolean;
  /** NeTEx XML body, read-only. */
  xml: string;
  /** Body fetch in flight; renders a spinner in both tabs' body panes. */
  loading: boolean;
  /** Body fetch error; renders an alert + retry in both tabs' body panes. */
  fetchError: string | null;
  /** Refetch trigger from the parent hook. */
  onRetry: () => void;
}

/**
 * Reusable, presentational DeckPlan editor — a tabbed FormLayout driven by
 * `value`/`onChange`/`mode`, mirroring the VehicleType editor's shape. Tabs:
 * Edit (name + description, then a horizontal strip of read-only deck
 * renderings) · XML (the read-only NeTEx source). Both panes render from the
 * same fetched body and so share its loading and fetch-error states.
 *
 * The XML body is never editable — name and description are patched into the
 * fetched document on save instead.
 *
 * Holds no fetch/save logic; chrome (title, EditorRail, snackbars, dirty
 * tracking) lives in `DeckPlanDetails`.
 */
export default function DeckPlanForm({
  value,
  onChange,
  mode,
  isCreate,
  xml,
  loading,
  fetchError,
  onRetry,
}: DeckPlanFormProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>('edit');
  const ro = mode === 'view';
  const setField = (patch: Partial<DeckPlan>) => onChange({ ...value, ...patch });

  const fields = (
    <FormLayout data-testid="deck-plan-tab-edit">
      <FieldRow id="deckPlan-name" label={t('deckPlans.field.name', 'Name')}>
        <TextField
          id="deckPlan-name"
          value={value.name?.value ?? ''}
          onChange={e => setField({ name: mergeNameText(value.name, e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
      <FieldRow id="deckPlan-description" label={t('deckPlans.field.description', 'Description')}>
        <TextField
          id="deckPlan-description"
          value={value.description?.value ?? ''}
          onChange={e =>
            setField({ description: mergeNameText(value.description, e.target.value) })
          }
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );

  // Create has no persisted body to show — render the fields bare, no tab strip
  // and no renderings.
  if (isCreate) return <Box>{fields}</Box>;

  return (
    <Box>
      <Tabs value={tab} onChange={(_e, v: TabKey) => setTab(v)} sx={TAB_SX}>
        <Tab value="edit" label={t('deckPlans.tab.edit', 'Edit')} />
        <Tab value="xml" label={t('deckPlans.tab.xml', 'XML')} />
      </Tabs>

      {tab === 'edit' && (
        <Box>
          {fields}
          <Divider sx={{ my: 1.5 }} />
          {/* Scoped to the strip so a slow body fetch never blocks typing. */}
          <BodyState
            loading={loading}
            fetchError={fetchError}
            onRetry={onRetry}
            testIdPrefix="deck-plan-decks"
          >
            <DeckStrip xml={xml} />
          </BodyState>
        </Box>
      )}
      {tab === 'xml' && (
        <Box data-testid="deck-plan-tab-xml">
          <BodyState
            loading={loading}
            fetchError={fetchError}
            onRetry={onRetry}
            testIdPrefix="deck-plan-xml"
          >
            <TextareaAutosize
              aria-label="deck plan data"
              data-testid="deck-plan-xml-textarea"
              readOnly
              value={xml}
              minRows={10}
              style={TEXTAREA_STYLE}
            />
          </BodyState>
        </Box>
      )}
    </Box>
  );
}

/**
 * Loading / fetch-error chrome around whatever renders the fetched NeTEx body.
 * Both tabs read the same fetch, so both share these states.
 */
function BodyState({
  loading,
  fetchError,
  onRetry,
  testIdPrefix,
  children,
}: Pick<DeckPlanFormProps, 'loading' | 'fetchError' | 'onRetry'> & {
  testIdPrefix: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress data-testid={`${testIdPrefix}-loading`} />
      </Box>
    );
  }
  if (fetchError) {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid={`${testIdPrefix}-fetch-error`}>
          {fetchError}
        </Alert>
        <Box>
          <Button onClick={onRetry} size="small" variant="outlined">
            {t('common.retry', 'Retry')}
          </Button>
        </Box>
      </Stack>
    );
  }
  return children;
}

/**
 * Horizontal strip of read-only deck renderings for the fetched body.
 *
 * Decks draw `vertical`: at ~26.4m × 2.8m, native orientation overflows the
 * sidebar for even one deck, where rotated columns sit side by side and read
 * as a vehicle seen from above. A plan with no decks shows the SAMPLE ghost.
 */
function DeckStrip({ xml }: { xml: string }) {
  const { t } = useTranslation();
  const { decks, isGhost, loading, error } = useDeckRenderer(xml);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress data-testid="deck-plan-decks-rendering" />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error" data-testid="deck-plan-decks-error">
        {t('deckPlans.render.error', 'Could not render the deck plan')}: {error}
      </Alert>
    );
  }
  if (decks.length === 0) return null;

  return (
    <Stack spacing={1} data-testid="deck-plan-decks">
      {isGhost && (
        <Box data-testid="deck-plan-decks-sample">
          <Typography variant="subtitle2">{t('deckPlans.deck.sample', 'SAMPLE')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'deckPlans.deck.sampleHint',
              'This plan has no decks yet — showing a sample layout.'
            )}
          </Typography>
        </Box>
      )}
      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
        {decks.map((deck, i) => (
          <Stack
            key={deck.attr_id || i}
            spacing={0.5}
            alignItems="center"
            sx={{ flex: '0 0 auto' }}
          >
            <DeckRendering deck={deck} vertical data-testid={`deck-plan-deck-${i}`} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {deck.Name || t('deckPlans.deck.label', 'Deck {{n}}', { n: i + 1 })}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
