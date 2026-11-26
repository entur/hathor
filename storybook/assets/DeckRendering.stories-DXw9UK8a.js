import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{t as n}from"./jsx-runtime-BB9-612F.js";import{n as r,t as i}from"./Box-C0BOFjz-.js";import{n as a,t as o}from"./Stack-BRXXgmTA.js";import{n as s,t as c}from"./Typography-Df7J5NOK.js";import{i as l,n as u,r as d,t as f}from"./DeckRendering-wumRDtzQ.js";function p(e,t=`SAMPLE:DeckPlan:1`){let n=e.map(m).join(``);return`<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <CompositeFrame version="1" id="SAMPLE:CompositeFrame:1">
      <frames>
        <ResourceFrame version="1" id="SAMPLE:ResourceFrame:1">
          <deckPlans>
            <DeckPlan version="1" id="${t}">
              ${e.length===0?`<decks/>`:`<decks>${n}</decks>`}
            </DeckPlan>
          </deckPlans>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`}function m({name:e,seats:t},n){let r=Math.ceil(t/2),i=Array.from({length:t},(e,t)=>h(n,t)).join(``);return`
                <Deck version="1" id="SAMPLE:Deck:${n+1}">
                  ${e?`<Name>${e}</Name>`:``}
                  <deckSpaces>
                    <PassengerSpace version="1" id="SAMPLE:PassengerSpace:${n+1}">
                      <passengerSpots>${i}
                      </passengerSpots>
                    </PassengerSpace>
                  </deckSpaces>
                  <Width>${y}</Width>
                  <Length>${(r+1)*g+.6}</Length>
                </Deck>`}function h(e,t){let n=Math.floor(t/2),r=t%2,i=1.2+n*g,a=y/2+(r?_:-.75);return`
                        <PassengerSpot version="1" id="SAMPLE:PassengerSpot:${e+1}-${t+1}">
                          <Label>${n+1}${r?`B`:`A`}</Label>
                          <Orientation>backwards</Orientation>
                          <Centroid><Location><pos>${i.toFixed(2)} ${a.toFixed(2)}</pos></Location></Centroid>
                          <Width>${v}</Width>
                          <Length>${v}</Length>
                        </PassengerSpot>`}var g,_,v,y;function b(){return(b=e((()=>{g=.9,_=.75,v=.7,y=2.825})))()}function x(e,t=0){let[n,r]=(0,w.useState)(null);return(0,w.useEffect)(()=>{let n=!0;return l().then(i=>{n&&r(i.parseNeTEx(e)[0]?.decks[t]??null)}),()=>{n=!1}},[e,t]),n}function S({label:e,xml:t,vertical:n,scale:r}){let a=x(t);return(0,T.jsxs)(o,{spacing:.5,sx:{alignItems:`flex-start`},children:[(0,T.jsx)(c,{variant:`caption`,sx:{color:`text.secondary`},children:e}),a?(0,T.jsx)(f,{deck:a,vertical:n,scale:r,"data-testid":`deck-${e}`}):(0,T.jsx)(i,{sx:{width:80,height:40}})]})}async function C(e){let t=null;return await D(()=>{t=e.querySelector(`deck-rendering`)?.shadowRoot?.querySelector(`svg.vehicle-frame`)??null,E(t).not.toBeNull()}),t}var w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{w=t(),r(),a(),s(),u(),d(),b(),T=n(),{expect:E,waitFor:D}=__STORYBOOK_MODULE_TEST__,O=p([{seats:8}]),k={title:`data/deck-plans/DeckRendering`,component:f,parameters:{layout:`padded`,docs:{description:{component:"Read-only SVG deck rendering, backed by `<deck-rendering>` from `@opentrainticketing/netex-deckplan-editor`. The element is created detached and populated before insertion — Vue renders in `connectedCallback` and dereferences `deck.getBoundingBox()` there, so a deck assigned after insertion is too late. `scale` is mandatory upstream (`stageSize` multiplies by `props.scale ?? 0`), hence the `DECK_SCALE` default. Decks are drawn `vertical` in the sidebar so several fit side by side."}}}},A=p([{seats:46}]),j={render:()=>(0,T.jsx)(S,{label:`ghost`,xml:A,vertical:!0}),play:async({canvasElement:e})=>{let t=await C(e);E(t.getBoundingClientRect().height).toBeGreaterThan(100);let n=t.querySelector(`rect.vehicle-deck`);E(getComputedStyle(n).stroke).not.toBe(`rgb(128, 128, 128)`)}},M={render:()=>(0,T.jsxs)(o,{direction:`row`,spacing:4,sx:{alignItems:`flex-start`},children:[(0,T.jsx)(S,{label:`vertical`,xml:O,vertical:!0}),(0,T.jsx)(S,{label:`horizontal`,xml:O})]}),play:async({canvasElement:e})=>{let t=await C(e);await D(()=>E(t.querySelectorAll(`g.seat`)).toHaveLength(8));let n=getComputedStyle(t.querySelector(`rect.seat__base`)).fill,r=getComputedStyle(t.querySelector(`text.seat__text`)).fill;E(n).not.toBe(`rgb(0, 0, 0)`),E(n).not.toBe(r)}},N={render:()=>(0,T.jsx)(o,{direction:`row`,spacing:4,sx:{alignItems:`flex-start`},children:[18,36,72].map(e=>(0,T.jsx)(S,{label:`scale ${e}`,xml:O,vertical:!0,scale:e},e))})},P=[`Ghost`,`Orientations`,`Scales`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <Framed label="ghost" xml={GHOST_XML} vertical />,
  play: async ({
    canvasElement
  }) => {
    const svg = await waitForSvg(canvasElement);
    // Non-degenerate box proves \`scale\` reached the element — unset, the
    // element's own \`?? 0\` collapses it to the 10px padding alone.
    expect(svg.getBoundingClientRect().height).toBeGreaterThan(100);

    // hathor's CSS must reach the shadow root: the package ships its renderer
    // styles to a CSS file its \`exports\` map doesn't expose, so nothing styles
    // it otherwise. Asserted through the cascade rather than through the
    // delivery mechanism — unstyled, the outline falls back to \`getShape()\`'s
    // \`stroke: 'gray'\` presentation attribute.
    const outline = svg.querySelector('rect.vehicle-deck')!;
    expect(getComputedStyle(outline).stroke).not.toBe('rgb(128, 128, 128)');
  }
}`,...j.parameters?.docs?.source},description:{story:"The `SAMPLE` fallback — what renders when a real plan carries an empty\n`<decks/>`. A full carriage's worth of seats, so it reads as a real layout.",...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" spacing={4} sx={{
    alignItems: 'flex-start'
  }}>
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
}`,...M.parameters?.docs?.source},description:{story:"A populated deck, in both orientations. `vertical` is what the sidebar uses:\neight seats fit a narrow column, where the native orientation overflows.",...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" spacing={4} sx={{
    alignItems: 'flex-start'
  }}>
      {[DECK_SCALE / 2, DECK_SCALE, DECK_SCALE * 2].map(s => <Framed key={s} label={\`scale \${s}\`} xml={SAMPLE_XML} vertical scale={s} />)}
    </Stack>
}`,...N.parameters?.docs?.source},description:{story:`Scale sweep — confirms px-per-metre is honoured and nothing clips.`,...N.parameters?.docs?.description}}}})))()}F();export{j as Ghost,M as Orientations,N as Scales,P as __namedExportsOrder,k as default};