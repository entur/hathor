/** A single item to import — reg number with optional metadata from CSV columns */
export interface ImportEntry {
  queryRegNumber: string;
  operationalRef?: string;
}
