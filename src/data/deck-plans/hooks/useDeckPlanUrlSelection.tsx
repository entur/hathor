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
  /** List refetch, run (not awaited) after each committed write in `DeckPlanDetails`. */
  refetch?: () => Promise<void>;
}

/**
 * DeckPlan binding for the generic {@link useUrlEditorSelection} hook:
 * param key `selected`, id is the full NeTEx id, editor is
 * `<DeckPlanDetails>` — given only the id (`NEW_SELECTION` for the New
 * Deck Plan action), it loads its own record — with the list refetch fired
 * from `onWritten`. A failed list refetch is the list's to show, not the
 * editor's.
 *
 * @param allData      Full dataset; `null` while the initial fetch is in flight.
 * @param dataForTable Current page slice (drives the deep-link page jump).
 * @param rowsPerPage  Page size, for the page-jump maths.
 * @param setPage      Pager setter.
 * @param loading      Whether the dataset fetch is in flight.
 * @param refetch      List refetch, fired (not awaited) after each committed write.
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
    renderEditor: (id, mode) => (
      <DeckPlanDetails id={id} mode={mode} onWritten={() => void refetch?.().catch(() => {})} />
    ),
  });
}
