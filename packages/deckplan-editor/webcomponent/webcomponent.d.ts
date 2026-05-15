declare const _default: {
  DeckRenderingElement: import('vue').VueElementConstructor<
    import('vue').ExtractPropTypes<{
      deck: {
        type: import('vue').PropType<import('..').Deck>;
        required: true;
      };
      scale: {
        type: NumberConstructor;
        required: true;
      };
      availability: {
        type: import('vue').PropType<import('..').Availability>;
      };
      vertical: {
        type: BooleanConstructor;
        default: boolean;
      };
    }>
  >;
  parseNeTEx: (xml: string) => import('..').DeckPlan[];
};
export default _default;
