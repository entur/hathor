// UNUSED — SingleImport is deactivated because it sends the raw Autosys XML
// to the backend without injecting OperationalNumber. Use MultiImport instead.

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
import SingleImportQuery from './SingleImportQuery';
import SingleImportConfirm from './SingleImportConfirm';
import DialogTitle from '@mui/material/DialogTitle';

interface SingleImportProps {
  onClose: () => void;
}

export default function SingleImport({ onClose }: SingleImportProps) {
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
        <SingleImportConfirm
          operationalId={operationalId}
          resourceFrame={resourceFrame}
          onConfirm={onConfirm}
          onClose={resetAndClose}
        />
      ) : (
        <SingleImportQuery
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
