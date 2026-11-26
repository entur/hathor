const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./netex-deckplan-editor.es-DMDvoRXw.js","./rolldown-runtime-BCiCTKAo.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{n as t,t as n}from"./preload-helper--ocVCp21.js";import{t as r}from"./react-BbeNlDUO.js";import{d as i,f as a}from"./DefaultPropsProvider-D68BqLsB.js";import{t as o}from"./jsx-runtime-BB9-612F.js";import{n as s,t as c}from"./Box-C0BOFjz-.js";import{n as l,t as u}from"./Alert-DaQM7GbH.js";import{n as d,t as f}from"./useTranslation-DWliA1VU.js";function p(){return _??=n(()=>import(`./netex-deckplan-editor.es-DMDvoRXw.js`).then(e=>m().then(()=>e.default)),__vite__mapDeps([0,1]),import.meta.url).catch(e=>{throw _=null,e})}function m(){let e,t=new Promise((t,n)=>{e=setTimeout(()=>n(Error(`<${h}> was not registered within ${g} ms`)),g)});return Promise.race([customElements.whenDefined(h),t]).then(()=>void 0).finally(()=>clearTimeout(e))}var h,g,_;function v(){return(v=e((()=>{t(),h=`deck-rendering`,g=1e4,_=null})))()}function y(e,t){if(e.querySelector(`style[${b}]`))return;let n=e.ownerDocument.createElement(`style`);n.setAttribute(b,``),n.textContent=t,e.append(n)}var b,x;function S(){return(S=e((()=>{b=`data-deck-style`,x=e=>`
    .vehicle-frame { background-color: ${e.frame}; border-radius: 4px; }
    .vehicle-deck  { fill: ${e.deck}; stroke: ${e.deckLine}; stroke-width: 2px; rx: 5px; }
    .seat .seat__base      { fill: ${e.seat}; stroke: ${e.seatLine}; stroke-width: 1px; rx: 5px; }
    .seat .seat__backrest  { fill: ${e.seatLine}; }
    .seat__text            { fill: ${e.label}; stroke: none; pointer-events: none; }
    .door                  { fill: ${e.seatLine}; stroke: ${e.seatLine}; stroke-width: 1px; }
    /* Read-only view — the element still emits \`select\`, but nothing consumes it. */
    .seat, .door { cursor: default; }
  `})))()}function C({deck:e,scale:t=36,vertical:n=!1,"data-testid":r}){let{t:i}=d(),o=(0,w.useRef)(null),[s,l]=(0,w.useState)(!1),{palette:f}=a(),m=(0,w.useMemo)(()=>x({frame:f.background.default,deck:f.background.paper,deckLine:f.divider,seat:f.action.selected,seatLine:f.text.secondary,label:f.text.primary}),[f]);return(0,w.useEffect)(()=>{let r=o.current,i=!0;return l(!1),p().then(()=>{if(!i||!r)return;let a=document.createElement(h);Object.assign(a,{deck:e,scale:t,vertical:n}),r.replaceChildren(a);try{a.shadowRoot&&y(a.shadowRoot,m)}catch{}}).catch(()=>{i&&l(!0)}),()=>{i=!1,r?.replaceChildren()}},[e,t,n,m]),(0,T.jsxs)(T.Fragment,{children:[s&&(0,T.jsx)(u,{severity:`error`,variant:`outlined`,"data-testid":r?`${r}-error`:void 0,children:i(`deckPlans.render.deckError`)}),(0,T.jsx)(c,{ref:o,"data-testid":r,sx:{lineHeight:0}})]})}var w,T;function E(){return(E=e((()=>{w=r(),l(),s(),i(),f(),v(),S(),T=o(),C.__docgenInfo={description:`Read-only SVG rendering of a single deck, backed by the editor package's
\`<deck-rendering>\` custom element.

The element is created and populated imperatively rather than written as
JSX. Vue renders custom elements in \`connectedCallback\`, and the component's
\`stageSize\` dereferences \`deck.getBoundingBox()\` on that first pass — so a
React-inserted element would throw before any effect could assign \`deck\`.
Creating it detached, assigning props, then inserting sidesteps that and
removes the need to augment \`JSX.IntrinsicElements\`.

Renders nothing until the bundle has loaded; callers own the loading UI.
A mount that throws reports itself in place rather than rendering nothing,
which would read as "this deck is empty" while the strip around it looks
healthy. In practice \`DeckStrip\` catches a failed bundle load first, so that
branch is a guard for standalone use (the stories mount this directly), not
a path the app reaches.

Styling is applied after insertion and cannot fail the rendering — see
\`deckRenderingStyles\`.`,methods:[],displayName:`DeckRendering`,props:{deck:{required:!0,tsType:{name:`Deck`},description:"Deck to draw — must come from the renderer bundle's own `parseNeTEx`."},scale:{required:!1,tsType:{name:`number`},description:`px per metre; omitting it upstream collapses the SVG to 10×10.`,defaultValue:{value:`36`,computed:!1}},vertical:{required:!1,tsType:{name:`boolean`},description:`Rotate 90° so the deck draws as a tall column instead of a wide strip.`,defaultValue:{value:`false`,computed:!1}},"data-testid":{required:!1,tsType:{name:`string`},description:`Forwarded to the host element for test targeting.`}}}})))()}export{p as i,E as n,v as r,C as t};