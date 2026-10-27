import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import DeckPlanDetails from '../components/DeckPlanDetails.tsx';
import { DECK_PLAN_SELECTED_PARAM } from '../utils/deckPlanUrlParams.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

interface UrlSelectionParams {
  allData: DeckPlan[] | null;
  dataForTable: DeckPlan[];
  rowsPerPage: number;
  setPage: (page: number) => void;
  loading: boolean;
  /** List refetch, forwarded into `DeckPlanDetails` so a save can refresh the row. */
  refetch?: () => Promise<void>;
}

/**
 * DeckPlan binding for the generic {@link useUrlEditorSelection} hook:
 * param key `selected`, id is the full NeTEx id, editor is
 * `<DeckPlanDetails>` — given only the id (`NEW_SELECTION` for the New
 * Deck Plan action), it loads its own record.
 */
export function useDeckPlanUrlSelection({
  allData,
  dataForTable,
  rowsPerPage,
  setPage,
  loading,
  refetch,
}: UrlSelectionParams): void {
  useUrlEditorSelection<DeckPlan>({
    paramKey: DECK_PLAN_SELECTED_PARAM,
    allData,
    dataForTable,
    rowsPerPage,
    setPage,
    loading,
    getId: dp => dp.id,
    renderEditor: (id, mode) => <DeckPlanDetails id={id} onSaved={refetch} mode={mode} />,
  });
}
