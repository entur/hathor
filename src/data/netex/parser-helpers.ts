/**
 * Shared helpers for `Vehicle-parser` + `VehicleModel-parser`. Inverse of
 * the mapping helpers: `@_x → $x`, `#text → value`, `<X ref="…"/> → 'S'`.
 *
 * Refs are looked up by XML element name and written under the domain key,
 * via a per-caller `Map<xmlKey, domKey>` — NeTEx aliases like
 * `<AuthorityRef>` (domain `TransportOrganisationRef`) and
 * `<CarModelProfileRef>` (domain `VehicleModelProfileRef`) collapse cleanly.
 */

export type Obj = Record<string, unknown>;
export type RefMap = ReadonlyMap<string, string>;

export function attr(raw: Obj, xmlKey: string, out: Obj, domKey: string) {
  const x = raw['@_' + xmlKey];
  if (x !== undefined) out[domKey] = x;
}

export function scalar(raw: Obj, key: string, out: Obj) {
  if (raw[key] !== undefined) out[key] = raw[key];
}

export function ref(raw: Obj, xmlKey: string, out: Obj, domKey: string) {
  const x = raw[xmlKey] as Obj | undefined;
  if (x && typeof x === 'object' && '@_ref' in x) out[domKey] = x['@_ref'];
}

export function textArr(raw: Obj, key: string, out: Obj) {
  const arr = raw[key] as Obj[] | undefined;
  if (!arr) return;
  out[key] = arr.map(projectText);
}

function projectText(raw: Obj) {
  const t: { value?: string; $lang?: string; $textIdType?: string } = {};
  if (raw['#text'] !== undefined) t.value = String(raw['#text']);
  if (raw['@_lang'] !== undefined) t.$lang = String(raw['@_lang']);
  if (raw['@_textIdType'] !== undefined) t.$textIdType = String(raw['@_textIdType']);
  return t;
}

export function projectValidBetween(raw: Obj, refMap: RefMap): Obj {
  const vb: Obj = {};
  attr(raw, 'id', vb, '$id');
  attr(raw, 'version', vb, '$version');
  scalar(raw, 'FromDate', vb);
  scalar(raw, 'ToDate', vb);
  textArr(raw, 'Name', vb);
  textArr(raw, 'Description', vb);
  for (const [xmlKey, domKey] of refMap) ref(raw, xmlKey, vb, domKey);
  return vb;
}

export function validBetweens(raw: Obj, out: Obj, refMap: RefMap) {
  const arr = raw['ValidBetween'] as Obj[] | undefined;
  if (!arr) return;
  out.ValidBetween = arr.map(vb => projectValidBetween(vb, refMap));
}
