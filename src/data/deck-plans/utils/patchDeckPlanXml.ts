import { XMLBuilder } from 'fast-xml-parser';
import { findResourceFrame, toArray, verbatimXmlParser } from '../../netex/xmlUtils.ts';
import type { ParsedXml } from '../../netex/xmlUtils.ts';
import type { Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Builder options mirroring the import POST's own serialization. */
const BUILD_OPTS = { ignoreAttributes: false, format: true, suppressEmptyNode: true };

/**
 * DataManagedObject header elements of a `DeckPlan`, in the NeTEx
 * `xsd:sequence` order Sobek emits them. Everything else a document carries
 * (`decks`, `deckLevels`, …) follows, keeping its own relative order.
 */
const HEADER_KEYS = ['ValidBetween', 'keyList', 'Name', 'ShortName', 'Description'];

/** Parsed `<Name>`/`<Description>` node: a `<Text>` child plus optional `lang`. */
type TextNode = { Text: string; '@_lang'?: string };

/**
 * Re-key a DeckPlan in place so its elements sit in NeTEx sequence order.
 *
 * `XMLBuilder` emits keys in insertion order, so assigning `Name` onto a
 * document that never had one appends it last — after `<decks/>`, out of the
 * `xsd:sequence` JAXB unmarshals against. Rewriting the key order fixes that
 * without disturbing the node's identity (callers hold the reference).
 */
function reorderInPlace(dp: ParsedXml): void {
  const keys = Object.keys(dp);
  const ordered = [
    ...keys.filter(k => k.startsWith('@_')),
    ...HEADER_KEYS.filter(k => k in dp),
    ...keys.filter(k => !k.startsWith('@_') && !HEADER_KEYS.includes(k)),
  ];
  const snapshot = ordered.map(k => [k, dp[k]] as const);
  for (const k of keys) delete dp[k];
  for (const [k, v] of snapshot) dp[k] = v;
}

/** Domain Name → NeTEx text node, or `undefined` when blank after trimming. */
const textNode = (n?: Name): TextNode | undefined => {
  const v = n?.value?.trim();
  if (!v) return undefined;
  return n?.lang ? { Text: v, '@_lang': n.lang } : { Text: v };
};

/**
 * Rewrite a deck plan's `Name`/`Description` inside its fetched NeTEx document
 * and re-serialize it for POSTing back to the import endpoint. This is the only
 * write path that preserves content `DeckPlanInput` cannot carry (deck geometry,
 * `ValidBetween`, frame envelope).
 *
 * Every other element, attribute and value survives verbatim — the parser is
 * {@link verbatimXmlParser} precisely so zero-padded seat labels and
 * trailing-zero dimensions are not coerced to numbers. The original bytes do
 * not survive: the parse/build round-trip normalizes whitespace and
 * indentation, and re-keys the patched `DeckPlan` into NeTEx sequence order.
 *
 * `keyList` is dropped before rebuilding: Sobek merges an incoming keyList into
 * the stored one by appending, so echoing it back doubles the `imported-id`
 * entries on every write (sobek#180). Omitting it lets Sobek re-derive the
 * canonical set, which is idempotent and repairs already-doubled rows.
 *
 * @param xml         Raw NeTEx document as fetched from `/netex/deckplans/<id>`.
 * @param id          Full NeTEx id of the DeckPlan node to patch.
 * @param name        New name; blank/whitespace removes the `<Name>` element.
 * @param description New description; blank/whitespace removes `<Description>`.
 * @returns The rebuilt document as an XML string.
 * @throws If the document carries no `DeckPlan` with the given id — a silent
 *   no-op POST would report success while persisting nothing.
 */
export function patchDeckPlanXml(xml: string, id: string, name?: Name, description?: Name): string {
  const parsed = verbatimXmlParser.parse(xml);
  const frame = findResourceFrame(parsed);
  const dp = toArray(frame?.deckPlans?.DeckPlan).find(n => n['@_id'] === id);
  if (!dp) throw new Error(`DeckPlan ${id} not found in document`);

  delete dp.keyList;

  const nameNode = textNode(name);
  const descNode = textNode(description);
  if (nameNode) dp.Name = nameNode;
  else delete dp.Name;
  if (descNode) dp.Description = descNode;
  else delete dp.Description;
  reorderInPlace(dp);

  return new XMLBuilder(BUILD_OPTS).build(parsed);
}
