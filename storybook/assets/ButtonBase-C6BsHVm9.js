import{a as e,n as t}from"./rolldown-runtime-sJBDdmOt.js";import{d as n,g as r,h as i,m as a,p as o}from"./Typography-W0OYS_Uw.js";import{C as s,S as c,_ as l,b as u,f as d,g as f,h as p,m,p as h,v as g,y as _}from"./mergeSlotProps-HIBQdcRe.js";import{a as v,i as ee,o as y}from"./useTranslation-BfZHcXB_.js";import{U as b,W as x,bt as S,f as C,gt as w,h as T,l as E,tn as D,u as te,yt as O}from"./iframe-Bo2QKnCP.js";function ne(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function k(e,t){var n=function(e){return t&&(0,N.isValidElement)(e)?t(e):e},r=Object.create(null);return e&&N.Children.map(e,function(e){return e}).forEach(function(e){r[e.key]=n(e)}),r}function A(e,t){e||={},t||={};function n(n){return n in t?t[n]:e[n]}var r=Object.create(null),i=[];for(var a in e)a in t?i.length&&(r[a]=i,i=[]):i.push(a);var o,s={};for(var c in t){if(r[c])for(o=0;o<r[c].length;o++){var l=r[c][o];s[r[c][o]]=n(l)}s[c]=n(c)}for(o=0;o<i.length;o++)s[i[o]]=n(i[o]);return s}function j(e,t,n){return n[t]==null?e.props[t]:n[t]}function re(e,t){return k(e.children,function(n){return(0,N.cloneElement)(n,{onExited:t.bind(null,n),in:!0,appear:j(n,`appear`,e),enter:j(n,`enter`,e),exit:j(n,`exit`,e)})})}function M(e,t,n){var r=k(e.children),i=A(t,r);return Object.keys(i).forEach(function(a){var o=i[a];if((0,N.isValidElement)(o)){var s=a in t,c=a in r,l=t[a],u=(0,N.isValidElement)(l)&&!l.props.in;c&&(!s||u)?i[a]=(0,N.cloneElement)(o,{onExited:n.bind(null,o),in:!0,exit:j(o,`exit`,e),enter:j(o,`enter`,e)}):!c&&s&&!u?i[a]=(0,N.cloneElement)(o,{in:!1}):c&&s&&(0,N.isValidElement)(l)&&(i[a]=(0,N.cloneElement)(o,{onExited:n.bind(null,o),in:l.props.in,exit:j(o,`exit`,e),enter:j(o,`enter`,e)}))}}),i}var N;function P(){return(P=t((()=>{N=D()})))()}var F,I,L,R;function z(){return(z=t((()=>{_(),F=e(D()),l(),P(),I=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},L={component:`div`,childFactory:function(e){return e}},R=function(e){g(t,e);function t(t,n){var r=e.call(this,t,n)||this;return r.state={contextValue:{isMounting:!0},handleExited:r.handleExited.bind(ne(r)),firstRender:!0},r}var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n=t.children,r=t.handleExited;return{children:t.firstRender?re(e,r):M(e,n,r),firstRender:!1}},n.handleExited=function(e,t){var n=k(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState(function(t){var n=S({},t.children);return delete n[e.key],{children:n}}))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=u(e,[`component`,`childFactory`]),i=this.state.contextValue,a=I(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,t===null?F.createElement(f.Provider,{value:i},a):F.createElement(f.Provider,{value:i},F.createElement(t,r,a))},t}(F.Component),R.propTypes={},R.defaultProps=L})))()}function ie(){return oe.use()}function ae(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var B,oe;function se(){return(se=t((()=>{B=e(D()),m(),oe=class e{static create(){return new e}static use(){let t=p(e.create).current,[n,r]=B.useState(!1);return t.shouldMount=n,t.setShouldMount=r,B.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=ae(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}}})))()}function ce(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:a,rippleSize:o,in:s,onExited:c,timeout:l}=e,[u,d]=V.useState(!1),f=b(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),p={width:o,height:o,top:-(o/2)+a,left:-(o/2)+i},m=b(n.child,u&&n.childLeaving,r&&n.childPulsate);return!s&&!u&&d(!0),V.useEffect(()=>{if(!s&&c!=null){let e=setTimeout(c,l);return()=>{clearTimeout(e)}}},[c,s,l]),(0,H.jsx)(`span`,{className:f,style:p,children:(0,H.jsx)(`span`,{className:m})})}var V,H;function U(){return(U=t((()=>{V=e(D()),x(),H=w()})))()}var W;function G(){return(G=t((()=>{a(),W=o(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`])})))()}var K,q,J,Y,X,le,Z,ue,de;function fe(){return(fe=t((()=>{K=e(D()),z(),x(),d(),C(),E(),U(),G(),q=w(),J=550,Y=O`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,X=O`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,le=O`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,Z=T(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),ue=T(ce,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${W.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${Y};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  &.${W.ripplePulsate} {
    animation-duration: ${({theme:e})=>e.transitions.duration.shorter}ms;
  }

  & .${W.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${W.childLeaving} {
    opacity: 0;
    animation-name: ${X};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  & .${W.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${le};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,de=K.forwardRef(function(e,t){let{center:n=!1,classes:r={},className:i,...a}=te({props:e,name:`MuiTouchRipple`}),[o,s]=K.useState([]),c=K.useRef(0),l=K.useRef(null);K.useEffect(()=>{l.current&&=(l.current(),null)},[o]);let u=K.useRef(!1),d=h(),f=K.useRef(null),p=K.useRef(null),m=K.useCallback(e=>{let{pulsate:t,rippleX:n,rippleY:i,rippleSize:a,cb:o}=e;s(e=>[...e,(0,q.jsx)(ue,{classes:{ripple:b(r.ripple,W.ripple),rippleVisible:b(r.rippleVisible,W.rippleVisible),ripplePulsate:b(r.ripplePulsate,W.ripplePulsate),child:b(r.child,W.child),childLeaving:b(r.childLeaving,W.childLeaving),childPulsate:b(r.childPulsate,W.childPulsate)},timeout:J,pulsate:t,rippleX:n,rippleY:i,rippleSize:a},c.current)]),c.current+=1,l.current=o},[r]),g=K.useCallback((e={},t={},r=()=>{})=>{let{pulsate:i=!1,center:a=n||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&u.current){u.current=!1;return}e?.type===`touchstart`&&(u.current=!0);let s=o?null:p.current,c=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0},l,h,g;if(a||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)l=Math.round(c.width/2),h=Math.round(c.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;l=Math.round(t-c.left),h=Math.round(n-c.top)}if(a)g=Math.sqrt((2*c.width**2+c.height**2)/3),g%2==0&&(g+=1);else{let e=Math.max(Math.abs((s?s.clientWidth:0)-l),l)*2+2,t=Math.max(Math.abs((s?s.clientHeight:0)-h),h)*2+2;g=Math.sqrt(e**2+t**2)}e?.touches?f.current===null&&(f.current=()=>{m({pulsate:i,rippleX:l,rippleY:h,rippleSize:g,cb:r})},d.start(80,()=>{f.current&&=(f.current(),null)})):m({pulsate:i,rippleX:l,rippleY:h,rippleSize:g,cb:r})},[n,m,d]),_=K.useCallback(()=>{g({},{pulsate:!0})},[g]),v=K.useCallback((e,t)=>{d.clear(),e?.type===`touchend`&&f.current?(f.current(),f.current=null,d.start(0,()=>{v(e,t)})):(f.current=null,s(e=>e.length>0?e.slice(1):e),l.current=t)},[d]);return K.useImperativeHandle(t,()=>({pulsate:_,start:g,stop:v}),[_,g,v]),(0,q.jsx)(Z,{className:b(W.root,r.root,i),ref:p,...a,children:(0,q.jsx)(R,{component:null,exit:!0,children:o})})})})))()}function pe(e){return i(`MuiButtonBase`,e)}var me;function he(){return(he=t((()=>{a(),r(),me=o(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`])})))()}function Q(e,t,n,r=!1){return y(i=>(n&&n(i),r||e[t](i),!0))}var $,ge,_e,ve,ye;function be(){return(be=t((()=>{$=e(D()),x(),C(),E(),c(),v(),se(),fe(),he(),ge=w(),_e=e=>{let{disabled:t,focusVisible:r,focusVisibleClassName:i,classes:a}=e,o=n({root:[`root`,t&&`disabled`,r&&`focusVisible`]},pe,a);return r&&i&&(o.root+=` ${i}`),o},ve=T(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${me.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),ye=$.forwardRef(function(e,t){let n=te({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:a,className:o,component:c=`button`,disabled:l=!1,disableRipple:u=!1,disableTouchRipple:d=!1,focusRipple:f=!1,focusVisibleClassName:p,LinkComponent:m=`a`,onBlur:h,onClick:g,onContextMenu:_,onDragLeave:v,onFocus:x,onFocusVisible:S,onKeyDown:C,onKeyUp:w,onMouseDown:T,onMouseLeave:E,onMouseUp:D,onTouchEnd:O,onTouchMove:ne,onTouchStart:k,tabIndex:A=0,TouchRippleProps:j,touchRippleRef:re,type:M,...N}=n,P=$.useRef(null),F=ie(),I=s(F.ref,re),[L,R]=$.useState(!1);l&&L&&R(!1),$.useImperativeHandle(r,()=>({focusVisible:()=>{R(!0),P.current.focus()}}),[]);let z=F.shouldMount&&!u&&!l;$.useEffect(()=>{L&&f&&!u&&F.pulsate()},[u,f,L,F]);let ae=Q(F,`start`,T,d),B=Q(F,`stop`,_,d),oe=Q(F,`stop`,v,d),se=Q(F,`stop`,D,d),ce=Q(F,`stop`,e=>{L&&e.preventDefault(),E&&E(e)},d),V=Q(F,`start`,k,d),H=Q(F,`stop`,O,d),U=Q(F,`stop`,ne,d),W=Q(F,`stop`,e=>{ee(e.target)||R(!1),h&&h(e)},!1),G=y(e=>{P.current||=e.currentTarget,ee(e.target)&&(R(!0),S&&S(e)),x&&x(e)}),K=()=>{let e=P.current;return c&&c!==`button`&&!(e.tagName===`A`&&e.href)},q=y(e=>{f&&!e.repeat&&L&&e.key===` `&&F.stop(e,()=>{F.start(e)}),e.target===e.currentTarget&&K()&&e.key===` `&&e.preventDefault(),C&&C(e),e.target===e.currentTarget&&K()&&e.key===`Enter`&&!l&&(e.preventDefault(),g&&g(e))}),J=y(e=>{f&&e.key===` `&&L&&!e.defaultPrevented&&F.stop(e,()=>{F.pulsate(e)}),w&&w(e),g&&e.target===e.currentTarget&&K()&&e.key===` `&&!e.defaultPrevented&&g(e)}),Y=c;Y===`button`&&(N.href||N.to)&&(Y=m);let X={};if(Y===`button`){let e=!!N.formAction;X.type=M===void 0&&!e?`button`:M,X.disabled=l}else!N.href&&!N.to&&(X.role=`button`),l&&(X[`aria-disabled`]=l);let le=s(t,P),Z={...n,centerRipple:i,component:c,disabled:l,disableRipple:u,disableTouchRipple:d,focusRipple:f,tabIndex:A,focusVisible:L},ue=_e(Z);return(0,ge.jsxs)(ve,{as:Y,className:b(ue.root,o),ownerState:Z,onBlur:W,onClick:g,onContextMenu:B,onFocus:G,onKeyDown:q,onKeyUp:J,onMouseDown:ae,onMouseLeave:ce,onMouseUp:se,onDragLeave:oe,onTouchEnd:H,onTouchMove:U,onTouchStart:V,ref:le,tabIndex:l?-1:A,type:M,...X,...N,children:[a,z?(0,ge.jsx)(de,{ref:I,center:i,...j}):null]})})})))()}export{be as n,ye as t};