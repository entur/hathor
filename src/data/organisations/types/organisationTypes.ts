import type { Name } from '../../vehicle-types/types/vehicleTypeTypes';

export const ORGANISATION_TYPES = ['AUTHORITY', 'OPERATOR', 'OTHER'] as const;

export type OrganisationType = (typeof ORGANISATION_TYPES)[number];

export type Organisation = {
  id: string;
  name: Name;
  type: OrganisationType;
};

export type OrganisationContext = {
  organisations: Organisation[];
};
