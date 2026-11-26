import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { MultilingualString } from '../../../data/netex/multilingualString.ts';

const deckPlansDocument = gql`
  query DeckPlans($page: Int, $size: Int, $filter: DeckPlanFilter) {
    deckPlans(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        name {
          value
          lang
        }
        description {
          value
          lang
        }
        version
      }
      totalElements
      page
      size
    }
  }
`;

/** Sobek `DeckPlanFilter` — the `deckPlans(filter:)` argument. */
export type DeckPlanFilter = {
  netexIds?: string[];
  transportModes?: string[];
  dataOwnerRef: string;
};

/** Variables of the `DeckPlans` query. */
export type DeckPlansQueryVariables = { page?: number; size?: number; filter?: DeckPlanFilter };

/** Result of the `DeckPlans` query: one page of deck plans, as selected above. */
export type DeckPlansQuery = {
  deckPlans: {
    content: {
      netexId: string;
      name?: MultilingualString | null;
      description?: MultilingualString | null;
      version: number;
    }[];
    totalElements: number;
    page: number;
    size: number;
  };
};

export const fetchDeckPlansRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: DeckPlansQueryVariables
) => request<DeckPlansQuery>(applicationBaseUrl, deckPlansDocument, variables, authHeader(token));
