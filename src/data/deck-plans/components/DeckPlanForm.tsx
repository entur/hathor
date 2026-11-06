import { useState } from 'react';
import { Box, Divider, Tab, TextareaAutosize } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormStack } from '../../../components/FormLayout.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import { useDeckPlanControls } from '../hooks/useDeckPlanControls.tsx';
import DeckStrip from './DeckStrip.tsx';
import PillTabs from '../../../components/PillTabs.tsx';
import BodyState from '../../../components/feedback/BodyState.tsx';

/** Editor tabs — Edit (the editable fields) first, then the NeTEx source. */
type TabKey = 'edit' | 'xml';

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
 * Reusable, presentational DeckPlan editor — a tabbed FormStack driven by
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
  const control = useDeckPlanControls({ value, onChange, mode });

  const fields = (
    <FormStack data-testid="deck-plan-tab-edit">
      {control('name')}
      {control('description')}
    </FormStack>
  );

  // Create has no persisted body to show — render the fields bare, no tab strip
  // and no renderings.
  if (isCreate) return <Box>{fields}</Box>;

  return (
    <Box>
      <PillTabs value={tab} onChange={(_e, v: TabKey) => setTab(v)}>
        <Tab value="edit" label={t('deckPlans.tab.general')} />
        <Tab value="xml" label={t('deckPlans.tab.xml')} />
      </PillTabs>

      {tab === 'edit' && (
        <Box>
          {fields}
          <Divider sx={{ my: 1.5 }} />
          {/* Scoped to the strip so a slow body fetch never blocks typing.
              `value.id` is the persisted NeTEx id — same one the save patches
              by, so the drawn plan and the patched plan match. */}
          <DeckStrip
            xml={xml}
            id={value.id || undefined}
            loading={loading}
            fetchError={fetchError}
            onRetry={onRetry}
          />
        </Box>
      )}
      {tab === 'xml' && (
        <Box data-testid="deck-plan-tab-xml">
          <BodyState
            loading={loading}
            error={fetchError}
            onRetry={onRetry}
            testIdPrefix="deck-plan-xml"
          >
            <TextareaAutosize
              aria-label={t('deckPlans.xmlAriaLabel')}
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
