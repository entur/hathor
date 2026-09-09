import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{D as n,Xt as r,at as i,k as a,lt as o,o as s,r as c,rt as l,t as u,tt as d,xt as f}from"./iframe-CWhZIATj.js";import{i as p,n as m,r as h,t as g}from"./ContentCopy-DyerXr6f.js";function _(e){let t=e.split(C);return t.length>=3?{code:t[0]||w,type:t[1]||w,value:t.slice(2).join(C)}:t.length===2?{code:w,type:t[0]||w,value:t[1]}:{code:w,type:w,value:t[0]??``}}function v({id:e,version:t,copy:n=`hide`,size:r=`medium`,sx:i,variant:s=`outlined`,...u}){let{t:f}=c(),{code:p,type:m,value:v}=_(e),w=E[r],D=n!==`hide`,[O,k]=(0,y.useState)(!1),A=(0,y.useRef)(null);(0,y.useEffect)(()=>()=>{A.current!==null&&window.clearTimeout(A.current)},[]);let j=t=>{t.stopPropagation(),navigator.clipboard.writeText(e),k(!0),A.current!==null&&window.clearTimeout(A.current),A.current=window.setTimeout(()=>k(!1),x)},M=O?f(`netex.copied`,`Copied!`):n===`only`?f(`netex.copyIdWith`,`Copy id {{id}}`,{id:e}):f(`netex.copyId`,`Copy id`);if(n===`only`)return(0,b.jsx)(a,{title:M,children:(0,b.jsx)(o,{size:`small`,onClick:j,className:S,"data-testid":`netex-id-copy`,"aria-label":M,sx:{width:w.btn,height:w.btn,p:0,"& svg":{fontSize:w.icon}},children:O?(0,b.jsx)(h,{fontSize:`inherit`}):(0,b.jsx)(g,{fontSize:`inherit`})})});let N=(0,b.jsxs)(d,{sx:{display:`inline-flex`,alignItems:`center`,gap:w.gap},children:[(0,b.jsxs)(`span`,{children:[`${p}${C}${m}${C}`,(0,b.jsx)(d,{component:`strong`,sx:{fontWeight:700},children:v})]}),t!=null&&(0,b.jsx)(l,{label:`v${t}`,size:`small`,variant:`filled`,"data-testid":`netex-id-version`,sx:{height:w.ver,borderRadius:w.ver/2,fontFamily:`monospace`,fontSize:w.verFont,"& .MuiChip-label":{px:.75}}}),D&&(0,b.jsx)(a,{title:M,children:(0,b.jsx)(o,{size:`small`,onClick:j,className:S,"data-testid":`netex-id-copy`,"aria-label":M,sx:{width:w.btn,height:w.btn,p:0,"& svg":{fontSize:w.icon}},children:O?(0,b.jsx)(h,{fontSize:`inherit`}):(0,b.jsx)(g,{fontSize:`inherit`})})})]}),P=n===`onHover`?{[`& .${S}`]:{display:`none`},[`&:hover .${S}, &:focus-within .${S}`]:{display:`inline-flex`}}:{};return(0,b.jsx)(l,{label:N,variant:s,"data-testid":`netex-id`,sx:{height:w.outer,borderRadius:w.outer/T,fontFamily:`monospace`,fontSize:w.idFont,maxWidth:`100%`,"& .MuiChip-label":{display:`flex`,alignItems:`center`},...P,...i},...u})}var y,b,x,S,C,w,T,E,D=e((()=>{y=t(r(),1),s(),m(),p(),u(),b=f(),x=1500,S=`netex-id-copy`,C=`:`,w=`???`,T=3,E={xsmall:{idFont:`0.625rem`,verFont:`0.5rem`,outer:20,ver:13,btn:14,icon:9,gap:.375},small:{idFont:`0.75rem`,verFont:`0.625rem`,outer:24,ver:16,btn:16,icon:11,gap:.5},medium:{idFont:`0.875rem`,verFont:`0.6875rem`,outer:32,ver:20,btn:20,icon:14,gap:.75},large:{idFont:`1rem`,verFont:`0.8125rem`,outer:40,ver:26,btn:26,icon:17,gap:1}},v.__docgenInfo={description:`Read-only chip rendering a NeTEx id, with the optional version surfaced as
a small nested chip (\`vN\`) inside the outer chip. Monospace label for
legibility; outlined outer + filled inner so the version reads as a badge.`,methods:[],displayName:`NetexId`,props:{id:{required:!0,tsType:{name:`string`},description:"Full NeTEx id of the form `CODESPACE:TYPE:VALUE`, e.g. `NMR:Vehicle:abc-123`."},version:{required:!1,tsType:{name:`union`,raw:`string | number`,elements:[{name:`string`},{name:`number`}]},description:"Optional version; rendered as a nested chip labelled `vN`."},copy:{required:!1,tsType:{name:`union`,raw:`'show' | 'hide' | 'onHover' | 'only'`,elements:[{name:`literal`,value:`'show'`},{name:`literal`,value:`'hide'`},{name:`literal`,value:`'onHover'`},{name:`literal`,value:`'only'`}]},description:"Copy-button visibility toggle. Defaults to `'hide'`.",defaultValue:{value:`'hide'`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`'xsmall' | 'small' | 'medium' | 'large'`,elements:[{name:`literal`,value:`'xsmall'`},{name:`literal`,value:`'small'`},{name:`literal`,value:`'medium'`},{name:`literal`,value:`'large'`}]},description:"Scales the chip and all sub-elements proportionally. Defaults to `'medium'`.",defaultValue:{value:`'medium'`,computed:!1}},variant:{defaultValue:{value:`'outlined'`,computed:!1},required:!1}},composes:[`Omit`]}})),O,k,A,j,M,N,P,F,I,L,R;e((()=>{s(),D(),O=f(),k=`NSR:VehicleType:6f3a9e`,A=[`xsmall`,`small`,`medium`,`large`],j={title:`data/netex/NetexId`,component:v,parameters:{layout:`centered`,docs:{description:{component:"Read-only chip rendering a NeTEx id (`CODESPACE:TYPE:VALUE`). Optional version chip, tri-state copy button (`hide` / `show` / `onHover` / `only`), and four discrete sizes."}}},argTypes:{id:{control:`text`},version:{control:`text`},size:{control:`select`,options:A},copy:{control:`inline-radio`,options:[`hide`,`show`,`onHover`,`only`],description:"Copy-button visibility. `only` drops the chip entirely."},variant:{control:`inline-radio`,options:[`outlined`,`filled`]}}},M={args:{id:k,size:`medium`,copy:`show`,variant:`outlined`}},N={args:{id:k,copy:`onHover`}},P={args:{id:k,copy:`only`}},F={args:{id:k,version:3,copy:`show`}},I={args:{id:`abc-123`,copy:`hide`}},L={render:()=>(0,O.jsx)(n,{spacing:2,sx:{alignItems:`flex-start`},children:A.map(e=>(0,O.jsxs)(d,{sx:{display:`flex`,alignItems:`center`,gap:2},children:[(0,O.jsx)(i,{variant:`caption`,sx:{width:64,fontFamily:`monospace`},children:e}),(0,O.jsx)(v,{id:k,version:3,copy:`show`,size:e})]},e))})},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    size: 'medium',
    copy: 'show',
    variant: 'outlined'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    copy: 'onHover'
  }
}`,...N.parameters?.docs?.source},description:{story:`\`copy: 'onHover'\` keeps the chip narrow at rest. The copy button slides in
when the chip is hovered or any child element is focused — try
tab-navigating to the chip with the keyboard.`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    copy: 'only'
  }
}`,...P.parameters?.docs?.source},description:{story:`\`copy: 'only'\` drops the segmented label and renders just the copy
button. Use in dense meta rows where the id text would clutter the
layout but you still want a one-click copy. The tooltip embeds the
full id.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    version: 3,
    copy: 'show'
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    id: 'abc-123',
    copy: 'hide'
  }
}`,...I.parameters?.docs?.source},description:{story:"Fewer than 3 segments — leftmost missing parts render as `???`. Useful\nwhen surfacing partial / malformed ids from upstream without crashing.",...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <Stack spacing={2} sx={{
    alignItems: 'flex-start'
  }}>
      {SIZES.map(size => <Box key={size} sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}>
          <Typography variant="caption" sx={{
        width: 64,
        fontFamily: 'monospace'
      }}>
            {size}
          </Typography>
          <NetexId id={SAMPLE_ID} version={3} copy="show" size={size} />
        </Box>)}
    </Stack>
}`,...L.parameters?.docs?.source},description:{story:`All four sizes side-by-side. Outer chip, version pill, copy button, and
font all scale proportionally.`,...L.parameters?.docs?.description}}},R=[`WithControls`,`CopyOnHover`,`CopyOnly`,`Versioned`,`MalformedId`,`AllSizes`]}))();export{L as AllSizes,N as CopyOnHover,P as CopyOnly,I as MalformedId,F as Versioned,M as WithControls,R as __namedExportsOrder,j as default};