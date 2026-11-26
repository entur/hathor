import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{i,n as a,t as o}from"./bus-picture-CnjEQY71.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),o(),s=t(),c=360,l={title:`components/BusPicture`,component:i,render:e=>(0,s.jsx)(r,{sx:{width:c},children:(0,s.jsx)(a,{...e})}),args:{paint:`vehicleType`},argTypes:{paint:{control:`inline-radio`,options:[`vehicleType`,`vehicle`]}},parameters:{docs:{description:{component:"In `BusPictureFrame`: a card's picture area, 16:10, the `<img>` filling it."}}}},u={args:{dims:{length:13.2,width:2.55,height:3.3}}},d={args:{dims:{}}},f={args:{dims:{length:18,width:2.55}}},p={args:{dims:{length:74,width:2.9,height:4.2}}},m={args:{paint:`vehicle`,dims:{length:12,width:2.55,height:3.2}}},h={args:{mode:`RAIL`,dims:{length:74,width:2.9,height:4.2}}},g=[`FullDims`,`NoDims`,`NoHeight`,`OutOfRange`,`Vehicle`,`Unsupported`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    dims: {
      length: 13.2,
      width: 2.55,
      height: 3.3
    }
  }
}`,...u.parameters?.docs?.source},description:{story:`All three outer dims: drawn as given, no note.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    dims: {}
  }
}`,...d.parameters?.docs?.source},description:{story:`No dims at all: the standard bus, and a note naming all three.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    dims: {
      length: 18,
      width: 2.55
    }
  }
}`,...f.parameters?.docs?.source},description:{story:`One dim missing: only that one is standard.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    dims: {
      length: 74,
      width: 2.9,
      height: 4.2
    }
  }
}`,...p.parameters?.docs?.source},description:{story:`A 74 m train can't be drawn as a bus: standard length, said so.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    paint: 'vehicle',
    dims: {
      length: 12,
      width: 2.55,
      height: 3.2
    }
  }
}`,...m.parameters?.docs?.source},description:{story:`A vehicle is red.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'RAIL',
    dims: {
      length: 74,
      width: 2.9,
      height: 4.2
    }
  }
}`,...h.parameters?.docs?.source},description:{story:`Not a bus or coach: a line of text, and the area shrinks to it.`,...h.parameters?.docs?.description}}}})))()}_();export{u as FullDims,d as NoDims,f as NoHeight,p as OutOfRange,h as Unsupported,m as Vehicle,g as __namedExportsOrder,l as default};