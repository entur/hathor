import type { ParsedXml } from '../netex/xmlUtils';
export type { ParsedXml };

// container for RegNo+xml
export type FramesByQueryRegNumber = Record<string, ParsedXml>;

/** A single item to import — reg number with optional metadata from CSV columns */
export interface ImportEntry {
  queryRegNumber: string;
  operationalRef?: string;
}
