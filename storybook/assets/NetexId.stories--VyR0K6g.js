import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{n as i,t as a}from"./Stack-BRXXgmTA.js";import{n as o,t as s}from"./Typography-Df7J5NOK.js";import{n as c,t as l}from"./NetexId-COqH5nZQ.js";var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),i(),o(),c(),u=t(),d=`NSR:VehicleType:6f3a9e`,f=[`small`,`medium`,`large`],p={title:`components/NetexId`,component:l,parameters:{layout:`centered`,docs:{description:{component:"Read-only chip rendering a NeTEx id (`CODESPACE:TYPE:VALUE`). Optional version chip, tri-state copy button (`hide` / `show` / `onHover` / `only`), and four discrete sizes."}}},argTypes:{id:{control:`text`},version:{control:`text`},size:{control:`select`,options:f},copy:{control:`inline-radio`,options:[`hide`,`show`,`onHover`,`only`],description:"Copy-button visibility. `only` drops the chip entirely."},variant:{control:`inline-radio`,options:[`outlined`,`filled`]}}},m={args:{id:d,size:`medium`,copy:`show`,variant:`outlined`}},h={args:{id:d,copy:`onHover`}},g={args:{id:d,copy:`only`}},_={args:{id:d,version:3,copy:`show`}},v={args:{id:`abc-123`,copy:`hide`}},y={render:()=>(0,u.jsx)(a,{spacing:2,sx:{alignItems:`flex-start`},children:f.map(e=>(0,u.jsxs)(r,{sx:{display:`flex`,alignItems:`center`,gap:2},children:[(0,u.jsx)(s,{variant:`caption`,sx:{width:64,fontFamily:`monospace`},children:e}),(0,u.jsx)(l,{id:d,version:3,copy:`show`,size:e})]},e))})},b=[`WithControls`,`CopyOnHover`,`CopyOnly`,`Versioned`,`MalformedId`,`AllSizes`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    size: 'medium',
    copy: 'show',
    variant: 'outlined'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    copy: 'onHover'
  }
}`,...h.parameters?.docs?.source},description:{story:`\`copy: 'onHover'\` keeps the chip narrow at rest. The copy button slides in
when the chip is hovered or any child element is focused — try
tab-navigating to the chip with the keyboard.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    copy: 'only'
  }
}`,...g.parameters?.docs?.source},description:{story:`\`copy: 'only'\` drops the segmented label and renders just the copy
button. Use in dense meta rows where the id text would clutter the
layout but you still want a one-click copy. The tooltip embeds the
full id.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    id: SAMPLE_ID,
    version: 3,
    copy: 'show'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    id: 'abc-123',
    copy: 'hide'
  }
}`,...v.parameters?.docs?.source},description:{story:"Fewer than 3 segments — leftmost missing parts render as `???`. Useful\nwhen surfacing partial / malformed ids from upstream without crashing.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source},description:{story:`All four sizes side-by-side. Outer chip, version pill, copy button, and
font all scale proportionally.`,...y.parameters?.docs?.description}}}})))()}x();export{y as AllSizes,h as CopyOnHover,g as CopyOnly,v as MalformedId,_ as Versioned,m as WithControls,b as __namedExportsOrder,p as default};