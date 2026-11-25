import{a as e,n as t}from"./rolldown-runtime-sJBDdmOt.js";import{c as n,d as r,g as i,h as a,m as o,p as s,s as c}from"./Typography-W0OYS_Uw.js";import{n as l,t as u}from"./Box-D6aFbIWF.js";import{n as d,t as f}from"./Divider-xeI7KqzB.js";import{i as ee,n as p}from"./FormLayout-DgDPgfCt.js";import{U as m,W as h,_t as g,f as _,gt as v,h as y,l as b,tn as x,u as S,yt as C}from"./iframe-Bo2QKnCP.js";function te(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||``}function ne(e){return parseFloat(e)}function w(e){return a(`MuiSkeleton`,e)}function T(){return(T=t((()=>{o(),i(),s(`MuiSkeleton`,[`root`,`text`,`rectangular`,`rounded`,`circular`,`pulse`,`wave`,`withChildren`,`fitContent`,`heightAuto`])})))()}var E,D,O,k,A,j,M,N,P;function F(){return(F=t((()=>{E=e(x()),h(),_(),c(),b(),T(),D=v(),O=e=>{let{classes:t,variant:n,animation:i,hasChildren:a,width:o,height:s}=e;return r({root:[`root`,n,i,a&&`withChildren`,a&&!o&&`fitContent`,a&&!s&&`heightAuto`]},w,t)},k=C`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,A=C`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,j=typeof k==`string`?null:g`
        animation: ${k} 2s ease-in-out 0.5s infinite;
      `,M=typeof A==`string`?null:g`
        &::after {
          animation: ${A} 2s linear 0.5s infinite;
        }
      `,N=y(`span`,{name:`MuiSkeleton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],n.animation!==!1&&t[n.animation],n.hasChildren&&t.withChildren,n.hasChildren&&!n.width&&t.fitContent,n.hasChildren&&!n.height&&t.heightAuto]}})(n(({theme:e})=>{let t=te(e.shape.borderRadius)||`px`,n=ne(e.shape.borderRadius);return{display:`block`,backgroundColor:e.vars?e.vars.palette.Skeleton.bg:e.alpha(e.palette.text.primary,e.palette.mode===`light`?.11:.13),height:`1.2em`,variants:[{props:{variant:`text`},style:{marginTop:0,marginBottom:0,height:`auto`,transformOrigin:`0 55%`,transform:`scale(1, 0.60)`,borderRadius:`${n}${t}/${Math.round(n/.6*10)/10}${t}`,"&:empty:before":{content:`"\\00a0"`}}},{props:{variant:`circular`},style:{borderRadius:`50%`}},{props:{variant:`rounded`},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:({ownerState:e})=>e.hasChildren,style:{"& > *":{visibility:`hidden`}}},{props:({ownerState:e})=>e.hasChildren&&!e.width,style:{maxWidth:`fit-content`}},{props:({ownerState:e})=>e.hasChildren&&!e.height,style:{height:`auto`}},{props:{animation:`pulse`},style:j||{animation:`${k} 2s ease-in-out 0.5s infinite`}},{props:{animation:`wave`},style:{position:`relative`,overflow:`hidden`,WebkitMaskImage:`-webkit-radial-gradient(white, black)`,"&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(e.vars||e).palette.action.hover},
                transparent
              )`,content:`""`,position:`absolute`,transform:`translateX(-100%)`,bottom:0,left:0,right:0,top:0}}},{props:{animation:`wave`},style:M||{"&::after":{animation:`${A} 2s linear 0.5s infinite`}}}]}})),P=E.forwardRef(function(e,t){let n=S({props:e,name:`MuiSkeleton`}),{animation:r=`pulse`,className:i,component:a=`span`,height:o,style:s,variant:c=`text`,width:l,...u}=n,d={...n,animation:r,component:a,variant:c,hasChildren:!!u.children},f=O(d);return(0,D.jsx)(N,{as:a,ref:t,className:m(f.root,i),ownerState:d,...u,style:{width:l,height:o,...s}})})})))()}function I({height:e=B}){return(0,z.jsxs)(u,{sx:{display:`contents`},children:[(0,z.jsx)(P,{animation:W,variant:`text`,width:`60%`}),(0,z.jsx)(P,{animation:W,variant:`rounded`,height:e})]})}function L({ariaLabel:e,showTitle:t,sections:n}){return(0,z.jsxs)(u,{role:`status`,"aria-label":e,sx:{p:2,height:`100%`,overflowY:`auto`,boxSizing:`border-box`},children:[t&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsxs)(p,{sx:{mb:1},children:[(0,z.jsx)(P,{animation:W,variant:`text`,height:V,width:`70%`}),(0,z.jsx)(P,{animation:W,variant:`rounded`,width:H,height:U})]}),(0,z.jsx)(f,{sx:{mb:2}})]}),n.map((e,t)=>{let r=t===n.length-1;return(0,z.jsxs)(R.Fragment,{children:[(0,z.jsx)(p,{rowGap:e.rowGap,sx:r?void 0:{mb:2},children:Array.from({length:e.rowCount}).map((t,n)=>(0,z.jsx)(I,{height:e.rowHeight},n))}),!r&&(0,z.jsx)(f,{sx:{mb:2}})]},t)})]})}var R,z,B,V,H,U,W;function G(){return(G=t((()=>{R=x(),l(),d(),F(),ee(),z=v(),B=37,V=28,H=144,U=24,W=`wave`,L.__docgenInfo={description:`Wave-animated loading skeleton for any sidebar editor built on the
{@link FormLayout} two-column grid. Internally wraps each section in
\`<FormLayout>\` so the skeleton's grid shape (and container-query
stacking) tracks the live form automatically — no separate grid
template to keep in sync.`,methods:[],displayName:`FormLayoutSkeleton`,props:{ariaLabel:{required:!0,tsType:{name:`string`},description:`Loading text for screen readers — caller-localised.`},showTitle:{required:!1,tsType:{name:`boolean`},description:`Render an h6 + id-pill skeleton row at the top, with a divider below.`},sections:{required:!0,tsType:{name:`Array`,elements:[{name:`FormLayoutSkeletonSection`}],raw:`FormLayoutSkeletonSection[]`},description:`Each section is its own <FormLayout> grid; Dividers auto-rendered between.`}}}})))()}var K,q,J,Y,X,Z,Q;function $(){return($=t((()=>{l(),G(),K=v(),q={title:`components/FormLayoutSkeleton`,component:L,parameters:{layout:`padded`,docs:{description:{component:"Wave-animated loading skeleton sharing the same grid shape as `FormLayout`. Drop it into any sidebar editor that hasn’t loaded yet."}}},argTypes:{ariaLabel:{control:`text`},showTitle:{control:`boolean`}},decorators:[e=>(0,K.jsx)(u,{sx:{maxWidth:`28rem`,border:`1px solid`,borderColor:`divider`},children:(0,K.jsx)(e,{})})]},J={args:{ariaLabel:`Loading form`,sections:[{rowCount:4}]}},Y={args:{ariaLabel:`Loading vehicle`,showTitle:!0,sections:[{rowCount:4}]}},X={args:{ariaLabel:`Loading vehicle type`,showTitle:!0,sections:[{rowCount:3},{rowCount:2},{rowCount:4}]}},Z={args:{ariaLabel:`Loading editor with notes`,showTitle:!0,sections:[{rowCount:2},{rowCount:1,rowHeight:88}]}},Q=[`Default`,`WithTitle`,`MultiSection`,`TallRows`]})))()}$();export{J as Default,X as MultiSection,Z as TallRows,Y as WithTitle,Q as __namedExportsOrder,q as default};