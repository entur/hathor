import { useUrlEditorSelection } from '../../../hooks/useUrlEditorSelection.tsx';
import DeckPlanDetails from '../components/DeckPlanDetails.tsx';
import { DECK_PLAN_SELECTED_PARAM } from '../utils/deckPlanUrlParams.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

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
 * `<DeckPlanDetails>`. `getEmptyRow` is required by the contract but
 * never UI-reachable: deck-plan creation is not a current product flow
 * (`?selected=new` would render the not-found view).
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
    getEmptyRow: () => ({ id: '' }),
    renderEditor: (row, mode) => <DeckPlanDetails deckPlan={row} onSaved={refetch} mode={mode} />,
  });
}
