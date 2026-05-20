/**
 * Shared helpers for `Vehicle-parser` + `VehicleModel-parser`. Inverse of
 * the mapping helpers: `@_x → $x`, `#text → value`, `<X ref="…"/> → 'S'`.
 *
 * Refs are looked up by XML element name and written under the domain key,
 * via a per-caller `Map<xmlKey, domKey>` — NeTEx aliases like
 * `<AuthorityRef>` (domain `TransportOrganisationRef`) and
 * `<CarModelProfileRef>` (domain `VehicleModelProfileRef`) collapse cleanly.
 *
 * NOTE: this hand-written parser/mapping mirror pair is the workaround
 * tracked by entur/netex-typescript-model#49. Once the codegen tool emits
 * bidirectional `Codec<T>` per entity (v2), this whole `netex/*-helpers.ts`
 * pair is deleted and consumers swap to `fooCodec.encode/decode`.
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

/**
 * Normalise one NeTEx multilingual-text node to `{ value, $lang? }`. Three
 * shapes occur in the wild and all must be handled:
 *   - `<Name>Foo</Name>`              → primitive `'Foo'`     (attribute-less;
 *      fast-xml-parser only emits `#text` for attribute-bearing elements)
 *   - `<Name lang="no">Foo</Name>`    → `{ '#text', '@_lang' }`  (standard NeTEx)
 *   - `<Name><Text>Foo</Text></Name>` → `{ Text: 'Foo' }`  (Sobek's exporter —
 *      confirmed via live probe; this is what the single-vehicle GET returns)
 */
function projectText(raw: unknown) {
  const node = raw && typeof raw === 'object' && 'Text' in raw ? (raw as Obj)['Text'] : raw;
  if (node == null) return {};
  if (typeof node !== 'object') return { value: String(node) };
  const n = node as Obj;
  const t: { value?: string; $lang?: string; $textIdType?: string } = {};
  if (n['#text'] !== undefined) t.value = String(n['#text']);
  if (n['@_lang'] !== undefined) t.$lang = String(n['@_lang']);
  if (n['@_textIdType'] !== undefined) t.$textIdType = String(n['@_textIdType']);
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
