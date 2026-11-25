import{a as e,n as t}from"./rolldown-runtime-sJBDdmOt.js";import{c as n,d as r,g as i,h as a,l as o,m as s,n as c,p as l,s as u,t as d,u as f}from"./Typography-W0OYS_Uw.js";import{n as p,t as m}from"./Box-D6aFbIWF.js";import{n as h,t as g}from"./Stack-BPIN5JeV.js";import{b as _,c as v,g as ee,h as y,m as te,p as ne,s as re,y as ie}from"./List-EJHfoxxM.js";import{_ as ae,g as oe,h as se,m as ce}from"./Select-grGfkXyJ.js";import{a as le,n as b,o as ue,t as de}from"./useTranslation-BfZHcXB_.js";import{n as x,t as S}from"./ButtonBase-C6BsHVm9.js";import{n as fe,t as pe}from"./useSlot-DaRTrn-N.js";import{n as me,t as he}from"./Alert-Btm__Pn5.js";import{i as ge,r as C}from"./IconButton-DzfwO87O.js";import{n as _e,t as w}from"./useSlotProps-7dtvhZmJ.js";import{n as T,t as ve}from"./Button-B7SyHn9t.js";import{n as ye,t as be}from"./Divider-xeI7KqzB.js";import{n as xe,t as E}from"./TextField-Dut24AG9.js";import{i as Se,n as Ce,t as we}from"./FormLayout-DgDPgfCt.js";import{i as Te,n as Ee,r as De,t as Oe}from"./KeyboardArrowRight-BajaZiyU.js";import{A as ke,U as D,W as Ae,f as je,gt as O,h as k,j as Me,l as A,tn as j,u as Ne,x as Pe}from"./iframe-Bo2QKnCP.js";import{c as Fe,i as Ie,n as Le,o as Re,r as ze,s as Be,t as Ve}from"./sampleDeckPlanXml-DBMjh-qB.js";function He(e){return a(`MuiTab`,e)}var M;function Ue(){return(Ue=t((()=>{s(),i(),M=l(`MuiTab`,[`root`,`labelIcon`,`textColorInherit`,`textColorPrimary`,`textColorSecondary`,`selected`,`disabled`,`fullWidth`,`wrapped`,`iconWrapper`,`icon`])})))()}var N,We,Ge,Ke,P;function qe(){return(qe=t((()=>{N=e(j()),Ae(),x(),f(),je(),u(),A(),Ue(),We=O(),Ge=e=>{let{classes:t,textColor:n,fullWidth:i,wrapped:a,icon:s,label:c,selected:l,disabled:u}=e,d={root:[`root`,s&&c&&`labelIcon`,`textColor${o(n)}`,i&&`fullWidth`,a&&`wrapped`,l&&`selected`,u&&`disabled`],icon:[`iconWrapper`,`icon`]};return r(d,He,t)},Ke=k(S,{name:`MuiTab`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.label&&n.icon&&t.labelIcon,t[`textColor${o(n.textColor)}`],n.fullWidth&&t.fullWidth,n.wrapped&&t.wrapped,{[`& .${M.iconWrapper}`]:t.iconWrapper},{[`& .${M.icon}`]:t.icon}]}})(n(({theme:e})=>({...e.typography.button,maxWidth:360,minWidth:90,position:`relative`,minHeight:48,flexShrink:0,padding:`12px 16px`,overflow:`hidden`,whiteSpace:`normal`,textAlign:`center`,lineHeight:1.25,variants:[{props:({ownerState:e})=>e.label&&(e.iconPosition===`top`||e.iconPosition===`bottom`),style:{flexDirection:`column`}},{props:({ownerState:e})=>e.label&&e.iconPosition!==`top`&&e.iconPosition!==`bottom`,style:{flexDirection:`row`}},{props:({ownerState:e})=>e.icon&&e.label,style:{minHeight:72,paddingTop:9,paddingBottom:9}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`top`,style:{[`& > .${M.icon}`]:{marginBottom:6}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`bottom`,style:{[`& > .${M.icon}`]:{marginTop:6}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`start`,style:{[`& > .${M.icon}`]:{marginRight:e.spacing(1)}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`end`,style:{[`& > .${M.icon}`]:{marginLeft:e.spacing(1)}}},{props:{textColor:`inherit`},style:{color:`inherit`,opacity:.6,[`&.${M.selected}`]:{opacity:1},[`&.${M.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity}}},{props:{textColor:`primary`},style:{color:(e.vars||e).palette.text.secondary,[`&.${M.selected}`]:{color:(e.vars||e).palette.primary.main},[`&.${M.disabled}`]:{color:(e.vars||e).palette.text.disabled}}},{props:{textColor:`secondary`},style:{color:(e.vars||e).palette.text.secondary,[`&.${M.selected}`]:{color:(e.vars||e).palette.secondary.main},[`&.${M.disabled}`]:{color:(e.vars||e).palette.text.disabled}}},{props:({ownerState:e})=>e.fullWidth,style:{flexShrink:1,flexGrow:1,flexBasis:0,maxWidth:`none`}},{props:({ownerState:e})=>e.wrapped,style:{fontSize:e.typography.pxToRem(12)}}]}))),P=N.forwardRef(function(e,t){let n=Ne({props:e,name:`MuiTab`}),{className:r,disabled:i=!1,disableFocusRipple:a=!1,fullWidth:o,icon:s,iconPosition:c=`top`,indicator:l,label:u,onChange:d,onClick:f,onFocus:p,selected:m,selectionFollowsFocus:h,textColor:g=`inherit`,value:_,wrapped:v=!1,...ee}=n,y={...n,disabled:i,disableFocusRipple:a,selected:m,icon:!!s,iconPosition:c,label:!!u,fullWidth:o,textColor:g,wrapped:v},te=Ge(y),ne=s&&u&&N.isValidElement(s)?N.cloneElement(s,{className:D(te.icon,s.props.className)}):s;return(0,We.jsxs)(Ke,{focusRipple:!a,className:D(te.root,r),ref:t,role:`tab`,"aria-selected":m,disabled:i,onClick:e=>{!m&&d&&d(e,_),f&&f(e)},onFocus:e=>{h&&!m&&d&&d(e,_),p&&p(e)},ownerState:y,tabIndex:m?0:-1,...ee,children:[c===`top`||c===`start`?(0,We.jsxs)(N.Fragment,{children:[ne,u]}):(0,We.jsxs)(N.Fragment,{children:[u,ne]}),l]})})})))()}function Je(e){return(1+Math.sin(Math.PI*e-Math.PI/2))/2}function Ye(e,t,n,r={},i=()=>{}){let{ease:a=Je,duration:o=300}=r,s=null,c=t[e],l=!1,u=()=>{l=!0},d=r=>{if(l){i(Error(`Animation cancelled`));return}s===null&&(s=r);let u=Math.min(1,(r-s)/o);t[e]=a(u)*(n-c)+c,requestAnimationFrame(u>=1?()=>{i(null)}:d)};return c===n?(i(Error(`Element already at target position`)),u):(requestAnimationFrame(d),u)}function Xe(){return(Xe=t((()=>{})))()}function Ze(e){let{onChange:t,...n}=e,r=Qe.useRef(),i=Qe.useRef(null),a=()=>{r.current=i.current.offsetHeight-i.current.clientHeight};return te(()=>{let e=ie(()=>{let e=r.current;a(),e!==r.current&&t(r.current)}),n=ee(i.current);return n.addEventListener(`resize`,e),()=>{e.clear(),n.removeEventListener(`resize`,e)}},[t]),Qe.useEffect(()=>{a(),t(r.current)},[t]),(0,$e.jsx)(`div`,{style:et,...n,ref:i})}var Qe,$e,et;function tt(){return(tt=t((()=>{Qe=e(j()),_(),y(),ne(),$e=O(),et={width:99,height:99,position:`absolute`,top:-9999,overflow:`scroll`}})))()}function nt(e){return a(`MuiTabScrollButton`,e)}var rt;function it(){return(it=t((()=>{s(),i(),rt=l(`MuiTabScrollButton`,[`root`,`vertical`,`horizontal`,`disabled`])})))()}var at,ot,st,ct,lt;function ut(){return(ut=t((()=>{at=e(j()),Ae(),ke(),w(),Te(),Ee(),x(),je(),A(),it(),ot=O(),st=e=>{let{classes:t,orientation:n,disabled:i}=e;return r({root:[`root`,n,i&&`disabled`]},nt,t)},ct=k(S,{name:`MuiTabScrollButton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.orientation&&t[n.orientation]]}})({width:40,flexShrink:0,opacity:.8,[`&.${rt.disabled}`]:{opacity:0},variants:[{props:{orientation:`vertical`},style:{width:`100%`,height:40,"& svg":{transform:`var(--TabScrollButton-svgRotate)`}}}]}),lt=at.forwardRef(function(e,t){let n=Ne({props:e,name:`MuiTabScrollButton`}),{className:r,slots:i={},slotProps:a={},direction:o,orientation:s,disabled:c,...l}=n,u=Me(),d={isRtl:u,...n},f=st(d),p=i.StartScrollButtonIcon??De,m=i.EndScrollButtonIcon??Oe,h=_e({elementType:p,externalSlotProps:a.startScrollButtonIcon,additionalProps:{fontSize:`small`},ownerState:d}),g=_e({elementType:m,externalSlotProps:a.endScrollButtonIcon,additionalProps:{fontSize:`small`},ownerState:d});return(0,ot.jsx)(ct,{component:`div`,className:D(f.root,r),ref:t,role:null,ownerState:d,tabIndex:null,...l,style:{...l.style,...s===`vertical`&&{"--TabScrollButton-svgRotate":`rotate(${u?-90:90}deg)`}},children:o===`left`?(0,ot.jsx)(p,{...h}):(0,ot.jsx)(m,{...g})})})})))()}function dt(e){return a(`MuiTabs`,e)}var ft;function pt(){return(pt=t((()=>{s(),i(),ft=l(`MuiTabs`,[`root`,`vertical`,`list`,`flexContainer`,`flexContainerVertical`,`centered`,`scroller`,`fixed`,`scrollableX`,`scrollableY`,`hideScrollbar`,`scrollButtons`,`scrollButtonsHideMobile`,`indicator`])})))()}var F,I,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt;function Tt(){return(Tt=t((()=>{F=e(j()),Ae(),ke(),w(),je(),u(),A(),_(),Xe(),tt(),ut(),le(),pt(),oe(),y(),v(),pe(),I=O(),mt=(e,t)=>e===t?e.firstChild:t&&t.nextElementSibling?t.nextElementSibling:e.firstChild,ht=(e,t)=>e===t?e.lastChild:t&&t.previousElementSibling?t.previousElementSibling:e.lastChild,gt=(e,t,n)=>{let r=!1,i=n(e,t);for(;i;){if(i===e.firstChild){if(r)return;r=!0}let t=i.disabled||i.getAttribute(`aria-disabled`)===`true`;if(!i.hasAttribute(`tabindex`)||t)i=n(e,i);else{i.focus();return}}},_t=e=>{let{vertical:t,fixed:n,hideScrollbar:i,scrollableX:a,scrollableY:o,centered:s,scrollButtonsHideMobile:c,classes:l}=e;return r({root:[`root`,t&&`vertical`],scroller:[`scroller`,n&&`fixed`,i&&`hideScrollbar`,a&&`scrollableX`,o&&`scrollableY`],list:[`list`,`flexContainer`,t&&`flexContainerVertical`,t&&`vertical`,s&&`centered`],indicator:[`indicator`],scrollButtons:[`scrollButtons`,c&&`scrollButtonsHideMobile`],scrollableX:[a&&`scrollableX`],hideScrollbar:[i&&`hideScrollbar`]},dt,l)},vt=k(`div`,{name:`MuiTabs`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[{[`& .${ft.scrollButtons}`]:t.scrollButtons},{[`& .${ft.scrollButtons}`]:n.scrollButtonsHideMobile&&t.scrollButtonsHideMobile},t.root,n.vertical&&t.vertical]}})(n(({theme:e})=>({overflow:`hidden`,minHeight:48,WebkitOverflowScrolling:`touch`,display:`flex`,variants:[{props:({ownerState:e})=>e.vertical,style:{flexDirection:`column`}},{props:({ownerState:e})=>e.scrollButtonsHideMobile,style:{[`& .${ft.scrollButtons}`]:{[e.breakpoints.down(`sm`)]:{display:`none`}}}}]}))),yt=k(`div`,{name:`MuiTabs`,slot:`Scroller`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.scroller,n.fixed&&t.fixed,n.hideScrollbar&&t.hideScrollbar,n.scrollableX&&t.scrollableX,n.scrollableY&&t.scrollableY]}})({position:`relative`,display:`inline-block`,flex:`1 1 auto`,whiteSpace:`nowrap`,variants:[{props:({ownerState:e})=>e.fixed,style:{overflowX:`hidden`,width:`100%`}},{props:({ownerState:e})=>e.hideScrollbar,style:{scrollbarWidth:`none`,"&::-webkit-scrollbar":{display:`none`}}},{props:({ownerState:e})=>e.scrollableX,style:{overflowX:`auto`,overflowY:`hidden`}},{props:({ownerState:e})=>e.scrollableY,style:{overflowY:`auto`,overflowX:`hidden`}}]}),bt=k(`div`,{name:`MuiTabs`,slot:`List`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.list,t.flexContainer,n.vertical&&t.flexContainerVertical,n.centered&&t.centered]}})({display:`flex`,variants:[{props:({ownerState:e})=>e.vertical,style:{flexDirection:`column`}},{props:({ownerState:e})=>e.centered,style:{justifyContent:`center`}}]}),xt=k(`span`,{name:`MuiTabs`,slot:`Indicator`})(n(({theme:e})=>({position:`absolute`,height:2,bottom:0,width:`100%`,transition:e.transitions.create(),variants:[{props:{indicatorColor:`primary`},style:{backgroundColor:(e.vars||e).palette.primary.main}},{props:{indicatorColor:`secondary`},style:{backgroundColor:(e.vars||e).palette.secondary.main}},{props:({ownerState:e})=>e.vertical,style:{height:`100%`,width:2,right:0}}]}))),St=k(Ze)({overflowX:`auto`,overflowY:`hidden`,scrollbarWidth:`none`,"&::-webkit-scrollbar":{display:`none`}}),Ct={},wt=F.forwardRef(function(e,t){let n=Ne({props:e,name:`MuiTabs`}),r=Pe(),i=Me(),{"aria-label":a,"aria-labelledby":o,action:s,centered:c=!1,children:l,className:u,component:d=`div`,allowScrollButtonsMobile:f=!1,indicatorColor:p=`primary`,onChange:m,orientation:h=`horizontal`,ScrollButtonComponent:g,scrollButtons:_=`auto`,selectionFollowsFocus:v,slots:y={},slotProps:te={},TabIndicatorProps:ne={},TabScrollButtonProps:oe={},textColor:se=`primary`,value:ce,variant:le=`standard`,visibleScrollbar:b=!1,...de}=n,x=le===`scrollable`,S=h===`vertical`,pe=S?`scrollTop`:`scrollLeft`,me=S?`top`:`left`,he=S?`bottom`:`right`,ge=S?`clientHeight`:`clientWidth`,C=S?`height`:`width`,w={...n,component:d,allowScrollButtonsMobile:f,indicatorColor:p,orientation:h,vertical:S,scrollButtons:_,textColor:se,variant:le,visibleScrollbar:b,fixed:!x,hideScrollbar:x&&!b,scrollableX:x&&!S,scrollableY:x&&S,centered:c&&!x,scrollButtonsHideMobile:!f},T=_t(w),ve=_e({elementType:y.StartScrollButtonIcon,externalSlotProps:te.startScrollButtonIcon,ownerState:w}),ye=_e({elementType:y.EndScrollButtonIcon,externalSlotProps:te.endScrollButtonIcon,ownerState:w}),[be,xe]=F.useState(!1),[E,Se]=F.useState(Ct),[Ce,we]=F.useState(!1),[Te,Ee]=F.useState(!1),[De,Oe]=F.useState(!1),[ke,Ae]=F.useState({overflow:`hidden`,scrollbarWidth:0}),je=new Map,O=F.useRef(null),k=F.useRef(null),A={slots:y,slotProps:{indicator:ne,scrollButtons:oe,...te}},j=()=>{let e=O.current,t;if(e){let n=e.getBoundingClientRect();t={clientWidth:e.clientWidth,scrollLeft:e.scrollLeft,scrollTop:e.scrollTop,scrollWidth:e.scrollWidth,top:n.top,bottom:n.bottom,left:n.left,right:n.right}}let n;if(e&&ce!==!1){let e=k.current.children;if(e.length>0){let t=e[je.get(ce)];n=t?t.getBoundingClientRect():null}}return{tabsMeta:t,tabMeta:n}},Fe=ue(()=>{let{tabsMeta:e,tabMeta:t}=j(),n=0,r;S?(r=`top`,t&&e&&(n=t.top-e.top+e.scrollTop)):(r=i?`right`:`left`,t&&e&&(n=(i?-1:1)*(t[r]-e[r]+e.scrollLeft)));let a={[r]:n,[C]:t?t[C]:0};if(typeof E[r]!=`number`||typeof E[C]!=`number`)Se(a);else{let e=Math.abs(E[r]-a[r]),t=Math.abs(E[C]-a[C]);(e>=1||t>=1)&&Se(a)}}),Ie=(e,{animation:t=!0}={})=>{t?Ye(pe,O.current,e,{duration:r.transitions.duration.standard}):O.current[pe]=e},Le=e=>{let t=O.current[pe];t+=S?e:e*(i?-1:1),Ie(t)},Re=()=>{let e=O.current[ge],t=0,n=Array.from(k.current.children);for(let r=0;r<n.length;r+=1){let i=n[r];if(t+i[ge]>e){r===0&&(t=e);break}t+=i[ge]}return t},ze=()=>{Le(-1*Re())},Be=()=>{Le(Re())},[Ve,{onChange:He,...M}]=fe(`scrollbar`,{className:D(T.scrollableX,T.hideScrollbar),elementType:St,shouldForwardComponentProp:!0,externalForwardedProps:A,ownerState:w}),Ue=F.useCallback(e=>{He?.(e),Ae({overflow:null,scrollbarWidth:e})},[He]),[N,We]=fe(`scrollButtons`,{className:D(T.scrollButtons,oe.className),elementType:lt,externalForwardedProps:A,ownerState:w,additionalProps:{orientation:h,slots:{StartScrollButtonIcon:y.startScrollButtonIcon||y.StartScrollButtonIcon,EndScrollButtonIcon:y.endScrollButtonIcon||y.EndScrollButtonIcon},slotProps:{startScrollButtonIcon:ve,endScrollButtonIcon:ye}}}),Ge=()=>{let e={};e.scrollbarSizeListener=x?(0,I.jsx)(Ve,{...M,onChange:Ue}):null;let t=x&&(_===`auto`&&(Ce||Te)||_===!0);return e.scrollButtonStart=t?(0,I.jsx)(N,{direction:i?`right`:`left`,onClick:ze,disabled:!Ce,...We}):null,e.scrollButtonEnd=t?(0,I.jsx)(N,{direction:i?`left`:`right`,onClick:Be,disabled:!Te,...We}):null,e},Ke=ue(e=>{let{tabsMeta:t,tabMeta:n}=j();if(n&&t){if(n[me]<t[me]){let r=t[pe]+(n[me]-t[me]);Ie(r,{animation:e})}else if(n[he]>t[he]){let r=t[pe]+(n[he]-t[he]);Ie(r,{animation:e})}}}),P=ue(()=>{x&&_!==!1&&Oe(!De)});F.useEffect(()=>{let e=ie(()=>{O.current&&Fe()}),t,n=n=>{n.forEach(e=>{e.removedNodes.forEach(e=>{t?.unobserve(e)}),e.addedNodes.forEach(e=>{t?.observe(e)})}),e(),P()},r=ee(O.current);r.addEventListener(`resize`,e);let i;return typeof ResizeObserver<`u`&&(t=new ResizeObserver(e),Array.from(k.current.children).forEach(e=>{t.observe(e)})),typeof MutationObserver<`u`&&(i=new MutationObserver(n),i.observe(k.current,{childList:!0})),()=>{e.clear(),r.removeEventListener(`resize`,e),i?.disconnect(),t?.disconnect()}},[Fe,P]),F.useEffect(()=>{let e=Array.from(k.current.children),t=e.length;if(typeof IntersectionObserver<`u`&&t>0&&x&&_!==!1){let n=e[0],r=e[t-1],i={root:O.current,threshold:.99},a=new IntersectionObserver(e=>{we(!e[0].isIntersecting)},i);a.observe(n);let o=new IntersectionObserver(e=>{Ee(!e[0].isIntersecting)},i);return o.observe(r),()=>{a.disconnect(),o.disconnect()}}},[x,_,De,l?.length]),F.useEffect(()=>{xe(!0)},[]),F.useEffect(()=>{Fe()}),F.useEffect(()=>{Ke(Ct!==E)},[Ke,E]),F.useImperativeHandle(s,()=>({updateIndicator:Fe,updateScrollButtons:P}),[Fe,P]);let[qe,Je]=fe(`indicator`,{className:D(T.indicator,ne.className),elementType:xt,externalForwardedProps:A,ownerState:w,additionalProps:{style:E}}),Xe=(0,I.jsx)(qe,{...Je}),Ze=0,Qe=F.Children.map(l,e=>{if(!F.isValidElement(e))return null;let t=e.props.value===void 0?Ze:e.props.value;je.set(t,Ze);let n=t===ce;return Ze+=1,F.cloneElement(e,{fullWidth:le===`fullWidth`,indicator:n&&!be&&Xe,selected:n,selectionFollowsFocus:v,onChange:m,textColor:se,value:t,...Ze===1&&ce===!1&&!e.props.tabIndex?{tabIndex:0}:{}})}),$e=e=>{if(e.altKey||e.shiftKey||e.ctrlKey||e.metaKey)return;let t=k.current,n=re(ae(t));if(n?.getAttribute(`role`)!==`tab`)return;let r=h===`horizontal`?`ArrowLeft`:`ArrowUp`,a=h===`horizontal`?`ArrowRight`:`ArrowDown`;switch(h===`horizontal`&&i&&(r=`ArrowRight`,a=`ArrowLeft`),e.key){case r:e.preventDefault(),gt(t,n,ht);break;case a:e.preventDefault(),gt(t,n,mt);break;case`Home`:e.preventDefault(),gt(t,null,mt);break;case`End`:e.preventDefault(),gt(t,null,ht)}},et=Ge(),[tt,nt]=fe(`root`,{ref:t,className:D(T.root,u),elementType:vt,externalForwardedProps:{...A,...de,component:d},ownerState:w}),[rt,it]=fe(`scroller`,{ref:O,className:T.scroller,elementType:yt,externalForwardedProps:A,ownerState:w,additionalProps:{style:{overflow:ke.overflow,[S?`margin${i?`Left`:`Right`}`:`marginBottom`]:b?void 0:-ke.scrollbarWidth}}}),[at,ot]=fe(`list`,{ref:k,className:D(T.list,T.flexContainer),elementType:bt,externalForwardedProps:A,ownerState:w,getSlotProps:e=>({...e,onKeyDown:t=>{$e(t),e.onKeyDown?.(t)}})});return(0,I.jsxs)(tt,{...nt,children:[et.scrollButtonStart,et.scrollbarSizeListener,(0,I.jsxs)(rt,{...it,children:[(0,I.jsx)(at,{"aria-label":a,"aria-labelledby":o,"aria-orientation":h===`vertical`?`vertical`:null,role:`tablist`,...ot,children:Qe}),be&&Xe]}),et.scrollButtonEnd]})})})))()}function Et(e,t){let n=[],r=t.exec(e);for(;r;){let i=[];i.startIndex=t.lastIndex-r[0].length;let a=r.length;for(let e=0;e<a;e++)i.push(r[e]);n.push(i),r=t.exec(e)}return n}function Dt(e){return e!==void 0}var Ot,kt,At,jt;function Mt(){return(Mt=t((()=>{Ot=RegExp(`^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),kt=function(e){return Ot.exec(e)!=null},At=[`hasOwnProperty`,`toString`,`valueOf`,`__defineGetter__`,`__defineSetter__`,`__lookupGetter__`,`__lookupSetter__`],jt=[`__proto__`,`constructor`,`prototype`]})))()}function Nt(e,t){t=Object.assign({},Gt,t);let n=[],r=!1,i=!1;e[0]===`﻿`&&(e=e.substr(1));for(let a=0;a<e.length;a++)if(e[a]===`<`&&e[a+1]===`?`){if(a+=2,a=Ft(e,a),a.err)return a}else if(e[a]===`<`){let o=a;if(a++,e[a]===`!`){a=It(e,a);continue}{let s=!1;e[a]===`/`&&(s=!0,a++);let c=``;for(;a<e.length&&e[a]!==`>`&&e[a]!==` `&&e[a]!==`	`&&e[a]!==`
`&&e[a]!==`\r`;a++)c+=e[a];if(c=c.trim(),c[c.length-1]===`/`&&(c=c.substring(0,c.length-1),a--),!Ut(c)){let t;return t=c.trim().length===0?`Invalid space after '<'.`:`Tag '`+c+`' is an invalid name.`,L(`InvalidTag`,t,R(e,a))}let l=Lt(e,a);if(l===!1)return L(`InvalidAttr`,`Attributes for '`+c+`' have open quote.`,R(e,a));let u=l.value;if(a=l.index,u[u.length-1]===`/`){let n=a-u.length;u=u.substring(0,u.length-1);let i=zt(u,t);if(i===!0)r=!0;else return L(i.err.code,i.err.msg,R(e,n+i.err.line))}else if(s){if(!l.tagClosed)return L(`InvalidTag`,`Closing tag '`+c+`' doesn't have proper closing.`,R(e,a));if(u.trim().length>0)return L(`InvalidTag`,`Closing tag '`+c+`' can't have attributes or invalid starting.`,R(e,o));if(n.length===0)return L(`InvalidTag`,`Closing tag '`+c+`' has not been opened.`,R(e,o));{let t=n.pop();if(c!==t.tagName){let n=R(e,t.tagStartPos);return L(`InvalidTag`,`Expected closing tag '`+t.tagName+`' (opened in line `+n.line+`, col `+n.col+`) instead of closing tag '`+c+`'.`,R(e,o))}n.length==0&&(i=!0)}}else{let s=zt(u,t);if(s!==!0)return L(s.err.code,s.err.msg,R(e,a-u.length+s.err.line));if(i===!0)return L(`InvalidXml`,`Multiple possible root nodes found.`,R(e,a));t.unpairedTags.indexOf(c)!==-1||n.push({tagName:c,tagStartPos:o}),r=!0}for(a++;a<e.length;a++)if(e[a]===`<`){if(e[a+1]===`!`){a++,a=It(e,a);continue}if(e[a+1]===`?`){if(a=Ft(e,++a),a.err)return a}else break}else if(e[a]===`&`){let t=Vt(e,a);if(t==-1)return L(`InvalidChar`,`char '&' is not expected.`,R(e,a));a=t}else if(i===!0&&!Pt(e[a]))return L(`InvalidXml`,`Extra text at the end`,R(e,a));e[a]===`<`&&a--}}else{if(Pt(e[a]))continue;return L(`InvalidChar`,`char '`+e[a]+`' is not expected.`,R(e,a))}return r?n.length==1?L(`InvalidTag`,`Unclosed tag '`+n[0].tagName+`'.`,R(e,n[0].tagStartPos)):n.length>0?L(`InvalidXml`,`Invalid '`+JSON.stringify(n.map(e=>e.tagName),null,4).replace(/\r?\n/g,``)+`' found.`,{line:1,col:1}):!0:L(`InvalidXml`,`Start tag expected.`,1)}function Pt(e){return e===` `||e===`	`||e===`
`||e===`\r`}function Ft(e,t){let n=t;for(;t<e.length;t++)if(e[t]==`?`||e[t]==` `){let r=e.substr(n,t-n);if(t>5&&r===`xml`)return L(`InvalidXml`,`XML declaration allowed only at the start of the document.`,R(e,t));if(e[t]==`?`&&e[t+1]==`>`){t++;break}continue}return t}function It(e,t){if(e.length>t+5&&e[t+1]===`-`&&e[t+2]===`-`){for(t+=3;t<e.length;t++)if(e[t]===`-`&&e[t+1]===`-`&&e[t+2]===`>`){t+=2;break}}else if(e.length>t+8&&e[t+1]===`D`&&e[t+2]===`O`&&e[t+3]===`C`&&e[t+4]===`T`&&e[t+5]===`Y`&&e[t+6]===`P`&&e[t+7]===`E`){let n=1;for(t+=8;t<e.length;t++)if(e[t]===`<`)n++;else if(e[t]===`>`&&(n--,n===0))break}else if(e.length>t+9&&e[t+1]===`[`&&e[t+2]===`C`&&e[t+3]===`D`&&e[t+4]===`A`&&e[t+5]===`T`&&e[t+6]===`A`&&e[t+7]===`[`){for(t+=8;t<e.length;t++)if(e[t]===`]`&&e[t+1]===`]`&&e[t+2]===`>`){t+=2;break}}return t}function Lt(e,t){let n=``,r=``,i=!1;for(;t<e.length;t++){if(e[t]===Kt||e[t]===qt)r===``?r=e[t]:r!==e[t]||(r=``);else if(e[t]===`>`&&r===``){i=!0;break}n+=e[t]}return r===``&&{value:n,index:t,tagClosed:i}}function Rt(e){let t=[],n=e.length,r=0;for(;r<n;){let i=r;for(;r<n&&Pt(e[r]);)r++;if(r>=n)break;if(e[r]===`=`){r++;continue}let a=e.slice(i,r),o=r;for(;r<n&&!Pt(e[r])&&e[r]!==`=`;)r++;let s=e.slice(o,r),c,l=r;for(;l<n&&Pt(e[l]);)l++;l<n&&e[l]===`=`&&(c=e.slice(r,l+1),r=l+1);let u,d,f=r;for(;f<n&&Pt(e[f]);)f++;if(f<n&&(e[f]===`"`||e[f]===`'`)){let t=f+1,n=e.indexOf(e[f],t);n!==-1&&(u=e[f],d=e.slice(t,n),r=n+1)}let p={startIndex:i};p[1]=a,p[2]=s,p[3]=c,p[4]=u!==void 0||void 0,p[5]=u,p[6]=d,t.push(p)}return t}function zt(e,t){let n=Rt(e),r={};for(let e=0;e<n.length;e++){if(n[e][1].length===0)return L(`InvalidAttr`,`Attribute '`+n[e][2]+`' has no space in starting.`,Wt(n[e]));if(n[e][3]!==void 0&&n[e][4]===void 0)return L(`InvalidAttr`,`Attribute '`+n[e][2]+`' is without value.`,Wt(n[e]));if(n[e][3]===void 0&&!t.allowBooleanAttributes)return L(`InvalidAttr`,`boolean attribute '`+n[e][2]+`' is not allowed.`,Wt(n[e]));let i=n[e][2];if(!Ht(i))return L(`InvalidAttr`,`Attribute '`+i+`' is an invalid name.`,Wt(n[e]));if(!Object.prototype.hasOwnProperty.call(r,i))r[i]=1;else return L(`InvalidAttr`,`Attribute '`+i+`' is repeated.`,Wt(n[e]))}return!0}function Bt(e,t){let n=/\d/;for(e[t]===`x`&&(t++,n=/[\da-fA-F]/);t<e.length;t++){if(e[t]===`;`)return t;if(!e[t].match(n))break}return-1}function Vt(e,t){if(t++,e[t]===`;`)return-1;if(e[t]===`#`)return t++,Bt(e,t);let n=0;for(;t<e.length;t++,n++)if(!(e[t].match(/\w/)&&n<20)){if(e[t]===`;`)break;return-1}return t}function L(e,t,n){return{err:{code:e,msg:t,line:n.line||n,col:n.col}}}function Ht(e){return kt(e)}function Ut(e){return kt(e)}function R(e,t){let n=e.substring(0,t).split(/\r?\n/);return{line:n.length,col:n[n.length-1].length+1}}function Wt(e){return e.startIndex+e[1].length}var Gt,Kt,qt;function Jt(){return(Jt=t((()=>{Mt(),Gt={allowBooleanAttributes:!1,unpairedTags:[]},Kt=`"`,qt=`'`})))()}var Yt,Xt,Zt;function Qt(){return(Qt=t((()=>{Yt={cent:`¢`,pound:`£`,curren:`¤`,yen:`¥`,euro:`€`,dollar:`$`,fnof:`ƒ`,inr:`₹`,af:`؋`,birr:`ብር`,peso:`₱`,rub:`₽`,won:`₩`,yuan:`¥`,cedil:`¸`},Xt={amp:`&`,apos:`'`,gt:`>`,lt:`<`,quot:`"`},Zt={nbsp:`\xA0`,copy:`©`,reg:`®`,trade:`™`,mdash:`—`,ndash:`–`,hellip:`…`,laquo:`«`,raquo:`»`,lsquo:`‘`,rsquo:`’`,ldquo:`“`,rdquo:`”`,bull:`•`,para:`¶`,sect:`§`,deg:`°`,frac12:`½`,frac14:`¼`,frac34:`¾`}})))()}function $t(e){if(e[0]===`#`)throw Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);for(let t of e)if(an.has(t))throw Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);return e}function en(...e){let t=Object.create(null);for(let n of e)if(n)for(let e of Object.keys(n)){let r=n[e];if(typeof r==`string`)t[e]=r;else if(r&&typeof r==`object`&&r.val!==void 0){let n=r.val;typeof n==`string`&&(t[e]=n)}}return t}function tn(e){return!e||e===z?new Set([z]):e===sn?new Set([sn]):e===on?new Set([on]):Array.isArray(e)?new Set(e):new Set([z])}function nn(e){if(!e)return{xmlVersion:1,onLevel:B.allow,nullLevel:B.remove};let t=e.xmlVersion===1.1?1.1:1,n=B[e.onNCR]??B.allow,r=B[e.nullNCR]??B.remove;return{xmlVersion:t,onLevel:n,nullLevel:Math.max(r,B.remove)}}var rn,an,z,on,sn,B,cn,ln;function un(){return(un=t((()=>{Qt(),rn=Object.freeze({ALLOW:`allow`,BLOCK:`block`,THROW:`throw`}),an=new Set(`!?\\\\/[]$%{}^&*()<>|+`),z=`external`,on=`base`,sn=`all`,B=Object.freeze({allow:0,leave:1,remove:2,throw:3}),cn=new Set([9,10,13]),ln=class{constructor(e={}){this._limit=e.limit||{},this._maxTotalExpansions=this._limit.maxTotalExpansions||0,this._maxExpandedLength=this._limit.maxExpandedLength||0,this._postCheck=typeof e.postCheck==`function`?e.postCheck:e=>e,this._limitTiers=tn(this._limit.applyLimitsTo??z),this._numericAllowed=e.numericAllowed??!0,this._baseMap=en(Xt,e.namedEntities||null),this._externalMap=Object.create(null),this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this._removeSet=new Set(e.remove&&Array.isArray(e.remove)?e.remove:[]),this._leaveSet=new Set(e.leave&&Array.isArray(e.leave)?e.leave:[]);let t=nn(e.ncr);this._ncrXmlVersion=t.xmlVersion,this._ncrOnLevel=t.onLevel,this._ncrNullLevel=t.nullLevel,this._onExternalEntity=typeof e.onExternalEntity==`function`?e.onExternalEntity:null,this._onInputEntity=typeof e.onInputEntity==`function`?e.onInputEntity:null}_applyRegistrationHook(e,t,n,r){if(!e)return!0;let i=e(t,n);if(i===rn.BLOCK)return!1;if(i===rn.THROW)throw Error(`[EntityDecoder] Registration of ${r} entity "&${t};" was rejected by hook`);return!0}setExternalEntities(e){if(e)for(let t of Object.keys(e))$t(t);if(!this._onExternalEntity){this._externalMap=en(e);return}let t=en(e),n=Object.create(null);for(let[e,r]of Object.entries(t))this._applyRegistrationHook(this._onExternalEntity,e,r,`external`)&&(n[e]=r);this._externalMap=n}addExternalEntity(e,t){$t(e),typeof t==`string`&&t.indexOf(`&`)===-1&&this._applyRegistrationHook(this._onExternalEntity,e,t,`external`)&&(this._externalMap[e]=t)}addInputEntities(e){if(this._totalExpansions=0,this._expandedLength=0,!this._onInputEntity){this._inputMap=en(e);return}let t=en(e),n=Object.create(null);for(let[e,r]of Object.entries(t))this._applyRegistrationHook(this._onInputEntity,e,r,`input`)&&(n[e]=r);this._inputMap=n}reset(){return this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this}setXmlVersion(e){this._ncrXmlVersion=e===1.1?1.1:1}decode(e){if(typeof e!=`string`||e.length===0||e.indexOf(`&`)===-1)return e;let t=e,n=[],r=e.length,i=0,a=0,o=this._maxTotalExpansions>0,s=this._maxExpandedLength>0,c=o||s;for(;a<r;){if(e.charCodeAt(a)!==38){a++;continue}let t=a+1;for(;t<r&&e.charCodeAt(t)!==59&&t-a<=32;)t++;if(t>=r||e.charCodeAt(t)!==59){a++;continue}let l=e.slice(a+1,t);if(l.length===0){a++;continue}let u,d;if(this._removeSet.has(l))u=``,d===void 0&&(d=z);else if(this._leaveSet.has(l)){a++;continue}else if(l.charCodeAt(0)===35){let e=this._resolveNCR(l);if(e===void 0){a++;continue}u=e,d=on}else{let e=this._resolveName(l);u=e?.value,d=e?.tier}if(u===void 0)a++;else if(a>i&&n.push(e.slice(i,a)),n.push(u),i=t+1,a=i,c&&this._tierCounts(d)){if(o&&(this._totalExpansions++,this._totalExpansions>this._maxTotalExpansions))throw Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);if(s){let e=u.length-(l.length+2);if(e>0&&(this._expandedLength+=e,this._expandedLength>this._maxExpandedLength))throw Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`)}}}i<r&&n.push(e.slice(i));let l=n.length===0?e:n.join(``);return this._postCheck(l,t)}_tierCounts(e){return this._limitTiers.has(sn)?!0:this._limitTiers.has(e)}_resolveName(e){if(e in this._inputMap)return{value:this._inputMap[e],tier:z};if(e in this._externalMap)return{value:this._externalMap[e],tier:z};if(e in this._baseMap)return{value:this._baseMap[e],tier:on}}_classifyNCR(e){return e===0?this._ncrNullLevel:e>=55296&&e<=57343||this._ncrXmlVersion===1&&e>=1&&e<=31&&!cn.has(e)?B.remove:-1}_applyNCRAction(e,t,n){switch(e){case B.allow:return String.fromCodePoint(n);case B.remove:return``;case B.leave:return;case B.throw:throw Error(`[EntityDecoder] Prohibited numeric character reference &${t}; (U+${n.toString(16).toUpperCase().padStart(4,`0`)})`);default:return String.fromCodePoint(n)}}_resolveNCR(e){let t=e.charCodeAt(1),n;if(n=t===120||t===88?parseInt(e.slice(2),16):parseInt(e.slice(1),10),Number.isNaN(n)||n<0||n>1114111)return;let r=this._classifyNCR(n);if(!this._numericAllowed&&r<B.remove)return;let i=r===-1?this._ncrOnLevel:Math.max(this._ncrOnLevel,r);return this._applyNCRAction(i,e,n)}}})))()}function dn(e,t){if(typeof e!=`string`)return;let n=e.toLowerCase();if(At.some(e=>n===e.toLowerCase())||jt.some(e=>n===e.toLowerCase()))throw Error(`[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`)}function fn(e,t){return typeof e==`boolean`?{enabled:e,maxEntitySize:1e4,maxExpansionDepth:1e4,maxTotalExpansions:1/0,maxExpandedLength:1e5,maxEntityCount:1e3,allowedTags:null,tagFilter:null,appliesTo:`all`}:typeof e==`object`&&e?{enabled:e.enabled!==!1,maxEntitySize:Math.max(1,e.maxEntitySize??1e4),maxExpansionDepth:Math.max(1,e.maxExpansionDepth??1e4),maxTotalExpansions:Math.max(1,e.maxTotalExpansions??1/0),maxExpandedLength:Math.max(1,e.maxExpandedLength??1e5),maxEntityCount:Math.max(1,e.maxEntityCount??1e3),allowedTags:e.allowedTags??null,tagFilter:e.tagFilter??null,appliesTo:e.appliesTo??`all`}:fn(!0)}var pn,mn,hn;function gn(){return(gn=t((()=>{Mt(),pn=e=>At.includes(e)?`__`+e:e,mn={preserveOrder:!1,attributeNamePrefix:`@_`,attributesGroupName:!1,textNodeName:`#text`,ignoreAttributes:!0,removeNSPrefix:!1,allowBooleanAttributes:!1,parseTagValue:!0,parseAttributeValue:!1,trimValues:!0,cdataPropName:!1,numberParseOptions:{hex:!0,leadingZeros:!0,eNotation:!0,unicode:!1},tagValueProcessor:function(e,t){return t},attributeValueProcessor:function(e,t){return t},stopNodes:[],alwaysCreateTextNode:!1,isArray:()=>!1,commentPropName:!1,unpairedTags:[],processEntities:!0,htmlEntities:!1,entityDecoder:null,ignoreDeclaration:!1,ignorePiTags:!1,transformTagName:!1,transformAttributeName:!1,updateTag:function(e,t,n){return e},captureMetaData:!1,maxNestedTags:100,strictReservedNames:!0,jPath:!0,onDangerousProperty:pn},hn=function(e){let t=Object.assign({},mn,e),n=[{value:t.attributeNamePrefix,name:`attributeNamePrefix`},{value:t.attributesGroupName,name:`attributesGroupName`},{value:t.textNodeName,name:`textNodeName`},{value:t.cdataPropName,name:`cdataPropName`},{value:t.commentPropName,name:`commentPropName`}];for(let{value:e,name:t}of n)e&&dn(e,t);return t.onDangerousProperty===null&&(t.onDangerousProperty=pn),t.processEntities=fn(t.processEntities,t.htmlEntities),t.unpairedTagsSet=new Set(t.unpairedTags),t.stopNodes&&Array.isArray(t.stopNodes)&&(t.stopNodes=t.stopNodes.map(e=>typeof e==`string`&&e.startsWith(`*.`)?`..`+e.substring(2):e)),t}})))()}var _n,V;function vn(){return(vn=t((()=>{_n=typeof Symbol==`function`?Symbol(`XML Node Metadata`):`@@xmlMetadata`,V=class{constructor(e){this.tagname=e,this.child=[],this[`:@`]=Object.create(null)}add(e,t){e===`__proto__`&&(e=`#__proto__`),this.child.push({[e]:t})}addChild(e,t){e.tagname===`__proto__`&&(e.tagname=`#__proto__`),e[`:@`]&&Object.keys(e[`:@`]).length>0?this.child.push({[e.tagname]:e.child,":@":e[`:@`]}):this.child.push({[e.tagname]:e.child}),this.addStartIndex(t)}addStartIndex(e){e!==void 0&&(this.child[this.child.length-1][_n]={startIndex:e})}addEndIndex(e){let t=this.child[this.child.length-1];t!==void 0&&t[_n]!==void 0&&t[_n].endIndex===void 0&&(t[_n].endIndex=e)}static getMetaDataSymbol(){return _n}}})))()}var yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An;function jn(){return(jn=t((()=>{yn=`:A-Za-z_À-ÖØ-öø-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�`,bn=yn+`\\-\\.\\d·̀-ͯ‿-⁀`,xn=`:A-Za-z_À-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�𐀀-󯿿`,Sn=xn+`\\-\\.\\d·̀-ͯ҇‿-⁀`,Cn=(e,t,n=``)=>{let r=`[${e.replace(`:`,``)}][${t.replace(`:`,``)}]*`;return{name:RegExp(`^[${e}][${t}]*$`,n),ncName:RegExp(`^${r}$`,n),qName:RegExp(`^${r}(?::${r})?$`,n),nmToken:RegExp(`^[${t}]+$`,n),nmTokens:RegExp(`^[${t}]+(?:\\s+[${t}]+)*$`,n)}},wn=Cn(yn,bn),Tn=Cn(xn,Sn,`u`),En=Cn(`:A-Za-z_`,`:A-Za-z_\\-\\.\\d`),Dn=(e=`1.0`,t=!1)=>t?En:e===`1.1`?Tn:wn,On=(e,{xmlVersion:t=`1.0`,asciiOnly:n=!1}={})=>Dn(t,n).qName.test(e),kn=[`name`,`ncName`,`qName`,`nmToken`,`nmTokens`],An=(e,{xmlVersion:t=`1.0`,asciiOnly:n=!1,maxCacheSize:r=2048}={})=>{if(!kn.includes(e))throw TypeError(`Unknown production "${e}". Must be one of: ${kn.join(`, `)}`);let i=Dn(t,n)[e],a=new Map,o=e=>{let t=a.get(e);if(t!==void 0)return t;let n=i.test(e);return a.size<r&&a.set(e,n),n};return o.reset=()=>{a=new Map},o}})))()}function H(e,t,n){for(let r=0;r<t.length;r++)if(t[r]!==e[n+r+1])return!1;return!0}function Mn(e,t){if(On(e,{xmlVersion:t}))return e;throw Error(`Invalid entity name ${e}`)}var Nn,U;function Pn(){return(Pn=t((()=>{jn(),Nn=class{constructor(e,t){this.suppressValidationErr=!e,this.options=e,this.xmlVersion=t||1}setXmlVersion(e=1){this.xmlVersion=e}readDocType(e,t){let n=Object.create(null),r=0;if(e[t+3]===`O`&&e[t+4]===`C`&&e[t+5]===`T`&&e[t+6]===`Y`&&e[t+7]===`P`&&e[t+8]===`E`){t+=9;let i=1,a=!1,o=!1,s=null,c=``;for(;t<e.length;t++)if(s!==null)e[t]===s&&(s=null),c+=e[t];else if(!a&&!o&&(e[t]===`"`||e[t]===`'`))s=e[t],c+=e[t];else if(e[t]===`<`&&!o){if(a&&H(e,`!ENTITY`,t)){t+=7;let i,a;if([i,a,t]=this.readEntityExp(e,t+1,this.suppressValidationErr),a.indexOf(`&`)===-1){if(this.options.enabled!==!1&&this.options.maxEntityCount!=null&&r>=this.options.maxEntityCount)throw Error(`Entity count (${r+1}) exceeds maximum allowed (${this.options.maxEntityCount})`);n[i]=a,r++}}else if(a&&H(e,`!ELEMENT`,t)){t+=8;let{index:n}=this.readElementExp(e,t+1);t=n}else if(a&&H(e,`!ATTLIST`,t))t+=8;else if(a&&H(e,`!NOTATION`,t)){t+=9;let{index:n}=this.readNotationExp(e,t+1,this.suppressValidationErr);t=n}else if(H(e,`!--`,t))o=!0;else throw Error(`Invalid DOCTYPE`);i++,c=``}else if(e[t]===`>`){if(o?e[t-1]===`-`&&e[t-2]===`-`&&(o=!1,i--):i--,i===0)break}else e[t]===`[`?a=!0:c+=e[t];if(s!==null||i!==0)throw Error(`Unclosed DOCTYPE`)}else throw Error(`Invalid Tag instead of DOCTYPE`);return{entities:n,i:t}}readEntityExp(e,t){t=U(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t])&&e[t]!==`"`&&e[t]!==`'`;)t++;let r=e.substring(n,t);if(Mn(r,{xmlVersion:this.xmlVersion}),t=U(e,t),!this.suppressValidationErr){if(e.substring(t,t+6).toUpperCase()===`SYSTEM`)throw Error(`External entities are not supported`);if(e[t]===`%`)throw Error(`Parameter entities are not supported`)}let i=``;if([t,i]=this.readIdentifierVal(e,t,`entity`),this.options.enabled!==!1&&this.options.maxEntitySize!=null&&i.length>this.options.maxEntitySize)throw Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);return t--,[r,i,t]}readNotationExp(e,t){t=U(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);!this.suppressValidationErr&&Mn(r,{xmlVersion:this.xmlVersion}),t=U(e,t);let i=e.substring(t,t+6).toUpperCase();if(!this.suppressValidationErr&&i!==`SYSTEM`&&i!==`PUBLIC`)throw Error(`Expected SYSTEM or PUBLIC, found "${i}"`);t+=i.length,t=U(e,t);let a=null,o=null;if(i===`PUBLIC`)[t,a]=this.readIdentifierVal(e,t,`publicIdentifier`),t=U(e,t),(e[t]===`"`||e[t]===`'`)&&([t,o]=this.readIdentifierVal(e,t,`systemIdentifier`));else if(i===`SYSTEM`&&([t,o]=this.readIdentifierVal(e,t,`systemIdentifier`),!this.suppressValidationErr&&!o))throw Error(`Missing mandatory system identifier for SYSTEM notation`);return{notationName:r,publicIdentifier:a,systemIdentifier:o,index:--t}}readIdentifierVal(e,t,n){let r=``,i=e[t];if(i!==`"`&&i!==`'`)throw Error(`Expected quoted string, found "${i}"`);t++;let a=t;for(;t<e.length&&e[t]!==i;)t++;if(r=e.substring(a,t),e[t]!==i)throw Error(`Unterminated ${n} value`);return t++,[t,r]}readElementExp(e,t){t=U(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);if(!this.suppressValidationErr&&!On(r,{xmlVersion:this.xmlVersion}))throw Error(`Invalid element name: "${r}"`);t=U(e,t);let i=``;if(e[t]===`E`&&H(e,`MPTY`,t))t+=4;else if(e[t]===`A`&&H(e,`NY`,t))t+=2;else if(e[t]===`(`){t++;let n=t;for(;t<e.length&&e[t]!==`)`;)t++;if(i=e.substring(n,t),e[t]!==`)`)throw Error(`Unterminated content model`)}else if(!this.suppressValidationErr)throw Error(`Invalid Element Expression, found "${e[t]}"`);return{elementName:r,contentModel:i.trim(),index:t}}readAttlistExp(e,t){t=U(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);for(Mn(r,{xmlVersion:this.xmlVersion}),t=U(e,t),n=t;t<e.length&&!/\s/.test(e[t]);)t++;let i=e.substring(n,t);if(!Mn(i,{xmlVersion:this.xmlVersion}))throw Error(`Invalid attribute name: "${i}"`);t=U(e,t);let a=``;if(e.substring(t,t+8).toUpperCase()===`NOTATION`){if(a=`NOTATION`,t+=8,t=U(e,t),e[t]!==`(`)throw Error(`Expected '(', found "${e[t]}"`);t++;let n=[];for(;t<e.length&&e[t]!==`)`;){let r=t;for(;t<e.length&&e[t]!==`|`&&e[t]!==`)`;)t++;let i=e.substring(r,t);if(i=i.trim(),!Mn(i,{xmlVersion:this.xmlVersion}))throw Error(`Invalid notation name: "${i}"`);n.push(i),e[t]===`|`&&(t++,t=U(e,t))}if(e[t]!==`)`)throw Error(`Unterminated list of notations`);t++,a+=` (`+n.join(`|`)+`)`}else{let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;if(a+=e.substring(n,t),!this.suppressValidationErr&&![`CDATA`,`ID`,`IDREF`,`IDREFS`,`ENTITY`,`ENTITIES`,`NMTOKEN`,`NMTOKENS`].includes(a.toUpperCase()))throw Error(`Invalid attribute type: "${a}"`)}t=U(e,t);let o=``;return e.substring(t,t+8).toUpperCase()===`#REQUIRED`?(o=`#REQUIRED`,t+=8):e.substring(t,t+7).toUpperCase()===`#IMPLIED`?(o=`#IMPLIED`,t+=7):[t,o]=this.readIdentifierVal(e,t,`ATTLIST`),{elementName:r,attributeName:i,attributeType:a,defaultValue:o,index:t}}},U=(e,t)=>{for(;t<e.length&&/\s/.test(e[t]);)t++;return t}})))()}var Fn,In,Ln,Rn,zn;function Bn(){return(Bn=t((()=>{Fn=[48,1632,1776,2406,2534,2662,2790,2918,3046,3174,3302,3430,3558,3664,3792,3872,4160,4240,6112,6160,6470,6608,6784,6800,6992,7088,7232,7248,65296,120782,120792,120802,120812,120822,66720,68912,69734,69872,69942,70096,70384,70736,70864,71248,71360,71472,71904,72016,72688,72784,73040,73120,73552,92768,92864,93008,123200,123632,124144,125264,130032],In=new Map,Ln=65535,Rn=1632,zn=new Uint8Array(63904).fill(255);for(let e of Fn)for(let t=0;t<10;t++){let n=e+t;n<=Ln?zn[n-Rn]=t:In.set(n,t)}})))()}function Vn(e){if(typeof e!=`string`)return e;let t=e.length;if(t===0)return e;let n=-1;for(let r=0;r<t;r++){let i=e.charCodeAt(r);if(!(i>=Hn&&i<=Un||i===Wn)){if(i<1632){if(Gn.has(i)){n=r;break}}else if(i>=55296&&i<=56319){if(r+1<t){let t=e.charCodeAt(r+1);if(t>=56320&&t<=57343){let e=65536+(i-55296<<10)+(t-56320);if(In.has(e)){n=r;break}}}}else if(zn[i-1632]!==255||Gn.has(i)){n=r;break}}}if(n===-1)return e;let r=[];n>0&&r.push(e.slice(0,n));for(let i=n;i<t;i++){let n=e.charCodeAt(i);if(n>=Hn&&n<=Un||n===Wn){r.push(e[i]);continue}if(n<1632){r.push(Gn.has(n)?`-`:e[i]);continue}if(n>=55296&&n<=56319){if(i+1<t){let t=e.charCodeAt(i+1);if(t>=56320&&t<=57343){let e=65536+(n-55296<<10)+(t-56320),a=In.get(e);if(a!==void 0){r.push(String.fromCharCode(a+48)),i++;continue}}}r.push(e[i]);continue}if(Gn.has(n)){r.push(`-`);continue}let a=zn[n-Rn];r.push(a===255?e[i]:String.fromCharCode(a+48))}return r.join(``)}var Hn,Un,Wn,Gn;function Kn(){return(Kn=t((()=>{Bn(),Hn=48,Un=57,Wn=45,Gn=new Set([8722,65293,65123])})))()}function qn(e,t={}){if(t=Object.assign({},nr,t),!e||typeof e!=`string`)return e;let n=e.trim();if(n.length===0||t.skipLike!==void 0&&t.skipLike.test(n))return e;if(n===`0`||t.unicode&&(n=Vn(n),n===`0`))return 0;if(t.hex&&Qn.test(n))return Xn(n,16);if(t.binary&&$n.test(n))return Xn(n,2);if(t.octal&&er.test(n))return Xn(n,8);if(!isFinite(n)){let r=Number(n);return Number.isNaN(r)?e:Zn(e,r,t)}if(n.includes(`e`)||n.includes(`E`))return Jn(e,n,t);{let r=tr.exec(n);if(r){let i=r[1]||``,a=r[2],o=Yn(r[3]),s=i?n[a.length+1]===`.`:n[a.length]===`.`;if(!t.leadingZeros&&(a.length>1||a.length===1&&!s))return e;{let r=Number(n),s=String(r);if(r===0)return r;if(s.search(/[eE]/)!==-1)return t.eNotation?r:e;if(n.indexOf(`.`)!==-1)return s===`0`||s===o||s===`${i}${o}`?r:e;let c=a?o:n;return a?c===s||i+c===s?r:e:c===s||c===i+s?r:e}}return e}}function Jn(e,t,n){if(!n.eNotation)return e;let r=t.match(rr);if(r){let i=r[1]||``,a=r[3].indexOf(`e`)===-1?`E`:`e`,o=r[2],s=i?t[o.length+1]===a:t[o.length]===a;return o.length>1&&s?e:o.length===1&&(r[3].startsWith(`.${a}`)||r[3][0]===a)?Number(t):o.length>0?n.leadingZeros&&!s?Number(t):e:Number(t)}return e}function Yn(e){if(e&&e.indexOf(`.`)!==-1){let t=e.length;for(;t>0&&e.charCodeAt(t-1)===48;)t--;return e=e.slice(0,t),e===`.`?e=`0`:e[0]===`.`?e=`0`+e:e[e.length-1]===`.`&&(e=e.substring(0,e.length-1)),e}return e}function Xn(e,t){let n=e.trim();if((t===2||t===8)&&(e=n.substring(2)),parseInt)return parseInt(e,t);if(Number.parseInt)return Number.parseInt(e,t);if(window&&window.parseInt)return window.parseInt(e,t);throw Error(`parseInt, Number.parseInt, window.parseInt are not supported`)}function Zn(e,t,n){let r=t===1/0;switch(n.infinity.toLowerCase()){case`null`:return null;case`infinity`:return t;case`string`:return r?`Infinity`:`-Infinity`;default:return e}}var Qn,$n,er,tr,nr,rr;function ir(){return(ir=t((()=>{Kn(),Qn=/^[-+]?0x[a-fA-F0-9]+$/,$n=/^0b[01]+$/,er=/^0o[0-7]+$/,tr=/^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,nr={hex:!0,binary:!1,octal:!1,leadingZeros:!0,decimalPoint:`.`,eNotation:!0,infinity:`original`,unicode:!1},rr=/^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/})))()}function ar(e){return typeof e==`function`?e:Array.isArray(e)?t=>{for(let n of e)if(typeof n==`string`&&t===n||n instanceof RegExp&&n.test(t))return!0}:()=>!1}var W;function or(){return(or=t((()=>{W=class{constructor(e,t={},n){this.pattern=e,this.separator=t.separator||`.`,this.segments=this._parse(e),this.data=n,this._hasDeepWildcard=this.segments.some(e=>e.type===`deep-wildcard`),this._hasAttributeCondition=this.segments.some(e=>e.attrName!==void 0),this._hasPositionSelector=this.segments.some(e=>e.position!==void 0)}_parse(e){let t=[],n=0,r=``;for(;n<e.length;)e[n]===this.separator?n+1<e.length&&e[n+1]===this.separator?(r.trim()&&(t.push(this._parseSegment(r.trim())),r=``),t.push({type:`deep-wildcard`}),n+=2):(r.trim()&&t.push(this._parseSegment(r.trim())),r=``,n++):(r+=e[n],n++);return r.trim()&&t.push(this._parseSegment(r.trim())),t}_parseSegment(e){let t={type:`tag`},n=null,r=e,i=e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);if(i&&(r=i[1]+i[3],i[2])){let e=i[2].slice(1,-1);e&&(n=e)}let a,o=r;if(r.includes(`::`)){let t=r.indexOf(`::`);if(a=r.substring(0,t).trim(),o=r.substring(t+2).trim(),!a)throw Error(`Invalid namespace in pattern: ${e}`)}let s,c=null;if(o.includes(`:`)){let e=o.lastIndexOf(`:`),t=o.substring(0,e).trim(),n=o.substring(e+1).trim();[`first`,`last`,`odd`,`even`].includes(n)||/^nth\(\d+\)$/.test(n)?(s=t,c=n):s=o}else s=o;if(!s)throw Error(`Invalid segment pattern: ${e}`);if(t.tag=s,a&&(t.namespace=a),n){if(n.includes(`=`)){let e=n.indexOf(`=`);t.attrName=n.substring(0,e).trim(),t.attrValue=n.substring(e+1).trim()}else t.attrName=n.trim()}if(c){let e=c.match(/^nth\((\d+)\)$/);e?(t.position=`nth`,t.positionValue=parseInt(e[1],10)):t.position=c}return t}get length(){return this.segments.length}hasDeepWildcard(){return this._hasDeepWildcard}hasAttributeCondition(){return this._hasAttributeCondition}hasPositionSelector(){return this._hasPositionSelector}toString(){return this.pattern}}})))()}var sr;function cr(){return(cr=t((()=>{sr=class{constructor(){this._byDepthAndTag=new Map,this._wildcardByDepth=new Map,this._deepWildcards=[],this._deepByTerminalTag=new Map,this._patterns=new Set,this._sealed=!1}add(e){if(this._sealed)throw TypeError(`ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.`);if(this._patterns.has(e.pattern))return this;if(this._patterns.add(e.pattern),e.hasDeepWildcard()){let t=e.segments[e.segments.length-1];if(t&&t.type!==`deep-wildcard`&&t.tag!==`*`){let n=t.tag;this._deepByTerminalTag.has(n)||this._deepByTerminalTag.set(n,[]),this._deepByTerminalTag.get(n).push(e)}else this._deepWildcards.push(e);return this}let t=e.length,n=e.segments[e.segments.length-1]?.tag;if(!n||n===`*`)this._wildcardByDepth.has(t)||this._wildcardByDepth.set(t,[]),this._wildcardByDepth.get(t).push(e);else{let r=`${t}:${n}`;this._byDepthAndTag.has(r)||this._byDepthAndTag.set(r,[]),this._byDepthAndTag.get(r).push(e)}return this}addAll(e){for(let t of e)this.add(t);return this}has(e){return this._patterns.has(e.pattern)}get size(){return this._patterns.size}seal(){return this._sealed=!0,this}get isSealed(){return this._sealed}matchesAny(e){return this.findMatch(e)!==null}findMatch(e){let t=e.getDepth(),n=e.getCurrentTag(),r=`${t}:${n}`,i=this._byDepthAndTag.get(r);if(i){for(let t=0;t<i.length;t++)if(e.matches(i[t]))return i[t]}let a=this._wildcardByDepth.get(t);if(a){for(let t=0;t<a.length;t++)if(e.matches(a[t]))return a[t]}let o=this._deepByTerminalTag.get(n);if(o){for(let t=0;t<o.length;t++)if(e.matches(o[t]))return o[t]}for(let t=0;t<this._deepWildcards.length;t++)if(e.matches(this._deepWildcards[t]))return this._deepWildcards[t];return null}}})))()}var lr,ur;function dr(){return(dr=t((()=>{lr=class{constructor(e){this._matcher=e}get separator(){return this._matcher.separator}getCurrentTag(){let e=this._matcher.path;return e.length>0?e[e.length-1].tag:void 0}getCurrentNamespace(){let e=this._matcher.path;return e.length>0?e[e.length-1].namespace:void 0}getAttrValue(e){let t=this._matcher.path;if(t.length!==0)return t[t.length-1].values?.[e]}hasAttr(e){let t=this._matcher.path;if(t.length===0)return!1;let n=t[t.length-1];return n.values!==void 0&&e in n.values}getAnyParentAttr(e){return this._matcher.getAnyParentAttr(e)}hasAnyParentAttr(e){return this._matcher.hasAnyParentAttr(e)}getPosition(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].position??0}getCounter(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this._matcher.path.length}toString(e,t=!0){return this._matcher.toString(e,t)}toArray(){return this._matcher.path.map(e=>e.tag)}matches(e){return this._matcher.matches(e)}matchesAny(e){return e.matchesAny(this._matcher)}},ur=class{constructor(e={}){this.separator=e.separator||`.`,this.path=[],this.siblingStacks=[],this._pathStringCache=null,this._view=new lr(this),this._keptAttrs=[]}push(e,t=null,n=null,r=null){this._pathStringCache=null,this.path.length>0&&(this.path[this.path.length-1].values=void 0);let i=this.path.length,a=this.siblingStacks[i];a||(a={counts:new Map,total:0},this.siblingStacks[i]=a);let o=n?`${n}:${e}`:e,s=a.counts.get(o)||0,c=a.total;a.counts.set(o,s+1),a.total++;let l={tag:e,position:c,counter:s};n!=null&&(l.namespace=n),t!=null&&(l.values=t),this.path.push(l);let u=this.path.length,d=r===null?null:r.keep;if(d!=null&&d.length>0&&t)for(let e=0;e<d.length;e++){let n=d[e];t[n]!==void 0&&this._keptAttrs.push({depth:u,name:n,value:t[n]})}}pop(){if(this.path.length===0)return;this._pathStringCache=null;let e=this.path.pop();this.siblingStacks.length>this.path.length+1&&(this.siblingStacks.length=this.path.length+1);let t=this.path.length+1;for(;this._keptAttrs.length>0&&this._keptAttrs[this._keptAttrs.length-1].depth>=t;)this._keptAttrs.pop();return e}updateCurrent(e){if(this.path.length>0){let t=this.path[this.path.length-1];e!=null&&(t.values=e)}}getCurrentTag(){return this.path.length>0?this.path[this.path.length-1].tag:void 0}getCurrentNamespace(){return this.path.length>0?this.path[this.path.length-1].namespace:void 0}getAttrValue(e){if(this.path.length!==0)return this.path[this.path.length-1].values?.[e]}hasAttr(e){if(this.path.length===0)return!1;let t=this.path[this.path.length-1];return t.values!==void 0&&e in t.values}getAnyParentAttr(e){let t=this._keptAttrs;for(let n=t.length-1;n>=0;n--)if(t[n].name===e)return t[n].value}hasAnyParentAttr(e){let t=this._keptAttrs;for(let n=t.length-1;n>=0;n--)if(t[n].name===e)return!0;return!1}getPosition(){return this.path.length===0?-1:this.path[this.path.length-1].position??0}getCounter(){return this.path.length===0?-1:this.path[this.path.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this.path.length}toString(e,t=!0){let n=e||this.separator;if(n===this.separator&&t===!0){if(this._pathStringCache!==null)return this._pathStringCache;let e=this.path.map(e=>e.namespace?`${e.namespace}:${e.tag}`:e.tag).join(n);return this._pathStringCache=e,e}return this.path.map(e=>t&&e.namespace?`${e.namespace}:${e.tag}`:e.tag).join(n)}toArray(){return this.path.map(e=>e.tag)}reset(){this._pathStringCache=null,this.path=[],this.siblingStacks=[],this._keptAttrs=[]}matches(e){let t=e.segments;return t.length===0?!1:e.hasDeepWildcard()?this._matchWithDeepWildcard(t):this._matchSimple(t)}_matchSimple(e){if(this.path.length!==e.length)return!1;for(let t=0;t<e.length;t++)if(!this._matchSegment(e[t],this.path[t],t===this.path.length-1))return!1;return!0}_matchWithDeepWildcard(e){let t=this.path.length-1,n=e.length-1;for(;n>=0&&t>=0;){let r=e[n];if(r.type===`deep-wildcard`){if(n--,n<0)return!0;let r=e[n],i=!1;for(let e=t;e>=0;e--)if(this._matchSegment(r,this.path[e],e===this.path.length-1)){t=e-1,n--,i=!0;break}if(!i)return!1}else{if(!this._matchSegment(r,this.path[t],t===this.path.length-1))return!1;t--,n--}}return n<0}_matchSegment(e,t,n){if(e.tag!==`*`&&e.tag!==t.tag||e.namespace!==void 0&&e.namespace!==`*`&&e.namespace!==t.namespace||e.attrName!==void 0&&(!n||!t.values||!(e.attrName in t.values)||e.attrValue!==void 0&&String(t.values[e.attrName])!==String(e.attrValue)))return!1;if(e.position!==void 0){if(!n)return!1;let r=t.counter??0;if(e.position===`first`&&r!==0||e.position===`odd`&&r%2!=1||e.position===`even`&&r%2!=0||e.position===`nth`&&r!==e.positionValue)return!1}return!0}matchesAny(e){return e.matchesAny(this)}snapshot(){return{path:this.path.map(e=>({...e})),siblingStacks:this.siblingStacks.map(e=>e&&{counts:new Map(e.counts),total:e.total}),keptAttrs:this._keptAttrs.map(e=>({...e}))}}restore(e){this._pathStringCache=null,this.path=e.path.map(e=>({...e})),this.siblingStacks=e.siblingStacks.map(e=>e&&{counts:new Map(e.counts),total:e.total}),this._keptAttrs=(e.keptAttrs||[]).map(e=>({...e}))}readOnly(){return this._view}}})))()}var fr;function pr(){return(pr=t((()=>{fr=[{id:`html-script-open`,description:`<script opening tag`,pattern:/<script[\s>/]/i},{id:`html-script-close`,description:`<\/script closing tag`,pattern:/<\/script[\s>]/i},{id:`html-javascript-protocol`,description:`javascript: URI scheme (with optional whitespace/encoding)`,pattern:/j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i},{id:`html-vbscript-protocol`,description:`vbscript: URI scheme`,pattern:/vbscript[\t\n\r ]*:/i},{id:`html-data-html`,description:`data:text/html URI — can execute scripts in browsers`,pattern:/data[\t\n\r ]*:[\t\n\r ]*text\/html/i},{id:`html-data-xhtml`,description:`data:application/xhtml+xml URI`,pattern:/data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i},{id:`html-data-svg`,description:`data:image/svg+xml URI — can execute scripts`,pattern:/data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i},{id:`html-inline-event-handler`,description:`Inline event handler attributes: onclick=, onerror=, onload=, etc.`,pattern:/\bon\w{1,30}\s*=/i},{id:`html-entity-obfuscated-script`,description:`HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)`,pattern:/(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i},{id:`html-entity-obfuscated-javascript`,description:`HTML-entity-encoded javascript: (partial — catches common &#106; or &#x6a; for "j")`,pattern:/(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i},{id:`html-style-expression`,description:`CSS expression() — IE-era code execution in style attributes`,pattern:/style[\s\S]{0,20}expression\s*\(/i},{id:`html-object-embed`,description:`<object or <embed tags that can load active content`,pattern:/<(?:object|embed)[\s>/]/i},{id:`html-base-tag`,description:`<base href= — can hijack all relative URLs on a page`,pattern:/<base[\s>]/i},{id:`html-meta-refresh`,description:`<meta http-equiv="refresh" — can redirect users`,pattern:/<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i},{id:`html-srcdoc`,description:`srcdoc= attribute on iframes — embeds HTML that can run scripts`,pattern:/srcdoc\s*=/i},{id:`html-iframe`,description:`<iframe tag`,pattern:/<iframe[\s>/]/i},{id:`html-form`,description:`<form tag — can be used for phishing / credential harvesting injection`,pattern:/<form[\s>/]/i}]})))()}var mr;function hr(){return(hr=t((()=>{mr=[{id:`xml-cdata-injection`,description:`CDATA section injection: <![CDATA[ breaks out of text node context`,pattern:/<!\[CDATA\[/i},{id:`xml-cdata-close`,description:`CDATA close sequence: ]]> can terminate an enclosing CDATA section`,pattern:/\]\]>/},{id:`xml-processing-instruction`,description:`XML processing instruction: <?xml-stylesheet or <?php etc.`,pattern:/<\?(?:xml[\- ]|php|asp)/i},{id:`xml-doctype-injection`,description:`DOCTYPE declaration embedded in content — can define entities`,pattern:/<!DOCTYPE(?:[\s[]|$)/i},{id:`xml-entity-system`,description:`SYSTEM keyword — used in external entity declarations (XXE)`,pattern:/\bSYSTEM\s+["']/i},{id:`xml-entity-public`,description:`PUBLIC keyword — used in external entity declarations (XXE)`,pattern:/\bPUBLIC\s+["']/i},{id:`xml-entity-declaration`,description:`<!ENTITY declaration — defines entities, potential XXE or entity expansion`,pattern:/<!ENTITY[\s%]/i},{id:`xml-billion-laughs`,description:`Entity reference chaining / billion laughs: repeated &eX; style references`,pattern:/(?:&\w{1,20};){3,}/},{id:`xml-namespace-confusion`,description:`xmlns: attribute injection — can redefine namespaces to confuse parsers`,pattern:/\bxmlns(?::\w{1,40})?\s*=/i},{id:`xml-comment-injection`,description:`<!-- comment injection — can hide content from some parsers`,pattern:/<!--/},{id:`xml-comment-close`,description:`--> closes an enclosing XML comment`,pattern:/-->/},{id:`xml-pi-close`,description:`?> closes an enclosing processing instruction`,pattern:/\?>/}]})))()}var gr;function _r(){return(_r=t((()=>{gr=[{id:`svg-script-element`,description:`<script element inside SVG executes JavaScript`,pattern:/<script[\s>/]/i},{id:`svg-xlink-href-javascript`,description:`xlink:href with javascript: — classic SVG XSS via <a> or <use>`,pattern:/xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i},{id:`svg-href-javascript`,description:`href= with javascript: in SVG context (<a>, <animate>, etc.)`,pattern:/href\s*=\s*["']?\s*javascript\s*:/i},{id:`svg-foreignobject`,description:`<foreignObject embeds HTML inside SVG — can execute scripts`,pattern:/<foreignObject[\s>/]/i},{id:`svg-use-external`,description:`<use xlink:href or href pointing to external resource (non-fragment URL)`,pattern:/<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i},{id:`svg-animate-href`,description:`<animate attributeName="href" — can dynamically change href to javascript:`,pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i},{id:`svg-animate-xlinkhref`,description:`<animate attributeName="xlink:href"`,pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i},{id:`svg-set-javascript`,description:`<set to="javascript:..." — sets an attribute to a javascript: URI`,pattern:/<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i},{id:`svg-event-handler`,description:`SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.`,pattern:/\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i},{id:`svg-handler-generic`,description:`Generic on* handler catch-all for SVG attributes`,pattern:/\bon\w{1,30}\s*=/i},{id:`svg-filter-feimage`,description:`<feImage href= — filter primitive that can load external resources`,pattern:/<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i},{id:`svg-image-external`,description:`<image xlink:href with http/https or javascript protocol`,pattern:/<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i},{id:`svg-style-javascript`,description:`style= attribute containing javascript: (e.g. background:url(javascript:...))`,pattern:/style\s*=[\s\S]{0,60}javascript\s*:/i}]})))()}var vr;function yr(){return(yr=t((()=>{vr=[{id:`sql-block-comment-open`,description:`SQL block comment open: /* ... */ — unusual in legitimate user text`,pattern:/\/\*/},{id:`sql-union-select`,description:`UNION SELECT — most common SQL injection aggregation attack`,pattern:/\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i},{id:`sql-drop-table`,description:`DROP TABLE — destructive DDL injection`,pattern:/\bDROP\s{1,20}TABLE\b/i},{id:`sql-drop-database`,description:`DROP DATABASE — destructive DDL injection`,pattern:/\bDROP\s{1,20}DATABASE\b/i},{id:`sql-insert-into`,description:`INSERT INTO — data injection`,pattern:/\bINSERT\s{1,20}INTO\b/i},{id:`sql-delete-from`,description:`DELETE FROM — data deletion injection`,pattern:/\bDELETE\s{1,20}FROM\b/i},{id:`sql-update-set`,description:`UPDATE ... SET — data modification injection`,pattern:/\bUPDATE\b[\s\S]{1,60}\bSET\b/i},{id:`sql-exec-xp`,description:`EXEC xp_ — MSSQL extended stored procedure execution`,pattern:/\bEXEC(?:UTE)?\s{1,20}xp_/i},{id:`sql-tautology-string`,description:`Classic string tautology: ' OR '1'='1 or " OR "1"="1"`,pattern:/'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i},{id:`sql-tautology-numeric`,description:`Numeric tautology: OR 1=1`,pattern:/\bOR\s{1,10}1\s*=\s*1\b/i},{id:`sql-always-true-zero`,description:`Numeric tautology: OR 0=0`,pattern:/\bOR\s{1,10}0\s*=\s*0\b/i},{id:`sql-sleep-benchmark`,description:`Time-based blind injection: SLEEP() or BENCHMARK()`,pattern:/\b(?:SLEEP|BENCHMARK)\s*\(/i},{id:`sql-waitfor-delay`,description:`MSSQL time-based blind injection: WAITFOR DELAY`,pattern:/\bWAITFOR\s{1,20}DELAY\b/i},{id:`sql-char-function`,description:`CHAR() function — used to obfuscate injected strings`,pattern:/\bCHAR\s*\(\s*\d{1,3}/i},{id:`sql-information-schema`,description:`INFORMATION_SCHEMA — reconnaissance query for table/column enumeration`,pattern:/\bINFORMATION_SCHEMA\b/i}]})))()}var br;function xr(){return(xr=t((()=>{br=[{id:`shell-path-traversal-unix`,description:`Unix path traversal: ../  — climbing the directory tree`,pattern:/\.\.\//},{id:`shell-path-traversal-windows`,description:`Windows path traversal: ..\\ — climbing the directory tree`,pattern:/\.\.\\/},{id:`shell-path-traversal-encoded`,description:`URL-encoded path traversal: %2e%2e or %2f variants`,pattern:/%2e%2e|%2f\.\.|\.\.%2f/i},{id:`shell-null-byte`,description:`Null byte injection: \\x00 or %00 — truncates strings in C-backed functions`,pattern:/\x00|%00/},{id:`shell-semicolon`,description:`Semicolon command separator: cmd1; cmd2`,pattern:/;/},{id:`shell-pipe`,description:`Pipe operator: cmd1 | cmd2`,pattern:/\|/},{id:`shell-and-operator`,description:`AND operator: cmd1 && cmd2`,pattern:/&&/},{id:`shell-or-operator`,description:`OR operator: cmd1 || cmd2`,pattern:/\|\|/},{id:`shell-backtick`,description:"Backtick command substitution: `cmd`",pattern:/`/},{id:`shell-dollar-paren`,description:`Dollar-paren command substitution: $(cmd)`,pattern:/\$\(/},{id:`shell-dollar-brace`,description:"Dollar-brace variable expansion: ${var} — can be abused for injection",pattern:/\$\{/},{id:`shell-redirect-out`,description:`Output redirection: cmd > file or cmd >> file`,pattern:/>{1,2}/},{id:`shell-redirect-in`,description:`Input redirection: cmd < file`,pattern:/</},{id:`shell-newline-injection`,description:`Newline injection: \\n or \\r — can inject new shell commands`,pattern:/[\n\r]/},{id:`shell-glob-star`,description:`Glob expansion: * or ? — can expand to unintended files`,pattern:/[/\\][*?]/},{id:`shell-absolute-root`,description:`Absolute root path injection: string starting with / or \\ (Windows UNC)`,pattern:/^(?:\/|\\\\)/},{id:`shell-windows-drive`,description:`Windows drive letter path injection: C:\\ or D:/`,pattern:/^[a-zA-Z]:[/\\]/},{id:`shell-curl-wget`,description:`curl/wget with URL or flags — can exfiltrate data or download payloads`,pattern:/\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i}]})))()}var Sr;function Cr(){return(Cr=t((()=>{Sr=[{id:`redos-nested-quantifier-plus`,description:`Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.`,pattern:/\([^)]*\+[^)]*\)[+*]/},{id:`redos-nested-quantifier-star`,description:`Nested * quantifier: (a*)* or (a*)+ — catastrophic backtracking`,pattern:/\([^)]*\*[^)]*\)[*+]/},{id:`redos-nested-groups`,description:`Doubly nested quantified groups: ((a+)+) — guaranteed catastrophic`,pattern:/\(\([^)]{0,40}\)[+*]\)[+*]/},{id:`redos-alternation-overlap`,description:`Overlapping alternation under quantifier: (a|a)+ — ambiguous NFA paths`,pattern:/\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/},{id:`redos-star-plus-concat`,description:`(x*x)+ pattern — triggers super-linear backtracking`,pattern:/\([^)]{0,10}\*[^)]{0,10}\)[+*]/},{id:`redos-dot-star-greedy`,description:`(.*){n,} or (.+){n,} — repeated greedy dot quantifiers`,pattern:/\(\.[*+]\)\{?\d/},{id:`redos-large-repetition`,description:`Very large fixed or range repetition count {1000,} or {1000,n} — denial of service via backtracking`,pattern:/\{\d{4,}(?:,\d*)?\}/},{id:`redos-catastrophic-alternation`,description:`Long alternation with many similar branches — polynomial backtracking risk`,pattern:/\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/}]})))()}var G,wr;function Tr(){return(Tr=t((()=>{G=`["'\\s]*:`,wr=[{id:`nosql-where-operator`,description:`$where — executes arbitrary JavaScript server-side in MongoDB`,pattern:RegExp(`\\$where${G}`,`i`)},{id:`nosql-ne-operator`,description:`$ne — "not equal" operator used to bypass equality checks`,pattern:RegExp(`\\$ne${G}`,`i`)},{id:`nosql-gt-operator`,description:`$gt — "greater than" used to bypass password/value checks`,pattern:RegExp(`\\$gte?${G}`,`i`)},{id:`nosql-lt-operator`,description:`$lt / $lte — "less than" bypass variants`,pattern:RegExp(`\\$lte?${G}`,`i`)},{id:`nosql-regex-operator`,description:`$regex — can be used to extract data character by character (blind injection)`,pattern:RegExp(`\\$regex${G}`,`i`)},{id:`nosql-or-operator`,description:`$or — logical OR; used to create always-true conditions`,pattern:RegExp(`\\$or${G}\\s*\\[`,`i`)},{id:`nosql-and-operator`,description:`$and — logical AND operator injection`,pattern:RegExp(`\\$and${G}\\s*\\[`,`i`)},{id:`nosql-nor-operator`,description:`$nor — logical NOR operator injection`,pattern:RegExp(`\\$nor${G}\\s*\\[`,`i`)},{id:`nosql-exists-operator`,description:`$exists — can enumerate fields to determine schema`,pattern:RegExp(`\\$exists${G}`,`i`)},{id:`nosql-in-operator`,description:`$in — matches any value in a list; can enumerate values`,pattern:RegExp(`\\$in${G}\\s*\\[`,`i`)},{id:`nosql-expr-operator`,description:`$expr — allows aggregation expressions in queries (MongoDB 3.6+)`,pattern:RegExp(`\\$expr${G}`,`i`)},{id:`nosql-function-operator`,description:`$function — executes arbitrary JavaScript in MongoDB 4.4+`,pattern:RegExp(`\\$function${G}`,`i`)},{id:`nosql-accumulator-operator`,description:`$accumulator — custom aggregation with arbitrary JS execution`,pattern:RegExp(`\\$accumulator${G}`,`i`)},{id:`nosql-proto-pollution`,description:`__proto__ — prototype pollution via object key injection`,pattern:/__proto__/},{id:`nosql-constructor-prototype`,description:`constructor.prototype — alternative prototype pollution vector (dot notation or JSON key)`,pattern:/constructor[\s"':.,{\[]*prototype/i},{id:`nosql-proto-bracket`,description:`["__proto__"] — bracket-notation prototype pollution`,pattern:/\[["']__proto__["']\]/}]})))()}var Er;function Dr(){return(Dr=t((()=>{Er=[{id:`log-crlf-injection`,description:`CRLF injection: literal \\r or \\n embeds fake log lines`,pattern:/[\r\n]/},{id:`log-url-encoded-crlf`,description:`URL-encoded CRLF: %0d, %0a, %0D, %0A — decoded by some log parsers`,pattern:/%0[dDaA]/},{id:`log-unicode-newline`,description:`Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)`,pattern:/[\u2028\u2029]/},{id:`log-log4shell-jndi`,description:"Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",pattern:/\$\{jndi\s*:/i},{id:`log-log4shell-obfuscated`,description:"Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",pattern:/\$\{::-/},{id:`log-log4j-lookup`,description:"Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} — data exfiltration",pattern:/\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i},{id:`log-ssti-double-brace`,description:`SSTI double-brace: {{expression}} — Jinja2, Twig, Handlebars, etc.`,pattern:/\{\{[\s\S]{0,80}\}\}/},{id:`log-ssti-hash-brace`,description:`SSTI hash-brace: #{expression} — Thymeleaf, Velocity, Ruby ERB`,pattern:/#\{[\s\S]{0,80}\}/},{id:`log-ssti-dollar-brace`,description:"SSTI/EL injection: ${expression with operators or method calls} — JSP EL, Freemarker, SpEL",pattern:/\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i},{id:`log-ssti-percent-tag`,description:`SSTI ERB/ASP tag: <%= expression %> — Ruby ERB, ASP`,pattern:/<%=[\s\S]{0,80}%>/},{id:`log-null-byte`,description:`Null byte: \\x00 or %00 — can truncate log entries in C-backed loggers`,pattern:/\x00|%00/},{id:`log-ansi-escape`,description:`ANSI escape sequence: ESC[ — can manipulate terminal output when logs are tailed`,pattern:/\x1b\[/}]})))()}var Or,kr;function Ar(){return(Ar=t((()=>{yr(),Or=[{id:`sql-line-comment`,description:`SQL line comment: -- followed by whitespace or end of string`,pattern:/--(?:\s|$)/},{id:`sql-stacked-query`,description:`Stacked queries: semicolon immediately followed by a SQL keyword`,pattern:/;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i},{id:`sql-hex-encoding`,description:`Hex-encoded string injection: 0x41414141 style (MySQL)`,pattern:/\b0x[0-9a-f]{4,}/i}],kr=[...vr,...Or]})))()}function jr(e){return e.indexOf(`&`)===-1?e:e.replace(Nr,(e,t,n,r)=>{if(r!==void 0)return Object.prototype.hasOwnProperty.call(Mr,r)?Mr[r]:e;let i=t===void 0?parseInt(n,10):parseInt(t,16);return!Number.isFinite(i)||i>1114111?e:String.fromCodePoint(i)})}var Mr,Nr;function Pr(){return(Pr=t((()=>{Mr=Object.freeze({colon:`:`,Tab:`	`,NewLine:`
`}),Nr=/&(?:#[xX]0*([0-9a-fA-F]{1,6});?|#0*([0-9]{1,7});?|([a-zA-Z][a-zA-Z0-9]{1,15});)/g})))()}function Fr(e){if(typeof e!=`string`)throw TypeError(`is-unsafe: first argument must be a string, got ${typeof e}`)}function Ir(e){if(!(e instanceof RegExp)){if(Array.isArray(e)){if(e.length===0)throw TypeError(`is-unsafe: context must not be an empty array`);if(Array.isArray(e[0])){for(let t of e)if(!Array.isArray(t)||t.length===0)throw TypeError(`is-unsafe: each context in the array must be a non-empty pattern array (PatternList)`)}}else throw TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof e}`)}}function Lr(e){return e instanceof RegExp?{lists:null,regex:e}:Array.isArray(e[0])?{lists:e,regex:null}:{lists:[e],regex:null}}function Rr(e,t){if(!t.decodeEntities)return null;let n=jr(e);return n===e?null:n}function zr(e,t){let n=t.label??`CUSTOM`,r=Rr(e,t);for(let i of t)if(i.pattern.test(e)||r!==null&&i.pattern.test(r))return{context:n,id:i.id,description:i.description,pattern:i.pattern};return null}function Br(e,t){Fr(e),Ir(t);let{lists:n,regex:r}=Lr(t);if(r)return r.test(e);for(let t of n)if(zr(e,t)!==null)return!0;return!1}function Vr(){return(Vr=t((()=>{pr(),hr(),_r(),yr(),xr(),Cr(),Tr(),Dr(),Ar(),Pr(),fr.label=`HTML`,mr.label=`XML`,gr.label=`SVG`,fr.decodeEntities=!0,mr.decodeEntities=!0,gr.decodeEntities=!0,vr.label=`SQL`,kr.label=`SQL-STRICT`,br.label=`SHELL`,Sr.label=`REDOS`,wr.label=`NOSQL`,Er.label=`LOG`,Object.freeze({HTML:fr,XML:mr,SVG:gr,SQL:vr,"SQL-STRICT":kr,SHELL:br,REDOS:Sr,NOSQL:wr,LOG:Er})})))()}function Hr(e,t){if(!e)return{};let n=t.attributesGroupName?e[t.attributesGroupName]:e;if(!n)return{};let r={};for(let e in n)if(e.startsWith(t.attributeNamePrefix)){let i=e.substring(t.attributeNamePrefix.length);r[i]=n[e]}else r[e]=n[e];return r}function Ur(e){if(!e||typeof e!=`string`)return;let t=e.indexOf(`:`);if(t!==-1&&t>0){let n=e.substring(0,t);if(n!==`xmlns`)return n}}function Wr(e,t,n,r,i,a,o){let s=this.options;if(e!==void 0&&(s.trimValues&&!r&&(e=e.trim()),e.length>0)){o||(e=this.replaceEntitiesValue(e,t,n));let r=s.jPath?n.toString():n,c=s.tagValueProcessor(t,e,r,i,a);return c==null?e:typeof c!=typeof e||c!==e?c:s.trimValues||e.trim()===e?ri(e,s.parseTagValue,s.numberParseOptions):e}}function Gr(e){if(this.options.removeNSPrefix){let t=e.split(`:`),n=e.charAt(0)===`/`?`/`:``;if(t[0]===`xmlns`)return``;t.length===2&&(e=n+t[1])}return e}function Kr(e){return e[3]===void 0?e[4]:e[3]}function qr(e,t,n,r=!1){let i=this.options;if(r===!0||i.ignoreAttributes!==!0&&typeof e==`string`){let r=Et(e,si),a=r.length,o={},s=Array(a),c=!1,l={};for(let e=0;e<a;e++){let t=this.resolveNameSpace(r[e][1]),a=Kr(r[e]);if(t.length&&a!==void 0){let r=a;i.trimValues&&(r=r.trim()),r=this.replaceEntitiesValue(r,n,this.readonlyMatcher),s[e]=r,l[t]=r,c=!0}}c&&typeof t==`object`&&t.updateCurrent&&t.updateCurrent(l);let u=i.jPath?t.toString():this.readonlyMatcher,d=!1;for(let e=0;e<a;e++){let t=this.resolveNameSpace(r[e][1]);if(this.ignoreAttributesFn(t,u))continue;let n=i.attributeNamePrefix+t;if(t.length){if(i.transformAttributeName&&(n=i.transformAttributeName(n)),n=ai(n,i),Kr(r[e])!==void 0){let r=s[e],a=i.attributeValueProcessor(t,r,u);a==null?o[n]=r:typeof a!=typeof r||a!==r?o[n]=a:o[n]=ri(r,i.parseAttributeValue,i.numberParseOptions),d=!0}else i.allowBooleanAttributes&&(o[n]=!0,d=!0)}}if(!d)return;if(i.attributesGroupName&&!i.preserveOrder){let e={};return e[i.attributesGroupName]=o,e}return o}}function K(e,t){let n=0,r=t.length;for(;n<r;){let i=Math.floor((n+r)/2);t[i]<e?n=i+1:r=i}return e+n}function Jr(e,t,n,r){this.options.captureMetaData||(r=void 0);let i=this.options.jPath?n.toString():n,a=this.options.updateTag(t.tagname,i,t[`:@`]);a===!1||(typeof a==`string`&&(t.tagname=a),e.addChild(t,r))}function Yr(e,t,n){let r=this.options.processEntities;if(!r||!r.enabled)return e;if(r.allowedTags){let i=this.options.jPath?n.toString():n;if(!(Array.isArray(r.allowedTags)?r.allowedTags.includes(t):r.allowedTags(t,i)))return e}if(r.tagFilter){let i=this.options.jPath?n.toString():n;if(!r.tagFilter(t,i))return e}return this.entityDecoder.decode(e)}function Xr(e,t,n,r){return e&&=(r===void 0&&(r=t.child.length===0),e=this.parseTextData(e,t.tagname,n,!1,t[`:@`]?Object.keys(t[`:@`]).length!==0:!1,r),e!==void 0&&e!==``&&t.add(this.options.textNodeName,e),``),e}function Zr(){return this.stopNodeExpressionsSet.size!==0&&this.matcher.matchesAny(this.stopNodeExpressionsSet)}function Qr(e,t,n=`>`){let r=e.length,i=n.charCodeAt(0),a=n.length>1?n.charCodeAt(1):-1,o=``,s=t;for(let n=t;n<r;n++){let t=e.charCodeAt(n);if(t===34||t===39){if(n=e.indexOf(e[n],n+1),n===-1)return}else if(t===i){if(a!==-1){if(e.charCodeAt(n+1)===a)return o+=e.substring(s,n),{data:o,index:n}}else return o+=e.substring(s,n),{data:o,index:n}}else t===9&&(o+=e.substring(s,n)+` `,s=n+1)}}function $r(e,t,n,r){let i=e.indexOf(t,n);if(i===-1)throw Error(r);return i+t.length-1}function ei(e,t,n,r){let i=e.indexOf(t,n);if(i===-1)throw Error(r);return i}function ti(e,t,n,r=`>`){let i=Qr(e,t+1,r);if(!i)return;let a=i.data,o=i.index,s=a.search(/\s/),c=a,l=!0;s!==-1&&(c=a.substring(0,s),a=a.substring(s+1).trimStart());let u=c;if(n){let e=c.indexOf(`:`);e!==-1&&(c=c.substr(e+1),l=c!==i.data.substr(e+1))}return{tagName:c,tagExp:a,closeIndex:o,attrExpPresent:l,rawTagName:u}}function ni(e,t,n){let r=n,i=1,a=!1,o=-1,s=e.length;for(;n<s;n++)if(e[n]===`<`){let s=e.charCodeAt(n+1);if(s===47){let a=ei(e,`>`,n,`${t} is not closed`);if(e.substring(n+2,a).trim()===t&&(i--,i===0))return{tagContent:e.substring(r,n),i:a};n=a}else if(s===63)n=$r(e,`?>`,n+1,`StopNode is not closed.`);else if(s===33&&e.charCodeAt(n+2)===45&&e.charCodeAt(n+3)===45)n=$r(e,`-->`,n+3,`StopNode is not closed.`);else if(s===33&&e.charCodeAt(n+2)===91)n=$r(e,`]]>`,n,`StopNode is not closed.`)-2;else{let r=a?void 0:ti(e,n,!1);if(r)r.tagName===t&&r.tagExp[r.tagExp.length-1]!==`/`&&i++,n=r.closeIndex;else{if(a=!0,o<n&&(o=e.indexOf(`>`,n),o===-1))return;let r=e.indexOf(`<`,n+1);if(r===-1||r>o){let r=e.substring(n+1,o),a=r.search(/\s/);(a===-1?r:r.substring(0,a))===t&&r[r.length-1]!==`/`&&i++,n=o}}}}}function ri(e,t,n){if(t&&typeof e==`string`){let t=e.trim();return t===`true`||t!==`false`&&qn(e,n)}return Dt(e)?e:``}function ii(e,t,n,r){if(e){let r=e(t);n===t&&(n=r),t=r}return t=ai(t,r),{tagName:t,tagExp:n}}function ai(e,t){if(jt.includes(e))throw Error(`[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);return At.includes(e)?t.onDangerousProperty(e):e}var oi,si,ci;function li(){return(li=t((()=>{Mt(),vn(),Pn(),ir(),or(),dr(),cr(),un(),Qt(),Vr(),oi=class{constructor(e,t){this.options=e,this.currentNode=null,this.tagsNodeStack=[],this.parseXml=ci,this.parseTextData=Wr,this.resolveNameSpace=Gr,this.buildAttributesMap=qr,this.isItStopNode=Zr,this.replaceEntitiesValue=Yr,this.readStopNodeData=ni,this.saveTextToParentTag=Xr,this.addChild=Jr,this.ignoreAttributesFn=ar(this.options.ignoreAttributes),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let n={...Xt};this.options.entityDecoder?this.entityDecoder=this.options.entityDecoder:(typeof this.options.htmlEntities==`object`?n=this.options.htmlEntities:this.options.htmlEntities===!0&&(n={...Zt,...Yt}),this.entityDecoder=new ln({namedEntities:{...n,...t},numericAllowed:this.options.htmlEntities,limit:{maxTotalExpansions:this.options.processEntities.maxTotalExpansions,maxExpandedLength:this.options.processEntities.maxExpandedLength,applyLimitsTo:this.options.processEntities.appliesTo},onInputEntity:(e,t)=>Br(t,[fr,mr])?rn.BLOCK:rn.ALLOW})),this.matcher=new ur,this.readonlyMatcher=this.matcher.readOnly(),this.isCurrentNodeStopNode=!1,this.stopNodeExpressionsSet=new sr;let r=this.options.stopNodes;if(r&&r.length>0){for(let e=0;e<r.length;e++){let t=r[e];typeof t==`string`?this.stopNodeExpressionsSet.add(new W(t)):t instanceof W&&this.stopNodeExpressionsSet.add(t)}this.stopNodeExpressionsSet.seal()}}},si=/([^\s=]+)\s*(=\s*(?:"([^"]*)"|'([^']*)'))?/gm,ci=function(e){let t=this.options,n=t.captureMetaData?[]:void 0;e=e.replace(/\r\n?/g,t.captureMetaData?(e,t)=>(e.length===2&&n.push(t-n.length),`
`):`
`);let r=new V(`!xml`),i=r,a=``;this.matcher.reset(),this.entityDecoder.reset(),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let o=new Nn(t.processEntities),s=e.length;for(let c=0;c<s;c++)if(e[c]===`<`){let l=e.charCodeAt(c+1);if(l===47){let o=$r(e,`>`,c,`Closing Tag is not closed.`),s=e.substring(c+2,o).trim();if(t.removeNSPrefix){let e=s.indexOf(`:`);e!==-1&&(s=s.substr(e+1))}s=ii(t.transformTagName,s,``,t).tagName,i&&(a=this.saveTextToParentTag(a,i,this.readonlyMatcher));let l=this.matcher.getCurrentTag();if(s&&t.unpairedTagsSet.has(s))throw Error(`Unpaired tag can not be used as closing tag: </${s}>`);l&&t.unpairedTagsSet.has(l)&&(this.matcher.pop(),this.tagsNodeStack.pop()),this.matcher.pop(),this.isCurrentNodeStopNode=!1,i=this.tagsNodeStack.pop()||r,t.captureMetaData&&i&&i.addEndIndex(K(o+1,n)),a=``,c=o}else if(l===63){let r=ti(e,c,!1,`?>`);if(!r)throw Error(`Pi Tag is not closed.`);a=this.saveTextToParentTag(a,i,this.readonlyMatcher);let s=this.buildAttributesMap(r.tagExp,this.matcher,r.tagName,!0);if(s){let e=s[this.options.attributeNamePrefix+`version`];this.entityDecoder.setXmlVersion(Number(e)||1),o.setXmlVersion(Number(e)||1)}if(!(t.ignoreDeclaration&&r.tagName===`?xml`||t.ignorePiTags)){let e=new V(r.tagName);e.add(t.textNodeName,``),r.tagName!==r.tagExp&&r.attrExpPresent&&t.ignoreAttributes!==!0&&(e[`:@`]=s);let a=t.captureMetaData?K(c,n):c;this.addChild(i,e,this.readonlyMatcher,a),t.captureMetaData&&i.addEndIndex(K(r.closeIndex+2,n))}c=r.closeIndex+1}else if(l===33&&e.charCodeAt(c+2)===45&&e.charCodeAt(c+3)===45){let n=$r(e,`-->`,c+4,`Comment is not closed.`);if(t.commentPropName){let r=e.substring(c+4,n-2);a=this.saveTextToParentTag(a,i,this.readonlyMatcher),i.add(t.commentPropName,[{[t.textNodeName]:r}])}c=n}else if(l===33&&e.charCodeAt(c+2)===68){if(this.doctypefound)throw Error(`Multiple DOCTYPE declarations found.`);this.doctypefound=!0;let t=o.readDocType(e,c);this.entityDecoder.addInputEntities(t.entities),c=t.i}else if(l===33&&e.charCodeAt(c+2)===91){let n=$r(e,`]]>`,c,`CDATA is not closed.`)-2,r=e.substring(c+9,n);a=this.saveTextToParentTag(a,i,this.readonlyMatcher);let o=this.parseTextData(r,i.tagname,this.readonlyMatcher,!0,!1,!0,!0);o??=``,t.cdataPropName?i.add(t.cdataPropName,[{[t.textNodeName]:r}]):i.add(t.textNodeName,o),c=n+2}else{let o=ti(e,c,t.removeNSPrefix);if(!o){let t=e.substring(Math.max(0,c-50),Math.min(s,c+50));throw Error(`readTagExp returned undefined at position ${c}. Context: "${t}"`)}let l=o.tagName,u=o.rawTagName,d=o.tagExp,f=o.attrExpPresent,p=o.closeIndex;if({tagName:l,tagExp:d}=ii(t.transformTagName,l,d,t),t.strictReservedNames&&(l===t.commentPropName||l===t.cdataPropName||l===t.textNodeName||l===t.attributesGroupName))throw Error(`Invalid tag name: ${l}`);i&&a&&i.tagname!==`!xml`&&(a=this.saveTextToParentTag(a,i,this.readonlyMatcher,!1));let m=i;m&&t.unpairedTagsSet.has(m.tagname)&&(i=this.tagsNodeStack.pop(),this.matcher.pop());let h=!1;d.length>0&&d.lastIndexOf(`/`)===d.length-1&&(h=!0,l[l.length-1]===`/`?(l=l.substr(0,l.length-1),d=l):d=d.substr(0,d.length-1),f=l!==d);let g=null,_;_=Ur(u),l!==r.tagname&&this.matcher.push(l,{},_),l!==d&&f&&(g=this.buildAttributesMap(d,this.matcher,l),g&&Hr(g,t)),l!==r.tagname&&(this.isCurrentNodeStopNode=this.isItStopNode());let v=t.captureMetaData?K(c,n):c;if(this.isCurrentNodeStopNode){let r=``;if(h)c=o.closeIndex;else if(t.unpairedTagsSet.has(l))c=o.closeIndex;else{let t=this.readStopNodeData(e,u,p+1);if(!t)throw Error(`Unexpected end of ${u}`);c=t.i,r=t.tagContent}let a=new V(l);g&&(a[`:@`]=g),a.add(t.textNodeName,r),this.matcher.pop(),this.isCurrentNodeStopNode=!1,this.addChild(i,a,this.readonlyMatcher,v),t.captureMetaData&&i.addEndIndex(K(c+1,n))}else{if(h){({tagName:l,tagExp:d}=ii(t.transformTagName,l,d,t));let e=new V(l);g&&(e[`:@`]=g),this.addChild(i,e,this.readonlyMatcher,v),t.captureMetaData&&i.addEndIndex(K(p+1,n)),this.matcher.pop(),this.isCurrentNodeStopNode=!1}else if(t.unpairedTagsSet.has(l)){let e=new V(l);g&&(e[`:@`]=g),this.addChild(i,e,this.readonlyMatcher,v),t.captureMetaData&&i.addEndIndex(K(o.closeIndex+1,n)),this.matcher.pop(),this.isCurrentNodeStopNode=!1,c=o.closeIndex;continue}else{let e=new V(l);if(this.tagsNodeStack.length>t.maxNestedTags)throw Error(`Maximum nested tags exceeded`);this.tagsNodeStack.push(i),g&&(e[`:@`]=g),this.addChild(i,e,this.readonlyMatcher,v),i=e}a=``,c=p}}}else a+=e[c];return r.child}})))()}function ui(e,t){if(!e||typeof e!=`object`)return{};if(!t)return e;let n={};for(let r in e)if(r.startsWith(t)){let i=r.substring(t.length);n[i]=e[r]}else n[r]=e[r];return n}function di(e,t,n,r){return fi(e,t,n,r)}function fi(e,t,n,r){let i,a={};for(let o=0;o<e.length;o++){let s=e[o],c=pi(s);if(c!==void 0&&c!==t.textNodeName){let e=ui(s[`:@`]||{},t.attributeNamePrefix);n.push(c,e)}if(c===t.textNodeName)i===void 0?i=s[c]:i+=``+s[c];else if(c===void 0)continue;else if(s[c]){let e=fi(s[c],t,n,r),i=hi(e,t);if(Object.keys(e).length===0&&t.alwaysCreateTextNode&&(e[t.textNodeName]=``),s[`:@`]?mi(e,s[`:@`],r,t):Object.keys(e).length===1&&e[t.textNodeName]!==void 0&&!t.alwaysCreateTextNode?e=e[t.textNodeName]:Object.keys(e).length===0&&(t.alwaysCreateTextNode?e[t.textNodeName]=``:e=``),s[gi]!==void 0&&typeof e==`object`&&e&&(e[gi]=s[gi]),a[c]!==void 0&&Object.prototype.hasOwnProperty.call(a,c))Array.isArray(a[c])||(a[c]=[a[c]]),a[c].push(e);else{let n=t.jPath?r.toString():r;a[c]=t.isArray(c,n,i)?[e]:e}c!==void 0&&c!==t.textNodeName&&n.pop()}}return typeof i==`string`?i.length>0&&(a[t.textNodeName]=i):i!==void 0&&(a[t.textNodeName]=i),a}function pi(e){let t=Object.keys(e);for(let e=0;e<t.length;e++){let n=t[e];if(n!==`:@`)return n}}function mi(e,t,n,r){if(t){let i=Object.keys(t),a=i.length;for(let o=0;o<a;o++){let a=i[o],s=a.startsWith(r.attributeNamePrefix)?a.substring(r.attributeNamePrefix.length):a,c=r.jPath?n.toString()+`.`+s:n;e[a]=r.isArray(a,c,!0,!0)?[t[a]]:t[a]}}}function hi(e,t){let{textNodeName:n}=t,r=Object.keys(e).length;return!!(r===0||r===1&&(e[n]||typeof e[n]==`boolean`||e[n]===0))}var gi;function _i(){return(_i=t((()=>{vn(),gi=V.getMetaDataSymbol()})))()}var vi;function yi(){return(yi=t((()=>{gn(),li(),_i(),Jt(),vn(),vi=class{constructor(e){this.externalEntities={},this.options=hn(e)}parse(e,t){if(typeof e!=`string`&&e.toString)e=e instanceof Uint8Array&&!(typeof Buffer<`u`&&Buffer.isBuffer(e))?new TextDecoder(`utf-8`,{ignoreBOM:!0}).decode(e):e.toString();else if(typeof e!=`string`)throw Error(`XML data is accepted in String or Bytes[] form.`);if(t){t===!0&&(t={});let n=Nt(e,t);if(n!==!0)throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`)}let n=new oi(this.options,this.externalEntities),r=n.parseXml(e);return this.options.preserveOrder||r===void 0?r:di(r,this.options,n.matcher,n.readonlyMatcher)}addEntity(e,t){if(t.indexOf(`&`)!==-1)throw Error(`Entity value can't have '&'`);if(e.indexOf(`&`)!==-1||e.indexOf(`;`)!==-1)throw Error(`An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'`);if(t===`&`)throw Error(`An entity with value '&' is not permitted`);this.externalEntities[e]=t}static getMetaDataSymbol(){return V.getMetaDataSymbol()}}})))()}function q(e){return typeof e==`number`&&Object.is(e,-0)?`-0`:String(e)}function bi(e){return q(e).replace(/--/g,`- -`).replace(/--/g,`- -`).replace(/-$/,`- `)}function xi(e){return q(e).replace(/\]\]>/g,`]]]]><![CDATA[>`)}function J(e){return q(e).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}function Si(e,t,n,r,i){if(!n.sanitizeName)return e;let a=!t&&e[0]===`?`,o=a?e.slice(1):e;if(i(o))return e;let s=n.sanitizeName(o,{isAttribute:t,matcher:r.readOnly()});if(typeof s!=`string`||!i(s))throw Error(`sanitizeName returned an invalid XML name for "${o}"`);return a?`?`+s:s}function Ci(e,t){if(!Array.isArray(e)||e.length===0)return`1.0`;let n=e[0];if(ki(n)===`?xml`){let e=n[`:@`];if(e){let n=t.attributeNamePrefix+`version`;if(e[n])return e[n]}}return`1.0`}function wi(e,t){let n=``;t.format&&(n=Ni);let r=[];if(t.stopNodes&&Array.isArray(t.stopNodes))for(let e=0;e<t.stopNodes.length;e++){let n=t.stopNodes[e];typeof n==`string`?r.push(new W(n)):n instanceof W&&r.push(n)}let i=Ci(e,t),a=An(`qName`,{xmlVersion:i}),o=new ur;return Ti(e,t,n,o,r,a)}function Ti(e,t,n,r,i,a){let o=``,s=!1;if(t.maxNestedTags&&r.getDepth()>t.maxNestedTags)throw Error(`Maximum nested tags exceeded`);if(!Array.isArray(e)){if(e!=null){let n=q(e);return n=Mi(n,t),n}return``}for(let c=0;c<e.length;c++){let l=e[c],u=ki(l);if(u===void 0)continue;let d=u===t.textNodeName||u===t.cdataPropName||u===t.commentPropName?u:Si(u,!1,t,r,a),f=Ei(l[`:@`],t);r.push(d,f);let p=ji(r,i);if(d===t.textNodeName){let e=l[u];p||(e=t.tagValueProcessor(d,e),e=Mi(e,t)),e=q(e),s&&(o+=n),o+=e,s=!1,r.pop();continue}if(d===t.cdataPropName){s&&(o+=n);let e=l[u][0][t.textNodeName],i=xi(e);o+=`<![CDATA[${i}]]>`,s=!1,r.pop();continue}if(d===t.commentPropName){let e=l[u][0][t.textNodeName],i=bi(e);o+=n+`<!--${i}-->`,s=!0,r.pop();continue}if(d[0]===`?`){let e=Ai(l[`:@`],t,p,r,a);o+=(d===`?xml`?``:n)+`<${d}${e}?>`,s=!0,r.pop();continue}let m=n;m!==``&&(m+=t.indentBy);let h=n+`<${d}${Ai(l[`:@`],t,p,r,a)}`,g;g=p?Di(l[u],t,r.getDepth()):Ti(l[u],t,m,r,i,a),t.unpairedTags.indexOf(d)===-1?(!g||g.length===0)&&t.suppressEmptyNode?o+=h+`/>`:g&&g.endsWith(`>`)?o+=h+`>${g}${n}</${d}>`:(o+=h+`>`,g&&n!==``&&(g.includes(`/>`)||g.includes(`</`))?o+=n+t.indentBy+g+n:o+=g,o+=`</${d}>`):t.suppressUnpairedNode?o+=h+`>`:o+=h+`/>`,s=!0,r.pop()}return o}function Ei(e,t){if(!e||t.ignoreAttributes)return null;let n={},r=!1;for(let i in e){if(!Object.prototype.hasOwnProperty.call(e,i))continue;let a=i.startsWith(t.attributeNamePrefix)?i.substr(t.attributeNamePrefix.length):i;n[a]=J(e[i]),r=!0}return r?n:null}function Di(e,t,n=0){if(t.maxNestedTags&&n>t.maxNestedTags)throw Error(`Maximum nested tags exceeded`);if(!Array.isArray(e))return e==null?``:q(e);let r=``;for(let i=0;i<e.length;i++){let a=e[i],o=ki(a);if(o===t.textNodeName)r+=q(a[o]);else if(o===t.cdataPropName)r+=a[o][0][t.textNodeName];else if(o===t.commentPropName)r+=a[o][0][t.textNodeName];else if(o&&o[0]===`?`)continue;else if(o){let e=Oi(a[`:@`],t),i=Di(a[o],t,n+1);!i||i.length===0?r+=`<${o}${e}/>`:r+=`<${o}${e}>${i}</${o}>`}}return r}function Oi(e,t){let n=``;if(e&&!t.ignoreAttributes)for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=e[r];i===!0&&t.suppressBooleanAttributes?n+=` ${r.substr(t.attributeNamePrefix.length)}`:n+=` ${r.substr(t.attributeNamePrefix.length)}="${J(i)}"`}return n}function ki(e){let t=Object.keys(e);for(let n=0;n<t.length;n++){let r=t[n];if(Object.prototype.hasOwnProperty.call(e,r)&&r!==`:@`)return r}}function Ai(e,t,n,r,i){let a=``;if(e&&!t.ignoreAttributes)for(let o in e){if(!Object.prototype.hasOwnProperty.call(e,o))continue;let s=o.substr(t.attributeNamePrefix.length),c=n?s:Si(s,!0,t,r,i),l;n?l=e[o]:(l=t.attributeValueProcessor(o,e[o]),l=Mi(l,t)),l===!0&&t.suppressBooleanAttributes?a+=` ${c}`:a+=` ${c}="${J(l)}"`}return a}function ji(e,t){if(!t||t.length===0)return!1;for(let n=0;n<t.length;n++)if(e.matches(t[n]))return!0;return!1}function Mi(e,t){if(e&&e.length>0&&t.processEntities)for(let n=0;n<t.entities.length;n++){let r=t.entities[n];e=e.replace(r.regex,r.val)}return e}var Ni;function Pi(){return(Pi=t((()=>{or(),dr(),jn(),Ni=`
`})))()}function Fi(e){return typeof e==`function`?e:Array.isArray(e)?t=>{for(let n of e)if(typeof n==`string`&&t===n||n instanceof RegExp&&n.test(t))return!0}:()=>!1}function Y(e){if(this.options=Object.assign({},Bi,e),this.options.stopNodes&&Array.isArray(this.options.stopNodes)&&(this.options.stopNodes=this.options.stopNodes.map(e=>typeof e==`string`&&e.startsWith(`*.`)?`..`+e.substring(2):e)),this.stopNodeExpressions=[],this.options.stopNodes&&Array.isArray(this.options.stopNodes))for(let e=0;e<this.options.stopNodes.length;e++){let t=this.options.stopNodes[e];typeof t==`string`?this.stopNodeExpressions.push(new W(t)):t instanceof W&&this.stopNodeExpressions.push(t)}this.options.ignoreAttributes===!0||this.options.attributesGroupName?this.isAttribute=function(){return!1}:(this.ignoreAttributesFn=Fi(this.options.ignoreAttributes),this.attrPrefixLen=this.options.attributeNamePrefix.length,this.isAttribute=zi),this.processTextOrObjNode=Li,this.options.format?(this.indentate=Ri,this.tagEndChar=`>
`,this.newLine=`
`):(this.indentate=function(){return``},this.tagEndChar=`>`,this.newLine=``)}function Ii(e,t){let n=e[`?xml`];if(n&&typeof n==`object`){if(t.attributesGroupName&&n[t.attributesGroupName]){let e=n[t.attributesGroupName][t.attributeNamePrefix+`version`];if(e)return e}let e=n[t.attributeNamePrefix+`version`];if(e)return e}return`1.0`}function Li(e,t,n,r,i){let a=this.extractAttributes(e);if(r.push(t,a),this.checkStopNode(r)){let i=this.buildRawContent(e,r.getDepth()),a=this.buildAttributesForStopNode(e);return r.pop(),this.buildObjectNode(i,t,a,n)}let o=this.j2x(e,n+1,r,i);return r.pop(),t[0]===`?`?this.buildTextValNode(``,t,o.attrStr,n,r):e[this.options.textNodeName]!==void 0&&Object.keys(e).length===1?this.buildTextValNode(e[this.options.textNodeName],t,o.attrStr,n,r):this.buildObjectNode(o.val,t,o.attrStr,n)}function Ri(e){return this.options.indentBy.repeat(e)}function zi(e){return e.startsWith(this.options.attributeNamePrefix)&&e!==this.options.textNodeName?e.substr(this.attrPrefixLen):!1}var Bi;function Vi(){return(Vi=t((()=>{Pi(),or(),dr(),jn(),Bi={attributeNamePrefix:`@_`,attributesGroupName:!1,textNodeName:`#text`,ignoreAttributes:!0,cdataPropName:!1,format:!1,indentBy:`  `,suppressEmptyNode:!1,suppressUnpairedNode:!0,suppressBooleanAttributes:!0,tagValueProcessor:function(e,t){return t},attributeValueProcessor:function(e,t){return t},preserveOrder:!1,commentPropName:!1,unpairedTags:[],entities:[{regex:RegExp(`&`,`g`),val:`&amp;`},{regex:RegExp(`>`,`g`),val:`&gt;`},{regex:RegExp(`<`,`g`),val:`&lt;`},{regex:RegExp(`'`,`g`),val:`&apos;`},{regex:RegExp(`"`,`g`),val:`&quot;`}],processEntities:!0,stopNodes:[],oneListGroup:!1,maxNestedTags:100,jPath:!0,sanitizeName:!1},Y.prototype.build=function(e){if(this.options.preserveOrder)return wi(e,this.options);{Array.isArray(e)&&this.options.arrayNodeName&&this.options.arrayNodeName.length>1&&(e={[this.options.arrayNodeName]:e});let t=new ur,n=Ii(e,this.options),r=An(`qName`,{xmlVersion:n});return this.j2x(e,0,t,r).val}},Y.prototype.j2x=function(e,t,n,r){let i=``,a=``;if(this.options.maxNestedTags&&n.getDepth()>=this.options.maxNestedTags)throw Error(`Maximum nested tags exceeded`);let o=this.options.jPath?n.toString():n,s=this.checkStopNode(n);for(let c in e){if(!Object.prototype.hasOwnProperty.call(e,c))continue;let l=c===this.options.textNodeName||c===this.options.cdataPropName||c===this.options.commentPropName||this.options.attributesGroupName&&c===this.options.attributesGroupName||this.isAttribute(c)?c:Si(c,!1,this.options,n,r);if(e[c]===void 0)this.isAttribute(c)&&(a+=``);else if(e[c]===null)this.isAttribute(c)||l===this.options.cdataPropName||l===this.options.commentPropName?a+=``:l[0]===`?`?a+=this.indentate(t)+`<`+l+`?`+this.tagEndChar:a+=this.indentate(t)+`<`+l+`/`+this.tagEndChar;else if(e[c]instanceof Date)a+=this.buildTextValNode(e[c],l,``,t,n);else if(typeof e[c]!=`object`){let u=this.isAttribute(c);if(u&&!this.ignoreAttributesFn(u,o)){let t=Si(u,!0,this.options,n,r);i+=this.buildAttrPairStr(t,q(e[c]),s)}else if(!u){if(c===this.options.textNodeName){let t=this.options.tagValueProcessor(c,q(e[c]));a+=this.replaceEntitiesValue(t)}else{n.push(l);let r=this.checkStopNode(n);if(n.pop(),r){let n=q(e[c]);a+=n===``?this.indentate(t)+`<`+l+this.closeTag(l)+this.tagEndChar:this.indentate(t)+`<`+l+`>`+n+`</`+l+this.tagEndChar}else a+=this.buildTextValNode(e[c],l,``,t,n)}}}else if(Array.isArray(e[c])){let i=e[c].length,o=``,s=``;for(let u=0;u<i;u++){let i=e[c][u];if(i!==void 0){if(i===null)l[0]===`?`?a+=this.indentate(t)+`<`+l+`?`+this.tagEndChar:a+=this.indentate(t)+`<`+l+`/`+this.tagEndChar;else if(typeof i==`object`){if(this.options.oneListGroup){n.push(l);let e=this.j2x(i,t+1,n,r);n.pop(),o+=e.val,this.options.attributesGroupName&&i.hasOwnProperty(this.options.attributesGroupName)&&(s+=e.attrStr)}else o+=this.processTextOrObjNode(i,l,t,n,r)}else if(this.options.oneListGroup){let e=this.options.tagValueProcessor(l,i);e=this.replaceEntitiesValue(e),e=q(e),o+=e}else{n.push(l);let e=this.checkStopNode(n);if(n.pop(),e){let e=q(i);o+=e===``?this.indentate(t)+`<`+l+this.closeTag(l)+this.tagEndChar:this.indentate(t)+`<`+l+`>`+e+`</`+l+this.tagEndChar}else o+=this.buildTextValNode(i,l,``,t,n)}}}this.options.oneListGroup&&(o=this.buildObjectNode(o,l,s,t)),a+=o}else if(this.options.attributesGroupName&&c===this.options.attributesGroupName){let t=Object.keys(e[c]),a=t.length;for(let o=0;o<a;o++){let a=Si(t[o],!0,this.options,n,r);i+=this.buildAttrPairStr(a,q(e[c][t[o]]),s)}}else a+=this.processTextOrObjNode(e[c],l,t,n,r)}return{attrStr:i,val:a}},Y.prototype.buildAttrPairStr=function(e,t,n){return n||(t=this.options.attributeValueProcessor(e,q(t)),t=this.replaceEntitiesValue(t)),this.options.suppressBooleanAttributes&&t===`true`?` `+e:` `+e+`="`+J(t)+`"`},Y.prototype.extractAttributes=function(e){if(!e||typeof e!=`object`)return null;let t={},n=!1;if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){let r=e[this.options.attributesGroupName];for(let e in r){if(!Object.prototype.hasOwnProperty.call(r,e))continue;let i=e.startsWith(this.options.attributeNamePrefix)?e.substring(this.options.attributeNamePrefix.length):e;t[i]=J(r[e]),n=!0}}else for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=this.isAttribute(r);i&&(t[i]=J(e[r]),n=!0)}return n?t:null},Y.prototype.buildRawContent=function(e,t=0){if(this.options.maxNestedTags&&t>=this.options.maxNestedTags)throw Error(`Maximum nested tags exceeded`);if(typeof e==`string`)return e;if(typeof e!=`object`||!e)return String(e);if(e[this.options.textNodeName]!==void 0)return e[this.options.textNodeName];let n=``;for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r)||this.isAttribute(r)||this.options.attributesGroupName&&r===this.options.attributesGroupName)continue;let i=e[r];if(r===this.options.textNodeName)n+=i;else if(Array.isArray(i)){for(let e of i)if(typeof e==`string`||typeof e==`number`)n+=`<${r}>${e}</${r}>`;else if(typeof e==`object`&&e){let i=this.buildRawContent(e,t+1),a=this.buildAttributesForStopNode(e);n+=i===``?`<${r}${a}/>`:`<${r}${a}>${i}</${r}>`}}else if(typeof i==`object`&&i){let e=this.buildRawContent(i,t+1),a=this.buildAttributesForStopNode(i);n+=e===``?`<${r}${a}/>`:`<${r}${a}>${e}</${r}>`}else n+=`<${r}>${i}</${r}>`}return n},Y.prototype.buildAttributesForStopNode=function(e){if(!e||typeof e!=`object`)return``;let t=``;if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){let n=e[this.options.attributesGroupName];for(let e in n){if(!Object.prototype.hasOwnProperty.call(n,e))continue;let r=e.startsWith(this.options.attributeNamePrefix)?e.substring(this.options.attributeNamePrefix.length):e,i=n[e];i===!0&&this.options.suppressBooleanAttributes?t+=` `+r:t+=` `+r+`="`+J(i)+`"`}}else for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let r=this.isAttribute(n);if(r){let i=e[n];i===!0&&this.options.suppressBooleanAttributes?t+=` `+r:t+=` `+r+`="`+J(i)+`"`}}return t},Y.prototype.buildObjectNode=function(e,t,n,r){if(e===``)return t[0]===`?`?this.indentate(r)+`<`+t+n+`?`+this.tagEndChar:this.indentate(r)+`<`+t+n+this.closeTag(t)+this.tagEndChar;if(t[0]===`?`)return this.indentate(r)+`<`+t+n+`?`+this.tagEndChar;{let i=`</`+t+this.tagEndChar,a=``;return t[0]===`?`&&(a=`?`,i=``),(n||n===``)&&e.indexOf(`<`)===-1?this.indentate(r)+`<`+t+n+a+`>`+e+i:this.options.commentPropName!==!1&&t===this.options.commentPropName&&a.length===0?this.indentate(r)+`<!--${bi(e)}-->`+this.newLine:this.indentate(r)+`<`+t+n+a+this.tagEndChar+e+this.indentate(r)+i}},Y.prototype.closeTag=function(e){let t=``;return this.options.unpairedTags.indexOf(e)===-1?t=this.options.suppressEmptyNode?`/`:`></${e}`:this.options.suppressUnpairedNode||(t=`/`),t},Y.prototype.checkStopNode=function(e){if(!this.stopNodeExpressions||this.stopNodeExpressions.length===0)return!1;for(let t=0;t<this.stopNodeExpressions.length;t++)if(e.matches(this.stopNodeExpressions[t]))return!0;return!1},Y.prototype.buildTextValNode=function(e,t,n,r,i){if(this.options.cdataPropName!==!1&&t===this.options.cdataPropName){let t=xi(e);return this.indentate(r)+`<![CDATA[${t}]]>`+this.newLine}if(this.options.commentPropName!==!1&&t===this.options.commentPropName){let t=bi(e);return this.indentate(r)+`<!--${t}-->`+this.newLine}if(t[0]===`?`)return this.indentate(r)+`<`+t+n+`?`+this.tagEndChar;{let i=this.options.tagValueProcessor(t,e);return i=this.replaceEntitiesValue(i),i=q(i),i===``?this.indentate(r)+`<`+t+n+this.closeTag(t)+this.tagEndChar:this.indentate(r)+`<`+t+n+`>`+i+`</`+t+this.tagEndChar}},Y.prototype.replaceEntitiesValue=function(e){if(e&&e.length>0&&this.options.processEntities)for(let t=0;t<this.options.entities.length;t++){let n=this.options.entities[t];e=e.replace(n.regex,n.val)}return e}})))()}var Hi;function Ui(){return(Ui=t((()=>{Vi(),Hi=Y})))()}var Wi;function Gi(){return(Gi=t((()=>{Wi=(e,t)=>t===``?void 0:{...e,value:t}})))()}function Ki(e,t,n){let r=e.parseNeTEx(t),i=n===void 0?r[0]:r.find(e=>e.attr_id===n);if(n!==void 0&&!i)throw Error(`DeckPlan ${n} not found in document`);let a=i?.decks??[];return a.length>0?{decks:a,isGhost:!1}:{decks:e.parseNeTEx(`<?xml version="1.0" encoding="UTF-8"?><PublicationDelivery xmlns="http://www.netex.org.uk/netex"><dataObjects><CompositeFrame version="1" id="GHOST:CompositeFrame:1"><frames><ResourceFrame version="1" id="GHOST:ResourceFrame:1"><deckPlans><DeckPlan version="1" id="GHOST:DeckPlan:1"><decks><Deck id="Deck/id/1" version="any"><spotRows><SpotRow id="SpotRow/id/1" /><SpotRow id="SpotRow/id/2" /><SpotRow id="SpotRow/id/3" /><SpotRow id="SpotRow/id/4" /><SpotRow id="SpotRow/id/5" /><SpotRow id="SpotRow/id/6" /><SpotRow id="SpotRow/id/7" /><SpotRow id="SpotRow/id/8" /><SpotRow id="SpotRow/id/9" /><SpotRow id="SpotRow/id/10" /><SpotRow id="SpotRow/id/11" /><SpotRow id="spot_row_1778936985294" /><SpotRow id="spot_row_1778936986382" /><SpotRow id="spot_row_1778936986822" /><SpotRow id="spot_row_1778936987173" /><SpotRow id="spot_row_1778936987614" /><SpotRow id="spot_row_1778936988038" /><SpotRow id="spot_row_1778936988454" /><SpotRow id="spot_row_1778936988839" /><SpotRow id="spot_row_1778936989382" /><SpotRow id="spot_row_1778949628771" /><SpotRow id="spot_row_1778949629523" /></spotRows><spotColumns><SpotColumn id="SpotColumn/id/A" /><SpotColumn id="SpotColumn/id/B" /><SpotColumn id="SpotColumn/id/C" /><SpotColumn id="SpotColumn/id/D" /><SpotColumn id="spot_column_1778936952743" /></spotColumns><deckSpaces><PassengerSpace id="space_1778949529557" version="1.0"><Name>Main Space</Name><SmokingAllowed>false</SmokingAllowed><StandingAllowed>true</StandingAllowed><PassengerSpaceType>seatingArea</PassengerSpaceType><passengerSpots><PassengerSpot id="seat_1778949525378" version="1.0"><Label>144</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/2" version="1.0" /><Centroid><Location><pos>2.1352564102564098 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949529558" version="1.0"><Label>143</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/2" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.1352564102564098 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949530908" version="1.0"><Label>140</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><Centroid><Location><pos>2.6804487179487166 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949532995" version="1.0"><Label>139</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.6804487179487166 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949534364" version="1.0"><Label>141</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.6804487179487166 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949536061" version="1.0"><Label>136</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><Centroid><Location><pos>3.2535256410256403 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949538308" version="1.0"><Label>135</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.2535256410256403 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949539995" version="1.0"><Label>132</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><Centroid><Location><pos>3.8573717948717934 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949542324" version="1.0"><Label>131</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.8573717948717934 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949544524" version="1.0"><Label>128</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><Centroid><Location><pos>4.472756410256409 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949547180" version="1.0"><Label>127</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>4.472756410256409 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949548557" version="1.0"><Label>137</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.2535256410256403 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949550116" version="1.0"><Label>133</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.8573717948717934 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949553005" version="1.0"><Label>129</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>4.472756410256409 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949554387" version="1.0"><Label>121</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.84775641025641 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949558285" version="1.0"><Label>120</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><Centroid><Location><pos>5.84775641025641 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949559700" version="1.0"><Label>119</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.84775641025641 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949561004" version="1.0"><Label>116</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><Centroid><Location><pos>6.451602564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949565540" version="1.0"><Label>115</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>6.451602564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949570101" version="1.0"><Label>117</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>6.451602564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949573539" version="1.0"><Label>113</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.026602564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949574772" version="1.0"><Label>109</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.589102564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949578028" version="1.0"><Label>103</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.208333333333334 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949579540" version="1.0"><Label>112</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><Centroid><Location><pos>7.026602564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949580950" version="1.0"><Label>111</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.026602564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949582596" version="1.0"><Label>108</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><Centroid><Location><pos>7.589102564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949584068" version="1.0"><Label>107</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.589102564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949585628" version="1.0"><Label>106</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><Centroid><Location><pos>8.208333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949587269" version="1.0"><Label>105</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.208333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949590102" version="1.0"><Label>101</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936986822" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.733333333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949593284" version="1.0"><Label>102</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936986822" version="1.0" /><Centroid><Location><pos>8.733333333333336 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949647845" version="1.0"><Label>125</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.058333333333334 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778950383846" version="1.0"><Label>124</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><Centroid><Location><pos>5.058333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778950385629" version="1.0"><Label>123</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.058333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot></passengerSpots><luggageSpots /><deckEntrances><PassengerEntrance id="entrance_1778950926855" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>0.3111111111111111 1.946667</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950928595" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>12.2 1.977778</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950938091" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>0.29111111111111115 0.037778</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950940714" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>12.2 0.022222</pos></Location></Centroid></PassengerEntrance></deckEntrances><deckEntranceUsage /><deckEntranceCouples /><deckSpaceCapacities /><actualVehicleEquipments /><FareClass>Best</FareClass></PassengerSpace><PassengerSpace id="seating-area_1778951084721" version="1.0"><Name>Lounge</Name><PassengerSpaceType>seatingArea</PassengerSpaceType><passengerSpots><PassengerSpot id="seat_1778949594749" version="1.0"><Label>171</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>9.183333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949598573" version="1.0"><Label>172</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><Centroid><Location><pos>9.183333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949600084" version="1.0"><Label>174</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><Centroid><Location><pos>9.183333333333334 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949601637" version="1.0"><Label>175</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988038" version="1.0" /><Centroid><Location><pos>9.795833333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949608438" version="1.0"><Label>176</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988454" version="1.0" /><Centroid><Location><pos>10.145833333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949609925" version="1.0"><Label>177</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988839" version="1.0" /><Centroid><Location><pos>10.570833333333335 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949613334" version="1.0"><Label>178</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936989382" version="1.0" /><Centroid><Location><pos>10.933333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949634064" version="1.0"><Label>179</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>11.58 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949637141" version="1.0"><Label>180</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><Centroid><Location><pos>11.58 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949638877" version="1.0"><Label>182</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><Centroid><Location><pos>11.58 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949640598" version="1.0"><Label>184</Label><Orientation>rightwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936988454" version="1.0" /><Centroid><Location><pos>10.703333333333337 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949646135" version="1.0"><Label>183</Label><Orientation>rightwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936988839" version="1.0" /><Centroid><Location><pos>10.323333333333336 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot></passengerSpots><luggageSpots /><deckEntrances /><deckEntranceUsage /><deckEntranceCouples /><deckSpaceCapacities /><actualVehicleEquipments /><FareClass>Best</FareClass></PassengerSpace></deckSpaces><DeckLevelRef ref="deck_level_0" version="1.0" /><Name /><Width>2</Width><Length>13</Length></Deck></decks></DeckPlan></deckPlans></ResourceFrame></frames></CompositeFrame></dataObjects></PublicationDelivery>`)[0]?.decks??[],isGhost:!0}}function qi(){return(qi=t((()=>{Re()})))()}function Ji(e,t){let[n,r]=(0,Yi.useState)([]),[i,a]=(0,Yi.useState)(!1),[o,s]=(0,Yi.useState)(!1),[c,l]=(0,Yi.useState)(null);return(0,Yi.useEffect)(()=>{if(!e){r([]),a(!1),s(!1),l(null);return}let n=!1;return s(!0),l(null),Fe().then(i=>{if(n)return;let o=Ki(i,e,t);r(o.decks),a(o.isGhost)}).catch(e=>{n||(r([]),a(!1),l(e instanceof Error?e.message:String(e)))}).finally(()=>{n||s(!1)}),()=>{n=!0}},[e,t]),{decks:n,isGhost:i,loading:o,error:c}}var Yi;function Xi(){return(Xi=t((()=>{Yi=j(),Be(),qi()})))()}function Zi({value:e,onChange:t,mode:n,isCreate:r,xml:i,loading:a,fetchError:o,onRetry:s}){let{t:c}=b(),[l,u]=(0,ea.useState)(`edit`),d=n===`view`,f=n=>t({...e,...n}),p=(0,X.jsxs)(Ce,{"data-testid":`deck-plan-tab-edit`,children:[(0,X.jsx)(we,{id:`deckPlan-name`,label:c(`deckPlans.field.name`,`Name`),children:(0,X.jsx)(E,{id:`deckPlan-name`,value:e.name?.value??``,onChange:t=>f({name:Wi(e.name,t.target.value)}),disabled:d,size:`small`,fullWidth:!0})}),(0,X.jsx)(we,{id:`deckPlan-description`,label:c(`deckPlans.field.description`,`Description`),children:(0,X.jsx)(E,{id:`deckPlan-description`,value:e.description?.value??``,onChange:t=>f({description:Wi(e.description,t.target.value)}),disabled:d,size:`small`,fullWidth:!0})})]});return r?(0,X.jsx)(m,{children:p}):(0,X.jsxs)(m,{children:[(0,X.jsxs)(wt,{value:l,onChange:(e,t)=>u(t),sx:ta,children:[(0,X.jsx)(P,{value:`edit`,label:c(`deckPlans.tab.edit`,`Edit`)}),(0,X.jsx)(P,{value:`xml`,label:c(`deckPlans.tab.xml`,`XML`)})]}),l===`edit`&&(0,X.jsxs)(m,{children:[p,(0,X.jsx)(be,{sx:{my:1.5}}),(0,X.jsx)(Qi,{loading:a,fetchError:o,onRetry:s,testIdPrefix:`deck-plan-decks`,children:(0,X.jsx)($i,{xml:i,id:e.id||void 0})})]}),l===`xml`&&(0,X.jsx)(m,{"data-testid":`deck-plan-tab-xml`,children:(0,X.jsx)(Qi,{loading:a,fetchError:o,onRetry:s,testIdPrefix:`deck-plan-xml`,children:(0,X.jsx)(ce,{"aria-label":`deck plan data`,"data-testid":`deck-plan-xml-textarea`,readOnly:!0,value:i,minRows:10,style:na})})})]})}function Qi({loading:e,fetchError:t,onRetry:n,testIdPrefix:r,children:i}){let{t:a}=b();return e?(0,X.jsx)(m,{sx:{display:`flex`,justifyContent:`center`,py:4},children:(0,X.jsx)(C,{"data-testid":`${r}-loading`})}):t?(0,X.jsxs)(g,{spacing:1,children:[(0,X.jsx)(he,{severity:`error`,"data-testid":`${r}-fetch-error`,children:t}),(0,X.jsx)(m,{children:(0,X.jsx)(ve,{onClick:n,size:`small`,variant:`outlined`,children:a(`common.retry`,`Retry`)})})]}):i}function $i({xml:e,id:t}){let{t:n}=b(),{decks:r,isGhost:i,loading:a,error:o}=Ji(e,t);return a?(0,X.jsx)(m,{sx:{display:`flex`,justifyContent:`center`,py:4},children:(0,X.jsx)(C,{"data-testid":`deck-plan-decks-rendering`})}):o?(0,X.jsxs)(he,{severity:`error`,"data-testid":`deck-plan-decks-error`,children:[n(`deckPlans.render.error`,`Could not render the deck plan`),`: `,o]}):r.length===0?null:(0,X.jsxs)(g,{spacing:1,"data-testid":`deck-plan-decks`,children:[i&&(0,X.jsxs)(m,{"data-testid":`deck-plan-decks-sample`,children:[(0,X.jsx)(d,{variant:`subtitle2`,children:n(`deckPlans.deck.sample`,`SAMPLE`)}),(0,X.jsx)(d,{variant:`caption`,color:`text.secondary`,children:n(`deckPlans.deck.sampleHint`,`This plan has no decks yet — showing a sample layout.`)})]}),(0,X.jsx)(g,{direction:`row`,spacing:2,sx:{overflowX:`auto`,pb:1},children:r.map((e,t)=>(0,X.jsxs)(g,{spacing:.5,alignItems:`center`,sx:{flex:`0 0 auto`},children:[(0,X.jsx)(ze,{deck:e,vertical:!0,"data-testid":`deck-plan-deck-${t}`}),(0,X.jsx)(d,{variant:`caption`,color:`text.secondary`,noWrap:!0,children:e.Name||n(`deckPlans.deck.label`,`Deck {{n}}`,{n:t+1})})]},e.attr_id||t))})]})}var ea,X,ta,na;function ra(){return(ra=t((()=>{ea=j(),me(),p(),T(),ge(),ye(),h(),qe(),Tt(),se(),xe(),c(),de(),Se(),Gi(),Xi(),Ie(),X=O(),ta={mb:1.5,minHeight:0,"& .MuiTabs-indicator":{display:`none`},"& .MuiTabs-flexContainer":{flexWrap:`wrap`,gap:.75},"& .MuiTab-root":{minHeight:30,px:1.25,py:.25,borderRadius:1,textTransform:`none`,bgcolor:`action.hover`,color:`text.secondary`},"& .MuiTab-root.Mui-selected":{bgcolor:`primary.main`,color:`primary.contrastText`}},na={width:`100%`,padding:`8px`,borderRadius:`4px`,borderColor:`rgba(0, 0, 0, 0.23)`,borderWidth:`1px`,borderStyle:`solid`,fontSize:`14px`,fontFamily:`monospace`,boxSizing:`border-box`},Zi.__docgenInfo={description:`Reusable, presentational DeckPlan editor — a tabbed FormLayout driven by
\`value\`/\`onChange\`/\`mode\`, mirroring the VehicleType editor's shape. Tabs:
Edit (name + description, then a horizontal strip of read-only deck
renderings) · XML (the read-only NeTEx source). Both panes render from the
same fetched body and so share its loading and fetch-error states.

The XML body is never editable — name and description are patched into the
fetched document on save instead.

Holds no fetch/save logic; chrome (title, EditorRail, snackbars, dirty
tracking) lives in \`DeckPlanDetails\`.`,methods:[],displayName:`DeckPlanForm`,props:{value:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: Name;
  description?: Name;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]}},description:`Current deck plan — the editable name/description fields.`},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(next: DeckPlan) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: Name;
  description?: Name;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]}},name:`next`}],return:{name:`void`}}},description:`Fired with the merged next value on every field edit.`},mode:{required:!0,tsType:{name:`union`,raw:`'view' | 'edit'`,elements:[{name:`literal`,value:`'view'`},{name:`literal`,value:`'edit'`}]},description:"`'view'` disables the inputs; `'edit'` enables them."},isCreate:{required:!0,tsType:{name:`boolean`},description:`Create flow — hides the tab strip; there is no persisted body yet.`},xml:{required:!0,tsType:{name:`string`},description:`NeTEx XML body, read-only.`},loading:{required:!0,tsType:{name:`boolean`},description:`Body fetch in flight; renders a spinner in both tabs' body panes.`},fetchError:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Body fetch error; renders an alert + retry in both tabs' body panes.`},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Refetch trigger from the parent hook.`}}}})))()}function ia(e){let t=e.PublicationDelivery?.dataObjects;return t?.CompositeFrame?.frames?.ResourceFrame??t?.ResourceFrame}function aa(e){return e==null?[]:Array.isArray(e)?e:[e]}var oa;function sa(){return(sa=t((()=>{yi(),oa=new vi({ignoreAttributes:!1}),new vi({ignoreAttributes:!1,parseTagValue:!1})})))()}var ca;function la(){return(la=t((()=>{ca=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <privateCodes>
                <PrivateCode type="Fahrzeug-Ident-Nr.">
                  94808442201
                </PrivateCode>
              </privateCodes>
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="seating-area_1779021502009" version="1.0">
                      <Name>Area 1</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778937092812" version="1.0">
                          <Label>77</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937062102" version="1.0">
                          <Label>79</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.390204678362572 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937064374" version="1.0">
                          <Label>75</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937065965" version="1.0">
                          <Label>71</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937067645" version="1.0">
                          <Label>67</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937069070" version="1.0">
                          <Label>63</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937070502" version="1.0">
                          <Label>64</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937071949" version="1.0">
                          <Label>68</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937073261" version="1.0">
                          <Label>72</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937074877" version="1.0">
                          <Label>76</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937076238" version="1.0">
                          <Label>80</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937079148" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937080613" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937082092" version="1.0">
                          <Label>66</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937083501" version="1.0">
                          <Label>65</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937084957" version="1.0">
                          <Label>70</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937086445" version="1.0">
                          <Label>69</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937088101" version="1.0">
                          <Label>74</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937089669" version="1.0">
                          <Label>73</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937091213" version="1.0">
                          <Label>78</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <TotalCapacity>0</TotalCapacity>
                      <FareClass>Standard</FareClass>
                      <AirConditioned>true</AirConditioned>
                    </PassengerSpace>
                    <PassengerSpace id="PassengerSpace/id/Main1" version="any">
                      <Name>Area 2</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778936959455" version="1.0">
                          <Label>1</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937008159" version="1.0">
                          <Label>2</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937015960" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937021040" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937022543" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937023767" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937025176" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937026727" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937028246" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937029719" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937031327" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937033231" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937042255" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937043838" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937045206" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937046518" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937047798" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937049046" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937051598" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937053102" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937054510" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937056022" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937057558" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937058966" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937060670" version="1.0">
                          <Label>83</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937077717" version="1.0">
                          <Label>84</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937094372" version="1.0">
                          <Label>82</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937096309" version="1.0">
                          <Label>81</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937097788" version="1.0">
                          <Label>56</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937099188" version="1.0">
                          <Label>55</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937100556" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937101980" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937103612" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937105060" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937106668" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937108868" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937110571" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937112164" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937113752" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937115005" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937123220" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937124755" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937193640" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937195011" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937196562" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937197906" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937199434" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937201099" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937203011" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937204314" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937205770" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937207563" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1779021475977" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.12 1.84</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021477501" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.38 -0.06</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021478836" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.36 1.88</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021480092" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <SequenceFromFront>2.14</SequenceFromFront>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.1 -0.04</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778937141072" version="1.0">
                      <Name>Premium Seats</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778937035630" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937037486" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937039071" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937040542" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937117116" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937118571" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937120156" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937121628" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>High</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}var ua;function da(){return(da=t((()=>{ua=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                    <SpotRow id="spot_row_1778949628771" />
                    <SpotRow id="spot_row_1778949629523" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778949525378" version="1.0">
                          <Label>144</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949529558" version="1.0">
                          <Label>143</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949530908" version="1.0">
                          <Label>140</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949532995" version="1.0">
                          <Label>139</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949534364" version="1.0">
                          <Label>141</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949536061" version="1.0">
                          <Label>136</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949538308" version="1.0">
                          <Label>135</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949539995" version="1.0">
                          <Label>132</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949542324" version="1.0">
                          <Label>131</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949544524" version="1.0">
                          <Label>128</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949547180" version="1.0">
                          <Label>127</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949548557" version="1.0">
                          <Label>137</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949550116" version="1.0">
                          <Label>133</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949553005" version="1.0">
                          <Label>129</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949554387" version="1.0">
                          <Label>121</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949558285" version="1.0">
                          <Label>120</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949559700" version="1.0">
                          <Label>119</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949561004" version="1.0">
                          <Label>116</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949565540" version="1.0">
                          <Label>115</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949570101" version="1.0">
                          <Label>117</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949573539" version="1.0">
                          <Label>113</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949574772" version="1.0">
                          <Label>109</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949578028" version="1.0">
                          <Label>103</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949579540" version="1.0">
                          <Label>112</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949580950" version="1.0">
                          <Label>111</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949582596" version="1.0">
                          <Label>108</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949584068" version="1.0">
                          <Label>107</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949585628" version="1.0">
                          <Label>106</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949587269" version="1.0">
                          <Label>105</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949590102" version="1.0">
                          <Label>101</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949593284" version="1.0">
                          <Label>102</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949647845" version="1.0">
                          <Label>125</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778950383846" version="1.0">
                          <Label>124</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778950385629" version="1.0">
                          <Label>123</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.946667</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 1.977778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.29111111111111115 0.037778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778951084721" version="1.0">
                      <Name>Lounge</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778949594749" version="1.0">
                          <Label>171</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949598573" version="1.0">
                          <Label>172</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949600084" version="1.0">
                          <Label>174</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949601637" version="1.0">
                          <Label>175</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.795833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949608438" version="1.0">
                          <Label>176</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.145833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949609925" version="1.0">
                          <Label>177</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.570833333333335 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949613334" version="1.0">
                          <Label>178</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.933333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949634064" version="1.0">
                          <Label>179</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.58 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949637141" version="1.0">
                          <Label>180</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949638877" version="1.0">
                          <Label>182</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949640598" version="1.0">
                          <Label>184</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.703333333333337 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949646135" version="1.0">
                          <Label>183</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.323333333333336 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}var fa;function pa(){return(pa=t((()=>{fa=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778951280027" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951281998" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951283438" version="1.0">
                          <Label>1</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951286374" version="1.0">
                          <Label>2</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951288031" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951289444" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951290773" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951292301" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.713461538461538 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951293892" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951296045" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951297870" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951299357" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951300693" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951303023" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951304677" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951308374" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951311126" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951313431" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951315068" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951318109" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951319565" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951326823" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951329037" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692315 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951330999" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951332398" version="1.0">
                          <Label>57</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951334357" version="1.0">
                          <Label>58</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951335649" version="1.0">
                          <Label>65</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951337629" version="1.0">
                          <Label>66</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951339093" version="1.0">
                          <Label>70</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951341134" version="1.0">
                          <Label>69</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461544 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951342589" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951344453" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951345862" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951347582" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692314 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951349037" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951350702" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951760950" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307667 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951765210" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951766953" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951768609" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.344230769230767 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951770217" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951771856" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951773553" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951775312" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951776978" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951778465" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951779768" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951781537" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951783249" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951785616" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951786953" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951788225" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951789681" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951791424" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951792713" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951794097" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951795456" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951796849" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951798401" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951799722" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951801345" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951803668" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951805192" version="1.0">
                          <Label>56</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951806915" version="1.0">
                          <Label>55</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951808793" version="1.0">
                          <Label>59</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951810994" version="1.0">
                          <Label>60</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951812968" version="1.0">
                          <Label>64</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951814865" version="1.0">
                          <Label>63</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951816513" version="1.0">
                          <Label>67</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951818121" version="1.0">
                          <Label>68</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951819978" version="1.0">
                          <Label>72</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951821722" version="1.0">
                          <Label>71</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 0.05641</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.929915</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.184615384615384 1.947009</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}var ma;function ha(){return(ha=t((()=>{ma=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <privateCodes>
                <PrivateCode type="Fahrzeug-Ident-Nr.">
                  94808442201
                </PrivateCode>
              </privateCodes>
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="seating-area_1779021502009" version="1.0">
                      <Name>Area 1</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="77" version="1.0">
                          <Label>77</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="79" version="1.0">
                          <Label>79</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.390204678362572 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="75" version="1.0">
                          <Label>75</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="71" version="1.0">
                          <Label>71</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="67" version="1.0">
                          <Label>67</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="63" version="1.0">
                          <Label>63</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="64" version="1.0">
                          <Label>64</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="68" version="1.0">
                          <Label>68</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="72" version="1.0">
                          <Label>72</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="76" version="1.0">
                          <Label>76</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="80" version="1.0">
                          <Label>80</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="62" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="61" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="66" version="1.0">
                          <Label>66</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="65" version="1.0">
                          <Label>65</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="70" version="1.0">
                          <Label>70</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="69" version="1.0">
                          <Label>69</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="74" version="1.0">
                          <Label>74</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="73" version="1.0">
                          <Label>73</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="78" version="1.0">
                          <Label>78</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <TotalCapacity>0</TotalCapacity>
                      <FareClass>Standard</FareClass>
                      <AirConditioned>true</AirConditioned>
                    </PassengerSpace>
                    <PassengerSpace id="PassengerSpace/id/Main1" version="any">
                      <Name>Area 2</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="1" version="1.0">
                          <Label>1</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="2" version="1.0">
                          <Label>2</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="5" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="6" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="9" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="10" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="13" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="14" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="17" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="18" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="21" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="22" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="33" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="34" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="37" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="38" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="41" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="42" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="45" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="46" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="49" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="50" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="53" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="54" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="83" version="1.0">
                          <Label>83</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="84" version="1.0">
                          <Label>84</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="82" version="1.0">
                          <Label>82</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="81" version="1.0">
                          <Label>81</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="56" version="1.0">
                          <Label>56</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="55" version="1.0">
                          <Label>55</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="52" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="51" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="48" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="47" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="44" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="43" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="40" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="39" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="36" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="35" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="24" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="23" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="20" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="19" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="16" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="15" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="12" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="11" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="8" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="7" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="4" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="3" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1779021475977" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.12 1.84</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021477501" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.38 -0.06</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021478836" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.36 1.88</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021480092" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <SequenceFromFront>2.14</SequenceFromFront>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.1 -0.04</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778937141072" version="1.0">
                      <Name>Premium Seats</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="25" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="26" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="29" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="30" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="32" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="31" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="28" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="27" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>High</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}var ga;function _a(){return(_a=t((()=>{ga=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                    <SpotRow id="spot_row_1778949628771" />
                    <SpotRow id="spot_row_1778949629523" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="144" version="1.0">
                          <Label>144</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="143" version="1.0">
                          <Label>143</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="140" version="1.0">
                          <Label>140</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="139" version="1.0">
                          <Label>139</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="141" version="1.0">
                          <Label>141</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="136" version="1.0">
                          <Label>136</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="135" version="1.0">
                          <Label>135</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="132" version="1.0">
                          <Label>132</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="131" version="1.0">
                          <Label>131</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="128" version="1.0">
                          <Label>128</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="127" version="1.0">
                          <Label>127</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="137" version="1.0">
                          <Label>137</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="133" version="1.0">
                          <Label>133</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="129" version="1.0">
                          <Label>129</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="121" version="1.0">
                          <Label>121</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="120" version="1.0">
                          <Label>120</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="119" version="1.0">
                          <Label>119</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="116" version="1.0">
                          <Label>116</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="115" version="1.0">
                          <Label>115</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="117" version="1.0">
                          <Label>117</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="113" version="1.0">
                          <Label>113</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="109" version="1.0">
                          <Label>109</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="103" version="1.0">
                          <Label>103</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="112" version="1.0">
                          <Label>112</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="111" version="1.0">
                          <Label>111</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="108" version="1.0">
                          <Label>108</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="107" version="1.0">
                          <Label>107</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="106" version="1.0">
                          <Label>106</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="105" version="1.0">
                          <Label>105</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="101" version="1.0">
                          <Label>101</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="102" version="1.0">
                          <Label>102</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="125" version="1.0">
                          <Label>125</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="124" version="1.0">
                          <Label>124</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="123" version="1.0">
                          <Label>123</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.946667</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 1.977778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.29111111111111115 0.037778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778951084721" version="1.0">
                      <Name>Lounge</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="171" version="1.0">
                          <Label>171</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="172" version="1.0">
                          <Label>172</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="174" version="1.0">
                          <Label>174</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="175" version="1.0">
                          <Label>175</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.795833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="176" version="1.0">
                          <Label>176</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.145833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="177" version="1.0">
                          <Label>177</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.570833333333335 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="178" version="1.0">
                          <Label>178</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.933333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="179" version="1.0">
                          <Label>179</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.58 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="180" version="1.0">
                          <Label>180</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="182" version="1.0">
                          <Label>182</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="184" version="1.0">
                          <Label>184</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.703333333333337 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="183" version="1.0">
                          <Label>183</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.323333333333336 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}var va;function ya(){return(ya=t((()=>{va=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="6" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="5" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="1" version="1.0">
                          <Label>1</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="2" version="1.0">
                          <Label>2</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="9" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="10" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="14" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="13" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.713461538461538 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="17" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="18" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="22" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="21" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="25" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="26" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="30" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="29" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="33" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="34" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="38" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="37" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="41" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="42" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="49" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692315 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="50" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="57" version="1.0">
                          <Label>57</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="58" version="1.0">
                          <Label>58</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="65" version="1.0">
                          <Label>65</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="66" version="1.0">
                          <Label>66</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="70" version="1.0">
                          <Label>70</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="69" version="1.0">
                          <Label>69</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461544 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="62" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="61" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="54" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="53" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692314 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="46" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="45" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="3" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307667 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="4" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="8" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="7" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.344230769230767 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="11" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="12" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="19" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="20" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="16" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="15" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="24" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="23" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="27" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="28" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="32" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="31" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="35" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="43" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="36" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="40" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="39" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="44" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="48" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="47" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="51" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="52" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="56" version="1.0">
                          <Label>56</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="55" version="1.0">
                          <Label>55</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="59" version="1.0">
                          <Label>59</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="60" version="1.0">
                          <Label>60</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="64" version="1.0">
                          <Label>64</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="63" version="1.0">
                          <Label>63</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="67" version="1.0">
                          <Label>67</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="68" version="1.0">
                          <Label>68</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="72" version="1.0">
                          <Label>72</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="71" version="1.0">
                          <Label>71</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 0.05641</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.929915</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.184615384615384 1.947009</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})))()}function ba({railWidth:e=wa,...t}){let[n,r]=(0,Sa.useState)(Pa);return(0,Z.jsx)(m,{sx:{width:e,maxWidth:`100%`,border:1,borderColor:`divider`,borderRadius:1,p:2},children:(0,Z.jsx)(Zi,{...t,value:n,onChange:r})})}function xa(e,t){let n=e.flatMap((e,t)=>aa(ia(oa.parse(e))?.deckPlans?.DeckPlan).flatMap(e=>aa(e?.decks?.Deck).map(e=>({...e,"@_id":`SAMPLE:Deck:${t+1}`}))));return new Hi({ignoreAttributes:!1,suppressEmptyNode:!0}).build({PublicationDelivery:{"@_xmlns":`http://www.netex.org.uk/netex`,dataObjects:{CompositeFrame:{"@_version":`1`,"@_id":`SAMPLE:CompositeFrame:1`,frames:{ResourceFrame:{"@_version":`1`,"@_id":`SAMPLE:ResourceFrame:1`,deckPlans:{DeckPlan:{"@_version":`1`,"@_id":t,decks:{Deck:n}}}}}}}}})}var Sa,Z,Q,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa,$,Ia,La,Ra,za,Ba,Va,Ha;function Ua(){return(Ua=t((()=>{Sa=j(),Ui(),p(),ra(),Ve(),sa(),la(),da(),pa(),ha(),_a(),ya(),Z=O(),{expect:Q,waitFor:Ca}=__STORYBOOK_MODULE_TEST__,wa=460,Ta=280,Ea=1200,Da=20,Oa=[ca,ua,fa,ma,ga,va],ka=[80,46,72,80,46,72],Aa=`NMR:DeckPlan:5`,ja=xa(Oa,Aa),Ma=46,Na=Le([],Aa),Pa={id:Aa,version:2,name:{value:`Plan Alpha`},description:{value:`Alpha lower-deck variant`}},Fa={title:`data/deck-plans/DeckPlanForm`,component:Zi,parameters:{layout:`padded`,docs:{description:{component:"The deck-plan sidebar editor. Tabs stay `Edit | XML`; the per-deck renderings live *inside* the Edit tab, below Name/Description, as a horizontal strip. Decks draw `vertical` — at ~26.4m × 2.8m the native orientation overflows the sidebar for even one deck, where rotated columns sit side by side and read as a vehicle seen from above. Both tabs render from the same fetched body, so they share its loading and fetch-error states; that chrome wraps only the body panes, never the fields."}}},args:{railWidth:wa},argTypes:{railWidth:{name:`rail width (px)`,description:`Width of the wrapper standing in for the resizable sidebar.`,control:{type:`range`,min:Ta,max:Ea,step:Da}}}},$={mode:`edit`,isCreate:!1,loading:!1,fetchError:null,onRetry:()=>{}},Ia={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,xml:ja}),play:async({canvasElement:e})=>{await Ca(()=>{let t=e.querySelectorAll(`deck-rendering`);Q(t).toHaveLength(Oa.length);let n=[...t].map(e=>e.shadowRoot.querySelectorAll(`g.seat`).length);Q(n).toEqual(ka)});let t=e.querySelector(`[data-testid="deck-plan-decks"]`);Q(t.textContent).toContain(`Deck 1`),Q(t.textContent).toContain(`Deck 6`),Q(e.querySelector(`[data-testid="deck-plan-decks-sample"]`)).toBeNull()}},La={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,xml:Na}),play:async({canvasElement:e})=>{await Ca(()=>Q(e.querySelector(`[data-testid="deck-plan-decks-sample"]`)).not.toBeNull());let t=e.querySelectorAll(`deck-rendering`);Q(t).toHaveLength(1),Q(t[0].shadowRoot.querySelectorAll(`g.seat`)).toHaveLength(Ma)}},Ra={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,mode:`view`,xml:ja})},za={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,loading:!0,xml:``}),play:async({canvasElement:e})=>{Q(e.querySelector(`[data-testid="deck-plan-decks-loading"]`)).not.toBeNull(),Q(e.querySelector(`#deckPlan-name`).disabled).toBe(!1)}},Ba={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,xml:``,fetchError:`503 Service Unavailable`})},Va={render:e=>(0,Z.jsx)(ba,{...$,railWidth:e.railWidth,isCreate:!0,xml:``}),play:async({canvasElement:e})=>{Q(e.querySelector(`[data-testid="deck-plan-tab-edit"]`)).not.toBeNull(),Q(e.querySelector(`deck-rendering`)).toBeNull(),Q(e.querySelectorAll(`[role="tab"]`)).toHaveLength(0)}},Ha=[`EditTab`,`EditTabSample`,`ViewMode`,`BodyLoading`,`BodyFetchError`,`Create`]})))()}Ua();export{Ba as BodyFetchError,za as BodyLoading,Va as Create,Ia as EditTab,La as EditTabSample,Ra as ViewMode,Ha as __namedExportsOrder,Fa as default};