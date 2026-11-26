import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{t as n}from"./jsx-runtime-BB9-612F.js";import{n as r,t as i}from"./Box-C0BOFjz-.js";import{a,g as o,l as s,t as c}from"./form-layout-PDBGI76M.js";import{o as l,s as u}from"./FormFields-Dn7jfSfJ.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{d=t(),r(),u(),c(),f=n(),{fn:p}=__STORYBOOK_MODULE_TEST__,m=1140,h=900,g=Object.fromEntries(Array.from({length:24},(e,t)=>[`field${t+1}`,{kind:`text`,path:[`field${t+1}`]}])),_=Object.keys(g),v=Object.fromEntries([`General`,`Dimensions`,`Capacity`,`Environment`].map((e,t)=>[e,_.slice(t*6,t*6+6)])),y=s(g,v),b=()=>{let[e,t]=(0,d.useState)({}),[n,r]=(0,d.useState)({}),[s,c]=(0,d.useState)(!1),[u,p]=(0,d.useState)(!1),g=_.some(t=>(n[t]??``)!==(e[t]??``));return(0,f.jsx)(i,{sx:{maxWidth:m,mx:`auto`,p:2},children:(0,f.jsx)(a,{sections:y,renderField:({key:e,label:t})=>(0,f.jsx)(l,{id:`story-${e}`,label:t,value:n[e]??``,onChange:t=>{p(!1),r(n=>({...n,[e]:t}))}}),footer:(0,f.jsx)(o,{dirty:g,saving:s,saved:u,onSave:()=>{c(!0),setTimeout(()=>{t(n),c(!1),p(!0)},h)},onCancel:()=>r(e)})})})},x={title:`components/form-layout/EditFooter`,component:o,args:{dirty:!1,saving:!1,disabled:!1,canSubmit:!0,saved:!1,onSave:p(),onCancel:p()},parameters:{docs:{description:{component:`Save/Cancel for an edit session (#269), at the end of the form in normal flow (#293). Presentational: the host owns state and the save. Cancel is inert while clean; Save stays enabled and says "No changes to save" or "Required fields missing" instead of saving.`}}}},S={},C={args:{saved:!0}},w={args:{dirty:!0}},T={args:{dirty:!0,saving:!0}},E={args:{dirty:!0,canSubmit:!1}},D={parameters:{layout:`fullscreen`},render:()=>(0,f.jsx)(b,{})},O=[`Clean`,`SavedOk`,`Dirty`,`Saving`,`MissingFields`,`OnLongForm`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source},description:{story:`Entering a form — nothing to lose and nothing to say: Cancel inert, no status; Save says there is nothing to save.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    saved: true
  }
}`,...C.parameters?.docs?.source},description:{story:`Clean again after a successful save — green dot, "All changes saved".`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    dirty: true
  }
}`,...w.parameters?.docs?.source},description:{story:`Unsaved work — tinted band, pulsing dot, both actions live.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    dirty: true,
    saving: true
  }
}`,...T.parameters?.docs?.source},description:{story:`A save in flight locks both: a discard would restore a baseline about to be replaced.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    dirty: true,
    canSubmit: false
  }
}`,...E.parameters?.docs?.source},description:{story:`Dirty but a required field is empty — Save locked, Cancel still discards.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'fullscreen'
  },
  render: () => <LongForm />
}`,...D.parameters?.docs?.source},description:{story:`Type in any field, scroll to the end: Save / Cancel sit after the form, in flow (#293).`,...D.parameters?.docs?.description}}}})))()}k();export{S as Clean,w as Dirty,E as MissingFields,D as OnLongForm,C as SavedOk,T as Saving,O as __namedExportsOrder,x as default};