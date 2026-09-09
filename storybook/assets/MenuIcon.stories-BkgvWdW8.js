import{i as e}from"./preload-helper-xPQekRTU.js";import{at as t,o as n,tt as r,xt as i}from"./iframe-CWhZIATj.js";import{n as a,t as o}from"./MenuIcon-CFnUbyZU.js";var s,c,l,u,d,f;e((()=>{n(),a(),s=i(),c=[`home`,`vehicleTypes`,`vehicles`,`deckPlans`,`menu`],l={title:`components/icons/MenuIcon`,component:o,parameters:{layout:`centered`,docs:{description:{component:'Navigation-rail glyph backed by the inline `MenuIconSprite` (`<use href="#menu-…">`). Paths are sourced from `@mui/icons-material` (Apache-2.0). Fills with `currentColor` — set `color` on a parent to recolour. `vehicleTypes` (outline) is the wireframe abstraction of solid `vehicles`.'}}},argTypes:{name:{control:`select`,options:c,description:`Sprite symbol to render.`},size:{control:{type:`number`},description:`Square px size (default 24).`}}},u={args:{name:`vehicles`,size:64}},d={render:()=>(0,s.jsxs)(r,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(9rem, 1fr))`,gap:2,p:2},children:[c.map(e=>(0,s.jsxs)(r,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:1,p:1.5,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,s.jsx)(o,{name:e,size:56}),(0,s.jsx)(t,{variant:`caption`,sx:{fontFamily:`monospace`},children:e}),(0,s.jsxs)(r,{sx:{display:`flex`,alignItems:`center`,gap:1.5},children:[(0,s.jsx)(o,{name:e,size:24}),(0,s.jsx)(o,{name:e,size:28})]})]},e)),(0,s.jsxs)(r,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:1,p:1.5,borderRadius:1,bgcolor:`primary.main`,color:`primary.contrastText`},children:[(0,s.jsx)(o,{name:`vehicles`,size:56}),(0,s.jsx)(t,{variant:`caption`,children:`currentColor`})]})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'vehicles',
    size: 64
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Box sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
    gap: 2,
    p: 2
  }}>
      {ALL_NAMES.map(name => <Box key={name} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      p: 1.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1
    }}>
          <MenuIcon name={name} size={56} />
          <Typography variant="caption" sx={{
        fontFamily: 'monospace'
      }}>
            {name}
          </Typography>
          <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
            <MenuIcon name={name} size={24} />
            <MenuIcon name={name} size={28} />
          </Box>
        </Box>)}
      {/* currentColor demo: tinted box drives the glyph colour. */}
      <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      p: 1.5,
      borderRadius: 1,
      bgcolor: 'primary.main',
      color: 'primary.contrastText'
    }}>
        <MenuIcon name="vehicles" size={56} />
        <Typography variant="caption">currentColor</Typography>
      </Box>
    </Box>
}`,...d.parameters?.docs?.source},description:{story:"Reference grid — every menu glyph at preview size plus the actual rail sizes\n(24px nav icon, 28px toggle). The last cell sits on a tinted surface to show\n`currentColor` recolouring (the active-item behaviour in `Menu.tsx`).",...d.parameters?.docs?.description}}},f=[`WithControls`,`AllIcons`]}))();export{d as AllIcons,u as WithControls,f as __namedExportsOrder,l as default};