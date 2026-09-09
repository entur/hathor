import{i as e}from"./preload-helper-xPQekRTU.js";import{at as t,kt as n,l as r,o as i}from"./iframe-D7q1UzBu.js";import{i as a,n as o,r as s,t as c}from"./FormLayout-B0P9ohtJ.js";var l,u,d,f,p,m,h;e((()=>{i(),a(),l=n(),u={title:`components/FormLayout`,component:o,parameters:{layout:`padded`,docs:{description:{component:`Container-query-aware two-column form grid. Stacks (single column) when the nearest inline-size container is narrower than 22rem.`}}}},d={render:()=>(0,l.jsxs)(o,{children:[(0,l.jsx)(c,{id:`f-name`,label:`Name`,children:(0,l.jsx)(r,{id:`f-name`,size:`small`,fullWidth:!0,defaultValue:`ER34-001`})}),(0,l.jsx)(c,{id:`f-reg`,label:`Registration number`,children:(0,l.jsx)(r,{id:`f-reg`,size:`small`,fullWidth:!0,defaultValue:`EW 12345`})}),(0,l.jsx)(c,{id:`f-notes`,label:`Notes`,alignTop:!0,children:(0,l.jsx)(r,{id:`f-notes`,size:`small`,fullWidth:!0,multiline:!0,rows:3})})]})},f={render:()=>(0,l.jsxs)(o,{children:[(0,l.jsx)(s,{label:`Codespace`,children:`NSR`}),(0,l.jsx)(s,{label:`Type`,children:`VehicleType`}),(0,l.jsx)(s,{label:`Created`,children:`2026-05-29`})]})},p={render:()=>(0,l.jsxs)(o,{children:[(0,l.jsx)(s,{label:`Id`,children:`NSR:VehicleType:1234`}),(0,l.jsx)(c,{id:`m-name`,label:`Name`,children:(0,l.jsx)(r,{id:`m-name`,size:`small`,fullWidth:!0,defaultValue:`Type 73`})}),(0,l.jsx)(s,{label:`Read-only field`,children:`cannot edit`})]})},m={render:()=>(0,l.jsx)(t,{sx:{width:`20rem`,border:`1px dashed`,borderColor:`divider`,p:2},children:(0,l.jsxs)(o,{children:[(0,l.jsx)(c,{id:`n-name`,label:`Name`,children:(0,l.jsx)(r,{id:`n-name`,size:`small`,fullWidth:!0,defaultValue:`ER34-001`})}),(0,l.jsx)(c,{id:`n-reg`,label:`Registration number`,children:(0,l.jsx)(r,{id:`n-reg`,size:`small`,fullWidth:!0,defaultValue:`EW 12345`})})]})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <FormLayout>
      <FieldRow id="f-name" label="Name">
        <TextField id="f-name" size="small" fullWidth defaultValue="ER34-001" />
      </FieldRow>
      <FieldRow id="f-reg" label="Registration number">
        <TextField id="f-reg" size="small" fullWidth defaultValue="EW 12345" />
      </FieldRow>
      <FieldRow id="f-notes" label="Notes" alignTop>
        <TextField id="f-notes" size="small" fullWidth multiline rows={3} />
      </FieldRow>
    </FormLayout>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <FormLayout>
      <MetaRow label="Codespace">NSR</MetaRow>
      <MetaRow label="Type">VehicleType</MetaRow>
      <MetaRow label="Created">2026-05-29</MetaRow>
    </FormLayout>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <FormLayout>
      <MetaRow label="Id">NSR:VehicleType:1234</MetaRow>
      <FieldRow id="m-name" label="Name">
        <TextField id="m-name" size="small" fullWidth defaultValue="Type 73" />
      </FieldRow>
      <MetaRow label="Read-only field">cannot edit</MetaRow>
    </FormLayout>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Box sx={{
    width: '20rem',
    border: '1px dashed',
    borderColor: 'divider',
    p: 2
  }}>
      <FormLayout>
        <FieldRow id="n-name" label="Name">
          <TextField id="n-name" size="small" fullWidth defaultValue="ER34-001" />
        </FieldRow>
        <FieldRow id="n-reg" label="Registration number">
          <TextField id="n-reg" size="small" fullWidth defaultValue="EW 12345" />
        </FieldRow>
      </FormLayout>
    </Box>
}`,...m.parameters?.docs?.source},description:{story:`Constrains the wrapping Box to 20rem so FormLayout's container query
(\`@container (min-width: 22rem)\`) misses and the grid collapses to a
single column. Resize your browser — the canvas-level layout doesn't
matter; only the wrapping Box's width does.`,...m.parameters?.docs?.description}}},h=[`Editable`,`ReadOnly`,`Mixed`,`NarrowContainer`]}))();export{d as Editable,p as Mixed,m as NarrowContainer,f as ReadOnly,h as __namedExportsOrder,u as default};