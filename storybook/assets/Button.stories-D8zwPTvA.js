import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./Stack-BRXXgmTA.js";import{n as i,t as a}from"./Button-CBvBvkiU.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{i(),n(),o=t(),s=[`small`,`medium`,`large`],c=[{name:`Primary`,props:{variant:`contained`}},{name:`Secondary`,props:{variant:`outlined`}},{name:`Negative`,props:{variant:`outlined`,color:`error`}}],l={title:`components/Button`,component:a,parameters:{layout:`centered`,docs:{description:{component:`MUI's Button themed as Linje's Primary (contained), Secondary (outlined) and Negative (outlined error): 32 / 48 / 64 px, body-s / body-m / body-xl text 14 / 18 / 26 px from the edge.`}}}},u={render:()=>(0,o.jsx)(r,{spacing:2,children:c.map(({name:e,props:t})=>(0,o.jsxs)(r,{direction:`row`,spacing:2,sx:{alignItems:`center`},children:[s.map(n=>(0,o.jsx)(a,{...t,size:n,"data-testid":`${e}-${n}`,children:e},n)),(0,o.jsx)(a,{...t,disabled:!0,children:`Disabled`})]},e))})},d=[`Sizes`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Stack spacing={2}>
      {KINDS.map(({
      name,
      props
    }) => <Stack key={name} direction="row" spacing={2} sx={{
      alignItems: 'center'
    }}>
          {SIZES.map(size => <Button key={size} {...props} size={size} data-testid={\`\${name}-\${size}\`}>
              {name}
            </Button>)}
          <Button {...props} disabled>
            Disabled
          </Button>
        </Stack>)}
    </Stack>
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as Sizes,d as __namedExportsOrder,l as default};