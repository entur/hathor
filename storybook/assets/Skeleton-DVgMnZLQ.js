import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{t as n}from"./react-BbeNlDUO.js";import{B as r,gt as i,i as a,mt as o,n as s,o as c,t as l,z as u}from"./DefaultPropsProvider-D68BqLsB.js";import{t as d}from"./jsx-runtime-BB9-612F.js";import{a as f,c as p,i as m,l as h,r as g,s as _,u as v}from"./capitalize-C7shdts4.js";import{m as y,y as b}from"./useTimeout-D4afy5Gw.js";function x(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||``}function S(e){return parseFloat(e)}function C(e){return h(`MuiSkeleton`,e)}function w(){return(w=e((()=>{p(),v(),_(`MuiSkeleton`,[`root`,`text`,`rectangular`,`rounded`,`circular`,`pulse`,`wave`,`withChildren`,`fitContent`,`heightAuto`])})))()}var T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{T=t(n(),1),r(),a(),g(),l(),b(),w(),E=d(),D=e=>{let{classes:t,variant:n,animation:r,hasChildren:i,width:a,height:o}=e;return f({root:[`root`,n,r,i&&`withChildren`,i&&!a&&`fitContent`,i&&!o&&`heightAuto`]},C,t)},O=i`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,k=i`
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
`,A=typeof O==`string`?null:o`
        animation: ${O} 2s ease-in-out 0.5s infinite;
      `,j=typeof k==`string`?null:o`
        &::after {
          animation: ${k} 2s linear 0.5s infinite;
        }
      `,M=c(`span`,{name:`MuiSkeleton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],n.animation!==!1&&t[n.animation],n.hasChildren&&t.withChildren,n.hasChildren&&!n.width&&t.fitContent,n.hasChildren&&!n.height&&t.heightAuto]}})(m(({theme:e})=>{let t=x(e.shape.borderRadius)||`px`,n=S(e.shape.borderRadius),r=y(e,{animation:`none`}),i=y(e,{"&::after":{animation:`none`,display:`none`}});return{display:`block`,backgroundColor:e.vars?e.vars.palette.Skeleton.bg:e.alpha(e.palette.text.primary,e.palette.mode===`light`?.11:.13),height:`1.2em`,variants:[{props:{variant:`text`},style:{marginTop:0,marginBottom:0,height:`auto`,transformOrigin:`0 55%`,transform:`scale(1, 0.60)`,borderRadius:`${n}${t}/${Math.round(n/.6*10)/10}${t}`,"&:empty:before":{content:`"\\00a0"`}}},{props:{variant:`circular`},style:{borderRadius:`50%`}},{props:{variant:`rounded`},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:({ownerState:e})=>e.hasChildren,style:{"& > *":{visibility:`hidden`}}},{props:({ownerState:e})=>e.hasChildren&&!e.width,style:{maxWidth:`fit-content`}},{props:({ownerState:e})=>e.hasChildren&&!e.height,style:{height:`auto`}},{props:{animation:`pulse`},style:A||{animation:`${O} 2s ease-in-out 0.5s infinite`}},...r?[{props:{animation:`pulse`},style:r}]:[],{props:{animation:`wave`},style:{position:`relative`,overflow:`hidden`,WebkitMaskImage:`-webkit-radial-gradient(white, black)`,"&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(e.vars||e).palette.action.hover},
                transparent
              )`,content:`""`,position:`absolute`,transform:`translateX(-100%)`,bottom:0,left:0,right:0,top:0}}},{props:{animation:`wave`},style:j||{"&::after":{animation:`${k} 2s linear 0.5s infinite`}}},...i?[{props:{animation:`wave`},style:i}]:[]]}})),N=T.forwardRef(function(e,t){let n=s({props:e,name:`MuiSkeleton`}),{animation:r=`pulse`,className:i,component:a=`span`,height:o,style:c,variant:l=`text`,width:d,...f}=n,p={...n,animation:r,component:a,variant:l,hasChildren:!!f.children},m=D(p);return(0,E.jsx)(M,{as:a,ref:t,className:u(m.root,i),ownerState:p,...f,style:{width:d,height:o,...c}})})})))()}export{P as n,N as t};