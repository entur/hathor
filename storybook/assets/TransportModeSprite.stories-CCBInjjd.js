import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{n as i,t as a}from"./Typography-Df7J5NOK.js";import{M as o,j as s}from"./iframe-DfVmPrTe.js";import{r as c,t as l}from"./transportMode-DhjbAMrW.js";import{n as u,t as d}from"./transportModeIconHelpers-6rBW9byz.js";var f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),c(),u(),o(),f=t(),p=32,m=`7.5rem`,h={title:`components/icons/TransportModeSprite`,component:s,parameters:{layout:`fullscreen`,docs:{description:{component:'Raw sprite showcase — every `<symbol id="tm-*">` rendered straight from the sprite, bypassing `TransportModeIcon` (which is locked to 16px). Colour comes from the `--tm-<MODE>` token via `colorVarFor`, applied to `color` and picked up by the paths\' `fill="currentColor"`. Modes without bespoke art alias `#tm-fallback`, so they all render the same generic glyph — visible here as repeated shapes.'}}},argTypes:{size:{control:{type:`range`,min:16,max:128,step:8},description:`Rendered glyph width/height in px.`}},args:{size:p}},g=({mode:e,px:t})=>(0,f.jsx)(`svg`,{width:t,height:t,role:`img`,"aria-label":e,style:{color:d(e)},children:(0,f.jsx)(`use`,{href:`#tm-${e}`})}),_={render:({size:e})=>(0,f.jsx)(r,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(${m}, 1fr))`,gap:2,p:3},children:l.map(t=>(0,f.jsxs)(r,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`flex-end`,gap:1,p:1.5,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,f.jsx)(g,{mode:t,px:e}),(0,f.jsx)(a,{variant:`caption`,sx:{fontFamily:`monospace`,textAlign:`center`,wordBreak:`break-all`},children:t})]},t))})},v=[`AllSymbols`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: ({
    size
  }) => <Box sx={{
    display: 'grid',
    gridTemplateColumns: \`repeat(auto-fill, minmax(\${CELL_MIN}, 1fr))\`,
    gap: 2,
    p: 3
  }}>
      {TRANSPORT_MODES.map(mode => <Box key={mode} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 1,
      p: 1.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1
    }}>
          <Glyph mode={mode} px={size} />
          <Typography variant="caption" sx={{
        fontFamily: 'monospace',
        textAlign: 'center',
        wordBreak: 'break-all'
      }}>
            {mode}
          </Typography>
        </Box>)}
    </Box>
}`,..._.parameters?.docs?.source},description:{story:`Reference grid — all 21 \`TransportMode\` symbols scaled up, each above its
enum id. Use it to spot missing art (duplicate fallback glyphs), check a
shape at a size the 16px component can't show, or eyeball token hues
against each other.`,..._.parameters?.docs?.description}}}})))()}y();export{_ as AllSymbols,v as __namedExportsOrder,h as default};