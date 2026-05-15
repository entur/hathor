import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { BuildableElement } from '@/models/netex/deckplan/deckPlan';
type __VLS_Props = {
  deck: Deck;
  scale: number;
  elementToBuild?: BuildableElement;
};
declare const __VLS_export: import('vue').DefineComponent<
  __VLS_Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    select: (...args: any[]) => void;
    drop: (...args: any[]) => void;
    updateElement: (...args: any[]) => void;
    editGrid: (...args: any[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<__VLS_Props> &
    Readonly<{
      onSelect?: ((...args: any[]) => any) | undefined;
      onDrop?: ((...args: any[]) => any) | undefined;
      onUpdateElement?: ((...args: any[]) => any) | undefined;
      onEditGrid?: ((...args: any[]) => any) | undefined;
    }>,
  {},
  {},
  {},
  {},
  string,
  import('vue').ComponentProvideOptions,
  false,
  {},
  any
>;
declare const _default: typeof __VLS_export;
export default _default;
