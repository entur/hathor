import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Box-C0BOFjz-.js";import{n as i,u as a}from"./chunk-YDNE64FV-B8wt3vL7.js";import{a as o,c as s,i as c,l,n as u,o as d,r as f,s as p,t as m}from"./SiteNavCards-jodMl9Uh.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{n(),a(),p(),l(),h=t(),{expect:g,waitFor:_}=__STORYBOOK_MODULE_TEST__,v={getToken:()=>Promise.resolve(null)},y=s.map(e=>({...e,count:()=>new Promise(()=>{})})),b=s.map(e=>({...e,count:()=>Promise.reject(Error(`count unavailable`))})),x={title:`components/SiteNavCards`,component:o,args:{ctx:v},argTypes:{variant:{control:`inline-radio`,options:[`combo`,`rows`]},counts:{control:`boolean`},iconSize:{control:{type:`range`,min:16,max:72,step:2}},bgURL:{control:`inline-radio`,options:[`none`,m]},ink:{control:`inline-radio`,options:[`black`,`white`]},createAlign:{control:`inline-radio`,options:[`right`,`left`]},busOpacity:{control:{type:`range`,min:0,max:1,step:.05}},halo:{control:`boolean`},bg:{control:`text`},hoverBg:{control:`text`}},parameters:{layout:`fullscreen`,docs:{description:{component:'The Home dashboard cards. `variant="combo"` (default) shows one card per type — browse link (optional count via `counts`), create footer; `variant="rows"` stacks the metric strip, browse tiles and create-new actions. Each layout is exported separately (`ComboStrip`, `StatStrip`, `NavGrid`, `CreateRow`). Sample counts resolve after a staggered fake delay.'}}},decorators:[e=>(0,h.jsx)(i,{children:(0,h.jsx)(r,{sx:{p:{xs:2,sm:3,md:5}},children:(0,h.jsx)(e,{})})})]},S={},C={args:{counts:!0}},w={args:{bgURL:m}},T={args:{bgURL:m,ink:`white`}},E={args:{variant:`rows`}},D={render:()=>(0,h.jsx)(u,{ctx:v,types:y,counts:!0})},O={render:()=>(0,h.jsx)(u,{ctx:v,types:b,counts:!0}),play:async({canvasElement:e})=>{await _(()=>g(e.querySelectorAll(`[data-testid="site-count-err"]`)).toHaveLength(s.length)),e.querySelectorAll(`[data-testid="site-count-err"]`).forEach(e=>{g(e.querySelector(`[aria-hidden="true"]`)?.textContent).toBe(`—`),g(e.textContent?.replace(`—`,``).trim()).not.toBe(``)})}},k={render:()=>(0,h.jsx)(d,{ctx:v})},A={render:()=>(0,h.jsx)(c,{})},j={render:()=>(0,h.jsx)(f,{})},M={globals:{viewport:{value:`mobile1`,isRotated:!1}}},N=[`Combo`,`ComboCounts`,`ComboBus`,`ComboWhiteInk`,`Rows`,`Loading`,`Failed`,`Stats`,`Browse`,`Create`,`Mobile`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source},description:{story:"Combo layout, as on Home — 40px glyph, no counts, no backdrop (`bgURL='none'`).",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    counts: true
  }
}`,...C.parameters?.docs?.source},description:{story:`Combo layout with per-type counts — they resolve one by one.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    bgURL: BUS_SRC
  }
}`,...w.parameters?.docs?.source},description:{story:`Combo layout with the opt-in bus backdrop — black ink (faint watermark).`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    bgURL: BUS_SRC,
    ink: 'white'
  }
}`,...T.parameters?.docs?.source},description:{story:`Combo layout with the opt-in white-ink (embossed-negative) bus backdrop.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'rows'
  }
}`,...E.parameters?.docs?.source},description:{story:`Legacy three-row layout.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <ComboStrip ctx={CTX} types={PENDING} counts />
}`,...D.parameters?.docs?.source},description:{story:`Combo cards while every count is still pending (Skeleton).`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <ComboStrip ctx={CTX} types={FAILING} counts />,
  play: async ({
    canvasElement
  }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-testid="site-count-err"]')).toHaveLength(TYPES.length));
    canvasElement.querySelectorAll('[data-testid="site-count-err"]').forEach(el => {
      // dash hidden from AT; the visually-hidden label carries the meaning
      expect(el.querySelector('[aria-hidden="true"]')?.textContent).toBe('—');
      expect(el.textContent?.replace('—', '').trim()).not.toBe('');
    });
  }
}`,...O.parameters?.docs?.source},description:{story:`Combo cards when every count fetch fails (muted dash + tooltip; screen-reader text).`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <StatStrip ctx={CTX} />
}`,...k.parameters?.docs?.source},description:{story:`Overview metric strip only (sample figures).`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <NavGrid />
}`,...A.parameters?.docs?.source},description:{story:`Browse tiles only — links to the three list views.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <CreateRow />
}`,...j.parameters?.docs?.source},description:{story:"Create-new action row only — `/<entity>/new` links.",...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...M.parameters?.docs?.source},description:{story:"Mobile layout: the `mobile1` viewport narrows the canvas below the `sm`\nbreakpoint, so the combo cards stack in a single column.",...M.parameters?.docs?.description}}}})))()}P();export{A as Browse,S as Combo,w as ComboBus,C as ComboCounts,T as ComboWhiteInk,j as Create,O as Failed,D as Loading,M as Mobile,E as Rows,k as Stats,N as __namedExportsOrder,x as default};