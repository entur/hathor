import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{Xt as n,Y as r,j as i,o as a,tt as o,xt as s}from"./iframe-CWhZIATj.js";import{i as c,n as l}from"./FormLayout-TkOTZxRT.js";function u({height:e=m}){return(0,p.jsxs)(o,{sx:{display:`contents`},children:[(0,p.jsx)(i,{animation:v,variant:`text`,width:`60%`}),(0,p.jsx)(i,{animation:v,variant:`rounded`,height:e})]})}function d({ariaLabel:e,showTitle:t,sections:n}){return(0,p.jsxs)(o,{role:`status`,"aria-label":e,sx:{p:2,height:`100%`,overflowY:`auto`,boxSizing:`border-box`},children:[t&&(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(l,{sx:{mb:1},children:[(0,p.jsx)(i,{animation:v,variant:`text`,height:h,width:`70%`}),(0,p.jsx)(i,{animation:v,variant:`rounded`,width:g,height:_})]}),(0,p.jsx)(r,{sx:{mb:2}})]}),n.map((e,t)=>{let i=t===n.length-1;return(0,p.jsxs)(f.Fragment,{children:[(0,p.jsx)(l,{rowGap:e.rowGap,sx:i?void 0:{mb:2},children:Array.from({length:e.rowCount}).map((t,n)=>(0,p.jsx)(u,{height:e.rowHeight},n))}),!i&&(0,p.jsx)(r,{sx:{mb:2}})]},t)})]})}var f,p,m,h,g,_,v,y=e((()=>{f=t(n(),1),a(),c(),p=s(),m=37,h=28,g=144,_=24,v=`wave`,d.__docgenInfo={description:`Wave-animated loading skeleton for any sidebar editor built on the
{@link FormLayout} two-column grid. Internally wraps each section in
\`<FormLayout>\` so the skeleton's grid shape (and container-query
stacking) tracks the live form automatically — no separate grid
template to keep in sync.`,methods:[],displayName:`FormLayoutSkeleton`,props:{ariaLabel:{required:!0,tsType:{name:`string`},description:`Loading text for screen readers — caller-localised.`},showTitle:{required:!1,tsType:{name:`boolean`},description:`Render an h6 + id-pill skeleton row at the top, with a divider below.`},sections:{required:!0,tsType:{name:`Array`,elements:[{name:`FormLayoutSkeletonSection`}],raw:`FormLayoutSkeletonSection[]`},description:`Each section is its own <FormLayout> grid; Dividers auto-rendered between.`}}}})),b,x,S,C,w,T,E;e((()=>{a(),y(),b=s(),x={title:`components/FormLayoutSkeleton`,component:d,parameters:{layout:`padded`,docs:{description:{component:"Wave-animated loading skeleton sharing the same grid shape as `FormLayout`. Drop it into any sidebar editor that hasn’t loaded yet."}}},argTypes:{ariaLabel:{control:`text`},showTitle:{control:`boolean`}},decorators:[e=>(0,b.jsx)(o,{sx:{maxWidth:`28rem`,border:`1px solid`,borderColor:`divider`},children:(0,b.jsx)(e,{})})]},S={args:{ariaLabel:`Loading form`,sections:[{rowCount:4}]}},C={args:{ariaLabel:`Loading vehicle`,showTitle:!0,sections:[{rowCount:4}]}},w={args:{ariaLabel:`Loading vehicle type`,showTitle:!0,sections:[{rowCount:3},{rowCount:2},{rowCount:4}]}},T={args:{ariaLabel:`Loading editor with notes`,showTitle:!0,sections:[{rowCount:2},{rowCount:1,rowHeight:88}]}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    ariaLabel: 'Loading form',
    sections: [{
      rowCount: 4
    }]
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ariaLabel: 'Loading vehicle',
    showTitle: true,
    sections: [{
      rowCount: 4
    }]
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    ariaLabel: 'Loading vehicle type',
    showTitle: true,
    sections: [{
      rowCount: 3
    }, {
      rowCount: 2
    }, {
      rowCount: 4
    }]
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    ariaLabel: 'Loading editor with notes',
    showTitle: true,
    sections: [{
      rowCount: 2
    }, {
      rowCount: 1,
      rowHeight: 88
    }]
  }
}`,...T.parameters?.docs?.source},description:{story:`\`rowHeight\` override on the second section bumps each value cell to 88px,
mimicking a multiline text area. The first section keeps the default
input-height rows for contrast.`,...T.parameters?.docs?.description}}},E=[`Default`,`WithTitle`,`MultiSection`,`TallRows`]}))();export{S as Default,w as MultiSection,T as TallRows,C as WithTitle,E as __namedExportsOrder,x as default};