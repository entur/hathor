import{i as e}from"./preload-helper-xPQekRTU.js";import{at as t,k as n,o as r,r as i,t as a,tt as o,xt as s}from"./iframe-CWhZIATj.js";import{a as c,i as l,n as u,r as d,t as f}from"./transportModeIconHelpers-BT3uIeXh.js";function p({mode:e,iconPosition:t}){let{t:r}=i(),a=r(c(e),e),s=(0,m.jsx)(`svg`,{width:h,height:h,role:`img`,"aria-hidden":t===void 0?void 0:!0,"aria-label":t===void 0?a:void 0,style:{color:f(e),flexShrink:0},children:(0,m.jsx)(`use`,{href:`#tm-${e}`})});return t===void 0?(0,m.jsx)(n,{title:a,children:s}):(0,m.jsxs)(o,{component:`span`,sx:{display:`inline-flex`,alignItems:`center`,gap:.5},children:[t===`left`?s:null,(0,m.jsx)(`span`,{children:a}),t===`right`?s:null]})}var m,h,g=e((()=>{r(),a(),l(),u(),m=s(),h=16,p.__docgenInfo={description:"Render a NeTEx TransportMode glyph. Backed by the inline SVG sprite in\n{@link TransportModeSprite}. Three rendering modes:\n\n- `iconPosition` omitted → icon only with tooltip + `aria-label`\n- `iconPosition === 'left'`  → `[icon] [label]`\n- `iconPosition === 'right'` → `[label] [icon]`\n\nThe visible / tooltip label comes from the existing `transportMode.*`\ni18n keys via {@link transportModeLabelKey}. No `label` prop override —\nthe locale bundle is the single source of truth.\n\n@param mode A NeTEx TransportMode (incl. synthetic `'unknown'`).\n@param iconPosition Optional inline-label layout; omit for icon-only.\n@returns The icon (with tooltip) or icon+label inline group.",methods:[],displayName:`TransportModeIcon`,props:{mode:{required:!0,tsType:{name:`unknown[number]`,raw:`(typeof TRANSPORT_MODES)[number]`},description:``},iconPosition:{required:!1,tsType:{name:`union`,raw:`'left' | 'right'`,elements:[{name:`literal`,value:`'left'`},{name:`literal`,value:`'right'`}]},description:`When set, render the localized label inline with the icon on the given
side. When omitted, render icon only — the label is exposed as
\`aria-label\` and surfaced via a MUI tooltip on hover.`}}}})),_,v,y,b,x,S,C,w;e((()=>{r(),g(),l(),_=s(),v=d,y={title:`components/icons/TransportModeIcon`,component:p,parameters:{layout:`centered`,docs:{description:{component:"NeTEx TransportMode glyph backed by the inline SVG sprite. Icon-only renders with tooltip + aria-label; `iconPosition` shows a localized inline label on either side."}}},argTypes:{mode:{control:`select`,options:v,description:"NeTEx TransportMode (plus synthetic `unknown`)."},iconPosition:{control:`inline-radio`,options:[void 0,`left`,`right`],description:"Omit for icon-only (tooltip). `left` / `right` show inline label."}}},b={args:{mode:`RAIL`}},x={args:{mode:`BUS`,iconPosition:`left`}},S={args:{mode:`WATER`,iconPosition:`right`}},C={render:()=>(0,_.jsx)(o,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(8rem, 1fr))`,gap:2,p:2},children:v.map(e=>(0,_.jsxs)(o,{sx:{display:`flex`,alignItems:`center`,gap:1,p:1,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,_.jsx)(p,{mode:e}),(0,_.jsx)(t,{variant:`caption`,sx:{fontFamily:`monospace`},children:e})]},e))})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'RAIL'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'BUS',
    iconPosition: 'left'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'WATER',
    iconPosition: 'right'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Box sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
    gap: 2,
    p: 2
  }}>
      {ALL_MODES.map(mode => <Box key={mode} sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      p: 1,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1
    }}>
          <TransportModeIcon mode={mode} />
          <Typography variant="caption" sx={{
        fontFamily: 'monospace'
      }}>
            {mode}
          </Typography>
        </Box>)}
    </Box>
}`,...C.parameters?.docs?.source},description:{story:`Reference grid — every TransportMode rendered icon-only (hover for the
localized label) plus its enum id. Useful when picking glyphs or
confirming sprite coverage.`,...C.parameters?.docs?.description}}},w=[`WithControls`,`LabelLeft`,`LabelRight`,`AllModes`]}))();export{C as AllModes,x as LabelLeft,S as LabelRight,b as WithControls,w as __namedExportsOrder,y as default};