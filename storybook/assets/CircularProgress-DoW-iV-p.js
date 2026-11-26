import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{t as n}from"./react-BbeNlDUO.js";import{B as r,gt as i,i as a,mt as o,n as s,o as c,t as l,z as u}from"./DefaultPropsProvider-D68BqLsB.js";import{t as d}from"./jsx-runtime-BB9-612F.js";import{a as f,c as p,i as m,l as h,n as g,r as _,s as v,t as y,u as b}from"./capitalize-C7shdts4.js";import{_ as x,m as S,y as C}from"./useTimeout-D4afy5Gw.js";import{n as w,t as T}from"./createSimplePaletteValueFilter-BZ8R_unU.js";function E(e){return h(`MuiCircularProgress`,e)}function D(){return(D=e((()=>{p(),b(),v(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDisableShrink`])})))()}var O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{O=t(n(),1),r(),a(),_(),l(),g(),w(),C(),D(),k=d(),A=44,j=i`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,M=i`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,N=typeof j==`string`?null:o`
        animation: ${j} 1.4s linear infinite;
      `,P=typeof M==`string`?null:o`
        animation: ${M} 1.4s ease-in-out infinite;
      `,F=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e,a={root:[`root`,n,`color${y(r)}`],svg:[`svg`],track:[`track`],circle:[`circle`,i&&`circleDisableShrink`]};return f(a,E,t)},I=c(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${y(n.color)}`]]}})(m(({theme:e})=>{let t=S(e,{animation:`none`});return{display:`inline-block`,variants:[{props:{variant:`determinate`},style:{...x(e,`transform`)}},{props:{variant:`indeterminate`},style:N||{animation:`${j} 1.4s linear infinite`}},...t?[{props:{variant:`indeterminate`},style:t}]:[],...Object.entries(e.palette).filter(T()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}})),L=c(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),R=c(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,n.disableShrink&&t.circleDisableShrink]}})(m(({theme:e})=>{let t=S(e,{animation:`none`});return{stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{...x(e,`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:P||{animation:`${M} 1.4s ease-in-out infinite`}},...t?[{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:t}]:[]]}})),z=c(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(m(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),B=O.forwardRef(function(e,t){let n=s({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,enableTrackSlot:o=!1,min:c,max:l,size:d=40,style:f,thickness:p=3.6,value:m=n.min??0,variant:h=`indeterminate`,...g}=n,_=c??0,v=l??100,y={...n,color:i,disableShrink:a,size:d,thickness:p,value:m,variant:h,enableTrackSlot:o},b=F(y),x={},S={},C={};if(h===`determinate`){let e=2*Math.PI*((A-p)/2),t=v-_;x.strokeDasharray=e.toFixed(3),x.strokeDashoffset=t>0?`${((v-m)/t*e).toFixed(3)}px`:`${e.toFixed(3)}px`,S.transform=`rotate(-90deg)`,C[`aria-valuenow`]=m,C[`aria-valuemin`]=_,C[`aria-valuemax`]=v}return(0,k.jsx)(I,{className:u(b.root,r),style:{width:d,height:d,...S,...f},ownerState:y,ref:t,role:`progressbar`,...C,...g,children:(0,k.jsxs)(L,{className:b.svg,ownerState:y,viewBox:`${A/2} ${A/2} ${A} ${A}`,children:[o?(0,k.jsx)(z,{className:b.track,ownerState:y,cx:A,cy:A,r:(A-p)/2,fill:`none`,strokeWidth:p,"aria-hidden":`true`}):null,(0,k.jsx)(R,{className:b.circle,style:x,ownerState:y,cx:A,cy:A,r:(A-p)/2,fill:`none`,strokeWidth:p})]})})})})))()}export{V as n,B as t};