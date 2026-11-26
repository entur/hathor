import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./react-BbeNlDUO.js";import{t as n}from"./jsx-runtime-BB9-612F.js";import{n as r,t as i}from"./Box-C0BOFjz-.js";import{a,l as o,n as s,r as c,t as l}from"./form-layout-PDBGI76M.js";import{n as u,t as d}from"./Typography-Df7J5NOK.js";import{n as f,t as p}from"./Chip-B4Y5YBYm.js";import{a as m,t as h}from"./collection-BlzMIiYu.js";import{n as g,t as _}from"./useTranslation-DWliA1VU.js";import{a as v,i as y,n as b,o as ee,r as te,s as ne}from"./FormFields-Dn7jfSfJ.js";import{t as x,u as S}from"./chunk-YDNE64FV-B8wt3vL7.js";import{n as C,t as w}from"./featureFlags-DqTHKA9O.js";import{n as re,t as T}from"./bus-picture-CnjEQY71.js";import{i as E,r as D,t as O}from"./transportMode-DhjbAMrW.js";import{n as k,t as A}from"./vehicleTypeFields-BZk48PeA.js";import{n as j,t as M}from"./multilingualString-DoqO4C_w.js";import{i as N,n as P,r as F,t as ie}from"./vehicleTypeLayout-CQ5N7myT.js";function ae(e,t){let[n,r]=(0,I.useState)(e);return(0,I.useEffect)(()=>{let n=setTimeout(()=>r(e),t);return()=>clearTimeout(n)},[e,t]),n}var I;function L(){return(L=e((()=>{I=t()})))()}var R;function z(){return(z=e((()=>{R=e=>`/vehicles/${encodeURIComponent(e)}`})))()}var B;function V(){return(V=e((()=>{B=(e,t)=>t&&!e.some(e=>e.value===t)?[{value:t,label:t},...e]:e})))()}function H({value:e,onChange:t,mode:n,euroClasses:r}){let{t:a}=g(),o=(0,U.useMemo)(()=>O.map(e=>({value:e,label:a(E(e),e)})),[a]),s={readOnly:n===`view`},c=e=>a(`vehicleType.field.${e}`),l=n=>t({...e,...n}),u=n=>{let r={...e.passengerCapacity,...n},i=Object.values(r).some(e=>e!=null);t({...e,passengerCapacity:i?r:void 0})};return t=>{switch(t){case`name`:return(0,W.jsx)(ee,{id:`vtype-name`,label:c(t),value:e.name?.value??``,onChange:t=>l({name:j(e.name,t)}),...s});case`transportMode`:return(0,W.jsx)(v,{id:`vtype-transport-mode`,label:c(t),value:e.transportMode,options:o,noneLabel:a(`common.none`),onChange:e=>l({transportMode:e}),...s});case`euroClass`:return(0,W.jsx)(v,{id:`vtype-euro-class`,label:c(t),value:e.euroClass,options:B(r,e.euroClass),noneLabel:a(`common.none`),onChange:e=>l({euroClass:e}),...s});case`vehicles`:return(0,W.jsx)(i,{sx:{display:`flex`,flexWrap:`wrap`,gap:.5,px:1,py:.5},children:e.vehicles?.length?e.vehicles.map(e=>(0,W.jsx)(p,{component:x,to:R(e.id),clickable:!0,size:`small`,variant:`outlined`,label:(0,W.jsxs)(W.Fragment,{children:[e.registrationNumber,e.operationalNumber&&(0,W.jsxs)(i,{component:`span`,sx:{color:`primary.main`,ml:.5},children:[`(`,e.operationalNumber,`)`]})]})},e.id)):(0,W.jsx)(d,{variant:`body2`,sx:{color:`text.secondary`},children:a(`vehicleType.noVehicles`)})})}let n=k[t],f=m(e,n),h=e=>l({[t]:e});switch(n.kind){case`number`:{let e=n.path[0]===`passengerCapacity`;return(0,W.jsx)(y,{id:e?`vtype-cap-${t}`:`vtype-${t}`,label:c(t),value:f,onChange:e?e=>u({[t]:e}):h,...s})}case`switch`:return(0,W.jsx)(te,{id:`vtype-${G(t)}`,label:c(t),checked:!!f,onChange:h,...s});case`enum`:return(0,W.jsx)(v,{id:`vtype-${G(t)}`,label:c(t),value:f,options:(n.options??[]).map(e=>({value:e,label:e})),noneLabel:a(`common.none`),onChange:h,...s});case`enumMulti`:return(0,W.jsx)(b,{id:`vtype-${G(t)}`,label:c(t),multiple:!0,options:n.options??[],value:f??[],onChange:(e,t)=>h(t.length?t:void 0),disableCloseOnSelect:!0,...s});default:return null}}}var U,W,G;function K(){return(K=e((()=>{U=t(),r(),f(),u(),S(),_(),ne(),D(),z(),M(),A(),h(),V(),W=n(),G=e=>e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)})))()}function q({isCreate:e,showVehicles:t=!0,...n}){let{t:r}=g(),i=H(n),s=C()(`BusPictures`),c=(0,Y.useMemo)(()=>{let n=Object.fromEntries(ie.filter(n=>!e&&!!t||n!==`vehicles`).map(e=>[e,N[e]]));return o(k,n)},[e,t]),{value:l}=n,{length:u,width:d,height:f}=l,p=ae((0,Y.useMemo)(()=>({length:u,width:d,height:f}),[u,d,f]),Z);return(0,X.jsx)(a,{sections:c,renderField:e=>i(e.key),tocLabel:r(`formSections.toc`),sectionLabel:e=>r(P[e]),aside:s?(0,X.jsx)(re,{dims:p,paint:`vehicleType`,mode:l.transportMode}):void 0})}function J(){let{t:e}=g(),t=C()(`BusPictures`);return(0,X.jsx)(s,{sections:Q,fields:k,tocLabel:e(`formSections.toc`),sectionLabel:t=>e(P[t]),aside:t?(0,X.jsx)(c,{}):void 0})}var Y,X,Z,Q;function $(){return($=e((()=>{Y=t(),_(),T(),l(),w(),L(),K(),A(),F(),X=n(),Z=400,Q=o(k,N),q.__docgenInfo={description:`The form page's VehicleType body (#280): \`vehicleTypeSections\` stacked, with
the table of contents (V3) and the type drawn as a bus above it. View mode is
read-only, not greyed out.

