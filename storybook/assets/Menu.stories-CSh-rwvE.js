import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{t as n}from"./jsx-runtime-BB9-612F.js";import{a as r,n as i,o as a,r as o,t as s}from"./Menu-De7E5MIk.js";import{n as c,u as l}from"./chunk-YDNE64FV-B8wt3vL7.js";import{n as u,t as d}from"./mockOrganisations-If2UXAUB.js";function f(){let{mobileOpen:e,toggleMobile:t}=a();return(0,p.useEffect)(()=>{e||t()},[e,t]),null}var p,m,h,g,_,v;function y(){return(y=e((()=>{p=t(),l(),i(),r(),d(),m=n(),h={title:`components/Menu`,component:s,parameters:{layout:`fullscreen`,docs:{description:{component:`Primary navigation as Linje SideNavigation (#418). From 800px (the Linje desktop breakpoint) it is always open, 21rem, fixed below the header; the active route gets the accent bar. Below 800px the same items sit in a left-anchored temporary Drawer, opened by the header menu button.`}}},decorators:[u(),e=>(0,m.jsx)(c,{initialEntries:[`/vehicle-types`],children:(0,m.jsx)(o,{children:(0,m.jsx)(e,{})})})]},g={globals:{viewport:{value:`desktop`,isRotated:!1}}},_={globals:{viewport:{value:`mobile1`,isRotated:!1}},render:()=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(f,{}),(0,m.jsx)(s,{})]})},v=[`Desktop`,`MobileDrawer`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  // The rail needs ≥ 800 px (Linje's desktop breakpoint); below it Menu is the drawer.
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false
    }
  }
}`,...g.parameters?.docs?.source},description:{story:`Desktop side navigation, always open; Vehicle types is the active route.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
  render: () => <>
      <ForceMobileOpen />
      <Menu />
    </>
}`,..._.parameters?.docs?.source},description:{story:"Mobile temporary Drawer (21rem, left-anchored). Forced open on mount; the\n`mobile1` viewport flips Menu's `useMediaQuery` mobile branch on.",..._.parameters?.docs?.description}}}})))()}y();export{g as Desktop,_ as MobileDrawer,v as __namedExportsOrder,h as default};