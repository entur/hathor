/**
 * Object returned by `fast-xml-parser`'s `XMLParser.parse()`.
 * Keys correspond to XML element names; values are nested objects, arrays,
 * or primitives depending on the XML structure. Typed as `Record<string, any>`
 * because the parser's return type is `any` — the actual shape is only known
 * at runtime from the XML content.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedXml = Record<string, any>;

// container for RegNo+xml
export type FramesByQueryRegNumber = Record<string, ParsedXml>;

/** A single item to import — reg number with optional metadata from CSV columns */
export interface ImportEntry {
  queryRegNumber: string;
  operationalRef?: string;
}
