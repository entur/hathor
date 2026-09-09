import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{at as n,dt as r,in as i,j as a,kt as o,o as s}from"./iframe-D7q1UzBu.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./sampleDeckPlanXml-iRJNbK3Q.js";function g(e,t=0){let[n,r]=(0,y.useState)(null);return(0,y.useEffect)(()=>{let n=!0;return l().then(i=>{n&&r(i.parseNeTEx(e)[0]?.decks[t]??null)}),()=>{n=!1}},[e,t]),n}function _({label:e,xml:t,vertical:i,scale:o}){let s=g(t);return(0,b.jsxs)(a,{spacing:.5,alignItems:`flex-start`,children:[(0,b.jsx)(r,{variant:`caption`,color:`text.secondary`,children:e}),s?(0,b.jsx)(p,{deck:s,vertical:i,scale:o,"data-testid":`deck-${e}`}):(0,b.jsx)(n,{sx:{width:80,height:40}})]})}async function v(e){let t=null;return await S(()=>{t=e.querySelector(`deck-rendering`)?.shadowRoot?.querySelector(`svg.vehicle-frame`)??null,x(t).not.toBeNull()}),t}var y,b,x,S,C,w,T,E,D,O;e((()=>{y=t(i(),1),s(),u(),m(),f(),h(),b=o(),{expect:x,waitFor:S}=__STORYBOOK_MODULE_TEST__,C=d([{seats:8}]),w={title:`data/deck-plans/DeckRendering`,component:p,parameters:{layout:`padded`,docs:{description:{component:"Read-only SVG deck rendering, backed by `<deck-rendering>` from `@opentrainticketing/netex-deckplan-editor`. The element is created detached and populated before insertion — Vue renders in `connectedCallback` and dereferences `deck.getBoundingBox()` there, so a deck assigned after insertion is too late. `scale` is mandatory upstream (`stageSize` multiplies by `props.scale ?? 0`), hence the `DECK_SCALE` default. Decks are drawn `vertical` in the sidebar so several fit side by side."}}}},T={render:()=>(0,b.jsx)(_,{label:`ghost`,xml:c,vertical:!0}),play:async({canvasElement:e})=>{let t=await v(e);x(t.getBoundingClientRect().height).toBeGreaterThan(100);let n=e.querySelector(`deck-rendering`).shadowRoot;x(n.adoptedStyleSheets.length).toBeGreaterThan(0);let r=t.querySelector(`rect.vehicle-deck`);x(getComputedStyle(r).stroke).not.toBe(`rgb(128, 128, 128)`)}},E={render:()=>(0,b.jsxs)(a,{direction:`row`,spacing:4,alignItems:`flex-start`,children:[(0,b.jsx)(_,{label:`vertical`,xml:C,vertical:!0}),(0,b.jsx)(_,{label:`horizontal`,xml:C})]}),play:async({canvasElement:e})=>{let t=await v(e);await S(()=>x(t.querySelectorAll(`g.seat`)).toHaveLength(8));let n=getComputedStyle(t.querySelector(`rect.seat__base`)).fill,r=getComputedStyle(t.querySelector(`text.seat__text`)).fill;x(n).not.toBe(`rgb(0, 0, 0)`),x(n).not.toBe(r)}},D={render:()=>(0,b.jsx)(a,{direction:`row`,spacing:4,alignItems:`flex-start`,children:[36/2,36,72].map(e=>(0,b.jsx)(_,{label:`scale ${e}`,xml:C,vertical:!0,scale:e},e))})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Framed label="ghost" xml={GHOST_DECK_PLAN_XML} vertical />,
  play: async ({
    canvasElement
  }) => {
    const svg = await waitForSvg(canvasElement);
    // Non-degenerate box proves \`scale\` reached the element — unset, the
    // element's own \`?? 0\` collapses it to the 10px padding alone.
    expect(svg.getBoundingClientRect().height).toBeGreaterThan(100);

    // hathor's sheet must be adopted: the package ships its renderer styles to
    // a CSS file its \`exports\` map doesn't expose, so nothing styles the
    // shadow root otherwise.
    const root = canvasElement.querySelector('deck-rendering')!.shadowRoot!;
    expect(root.adoptedStyleSheets.length).toBeGreaterThan(0);

    // Unstyled, the outline falls back to \`getShape()\`'s \`stroke: 'gray'\`
    // presentation attribute. Anything else means the sheet won the cascade.
    const outline = svg.querySelector('rect.vehicle-deck')!;
    expect(getComputedStyle(outline).stroke).not.toBe('rgb(128, 128, 128)');
  }
}`,...T.parameters?.docs?.source},description:{story:"The `SAMPLE` fallback — what renders when a real plan carries an empty\n`<decks/>`. Backed by Wagon_2's deck, so it looks like a real layout.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" spacing={4} alignItems="flex-start">
      <Framed label="vertical" xml={SAMPLE_XML} vertical />
      <Framed label="horizontal" xml={SAMPLE_XML} />
    </Stack>,
  play: async ({
    canvasElement
  }) => {
    const svg = await waitForSvg(canvasElement);
    // Seats only render when the parsed deck spaces satisfy the bundle's own
    // \`instanceof PassengerSpace\` — this is the class-identity guard.
    await waitFor(() => expect(svg.querySelectorAll('g.seat')).toHaveLength(8));

    // Unstyled, seat bodies and their labels both compute to solid black —
    // legible only by accident. Both must be painted, and distinguishable.
    const base = getComputedStyle(svg.querySelector('rect.seat__base')!).fill;
    const label = getComputedStyle(svg.querySelector('text.seat__text')!).fill;
    expect(base).not.toBe('rgb(0, 0, 0)');
    expect(base).not.toBe(label);
  }
}`,...E.parameters?.docs?.source},description:{story:"A populated deck, in both orientations. `vertical` is what the sidebar uses:\neight seats fit a narrow column, where the native orientation overflows.",...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" spacing={4} alignItems="flex-start">
      {[DECK_SCALE / 2, DECK_SCALE, DECK_SCALE * 2].map(s => <Framed key={s} label={\`scale \${s}\`} xml={SAMPLE_XML} vertical scale={s} />)}
    </Stack>
}`,...D.parameters?.docs?.source},description:{story:`Scale sweep — confirms px-per-metre is honoured and nothing clips.`,...D.parameters?.docs?.description}}},O=[`Ghost`,`Orientations`,`Scales`]}))();export{T as Ghost,E as Orientations,D as Scales,O as __namedExportsOrder,w as default};