import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{n as i,t as a}from"./Typography-Df7J5NOK.js";import{r as o,t as s}from"./transportMode-DhjbAMrW.js";import{n as c,t as l}from"./TransportModeIcon-D54J-w6l.js";var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),c(),o(),u=t(),d=s,f={title:`components/icons/TransportModeIcon`,component:l,parameters:{layout:`centered`,docs:{description:{component:"NeTEx TransportMode glyph backed by the inline SVG sprite. Icon-only renders with tooltip + aria-label; `iconPosition` shows a localized inline label on either side."}}},argTypes:{mode:{control:`select`,options:d,description:"NeTEx TransportMode (plus synthetic `unknown`)."},iconPosition:{control:`inline-radio`,options:[void 0,`left`,`right`],description:"Omit for icon-only (tooltip). `left` / `right` show inline label."}}},p={args:{mode:`RAIL`}},m={args:{mode:`BUS`,iconPosition:`left`}},h={args:{mode:`WATER`,iconPosition:`right`}},g={render:()=>(0,u.jsx)(r,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(8rem, 1fr))`,gap:2,p:2},children:d.map(e=>(0,u.jsxs)(r,{sx:{display:`flex`,alignItems:`center`,gap:1,p:1,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,u.jsx)(l,{mode:e}),(0,u.jsx)(a,{variant:`caption`,sx:{fontFamily:`monospace`},children:e})]},e))})},_=[`WithControls`,`LabelLeft`,`LabelRight`,`AllModes`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'RAIL'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'BUS',
    iconPosition: 'left'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'WATER',
    iconPosition: 'right'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source},description:{story:`Reference grid — every TransportMode rendered icon-only (hover for the
localized label) plus its enum id. Useful when picking glyphs or
confirming sprite coverage.`,...g.parameters?.docs?.description}}}})))()}v();export{g as AllModes,m as LabelLeft,h as LabelRight,p as WithControls,_ as __namedExportsOrder,f as default};