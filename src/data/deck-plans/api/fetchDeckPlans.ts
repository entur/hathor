import type { AccessToken } from '../../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext } from '../types/deckPlanTypes.ts';
import type { DeckPlan, Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';

/**
 * Sobek `DeckPlanInput` — the mutation-accepted shape (mirrors `input
 * DeckPlanInput` in the SDL). Strict subset of the fetched {@link DeckPlanWire}:
 * no `version` (server-managed; Sobek resolves the live version by `netexId`).
 * `dataOwnerRef` is a required input field, threaded in by the caller (current
 * organisation). Mirrors the `<Entity>Input` convention used by
 * `VehicleTypeInput`.
 */
export interface DeckPlanInput {
  netexId?: string | null;
  /** Owning organisation ref (NeTEx codespace). Required by Sobek `DeckPlanInput`. */
  dataOwnerRef: string;
  name?: Name | null;
  description?: Name | null;
}

interface DeckPlanWire {
  netexId: string;
  name?: Name | null;
  description?: Name | null;
  version: number;
}

const projectDeckPlan = (dp: DeckPlanWire): DeckPlan => ({
  id: dp.netexId,
  name: dp.name ?? undefined,
  description: dp.description ?? undefined,
  version: dp.version,
});

/**
 * Trim a NeTEx name, nulling it when nothing survives. The edit path trims via
 * `patchDeckPlanXml`; without this the create path would persist padding its
 * sibling strips — and the row would read back dirty.
 */
const trimmed = (n?: Name | null): Name | null => {
  const value = n?.value?.trim();
  if (!value) return null;
  return n?.lang ? { value, lang: n.lang } : { value };
};

/**
 * Domain → input inverse of {@link projectDeckPlan}. Emits the full document
 * with blanks as explicit `null` — Sobek's `createOrUpdateDeckPlan` is a
 * full-replace, so an omitted/blank input field nulls the persisted value.
 */
export const serializeDeckPlan = (dp: DeckPlan, dataOwnerRef: string): DeckPlanInput => ({
  netexId: dp.id === '' ? undefined : dp.id,
  dataOwnerRef,
  name: trimmed(dp.name),
  description: trimmed(dp.description),
});

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw: { deckPlans: Page<DeckPlanWire> } = await fetchDeckPlansRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE, filter: { dataOwnerRef } }
  );
  return { deckPlans: raw.deckPlans.content.map(projectDeckPlan) };
};
