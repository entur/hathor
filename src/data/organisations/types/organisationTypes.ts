import type { MultilingualString } from '../../netex/multilingualString';

export const ORGANISATION_TYPES = ['AUTHORITY', 'OPERATOR', 'OTHER'] as const;

export type OrganisationType = (typeof ORGANISATION_TYPES)[number];

export type Organisation = {
  id: string;
  name: MultilingualString;
  type: OrganisationType;
};

export type OrganisationContext = {
  organisations: Organisation[];
};
