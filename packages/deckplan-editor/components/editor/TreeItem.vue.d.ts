interface TreeChild {
  label: string;
  id: string;
  icon: string;
  children?: TreeChild[];
}
type __VLS_Props = {
  label: string;
  id: string;
  icon: string;
  children?: TreeChild[];
  selectedId?: string;
};
declare const __VLS_export: import('vue').DefineComponent<
  __VLS_Props,
  {},
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {} & {
    select: (id: string) => any;
    move: (data: {
      sourceId: string;
      targetId: string;
      position?: 'before' | 'inside' | 'after';
    }) => any;
    dropNew: (data: { targetId: string; position?: 'before' | 'inside' | 'after' }) => any;
  },
  string,
  import('vue').PublicProps,
  Readonly<__VLS_Props> &
    Readonly<{
      onSelect?: ((id: string) => any) | undefined;
      onMove?:
        | ((data: {
            sourceId: string;
            targetId: string;
            position?: 'before' | 'inside' | 'after';
          }) => any)
        | undefined;
      onDropNew?:
        | ((data: { targetId: string; position?: 'before' | 'inside' | 'after' }) => any)
        | undefined;
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
