import { SobekProvider, VehicleTypeForm } from '@entur/mui-comps-nmr';

import { useAuth } from '../auth';
import { useConfig } from '../contexts/configContext';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext';

export default function Elem() {
  const { applicationBaseUrl } = useConfig();
  const auth = useAuth();
  const { currentOrganisation } = useOrganisationsContext();

  const getHeaders = async (): Promise<Record<string, string>> => ({
    Authorization: `Bearer ${await auth.getAccessToken()}`,
  });

  // `applicationBaseUrl` lands async from public/config.json and the org comes
  // from the picker — both are legitimately absent on first paint, so gate the
  // provider instead of asserting the required SobekCtx fields non-null.
  if (!applicationBaseUrl || !currentOrganisation) return null;

  return (
    <SobekProvider
      value={{
        endpoint: applicationBaseUrl,
        getHeaders,
        dataOwnerRef: currentOrganisation.id,
      }}
    >
      <h2>Hello gql</h2>
      <VehicleTypeForm netexId="" />
    </SobekProvider>
  );
}
