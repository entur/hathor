import { useCallback, useEffect, useState } from 'react';
import { normalizeXML, type Vehicle } from '@entur/vehicle-details';
import { useAuth } from '../../auth/authUtils.ts';
import { useConfig } from '../../contexts/configContext.ts';
import { extractVehicleFromPublicationDelivery, fetchVehicleNetexXml } from './vehicleExport.ts';

export function useVehicle(id: string | undefined) {
  const [data, setData] = useState<Partial<Vehicle> | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const doFetch = useCallback(async () => {
    if (!applicationImportBaseUrl || !id) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const xml = await fetchVehicleNetexXml(applicationImportBaseUrl, id, token);
      const parsed = extractVehicleFromPublicationDelivery(xml);
      if (!parsed) {
        setData(null);
        setError(`Vehicle "${id}" not found`);
      } else {
        setData(normalizeXML(parsed));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [applicationImportBaseUrl, id, getAccessToken]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
