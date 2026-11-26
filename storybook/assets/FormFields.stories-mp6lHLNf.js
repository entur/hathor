import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{t as n}from"./jsx-runtime-BB9-612F.js";import{n as r,t as i}from"./Box-C0BOFjz-.js";import{n as a,t as o}from"./Stack-BRXXgmTA.js";import{a as s,i as c,o as l,r as u,s as d}from"./FormFields-Dn7jfSfJ.js";function f({disabled:e,readOnly:t}){let[n,r]=(0,p.useState)(`Turvogn 1`),[i,a]=(0,p.useState)(`2026-05-29`),[d,f]=(0,p.useState)(12.5),[h,_]=(0,p.useState)(`bus`),[v,y]=(0,p.useState)(!0);return(0,m.jsxs)(o,{spacing:2,useFlexGap:!0,children:[(0,m.jsx)(l,{id:`s-name`,label:`Name`,value:n,onChange:r,disabled:e,readOnly:t}),(0,m.jsx)(l,{id:`s-built`,label:`Build date`,type:`date`,value:i,onChange:a,disabled:e,readOnly:t}),(0,m.jsx)(c,{id:`s-length`,label:`Length (m)`,value:d,onChange:f,disabled:e,readOnly:t}),(0,m.jsx)(s,{id:`s-mode`,label:`Transport mode`,value:h,options:g,noneLabel:`None`,onChange:_,disabled:e,readOnly:t}),(0,m.jsx)(u,{id:`s-low-floor`,label:`Low floor`,checked:v,onChange:y,disabled:e,readOnly:t})]})}var p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{p=t(),r(),a(),d(),m=n(),h=`16rem`,g=[{value:`bus`,label:`Bus`},{value:`rail`,label:`Rail`},{value:`water`,label:`Water`}],_={title:`components/form-layout/FormFields`,parameters:{layout:`padded`,docs:{description:{component:"Field primitives for editor forms — the controls a form page draws into `FormSections` and the sidebar tabs use — text, number, select-with-none and switch. Each takes plain values and reports plain values; no feature types."}}}},v={render:()=>(0,m.jsx)(f,{})},y={render:()=>(0,m.jsx)(f,{readOnly:!0})},b={render:()=>(0,m.jsx)(f,{disabled:!0})},x={render:()=>(0,m.jsx)(i,{sx:{width:h,border:`1px dashed`,borderColor:`divider`,p:2},children:(0,m.jsx)(f,{})})},S=[`Editable`,`ReadOnly`,`Disabled`,`NarrowContainer`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <AllFields />
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <AllFields readOnly />
}`,...y.parameters?.docs?.source},description:{story:`A form page's view mode (#267): no border or hover, the value full contrast.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <AllFields disabled />
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Box sx={{
    width: NARROW_WIDTH,
    border: '1px dashed',
    borderColor: 'divider',
    p: 2
  }}>
      <AllFields />
    </Box>
}`,...x.parameters?.docs?.source},description:{story:`A narrow container: every field fills it (widths are the form layout's, #283).`,...x.parameters?.docs?.description}}}})))()}C();export{b as Disabled,v as Editable,x as NarrowContainer,y as ReadOnly,S as __namedExportsOrder,_ as default};