import type { Deck } from '@/models/netex/deckplan/deck/deck';
import type { PropType } from 'vue';
import { type Availability } from '@/models/view/seats';
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
    availability: {
      type: PropType<Availability>;
    };
    vertical: {
      type: BooleanConstructor;
      default: boolean;
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
      availability: {
        type: PropType<Availability>;
      };
      vertical: {
        type: BooleanConstructor;
        default: boolean;
      };
    }>
  > &
    Readonly<{
      onSelect?: ((...args: any[]) => any) | undefined;
    }>,
  {
    vertical: boolean;
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
