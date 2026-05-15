import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { PropType } from 'vue';
declare const __VLS_export: import('vue').DefineComponent<
  import('vue').ExtractPropTypes<{
    deck: {
      type: PropType<Deck>;
      required: true;
    };
    scale: {
      type: NumberConstructor;
      required: true;
    };
    selectedElements: {
      type: PropType<any[]>;
      default: () => never[];
    };
    elementToBuild: {
      type: PropType<any>;
      default: null;
    };
  }>,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    select: (...args: any[]) => void;
    'area-select': (...args: any[]) => void;
    drop: (...args: any[]) => void;
    updateElement: (...args: any[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      deck: {
        type: PropType<Deck>;
        required: true;
      };
      scale: {
        type: NumberConstructor;
        required: true;
      };
      selectedElements: {
        type: PropType<any[]>;
        default: () => never[];
      };
      elementToBuild: {
        type: PropType<any>;
        default: null;
      };
    }>
  > &
    Readonly<{
      onSelect?: ((...args: any[]) => any) | undefined;
      'onArea-select'?: ((...args: any[]) => any) | undefined;
      onDrop?: ((...args: any[]) => any) | undefined;
      onUpdateElement?: ((...args: any[]) => any) | undefined;
    }>,
  {
    selectedElements: any[];
    elementToBuild: any;
  },
  {},
  {},
  {},
  string,
  import('vue').ComponentProvideOptions,
  true,
  {},
  any
>;
declare const _default: typeof __VLS_export;
export default _default;
