import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Typography-Df7J5NOK.js";import{a as i,m as a,n as o,s,u as c}from"./chunk-YDNE64FV-B8wt3vL7.js";import{a as l,t as u}from"./types-CukKlRea.js";import{n as d,t as f}from"./vehicleTypeCollectionConfig-BAtgvqfA.js";function p(){return(0,h.jsxs)(r,{variant:`h5`,children:[`Details page for `,a().id]})}function m(e){return(0,h.jsx)(o,{initialEntries:[v],children:(0,h.jsxs)(s,{children:[(0,h.jsx)(i,{path:v,element:(0,h.jsx)(f,{...e})}),(0,h.jsx)(i,{path:`${v}/:id`,element:(0,h.jsx)(p,{})})]})})}var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{c(),n(),d(),l(),h=t(),{fn:g}=__STORYBOOK_MODULE_TEST__,_=120,v=`/vehicle-types`,y=360,b=560,x=[`BUS`,`COACH`,`RAIL`,`TRAM`,`WATER`],S=15,C=[`Volvo`,`Scania`,`Solaris`,`MAN`,`Stadler`,`Bombardier`,`Ærø`],w=[`Citea`,`8900`,`Urbino`,`Lion`,`Flirt`,`Talent`,`Express`],T=[`COMBUSTION`,`ELECTRIC`,`HYBRID`],E=40,D=110,O=4,k=2.45,A=.1,j=2.9,M=.2,N=Array.from({length:_},(e,t)=>({id:`NMR:VehicleType:${1e3+t}`,version:1+t%3,name:t%S===7?void 0:{value:`${C[t%C.length]} ${w[t*3%w.length]}`},transportMode:t%4?`BUS`:x[1+(t>>2)%(x.length-1)],length:8+t*7%180/10,...t%O!==3&&{width:k+t%3*A,height:j+t%4*M},lowFloor:t%5<3,propulsionTypes:[T[t%T.length]],passengerCapacity:{totalCapacity:E+t*37%D},deckPlan:t%5==0?{id:`NMR:DeckPlan:${t}`,name:{value:`Deck ${t}`}}:void 0})),P={title:`components/EntityCollection/vehicle-types`,component:m,parameters:{layout:`padded`,docs:{description:{component:"Embedded port of the sandbox `EntityCollection` (#261, epic #252): toolbar (search · filter · sort · columns · density · view), grid / cards. Hathor additions: a field's `render` (transport mode as icon + text), an Edit link per record (`editHref`), the id muted. Drawn with the vehicle-types page's own collection config (`vehicleTypeFields`, `vehicleTypeCollectionConfig.tsx`, #271) over 120 seeded rows."}}},args:{rows:N,tools:[...u],filterMode:`client`,onQueryChange:g(),onViewChange:g()},argTypes:{view:{control:`inline-radio`,options:[`grid`,`cards`]},filterMode:{control:`inline-radio`,options:[`client`,`server`]},tools:{control:`check`,options:[...u]},rows:{control:!1}}},F={},I={args:{view:`cards`}},L={args:{rows:[]}},R={decorators:[e=>(0,h.jsx)(`div`,{style:{width:y},children:(0,h.jsx)(e,{})})]},z={decorators:[e=>(0,h.jsx)(`div`,{style:{height:b,display:`flex`,flexDirection:`column`},children:(0,h.jsx)(e,{})})]},B=[`Grid`,`Cards`,`Empty`,`Narrow`,`Framed`],F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{}`,...F.parameters?.docs?.source},description:{story:`Uncontrolled: starts on the grid; the toolbar's view switch changes it.`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    view: 'cards'
  }
}`,...I.parameters?.docs?.source},description:{story:`Each type drawn as a bus; one row in four has no width or height and says so.`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    rows: []
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    width: NARROW_W
  }}>
        <Story />
      </div>]
}`,...R.parameters?.docs?.source},description:{story:`A phone's width: the toolbar wraps; the Columns tool trims what the grid shows (U5).`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    height: FRAME_H,
    display: 'flex',
    flexDirection: 'column'
  }}>
        <Story />
      </div>]
}`,...z.parameters?.docs?.source},description:{story:`In a frame of set height, as the page shell gives it: the toolbar and the pager stay put
 and the rows scroll between them — the grid under its fixed headers (#278).`,...z.parameters?.docs?.description}}}})))()}V();export{I as Cards,L as Empty,z as Framed,F as Grid,R as Narrow,B as __namedExportsOrder,P as default};