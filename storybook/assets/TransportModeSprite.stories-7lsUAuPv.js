import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,at as n,dt as r,i,kt as a,o}from"./iframe-D7q1UzBu.js";import{i as s,n as c,r as l,t as u}from"./transportModeIconHelpers-BT3uIeXh.js";var d,f,p,m,h,g,_;e((()=>{o(),s(),c(),t(),d=a(),f=32,p=`7.5rem`,m={title:`components/icons/TransportModeSprite`,component:i,parameters:{layout:`fullscreen`,docs:{description:{component:'Raw sprite showcase — every `<symbol id="tm-*">` rendered straight from the sprite, bypassing `TransportModeIcon` (which is locked to 16px). Colour comes from the `--tm-<MODE>` token via `colorVarFor`, applied to `color` and picked up by the paths\' `fill="currentColor"`. Modes without bespoke art alias `#tm-fallback`, so they all render the same generic glyph — visible here as repeated shapes.'}}},argTypes:{size:{control:{type:`range`,min:16,max:128,step:8},description:`Rendered glyph width/height in px.`}},args:{size:f}},h=({mode:e,px:t})=>(0,d.jsx)(`svg`,{width:t,height:t,role:`img`,"aria-label":e,style:{color:u(e)},children:(0,d.jsx)(`use`,{href:`#tm-${e}`})}),g={render:({size:e})=>(0,d.jsx)(n,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(${p}, 1fr))`,gap:2,p:3},children:l.map(t=>(0,d.jsxs)(n,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`flex-end`,gap:1,p:1.5,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,d.jsx)(h,{mode:t,px:e}),(0,d.jsx)(r,{variant:`caption`,sx:{fontFamily:`monospace`,textAlign:`center`,wordBreak:`break-all`},children:t})]},t))})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source},description:{story:`Reference grid — all 21 \`TransportMode\` symbols scaled up, each above its
enum id. Use it to spot missing art (duplicate fallback glyphs), check a
shape at a size the 16px component can't show, or eyeball token hues
against each other.`,...g.parameters?.docs?.description}}},_=[`AllSymbols`]}))();export{g as AllSymbols,_ as __namedExportsOrder,m as default};