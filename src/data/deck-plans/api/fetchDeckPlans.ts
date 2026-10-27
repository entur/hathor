import type { AccessToken } from '../../../auth/index.ts';
import {
  fetchDeckPlansRequest,
  type DeckPlansQuery,
} from '../../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { FetchById } from '../../../hooks/useEntityRecord.ts';
import type { DeckPlan, DeckPlanContext } from '../types/deckPlanTypes.ts';
import { netexName, type MultilingualString } from '../../netex/multilingualString.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';

/**
 * Sobek `DeckPlanInput` — the mutation-accepted shape (mirrors `input
 * DeckPlanInput` in the SDL). Strict subset of a fetched `DeckPlansQuery` row:
 * no `version` (server-managed; Sobek resolves the live version by `netexId`).
 * `dataOwnerRef` is a required input field, threaded in by the caller (current
 * organisation). Mirrors the `<Entity>Input` convention used by
 * `VehicleTypeInput`.
 */
export interface DeckPlanInput {
  netexId?: string | null;
  /** Owning organisation ref (NeTEx codespace). Required by Sobek `DeckPlanInput`. */
  dataOwnerRef: string;
  name?: MultilingualString | null;
  description?: MultilingualString | null;
}

/**
 * Project a GraphQL deck-plan row onto the domain `DeckPlan`.
 *
 * @param {DeckPlansQuery['deckPlans']['content'][number]} dp Row as selected by the deck-plans query.
 * @returns {DeckPlan} The domain deck plan.
 */
const projectDeckPlan = (dp: DeckPlansQuery['deckPlans']['content'][number]): DeckPlan => ({
  id: dp.netexId,
  name: dp.name ?? undefined,
  description: dp.description ?? undefined,
  version: dp.version,
});

/**
 * Domain → input inverse of {@link projectDeckPlan}. Emits the full document
 * with blanks as explicit `null` — Sobek's `createOrUpdateDeckPlan` is a
 * full-replace, so an omitted/blank input field nulls the persisted value.
 * `netexName` reports a blank name as absent; the `?? null` is that absence
 * spelled for the wire, where an omitted key would mean the same thing but
 * reads as an oversight.
 */
export const serializeDeckPlan = (dp: DeckPlan, dataOwnerRef: string): DeckPlanInput => ({
  netexId: dp.id === '' ? undefined : dp.id,
  dataOwnerRef,
  name: netexName(dp.name) ?? null,
  description: netexName(dp.description) ?? null,
});

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw = await fetchDeckPlansRequest(applicationBaseUrl, token, {
    size: FETCH_ALL_SIZE,
    filter: { dataOwnerRef },
  });
  return { deckPlans: raw.deckPlans.content.map(projectDeckPlan) };
};

/**
 * Fetch one DeckPlan by NeTEx id, fresh from Sobek.
 *
 * @param {string} id Full NeTEx id (`Codespace:DeckPlan:Number`).
 * @param {RecordFetchCtx} ctx Base URL, owning organisation and bearer token.
 * @returns The projected deck plan, or `null` when Sobek has no such record.
 */
export const fetchDeckPlanById: FetchById<DeckPlan> = async (
  id,
  { applicationBaseUrl, dataOwnerRef, token }
) => {
  const raw = await fetchDeckPlansRequest(applicationBaseUrl, token, {
    size: 1,
    filter: { netexIds: [id], dataOwnerRef },
  });
  const row = raw.deckPlans.content[0];
  return row ? projectDeckPlan(row) : null;
};
