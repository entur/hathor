import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{A as n,T as r,d as i,f as a}from"./DefaultPropsProvider-D68BqLsB.js";import{t as o}from"./jsx-runtime-BB9-612F.js";import{n as s,t as c}from"./Box-C0BOFjz-.js";import{n as ee,t as l}from"./Skeleton-DVgMnZLQ.js";import{n as te,t as u}from"./Typography-Df7J5NOK.js";import{n as d,t as f}from"./Divider-CddG0IAe.js";import{n as p,t as m}from"./useTranslation-DWliA1VU.js";import{t as h,u as g}from"./chunk-YDNE64FV-B8wt3vL7.js";import{n as _,t as v}from"./MenuIcon-Ce-j-yan.js";import{n as y,t as b}from"./featureFlags-DqTHKA9O.js";import{n as x,t as ne}from"./Add-d7nhyoU1.js";import{n as S,t as C}from"./SquareButton-DVCifb55.js";import{n as w,t as T}from"./colorOver-C9kHNx5F.js";import{n as re,t as ie}from"./srOnly--GGcarhK.js";var E,D,O;function k(){return(k=e((()=>{E=600,D=(e,t)=>()=>new Promise(n=>setTimeout(()=>n(e),E*(t+1))),O=[{id:`vehicleTypes`,icon:`vehicleTypes`,path:`/vehicle-types`,titleKey:`home.features.vehicletypes.headline`,descKey:`home.features.vehicletypes.description`,statKey:`home.stat.vehicleTypes`,createKey:`home.createNew.vehicleType`,count:D(142,0)},{id:`vehicles`,icon:`vehicles`,path:`/vehicles`,titleKey:`vehicles.title`,descKey:`home.nav.vehicles.desc`,statKey:`home.stat.vehicles`,createKey:`home.createNew.vehicle`,count:D(3870,1)},{id:`deckPlans`,icon:`deckPlans`,path:`/deck-plans`,titleKey:`home.features.deckplans.headline`,descKey:`home.features.deckplans.description`,statKey:`home.stat.deckPlans`,createKey:`home.createNew.deckPlan`,count:D(58,2),flag:`DeckPlans`}]})))()}function A({ctx:e,types:t=O}){let{t:n}=p();return(0,R.jsx)(c,{component:`section`,"aria-label":n(`home.overview`),sx:{display:`grid`,gridTemplateColumns:{xs:`1fr`,sm:`repeat(3, 1fr)`},gap:2},children:t.map(t=>(0,R.jsxs)(c,{sx:{p:2.5,borderRadius:H,bgcolor:`action.hover`},children:[(0,R.jsxs)(c,{sx:{display:`flex`,alignItems:`center`,gap:1,mb:1,color:`text.secondary`},children:[(0,R.jsx)(v,{name:t.icon,size:le}),(0,R.jsx)(u,{variant:`overline`,sx:{letterSpacing:`0.08em`},children:n(t.statKey)})]}),(0,R.jsx)(F,{fn:t.count,ctx:e})]},t.id))})}function j({types:e=O}){let{t}=p();return(0,R.jsxs)(c,{component:`section`,children:[(0,R.jsx)(u,{variant:`h6`,component:`h2`,sx:{mb:2},children:t(`home.browse`)}),(0,R.jsx)(c,{sx:{display:`grid`,gridTemplateColumns:{xs:`1fr`,sm:`repeat(2, 1fr)`,md:`repeat(3, 1fr)`},gap:2},children:e.map(e=>(0,R.jsx)(se,{to:e.path,icon:e.icon,title:t(e.titleKey),desc:t(e.descKey)},e.id))})]})}function M({types:e=O}){let{t}=p();return(0,R.jsxs)(c,{component:`section`,children:[(0,R.jsx)(u,{variant:`h6`,component:`h2`,sx:{mb:2},children:t(`home.createNew.title`)}),(0,R.jsx)(c,{sx:{display:`flex`,flexWrap:`wrap`,alignItems:`stretch`,borderRadius:H,bgcolor:`background.paper`,border:1,borderColor:`divider`,overflow:`hidden`},children:e.map((e,n)=>(0,R.jsxs)(L.Fragment,{children:[n>0&&(0,R.jsx)(f,{flexItem:!0,orientation:`vertical`,sx:{display:{xs:`none`,sm:`block`}}}),(0,R.jsx)(ce,{to:Q(e.path),icon:e.icon,label:t(e.createKey)})]},e.id))})]})}function N({ctx:e,types:t=O,...n}){let r={...fe,...pe(n)},{t:i}=p();return(0,R.jsx)(c,{component:`section`,"aria-label":i(`home.browse`),sx:{display:`grid`,gridTemplateColumns:{xs:`1fr`,md:`repeat(${t.length}, 1fr)`},gap:G,containerType:`inline-size`},children:t.map((n,i)=>(0,R.jsx)(oe,{type:n,ctx:e,idx:i,n:t.length,look:r},n.id))})}function P({variant:e=`combo`,...t}){let n=y(),r=(t.types??O).filter(e=>n(e.flag));return e===`combo`?(0,R.jsx)(N,{...t,types:r}):(0,R.jsxs)(c,{sx:{display:`flex`,flexDirection:`column`,gap:U},children:[(0,R.jsx)(A,{ctx:t.ctx,types:r}),(0,R.jsx)(j,{types:r}),(0,R.jsx)(M,{types:r})]})}function ae(e,t){let[n,r]=(0,L.useState)({st:`pending`});return(0,L.useEffect)(()=>{let n=!0;return r({st:`pending`}),e(t).then(e=>n&&r({st:`ok`,n:e}),()=>n&&r({st:`err`})),()=>{n=!1}},[e,t]),n}function F({fn:e,ctx:t}){let{t:n,i18n:r}=p(),i=ae(e,t),a=i.st===`err`;return(0,R.jsx)(u,{variant:`h4`,sx:{lineHeight:1,...a&&{color:`text.disabled`}},title:a?n(`home.countUnavailable`):void 0,"data-testid":i.st===`pending`?`site-count-pending`:a?`site-count-err`:void 0,children:i.st===`ok`?i.n.toLocaleString(r.language):a?(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`span`,{"aria-hidden":`true`,children:`—`}),(0,R.jsx)(c,{component:`span`,sx:ie,children:n(`home.countUnavailable`)})]}):(0,R.jsx)(l,{width:W})})}function oe({type:e,ctx:t,idx:n,n:r,look:{counts:i,iconSize:o,bgURL:s,ink:ee,busOpacity:l,createAlign:te,halo:d,bg:m,hoverBg:g}}){let{t:_}=p(),v=a(),y=Z(v,m),b=Z(v,g),x=w(v.palette.background.default,y),S=w(x,b),T={position:`relative`,textDecoration:`none`,transition:v.transitions.create(`background-color`,{duration:q}),"--halo":x,textShadow:d?K.map(e=>`0 0 ${e}px var(--halo)`).join(`, `):`none`,"&:hover":{bgcolor:b,"--halo":S},"& > *":{position:`relative`,zIndex:2}};return(0,R.jsxs)(c,{sx:{display:`flex`,flexDirection:`column`,borderRadius:H,bgcolor:y,overflow:`hidden`,position:`relative`,isolation:`isolate`,"&::before":s===`none`?void 0:{content:`""`,position:`absolute`,inset:0,zIndex:1,pointerEvents:`none`,backgroundImage:`url(${s})`,backgroundRepeat:`no-repeat`,backgroundSize:`100cqw auto`,backgroundPosition:`center ${Y}`,[v.breakpoints.up(`md`)]:{backgroundPosition:me(n,r,v.spacing(G))},...X[ee],...l!==void 0&&{opacity:l}}},children:[(0,R.jsxs)(c,{component:h,to:e.path,sx:{...T,flex:1,display:`flex`,flexDirection:`column`,gap:1.25,p:2.5,color:`text.primary`},children:[(0,R.jsxs)(c,{sx:{display:`flex`,alignItems:`center`,gap:1},children:[(0,R.jsx)(I,{name:e.icon,size:o}),(0,R.jsx)(u,{variant:`subtitle1`,sx:{fontWeight:`fontWeightBold`},children:_(e.titleKey)})]}),i&&(0,R.jsx)(F,{fn:e.count,ctx:t}),(0,R.jsx)(u,{variant:`body2`,sx:{color:`text.secondary`},children:_(e.descKey)})]}),(0,R.jsx)(f,{}),(0,R.jsx)(c,{sx:{position:`relative`,zIndex:2,display:`flex`,justifyContent:te===`right`?`flex-end`:`flex-start`,px:2.5,py:1.5},children:(0,R.jsx)(C,{icon:(0,R.jsx)(ne,{}),size:`small`,to:Q(e.path),"aria-label":`${_(`home.createNew.title`)} ${_(e.createKey)}`,children:_(e.createKey)})})]})}function se({to:e,icon:t,title:n,desc:r}){return(0,R.jsxs)(c,{component:h,to:e,sx:{display:`flex`,flexDirection:`column`,gap:1.25,p:2.5,borderRadius:H,textDecoration:`none`,color:`text.primary`,bgcolor:`action.hover`,transition:e=>e.transitions.create([`background-color`,`transform`],{duration:q}),"&:hover":{bgcolor:`action.selected`,transform:`translateY(-2px)`}},children:[(0,R.jsx)(I,{name:t,size:z}),(0,R.jsx)(u,{variant:`subtitle1`,sx:{fontWeight:`fontWeightBold`},children:n}),(0,R.jsx)(u,{variant:`body2`,sx:{color:`text.secondary`},children:r})]})}function ce({to:e,icon:t,label:n}){return(0,R.jsx)(c,{sx:{flex:{xs:`1 1 100%`,sm:`1 1 0`},display:`flex`,p:2.5},children:(0,R.jsx)(C,{icon:(0,R.jsx)(I,{name:t,size:V}),to:e,children:n})})}function I({name:e,size:t}){return(0,R.jsx)(c,{sx:{color:`primary.main`,display:`flex`},children:(0,R.jsx)(v,{name:e,size:t})})}var L,R,z,le,B,V,H,U,W,G,K,q,J,Y,X,ue,de,Z,Q,fe,pe,me;function $(){return($=e((()=>{s(),d(),ee(),te(),i(),n(),L=t(),g(),m(),x(),_(),S(),k(),b(),re(),T(),R=o(),z=30,le=20,B=40,V=22,H=2,U={xs:4,md:6},W=96,G=2,K=[2,4],q=150,J=`/assets/bus-sketch-alpha.png`,Y=`75%`,X={white:{filter:`invert(1)`,opacity:1},black:{filter:`none`,opacity:.1}},ue=e=>r(e.palette.primary.main,e.palette.action.selectedOpacity),de=`action.hover`,Z=(e,t)=>{if(typeof t==`function`)return t(e);let[n,r]=t.split(`.`),i=r&&e.palette[n]?.[r];return typeof i==`string`?i:t},Q=e=>`${e}/new`,fe={counts:!1,iconSize:B,bgURL:`none`,ink:`black`,createAlign:`right`,halo:!0,bg:ue,hoverBg:de},pe=e=>Object.fromEntries(Object.entries(e).filter(([,e])=>e!==void 0)),me=(e,t,n)=>`calc(0cqw - ${e} * (100cqw + ${n}) / ${t}) ${Y}`,A.__docgenInfo={description:"Overview metric strip — flat tiles separated by gaps, no borders.\n@param {LayoutProps} props - `ctx` for the count fetchers; `types` defaults to {@link TYPES}.\n@returns a 3-up (1-up on xs) grid of metric tiles.",methods:[],displayName:`StatStrip`,props:{ctx:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},description:``},types:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
  /** Hides the type unless this \`sandboxFeatures\` key is on in config.json. */
  flag?: FeatureFlag;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`icon`,value:{name:`union`,raw:`'home' | 'vehicleTypes' | 'contractualVehicleTypes' | 'vehicles' | 'deckPlans' | 'menu'`,elements:[{name:`literal`,value:`'home'`},{name:`literal`,value:`'vehicleTypes'`},{name:`literal`,value:`'contractualVehicleTypes'`},{name:`literal`,value:`'vehicles'`},{name:`literal`,value:`'deckPlans'`},{name:`literal`,value:`'menu'`}],required:!0}},{key:`path`,value:{name:`string`,required:!0}},{key:`titleKey`,value:{name:`string`,required:!0}},{key:`descKey`,value:{name:`string`,required:!0}},{key:`statKey`,value:{name:`string`,required:!0}},{key:`createKey`,value:{name:`string`,required:!0}},{key:`count`,value:{name:`signature`,type:`function`,raw:`(ctx: CountCtx) => Promise<number>`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},name:`ctx`}],return:{name:`Promise`,elements:[{name:`number`}],raw:`Promise<number>`}},required:!0}},{key:`flag`,value:{name:`SandboxFeatures`,required:!1},description:"Hides the type unless this `sandboxFeatures` key is on in config.json."}]}}],raw:`SiteType[]`},description:``,defaultValue:{value:`[
  {
    id: 'vehicleTypes',
    icon: 'vehicleTypes',
    path: '/vehicle-types',
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    statKey: 'home.stat.vehicleTypes',
    createKey: 'home.createNew.vehicleType',
    count: fakeCount(142, 0),
  },
  {
    id: 'vehicles',
    icon: 'vehicles',
    path: '/vehicles',
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    statKey: 'home.stat.vehicles',
    createKey: 'home.createNew.vehicle',
    count: fakeCount(3870, 1),
  },
  {
    id: 'deckPlans',
    icon: 'deckPlans',
    path: '/deck-plans',
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    statKey: 'home.stat.deckPlans',
    createKey: 'home.createNew.deckPlan',
    count: fakeCount(58, 2),
    flag: 'DeckPlans',
  },
]`,computed:!1}}}},j.__docgenInfo={description:`Browse section — headed grid of {@link NavTile}s into the list views.
@param {{ types?: SiteType[] }} props - \`types\` defaults to {@link TYPES}.
@returns the "Browse the registry" section.`,methods:[],displayName:`NavGrid`,props:{types:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
  /** Hides the type unless this \`sandboxFeatures\` key is on in config.json. */
  flag?: FeatureFlag;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`icon`,value:{name:`union`,raw:`'home' | 'vehicleTypes' | 'contractualVehicleTypes' | 'vehicles' | 'deckPlans' | 'menu'`,elements:[{name:`literal`,value:`'home'`},{name:`literal`,value:`'vehicleTypes'`},{name:`literal`,value:`'contractualVehicleTypes'`},{name:`literal`,value:`'vehicles'`},{name:`literal`,value:`'deckPlans'`},{name:`literal`,value:`'menu'`}],required:!0}},{key:`path`,value:{name:`string`,required:!0}},{key:`titleKey`,value:{name:`string`,required:!0}},{key:`descKey`,value:{name:`string`,required:!0}},{key:`statKey`,value:{name:`string`,required:!0}},{key:`createKey`,value:{name:`string`,required:!0}},{key:`count`,value:{name:`signature`,type:`function`,raw:`(ctx: CountCtx) => Promise<number>`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},name:`ctx`}],return:{name:`Promise`,elements:[{name:`number`}],raw:`Promise<number>`}},required:!0}},{key:`flag`,value:{name:`SandboxFeatures`,required:!1},description:"Hides the type unless this `sandboxFeatures` key is on in config.json."}]}}],raw:`SiteType[]`},description:``,defaultValue:{value:`[
  {
    id: 'vehicleTypes',
    icon: 'vehicleTypes',
    path: '/vehicle-types',
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    statKey: 'home.stat.vehicleTypes',
    createKey: 'home.createNew.vehicleType',
    count: fakeCount(142, 0),
  },
  {
    id: 'vehicles',
    icon: 'vehicles',
    path: '/vehicles',
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    statKey: 'home.stat.vehicles',
    createKey: 'home.createNew.vehicle',
    count: fakeCount(3870, 1),
  },
  {
    id: 'deckPlans',
    icon: 'deckPlans',
    path: '/deck-plans',
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    statKey: 'home.stat.deckPlans',
    createKey: 'home.createNew.deckPlan',
    count: fakeCount(58, 2),
    flag: 'DeckPlans',
  },
]`,computed:!1}}}},M.__docgenInfo={description:`Create section — flat action row of {@link CreateAction}s, divided on sm+.
@param {{ types?: SiteType[] }} props - \`types\` defaults to {@link TYPES}.
@returns the "Create new" section.`,methods:[],displayName:`CreateRow`,props:{types:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
  /** Hides the type unless this \`sandboxFeatures\` key is on in config.json. */
  flag?: FeatureFlag;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`icon`,value:{name:`union`,raw:`'home' | 'vehicleTypes' | 'contractualVehicleTypes' | 'vehicles' | 'deckPlans' | 'menu'`,elements:[{name:`literal`,value:`'home'`},{name:`literal`,value:`'vehicleTypes'`},{name:`literal`,value:`'contractualVehicleTypes'`},{name:`literal`,value:`'vehicles'`},{name:`literal`,value:`'deckPlans'`},{name:`literal`,value:`'menu'`}],required:!0}},{key:`path`,value:{name:`string`,required:!0}},{key:`titleKey`,value:{name:`string`,required:!0}},{key:`descKey`,value:{name:`string`,required:!0}},{key:`statKey`,value:{name:`string`,required:!0}},{key:`createKey`,value:{name:`string`,required:!0}},{key:`count`,value:{name:`signature`,type:`function`,raw:`(ctx: CountCtx) => Promise<number>`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},name:`ctx`}],return:{name:`Promise`,elements:[{name:`number`}],raw:`Promise<number>`}},required:!0}},{key:`flag`,value:{name:`SandboxFeatures`,required:!1},description:"Hides the type unless this `sandboxFeatures` key is on in config.json."}]}}],raw:`SiteType[]`},description:``,defaultValue:{value:`[
  {
    id: 'vehicleTypes',
    icon: 'vehicleTypes',
    path: '/vehicle-types',
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    statKey: 'home.stat.vehicleTypes',
    createKey: 'home.createNew.vehicleType',
    count: fakeCount(142, 0),
  },
  {
    id: 'vehicles',
    icon: 'vehicles',
    path: '/vehicles',
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    statKey: 'home.stat.vehicles',
    createKey: 'home.createNew.vehicle',
    count: fakeCount(3870, 1),
  },
  {
    id: 'deckPlans',
    icon: 'deckPlans',
    path: '/deck-plans',
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    statKey: 'home.stat.deckPlans',
    createKey: 'home.createNew.deckPlan',
    count: fakeCount(58, 2),
    flag: 'DeckPlans',
  },
]`,computed:!1}}}},N.__docgenInfo={description:`Combo strip — one {@link ComboCard} per type: count + browse link on top,
create action in a divided footer. 1-up below md, 3-up from md.
@param {ComboProps} props - \`ctx\` for the count fetchers; \`types\` defaults to
  {@link TYPES}; remaining {@link ComboLook} toggles default to {@link DEF_LOOK}.
@returns the equal-height card grid.`,methods:[],displayName:`ComboStrip`,props:{ctx:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},description:``},types:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
  /** Hides the type unless this \`sandboxFeatures\` key is on in config.json. */
  flag?: FeatureFlag;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`icon`,value:{name:`union`,raw:`'home' | 'vehicleTypes' | 'contractualVehicleTypes' | 'vehicles' | 'deckPlans' | 'menu'`,elements:[{name:`literal`,value:`'home'`},{name:`literal`,value:`'vehicleTypes'`},{name:`literal`,value:`'contractualVehicleTypes'`},{name:`literal`,value:`'vehicles'`},{name:`literal`,value:`'deckPlans'`},{name:`literal`,value:`'menu'`}],required:!0}},{key:`path`,value:{name:`string`,required:!0}},{key:`titleKey`,value:{name:`string`,required:!0}},{key:`descKey`,value:{name:`string`,required:!0}},{key:`statKey`,value:{name:`string`,required:!0}},{key:`createKey`,value:{name:`string`,required:!0}},{key:`count`,value:{name:`signature`,type:`function`,raw:`(ctx: CountCtx) => Promise<number>`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},name:`ctx`}],return:{name:`Promise`,elements:[{name:`number`}],raw:`Promise<number>`}},required:!0}},{key:`flag`,value:{name:`SandboxFeatures`,required:!1},description:"Hides the type unless this `sandboxFeatures` key is on in config.json."}]}}],raw:`SiteType[]`},description:``,defaultValue:{value:`[
  {
    id: 'vehicleTypes',
    icon: 'vehicleTypes',
    path: '/vehicle-types',
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    statKey: 'home.stat.vehicleTypes',
    createKey: 'home.createNew.vehicleType',
    count: fakeCount(142, 0),
  },
  {
    id: 'vehicles',
    icon: 'vehicles',
    path: '/vehicles',
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    statKey: 'home.stat.vehicles',
    createKey: 'home.createNew.vehicle',
    count: fakeCount(3870, 1),
  },
  {
    id: 'deckPlans',
    icon: 'deckPlans',
    path: '/deck-plans',
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    statKey: 'home.stat.deckPlans',
    createKey: 'home.createNew.deckPlan',
    count: fakeCount(58, 2),
    flag: 'DeckPlans',
  },
]`,computed:!1}}}},P.__docgenInfo={description:`The Home dashboard's org-gated body. Types whose feature flag is off are dropped
here, before any layout sees them.
@param {ComboProps & { variant?: 'combo' | 'rows' }} props - \`variant\` picks the
  layout (default \`combo\`); look toggles apply to combo only (see {@link ComboStrip}).
@returns the combo strip, or the metric strip + browse grid + create row stacked.`,methods:[],displayName:`SiteNavCards`,props:{ctx:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},description:``},types:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
  /** Hides the type unless this \`sandboxFeatures\` key is on in config.json. */
  flag?: FeatureFlag;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`icon`,value:{name:`union`,raw:`'home' | 'vehicleTypes' | 'contractualVehicleTypes' | 'vehicles' | 'deckPlans' | 'menu'`,elements:[{name:`literal`,value:`'home'`},{name:`literal`,value:`'vehicleTypes'`},{name:`literal`,value:`'contractualVehicleTypes'`},{name:`literal`,value:`'vehicles'`},{name:`literal`,value:`'deckPlans'`},{name:`literal`,value:`'menu'`}],required:!0}},{key:`path`,value:{name:`string`,required:!0}},{key:`titleKey`,value:{name:`string`,required:!0}},{key:`descKey`,value:{name:`string`,required:!0}},{key:`statKey`,value:{name:`string`,required:!0}},{key:`createKey`,value:{name:`string`,required:!0}},{key:`count`,value:{name:`signature`,type:`function`,raw:`(ctx: CountCtx) => Promise<number>`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
}`,signature:{properties:[{key:`apiUrl`,value:{name:`string`,required:!1}},{key:`getToken`,value:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}},required:!0}},{key:`org`,value:{name:`string`,required:!1}}]}},name:`ctx`}],return:{name:`Promise`,elements:[{name:`number`}],raw:`Promise<number>`}},required:!0}},{key:`flag`,value:{name:`SandboxFeatures`,required:!1},description:"Hides the type unless this `sandboxFeatures` key is on in config.json."}]}}],raw:`SiteType[]`},description:``},variant:{required:!1,tsType:{name:`union`,raw:`'combo' | 'rows'`,elements:[{name:`literal`,value:`'combo'`},{name:`literal`,value:`'rows'`}]},description:``,defaultValue:{value:`'combo'`,computed:!1}}}}})))()}export{P as a,O as c,j as i,k as l,N as n,A as o,M as r,$ as s,J as t};