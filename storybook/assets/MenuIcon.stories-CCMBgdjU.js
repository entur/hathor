import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{n as i,t as a}from"./Typography-Df7J5NOK.js";import{n as o,t as s}from"./MenuIcon-Ce-j-yan.js";var c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i(),o(),c=t(),l=[`home`,`vehicleTypes`,`vehicles`,`deckPlans`,`menu`],u={title:`components/icons/MenuIcon`,component:s,parameters:{layout:`centered`,docs:{description:{component:'Navigation-rail glyph backed by the inline `MenuIconSprite` (`<use href="#menu-…">`). Paths are sourced from `@mui/icons-material` (Apache-2.0). Fills with `currentColor` — set `color` on a parent to recolour. `vehicleTypes` (outline) is the wireframe abstraction of solid `vehicles`.'}}},argTypes:{name:{control:`select`,options:l,description:`Sprite symbol to render.`},size:{control:{type:`number`},description:`Square px size (default 24).`}}},d={args:{name:`vehicles`,size:64}},f={render:()=>(0,c.jsxs)(r,{sx:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(9rem, 1fr))`,gap:2,p:2},children:[l.map(e=>(0,c.jsxs)(r,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:1,p:1.5,border:`1px solid`,borderColor:`divider`,borderRadius:1},children:[(0,c.jsx)(s,{name:e,size:56}),(0,c.jsx)(a,{variant:`caption`,sx:{fontFamily:`monospace`},children:e}),(0,c.jsxs)(r,{sx:{display:`flex`,alignItems:`center`,gap:1.5},children:[(0,c.jsx)(s,{name:e,size:24}),(0,c.jsx)(s,{name:e,size:28})]})]},e)),(0,c.jsxs)(r,{sx:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:1,p:1.5,borderRadius:1,bgcolor:`primary.main`,color:`primary.contrastText`},children:[(0,c.jsx)(s,{name:`vehicles`,size:56}),(0,c.jsx)(a,{variant:`caption`,children:`currentColor`})]})]})},p=[`WithControls`,`AllIcons`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'vehicles',
    size: 64
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source},description:{story:"Reference grid — every menu glyph at preview size plus the actual rail sizes\n(24px nav icon, 28px toggle). The last cell sits on a tinted surface to show\n`currentColor` recolouring (the active-item behaviour in `Menu.tsx`).",...f.parameters?.docs?.description}}}})))()}m();export{f as AllIcons,d as WithControls,p as __namedExportsOrder,u as default};