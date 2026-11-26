/** Sobek `DeactivateInput` — the shared input of the three `deactivate*` mutations. */
export interface DeactivateInput {
  netexId: string;
  version: number;
  deactivateAt: string;
}
