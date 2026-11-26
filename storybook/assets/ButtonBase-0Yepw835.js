import{n as e,o as t}from"./rolldown-runtime-BCiCTKAo.js";import{t as n}from"./react-BbeNlDUO.js";import{B as r,S as i,f as a,gt as o,i as s,mt as c,n as l,o as u,t as d,x as f,z as p}from"./DefaultPropsProvider-D68BqLsB.js";import{t as m}from"./jsx-runtime-BB9-612F.js";import{a as h,c as g,i as _,l as v,r as y,s as b,u as x}from"./capitalize-C7shdts4.js";import{C as S,S as C,a as ee,c as w,d as T,f as E,i as te,l as ne,n as D,p as O,r as k,s as re,u as ie}from"./useTimeout-D4afy5Gw.js";function ae(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return A.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var A;function oe(){return(oe=e((()=>{A=t(n(),1)})))()}function se(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=j.useRef(null),m=l===!0,h=ae({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=j.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`||!!(e.tagName===`A`&&e.href)},[t]),_=j.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:j.useCallback((e=M)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{u&&e.stopPropagation(),a?e.preventDefault():t?.(e)},s=e=>{m&&h.onKeyDown(e),a||(d?.(e),n?.(e),e.target!==e.currentTarget||g()||(e.key===` `?e.preventDefault():e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())))},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var j,M;function N(){return(N=e((()=>{j=t(n(),1),oe(),M={}})))()}function ce(){return F.use()}function le(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var P,F;function I(){return(I=e((()=>{P=t(n(),1),ie(),F=class e{ref={current:null};shouldMount=!1;mounted=null;didMount=!1;setShouldMount=null;static create(){return new e}static use(){let t=T(e.create).current,[n,r]=P.useState(!1);return t.shouldMount=n,t.setShouldMount=r,P.useEffect(t.mountEffect,[n]),t}mount(){return this.mounted||(this.mounted=le(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&(this.ref.current!==null&&(this.didMount=!0),this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}}})))()}function L(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:a,rippleSize:o,in:s,onExited:c,timeout:l}=e,[u,d]=R.useState(!1),f=k(),m=R.useRef(!1),h=R.useRef(c);h.current=c;let g=c!=null,_=p(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),v={width:o,height:o,top:-(o/2)+a,left:-(o/2)+i},y=p(n.child,u&&n.childLeaving,r&&n.childPulsate);return!s&&!u&&d(!0),R.useEffect(()=>{!s&&g?m.current||(m.current=!0,f.start(l,()=>{m.current=!1,h.current?.()})):(m.current=!1,f.clear())},[f,g,s,l]),(0,z.jsx)(`span`,{className:_,style:v,children:(0,z.jsx)(`span`,{className:y})})}var R,z;function B(){return(B=e((()=>{R=t(n(),1),r(),D(),z=m()})))()}var V;function H(){return(H=e((()=>{g(),V=b(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`])})))()}function U(e,t){let n=new Set(t),r=new Map,i=[];for(let t of e)n.has(t)?i.length>0&&(r.set(t,i),i=[]):i.push(t);let a=[];for(let e of t){let t=r.get(e);t&&a.push(...t),a.push(e)}return a.push(...i),a}function ue({event:e,element:t,center:n}){let r=t?t.getBoundingClientRect():{width:0,height:0,left:0,top:0},i,a;if(n||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)i=Math.round(r.width/2),a=Math.round(r.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;i=Math.round(t-r.left),a=Math.round(n-r.top)}let o;if(n)o=Math.sqrt((2*r.width**2+r.height**2)/3),o%2==0&&(o+=1);else{let e=Math.max(Math.abs((t?t.clientWidth:0)-i),i)*2+2,n=Math.max(Math.abs((t?t.clientHeight:0)-a),a)*2+2;o=Math.sqrt(e**2+n**2)}return{rippleX:i,rippleY:a,rippleSize:o}}function de(e){if(e.motion.reducedMotion===`always`)return null;let t=c`
    &.${V.rippleVisible} {
      animation-name: ${pe};
      animation-duration: ${K}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    &.${V.ripplePulsate} {
      animation-duration: ${e.transitions.duration.shorter}ms;
    }

    & .${V.childLeaving} {
      animation-name: ${me};
      animation-duration: ${K}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    & .${V.childPulsate} {
      animation-name: ${he};
      animation-duration: 2500ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;return e.motion.reducedMotion===`system`?c`
      @media (prefers-reduced-motion: no-preference) {
        ${t}
      }
    `:t}var W,G,K,q,J,fe,pe,me,he,ge,_e,ve;function ye(){return(ye=e((()=>{W=t(n(),1),r(),te(),D(),s(),d(),B(),H(),E(),w(),G=m(),K=550,q={},J=[],fe=()=>{},pe=o`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,me=o`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,he=o`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,ge=u(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),_e=u(L,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${V.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
  }

  /*
   * Order matters: 'child', 'childLeaving' and 'childPulsate' apply to the same
   * element with equal specificity, so the later rule wins. 'child' must come
   * before 'childLeaving' so the leaving 'opacity: 0' takes precedence. A focus
   * (pulsate) ripple keeps 'pulsateKeyframe' (no opacity animation) on exit, so
   * it relies on this static 'opacity: 0' to disappear on blur instead of
   * lingering until removal.
   */
  & .${V.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${V.childLeaving} {
    opacity: 0;
  }

  & .${V.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({theme:e})=>de(e)}
`,ve=W.forwardRef(function(e,t){let n=l({props:e,name:`MuiTouchRipple`}),r=a(),i=ne(r.motion.reducedMotion,!1),{center:o=!1,classes:s=q,className:c,...u}=n,[d,f]=W.useState({items:J,order:J}),m=d.items,h=W.useRef(0),g=W.useRef(null),_=W.useRef(!1);ee(()=>(_.current=!0,()=>{_.current=!1})),W.useEffect(()=>{g.current&&=(g.current(),null)},[m]);let v=W.useRef(!1),y=k(),b=W.useRef(null),x=W.useRef(null),S=O(e=>{_.current&&f(t=>{let n=t.items.filter(t=>t.key!==e);return{items:n,order:U(t.order.filter(t=>t!==e),n.filter(e=>!e.exiting).map(e=>e.key))}})}),C=O(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:i,cb:a}=e,o=h.current;h.current+=1,f(e=>{let a=[...e.items,{key:o,pulsate:t,rippleX:n,rippleY:r,rippleSize:i,exiting:!1}];return{items:a,order:U(e.order,a.filter(e=>!e.exiting).map(e=>e.key))}}),g.current=a}),w=O((e=q,t=q,n=fe)=>{let{pulsate:r=!1,center:i=o||t.pulsate,fakeElement:a=!1}=t;if(e?.type===`mousedown`&&v.current){v.current=!1;return}e?.type===`touchstart`&&(v.current=!0);let{rippleX:s,rippleY:c,rippleSize:l}=ue({event:e,element:a?null:x.current,center:i});e?.touches?b.current===null&&(b.current=()=>{C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})},y.start(80,()=>{b.current&&=(b.current(),null)})):C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})}),T=O(()=>{w(q,{pulsate:!0})}),E=O((e,t)=>{y.clear(),e?.type===`touchend`&&b.current?(b.current(),b.current=null,y.start(0,()=>{E(e,t)})):(b.current=null,f(e=>{let t=e.items.findIndex(e=>!e.exiting);if(t===-1)return e;let n=e.items.slice();return n[t]={...n[t],exiting:!0},{items:n,order:U(e.order,n.filter(e=>!e.exiting).map(e=>e.key))}}),g.current=t)});W.useImperativeHandle(t,()=>({pulsate:T,start:w,stop:E}),[T,w,E]);let te=new Map(m.map(e=>[e.key,e])),D=d.order.map(e=>te.get(e)).filter(Boolean);return(0,G.jsx)(ge,{className:p(V.root,s.root,c),ref:x,...u,children:D.map(e=>(0,G.jsx)(_e,{classes:{ripple:p(s.ripple,V.ripple),rippleVisible:p(s.rippleVisible,V.rippleVisible),ripplePulsate:p(s.ripplePulsate,V.ripplePulsate),child:p(s.child,V.child),childLeaving:p(s.childLeaving,V.childLeaving),childPulsate:p(s.childPulsate,V.childPulsate)},timeout:i.shouldReduceMotion?0:K,pulsate:e.pulsate,rippleX:e.rippleX,rippleY:e.rippleY,rippleSize:e.rippleSize,in:!e.exiting,onExited:()=>S(e.key)},e.key))})})})))()}function be(e){return v(`MuiButtonBase`,e)}var Y;function X(){return(X=e((()=>{g(),x(),Y=b(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`])})))()}function Z(e,t,n,r=!1){return O(i=>(n&&n(i),r||e[t](i),!0))}var Q,xe,Se,Ce,we;function Te(){return(Te=e((()=>{Q=t(n(),1),r(),s(),y(),d(),C(),E(),N(),I(),ye(),X(),f(),xe=m(),Se=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:a}=e,o=h({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},be,a);return n&&!i&&r&&(o.root+=` ${r}`),o},Ce=u(`button`,{name:`MuiButtonBase`,slot:`Root`})(_(({theme:e})=>({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${Y.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`},variants:[{props:{internalDisabledThemeFocusVisible:!1},style:e.focusVisible&&{...i,[`&.${Y.focusVisible}`]:e.focusVisible}}]}))),we=Q.forwardRef(function(e,t){let n=l({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:a,className:o,component:s=`button`,disabled:c=!1,disableRipple:u=!1,disableTouchRipple:d=!1,focusRipple:f=!1,focusVisibleClassName:m,focusableWhenDisabled:h,suppressFocusVisible:g=!1,internalNativeButton:_,internalDisabledThemeFocusVisible:v=!1,LinkComponent:y=`a`,nativeButton:b,onBlur:x,onClick:C,onContextMenu:ee,onDragLeave:w,onFocus:T,onFocusVisible:E,onKeyDown:te,onKeyUp:ne,onMouseDown:D,onMouseLeave:k,onMouseUp:ie,onTouchEnd:ae,onTouchMove:A,onTouchStart:oe,tabIndex:j=0,TouchRippleProps:M,touchRippleRef:N,type:le,...P}=n,F=!!(P.href||P.to),I=!!P.formAction,L=s;L===`button`&&F&&(L=y);let R=typeof L==`string`?L===`button`:_??!1,z=b??R,B=ce(),V=S(B.ref,N),[H,U]=Q.useState(!1);(c||g)&&H&&U(!1);let ue=O(e=>{f&&!e.repeat&&H&&e.key===` `&&B.stop(e,()=>{B.start(e)})}),de=O(e=>{f&&e.key===` `&&H&&!e.defaultPrevented&&B.stop(e,()=>{B.pulsate(e)})}),{getButtonProps:W,rootRef:G}=se({nativeButton:z,nativeButtonProp:b,internalNativeButton:R,allowInferredHostMismatch:F||typeof L==`string`,disabled:c,type:le,hasFormAction:I,tabIndex:j,onBeforeKeyDown:ue,onBeforeKeyUp:de}),{onClick:K,onKeyDown:q,onKeyUp:J,...fe}=W({onClick:C,onKeyDown:te,onKeyUp:ne});Q.useImperativeHandle(r,()=>({focusVisible:()=>{U(!0),G.current.focus()}}),[G]);let pe=B.shouldMount&&!u&&!c;Q.useEffect(()=>{H&&f&&!u&&B.pulsate()},[u,f,H,B]);let me=Z(B,`start`,D,d),he=Z(B,`stop`,ee,d),ge=Z(B,`stop`,w,d),_e=Z(B,`stop`,ie,d),ye=Z(B,`stop`,e=>{H&&e.preventDefault(),k&&k(e)},d),be=Z(B,`start`,oe,d),Y=Z(B,`stop`,ae,d),X=Z(B,`stop`,A,d),we=Z(B,`stop`,e=>{re(e.target)||U(!1),x&&x(e)},!1),Te=O(e=>{G.current||=e.currentTarget,!g&&re(e.target)&&(U(!0),E&&E(e)),T&&T(e)}),$={};F&&($.tabIndex=c?-1:j,c&&($[`aria-disabled`]=c),$.type=le);let Ee=S(t,G),De={...n,centerRipple:i,component:s,disabled:c,disableRipple:u,disableTouchRipple:d,focusRipple:f,suppressFocusVisible:g,tabIndex:j,focusVisible:H,internalDisabledThemeFocusVisible:v},Oe=Se(De);return(0,xe.jsxs)(Ce,{as:L,className:p(Oe.root,o),ownerState:De,onBlur:we,onClick:K,onContextMenu:he,onFocus:Te,onKeyDown:q,onKeyUp:J,onMouseDown:me,onMouseLeave:ye,onMouseUp:_e,onDragLeave:ge,onTouchEnd:Y,onTouchMove:X,onTouchStart:be,ref:Ee,...F?$:fe,...P,children:[a,pe?(0,xe.jsx)(ve,{ref:V,center:i,...M}):null]})})})))()}export{X as i,Te as n,Y as r,we as t};