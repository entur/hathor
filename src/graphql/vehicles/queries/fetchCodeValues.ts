import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';

const codeValuesDocument = gql`
  query CodeValues($filter: CodeValuesFilter!, $size: Int) {
    codeValues(filter: $filter, size: $size) {
      content {
        label
        value
      }
    }
  }
`;

/** Sobek `CodeValuesFilter` — the `codeValues(filter:)` argument. */
export type CodeValuesFilter = { valueType: string };

/** Variables of the `CodeValues` query. */
export type CodeValuesQueryVariables = {
  filter: CodeValuesFilter;
  size?: number;
};

/** Result of the `CodeValues` query: the code values of one list, as selected above. */
export type CodeValuesQuery = {
  codeValues: {
    content: { label: string; value: string }[];
  };
};

export const fetchCodeValuesRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables: CodeValuesQueryVariables
) => request<CodeValuesQuery>(applicationBaseUrl, codeValuesDocument, variables, authHeader(token));
