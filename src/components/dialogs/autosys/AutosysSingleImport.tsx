import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../contexts/configContext';
import {
  fetchVehicleFromAutosys,
  importAsNetexToBackend,
} from '../../../data/vehicle-imports/vehicleImportServices';
import type { NeTExResourceFrame } from '../../../data/vehicle-types/vehicleTypeTypes';
import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { useAuth } from '../../../auth';
import AutosysSingleQuery from './AutosysSingleQuery';
import AutosysSingleConfirm from './AutosysSingleConfirm';
import DialogTitle from '@mui/material/DialogTitle';

interface AutosysSingleImportProps {
  onClose: () => void;
}

export default function AutosysSingleImport({ onClose }: AutosysSingleImportProps) {
  const { t } = useTranslation();
  const { applicationImportBaseUrl, applicationGetAutosysUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [operationalId, setOperationalId] = useState('');
  const [neTExXML, setNeTExXML] = useState('');
  const [resourceFrame, setResourceFrame] = useState<NeTExResourceFrame | null>(null);

  const resetAndClose = () => {
    setRegistrationNumber('');
    setOperationalId('');
    setNeTExXML('');
    setResourceFrame(null);
    onClose();
  };

  const onFetch = async () => {
    const token = await getAccessToken();
    const retXML = await fetchVehicleFromAutosys(
      applicationGetAutosysUrl || '',
      registrationNumber,
      token
    );

    setNeTExXML(retXML);

    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(retXML);
    setResourceFrame(result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames.ResourceFrame);
  };

  const onConfirm = async () => {
    const token = await getAccessToken();
    await importAsNetexToBackend(applicationImportBaseUrl || '', neTExXML, token);
    resetAndClose();
  };

  return (
    <>
      <DialogTitle>{t('import.title', 'Import Vehicle')}</DialogTitle>

      {resourceFrame ? (
        <AutosysSingleConfirm
          operationalId={operationalId}
          resourceFrame={resourceFrame}
          onConfirm={onConfirm}
          onClose={resetAndClose}
        />
      ) : (
        <AutosysSingleQuery
          registrationNumber={registrationNumber}
          operationalId={operationalId}
          onRegistrationNumberChange={setRegistrationNumber}
          onOperationalIdChange={setOperationalId}
          onFetch={onFetch}
          onClose={resetAndClose}
        />
      )}
    </>
  );
}
