import { XMLBuilder } from 'fast-xml-parser';
import { findResourceFrame, toArray, xmlParser } from '../../netex/xmlUtils.ts';
import type { Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Builder options mirroring the import POST's own serialization. */
const BUILD_OPTS = { ignoreAttributes: false, format: true, suppressEmptyNode: true };

/** Parsed `<Name>`/`<Description>` node: a `<Text>` child plus optional `lang`. */
type TextNode = { Text: string; '@_lang'?: string };

/** Domain Name → NeTEx text node, or `undefined` when blank after trimming. */
const textNode = (n?: Name): TextNode | undefined => {
  const v = n?.value?.trim();
  if (!v) return undefined;
  return n?.lang ? { Text: v, '@_lang': n.lang } : { Text: v };
};

/**
 * Rewrite a deck plan's `Name`/`Description` inside its fetched NeTEx document,
 * leaving every other element untouched so the whole body can be POSTed back to
 * the import endpoint. This is the only write path that preserves content
 * `DeckPlanInput` cannot carry (deck geometry, `ValidBetween`, frame envelope).
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
  const parsed = xmlParser.parse(xml);
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

  return new XMLBuilder(BUILD_OPTS).build(parsed);
}