@param {VehicleTypeSectionsProps} props value, onChange, mode, euro classes, create flag
@returns {JSX.Element} the sections, their table of contents and the picture`,methods:[],displayName:`VehicleTypeSections`,props:{value:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  id: string;
  version: number;
  /** Undefined on a create: Sobek defaults to VEHICLE_TYPE. */
  subtype?: VehicleTypeSubtype;
  /** Set only for the train subtypes; sent back untouched on save. */
  train?: TrainParts;
  name?: MultilingualString;
  shortName?: MultilingualString;
  description?: MultilingualString;
  transportMode?: TransportMode;
  deckPlan?: DeckPlan;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  lowFloor?: boolean;
  // Propulsion & performance (Edit tab)
  propulsionTypes?: PropulsionType[];
  fuelTypes?: FuelType[];
  selfPropelled?: boolean;
  euroClass?: string;
  maximumVelocity?: number;
  maximumRange?: number;
  // Environmental extras (Environment tab) — first-class in Sobek's schema
  formDragCoefficient?: number;
  rollResistanceCoefficient?: number;
  maximumEngineEffectKW?: number;
  hybridCategory?: HybridCategory;
  passengerCapacity?: PassengerCapacity;
  created?: string;
  changed?: string;
  changedBy?: string;
  vehicles?: {
    id: string;
    registrationNumber: string;
    operationalNumber?: string;
    version: number;
  }[];
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!0}},{key:`subtype`,value:{name:`unknown[number]`,raw:`(typeof VEHICLE_TYPE_SUBTYPES)[number]`,required:!1},description:`Undefined on a create: Sobek defaults to VEHICLE_TYPE.`},{key:`train`,value:{name:`signature`,type:`object`,raw:`{
  numberOfCars?: number | null;
  trainSizeType?: TrainSize | null;
  trainElementType?: TrainElementType | null;
  trainComponents?: TrainComponentInput[] | null;
  compoundTrainComponents?: TrainInCompoundTrainInput[] | null;
}`,signature:{properties:[{key:`numberOfCars`,value:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}],required:!1}},{key:`trainSizeType`,value:{name:`union`,raw:`TrainSize | null`,elements:[{name:`unknown[number]`,raw:`(typeof TRAIN_SIZES)[number]`},{name:`null`}],required:!1}},{key:`trainElementType`,value:{name:`union`,raw:`TrainElementType | null`,elements:[{name:`unknown[number]`,raw:`(typeof TRAIN_ELEMENT_TYPES)[number]`},{name:`null`}],required:!1}},{key:`trainComponents`,value:{name:`union`,raw:`TrainComponentInput[] | null`,elements:[{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  trainElement: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
  forwardCouplingThroughAccess?: ThroughAccess | null;
}`,signature:{properties:[{key:`netexId`,value:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}],required:!1}},{key:`label`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`description`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`trainElement`,value:{name:`signature`,type:`object`,raw:`{ netexId: string }`,signature:{properties:[{key:`netexId`,value:{name:`string`,required:!0}}]},required:!0}},{key:`operationalOrientation`,value:{name:`union`,raw:`VehicleOrientation | null`,elements:[{name:`unknown[number]`,raw:`(typeof VEHICLE_ORIENTATIONS)[number]`},{name:`null`}],required:!1}},{key:`forwardCouplingThroughAccess`,value:{name:`union`,raw:`ThroughAccess | null`,elements:[{name:`unknown[number]`,raw:`(typeof THROUGH_ACCESSES)[number]`},{name:`null`}],required:!1}}]}}],raw:`TrainComponentInput[]`},{name:`null`}],required:!1}},{key:`compoundTrainComponents`,value:{name:`union`,raw:`TrainInCompoundTrainInput[] | null`,elements:[{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  train: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
}`,signature:{properties:[{key:`netexId`,value:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}],required:!1}},{key:`label`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`description`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`train`,value:{name:`signature`,type:`object`,raw:`{ netexId: string }`,signature:{properties:[{key:`netexId`,value:{name:`string`,required:!0}}]},required:!0}},{key:`operationalOrientation`,value:{name:`union`,raw:`VehicleOrientation | null`,elements:[{name:`unknown[number]`,raw:`(typeof VEHICLE_ORIENTATIONS)[number]`},{name:`null`}],required:!1}}]}}],raw:`TrainInCompoundTrainInput[]`},{name:`null`}],required:!1}}]},required:!1},description:`Set only for the train subtypes; sent back untouched on save.`},{key:`name`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`shortName`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`transportMode`,value:{name:`unknown[number]`,raw:`(typeof TRANSPORT_MODES)[number]`,required:!1}},{key:`deckPlan`,value:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: MultilingualString;
  description?: MultilingualString;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]},required:!1}},{key:`length`,value:{name:`number`,required:!1}},{key:`width`,value:{name:`number`,required:!1}},{key:`height`,value:{name:`number`,required:!1}},{key:`weight`,value:{name:`number`,required:!1}},{key:`lowFloor`,value:{name:`boolean`,required:!1}},{key:`propulsionTypes`,value:{name:`Array`,elements:[{name:`unknown[number]`,raw:`(typeof PROPULSION_TYPES)[number]`}],raw:`PropulsionType[]`,required:!1}},{key:`fuelTypes`,value:{name:`Array`,elements:[{name:`unknown[number]`,raw:`(typeof FUEL_TYPES)[number]`}],raw:`FuelType[]`,required:!1}},{key:`selfPropelled`,value:{name:`boolean`,required:!1}},{key:`euroClass`,value:{name:`string`,required:!1}},{key:`maximumVelocity`,value:{name:`number`,required:!1}},{key:`maximumRange`,value:{name:`number`,required:!1}},{key:`formDragCoefficient`,value:{name:`number`,required:!1}},{key:`rollResistanceCoefficient`,value:{name:`number`,required:!1}},{key:`maximumEngineEffectKW`,value:{name:`number`,required:!1}},{key:`hybridCategory`,value:{name:`unknown[number]`,raw:`(typeof HYBRID_CATEGORIES)[number]`,required:!1}},{key:`passengerCapacity`,value:{name:`signature`,type:`object`,raw:`{
  totalCapacity?: number;
  seatingCapacity?: number;
  standingCapacity?: number;
  pushchairCapacity?: number;
  wheelchairPlaceCapacity?: number;
  pramPlaceCapacity?: number;
  bicycleRackCapacity?: number;
}`,signature:{properties:[{key:`totalCapacity`,value:{name:`number`,required:!1}},{key:`seatingCapacity`,value:{name:`number`,required:!1}},{key:`standingCapacity`,value:{name:`number`,required:!1}},{key:`pushchairCapacity`,value:{name:`number`,required:!1}},{key:`wheelchairPlaceCapacity`,value:{name:`number`,required:!1}},{key:`pramPlaceCapacity`,value:{name:`number`,required:!1}},{key:`bicycleRackCapacity`,value:{name:`number`,required:!1}}]},required:!1}},{key:`created`,value:{name:`string`,required:!1}},{key:`changed`,value:{name:`string`,required:!1}},{key:`changedBy`,value:{name:`string`,required:!1}},{key:`vehicles`,value:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  registrationNumber: string;
  operationalNumber?: string;
  version: number;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`registrationNumber`,value:{name:`string`,required:!0}},{key:`operationalNumber`,value:{name:`string`,required:!1}},{key:`version`,value:{name:`number`,required:!0}}]}}],raw:`{
  id: string;
  registrationNumber: string;
  operationalNumber?: string;
  version: number;
}[]`,required:!1}}]}},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(next: VehicleType) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  id: string;
  version: number;
  /** Undefined on a create: Sobek defaults to VEHICLE_TYPE. */
  subtype?: VehicleTypeSubtype;
  /** Set only for the train subtypes; sent back untouched on save. */
  train?: TrainParts;
  name?: MultilingualString;
  shortName?: MultilingualString;
  description?: MultilingualString;
  transportMode?: TransportMode;
  deckPlan?: DeckPlan;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  lowFloor?: boolean;
  // Propulsion & performance (Edit tab)
  propulsionTypes?: PropulsionType[];
  fuelTypes?: FuelType[];
  selfPropelled?: boolean;
  euroClass?: string;
  maximumVelocity?: number;
  maximumRange?: number;
  // Environmental extras (Environment tab) — first-class in Sobek's schema
  formDragCoefficient?: number;
  rollResistanceCoefficient?: number;
  maximumEngineEffectKW?: number;
  hybridCategory?: HybridCategory;
  passengerCapacity?: PassengerCapacity;
  created?: string;
  changed?: string;
  changedBy?: string;
  vehicles?: {
    id: string;
    registrationNumber: string;
    operationalNumber?: string;
    version: number;
  }[];
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!0}},{key:`subtype`,value:{name:`unknown[number]`,raw:`(typeof VEHICLE_TYPE_SUBTYPES)[number]`,required:!1},description:`Undefined on a create: Sobek defaults to VEHICLE_TYPE.`},{key:`train`,value:{name:`signature`,type:`object`,raw:`{
  numberOfCars?: number | null;
  trainSizeType?: TrainSize | null;
  trainElementType?: TrainElementType | null;
  trainComponents?: TrainComponentInput[] | null;
  compoundTrainComponents?: TrainInCompoundTrainInput[] | null;
}`,signature:{properties:[{key:`numberOfCars`,value:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}],required:!1}},{key:`trainSizeType`,value:{name:`union`,raw:`TrainSize | null`,elements:[{name:`unknown[number]`,raw:`(typeof TRAIN_SIZES)[number]`},{name:`null`}],required:!1}},{key:`trainElementType`,value:{name:`union`,raw:`TrainElementType | null`,elements:[{name:`unknown[number]`,raw:`(typeof TRAIN_ELEMENT_TYPES)[number]`},{name:`null`}],required:!1}},{key:`trainComponents`,value:{name:`union`,raw:`TrainComponentInput[] | null`,elements:[{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  trainElement: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
  forwardCouplingThroughAccess?: ThroughAccess | null;
}`,signature:{properties:[{key:`netexId`,value:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}],required:!1}},{key:`label`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`description`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`trainElement`,value:{name:`signature`,type:`object`,raw:`{ netexId: string }`,signature:{properties:[{key:`netexId`,value:{name:`string`,required:!0}}]},required:!0}},{key:`operationalOrientation`,value:{name:`union`,raw:`VehicleOrientation | null`,elements:[{name:`unknown[number]`,raw:`(typeof VEHICLE_ORIENTATIONS)[number]`},{name:`null`}],required:!1}},{key:`forwardCouplingThroughAccess`,value:{name:`union`,raw:`ThroughAccess | null`,elements:[{name:`unknown[number]`,raw:`(typeof THROUGH_ACCESSES)[number]`},{name:`null`}],required:!1}}]}}],raw:`TrainComponentInput[]`},{name:`null`}],required:!1}},{key:`compoundTrainComponents`,value:{name:`union`,raw:`TrainInCompoundTrainInput[] | null`,elements:[{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  netexId?: string | null;
  label?: MultilingualString | null;
  description?: MultilingualString | null;
  train: { netexId: string };
  operationalOrientation?: VehicleOrientation | null;
}`,signature:{properties:[{key:`netexId`,value:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}],required:!1}},{key:`label`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`description`,value:{name:`union`,raw:`MultilingualString | null`,elements:[{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1},{name:`null`}],required:!1}},{key:`train`,value:{name:`signature`,type:`object`,raw:`{ netexId: string }`,signature:{properties:[{key:`netexId`,value:{name:`string`,required:!0}}]},required:!0}},{key:`operationalOrientation`,value:{name:`union`,raw:`VehicleOrientation | null`,elements:[{name:`unknown[number]`,raw:`(typeof VEHICLE_ORIENTATIONS)[number]`},{name:`null`}],required:!1}}]}}],raw:`TrainInCompoundTrainInput[]`},{name:`null`}],required:!1}}]},required:!1},description:`Set only for the train subtypes; sent back untouched on save.`},{key:`name`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`shortName`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`transportMode`,value:{name:`unknown[number]`,raw:`(typeof TRANSPORT_MODES)[number]`,required:!1}},{key:`deckPlan`,value:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: MultilingualString;
  description?: MultilingualString;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{ value: string; lang?: string }`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]},required:!1}},{key:`length`,value:{name:`number`,required:!1}},{key:`width`,value:{name:`number`,required:!1}},{key:`height`,value:{name:`number`,required:!1}},{key:`weight`,value:{name:`number`,required:!1}},{key:`lowFloor`,value:{name:`boolean`,required:!1}},{key:`propulsionTypes`,value:{name:`Array`,elements:[{name:`unknown[number]`,raw:`(typeof PROPULSION_TYPES)[number]`}],raw:`PropulsionType[]`,required:!1}},{key:`fuelTypes`,value:{name:`Array`,elements:[{name:`unknown[number]`,raw:`(typeof FUEL_TYPES)[number]`}],raw:`FuelType[]`,required:!1}},{key:`selfPropelled`,value:{name:`boolean`,required:!1}},{key:`euroClass`,value:{name:`string`,required:!1}},{key:`maximumVelocity`,value:{name:`number`,required:!1}},{key:`maximumRange`,value:{name:`number`,required:!1}},{key:`formDragCoefficient`,value:{name:`number`,required:!1}},{key:`rollResistanceCoefficient`,value:{name:`number`,required:!1}},{key:`maximumEngineEffectKW`,value:{name:`number`,required:!1}},{key:`hybridCategory`,value:{name:`unknown[number]`,raw:`(typeof HYBRID_CATEGORIES)[number]`,required:!1}},{key:`passengerCapacity`,value:{name:`signature`,type:`object`,raw:`{
  totalCapacity?: number;
  seatingCapacity?: number;
  standingCapacity?: number;
  pushchairCapacity?: number;
  wheelchairPlaceCapacity?: number;
  pramPlaceCapacity?: number;
  bicycleRackCapacity?: number;
}`,signature:{properties:[{key:`totalCapacity`,value:{name:`number`,required:!1}},{key:`seatingCapacity`,value:{name:`number`,required:!1}},{key:`standingCapacity`,value:{name:`number`,required:!1}},{key:`pushchairCapacity`,value:{name:`number`,required:!1}},{key:`wheelchairPlaceCapacity`,value:{name:`number`,required:!1}},{key:`pramPlaceCapacity`,value:{name:`number`,required:!1}},{key:`bicycleRackCapacity`,value:{name:`number`,required:!1}}]},required:!1}},{key:`created`,value:{name:`string`,required:!1}},{key:`changed`,value:{name:`string`,required:!1}},{key:`changedBy`,value:{name:`string`,required:!1}},{key:`vehicles`,value:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  registrationNumber: string;
  operationalNumber?: string;
  version: number;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`registrationNumber`,value:{name:`string`,required:!0}},{key:`operationalNumber`,value:{name:`string`,required:!1}},{key:`version`,value:{name:`number`,required:!0}}]}}],raw:`{
  id: string;
  registrationNumber: string;
  operationalNumber?: string;
  version: number;
}[]`,required:!1}}]}},name:`next`}],return:{name:`void`}}},description:``},mode:{required:!0,tsType:{name:`union`,raw:`'view' | 'edit'`,elements:[{name:`literal`,value:`'view'`},{name:`literal`,value:`'edit'`}]},description:``},euroClasses:{required:!0,tsType:{name:`unknown`},description:``},isCreate:{required:!0,tsType:{name:`boolean`},description:`A create: a record not yet saved has no vehicles to list.`},showVehicles:{required:!1,tsType:{name:`boolean`},description:`List the linked vehicles (default): false for a kind vehicles can't refer to.`,defaultValue:{value:`true`,computed:!1}}}},J.__docgenInfo={description:`The form's shape while the record loads: every section in skeleton blocks, the picture's
place in column 3.

@returns {JSX.Element} the skeleton sections`,methods:[],displayName:`VehicleTypeSectionsSkeleton`}})))()}export{J as n,$ as r,q as t};