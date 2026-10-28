import { useTranslation } from 'react-i18next';
import SidebarEditorRail from '../../../components/sidebar/SidebarEditorRail.tsx';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import type { EntityWrite } from '../../../hooks/useEntityEditor.ts';
import { DECK_PLAN_SELECTED_PARAM } from '../utils/deckPlanUrlParams.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import DeckPlanEditor from './DeckPlanEditor.tsx';

interface DeckPlanDetailsProps {
  /** DeckPlan netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /** Mode on open. */
  mode?: 'view' | 'edit';
  /** Fire-and-forget report of each committed write (the list refetch). */
  onWritten?: (write: EntityWrite<DeckPlan>) => void;
}

/**
 * Sidebar host for {@link DeckPlanEditor}, opened via
 * `/deck-plans?selected=<id>`: closing drops `?selected=`, a create advances it
 * to the new id, and the editor's controls are the sidebar's
 * {@link SidebarEditorRail}.
 *
 * @param {DeckPlanDetailsProps} props - Id, initial mode and the write report.
 * @returns {JSX.Element} The DeckPlan editor with its sidebar rail.
 */
export default function DeckPlanDetails({ id, mode, onWritten }: DeckPlanDetailsProps) {
  const { t } = useTranslation();
  const closeSlider = useCloseSliderParam(DECK_PLAN_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(DECK_PLAN_SELECTED_PARAM);
  return (
    <DeckPlanEditor
      id={id}
      mode={mode}
      onClose={closeSlider}
      onCreated={advanceCreated}
      onWritten={onWritten}
      actions={api => (
        <SidebarEditorRail
          api={api}
          onCollapse={closeSlider}
          deactivateConfirm={{
            title: t('deckPlan.deactivateConfirmTitle'),
            message: t('deckPlan.deactivateConfirmMessage'),
          }}
        />
      )}
    />
  );
}
