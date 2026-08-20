import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import { mergeNameText } from '../../netex/multilingualString.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Editor tabs — Identity (the editable fields) first, then the NeTEx source. */
type TabKey = 'identity' | 'xml';

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
  /** Current deck plan — the editable identity fields. */
  value: DeckPlan;
  /** Fired with the merged next value on every field edit. */
  onChange: (next: DeckPlan) => void;
  /** `'view'` disables the inputs; `'edit'` enables them. */
  mode: 'view' | 'edit';
  /** Create flow — hides the tab strip; there is no persisted body yet. */
  isCreate: boolean;
  /** NeTEx XML body, read-only. */
  xml: string;
  /** Body fetch in flight; renders a spinner in the XML tab. */
  loading: boolean;
  /** Body fetch error; renders an alert + retry in the XML tab. */
  fetchError: string | null;
  /** Refetch trigger from the parent hook. */
  onRetry: () => void;
}

/**
 * Reusable, presentational DeckPlan editor — a tabbed FormLayout driven by
 * `value`/`onChange`/`mode`, mirroring the VehicleType editor's shape. Tabs:
 * Identity (name + description) · XML (the read-only NeTEx source, with its
 * loading and fetch-error states). The XML body is never editable — name and
 * description are patched into the fetched document on save instead.
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
  const [tab, setTab] = useState<TabKey>('identity');
  const ro = mode === 'view';
  const setField = (patch: Partial<DeckPlan>) => onChange({ ...value, ...patch });

  const identity = (
    <FormLayout data-testid="deck-plan-identity-panel">
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

  // Create has no persisted body to show — render the fields bare, no tab strip.
  if (isCreate) return <Box>{identity}</Box>;

  return (
    <Box>
      <Tabs value={tab} onChange={(_e, v: TabKey) => setTab(v)} sx={TAB_SX}>
        <Tab
          value="identity"
          label={t('deckPlans.tab.identity', 'Identity')}
          data-testid="deck-plan-tab-identity"
        />
        <Tab value="xml" label={t('deckPlans.tab.xml', 'XML')} data-testid="deck-plan-tab-xml" />
      </Tabs>

      {tab === 'identity' && identity}
      {tab === 'xml' && (
        <XmlBody xml={xml} loading={loading} fetchError={fetchError} onRetry={onRetry} />
      )}
    </Box>
  );
}

/** Read-only NeTEx source pane with its loading and fetch-error states. */
function XmlBody({
  xml,
  loading,
  fetchError,
  onRetry,
}: Pick<DeckPlanFormProps, 'xml' | 'loading' | 'fetchError' | 'onRetry'>) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress data-testid="deck-plan-xml-loading" />
      </Box>
    );
  }
  if (fetchError) {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid="deck-plan-xml-fetch-error">
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
  return (
    <TextareaAutosize
      aria-label="deck plan data"
      data-testid="deck-plan-xml-textarea"
      readOnly
      value={xml}
      minRows={10}
      style={TEXTAREA_STYLE}
    />
  );
}
