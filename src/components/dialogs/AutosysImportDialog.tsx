import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../contexts/ConfigContext';
import {
  fetchVehicleFromAutosys,
  importVehicle,
} from '../../data/vehicle-imports/vehicleImportServices';
import type { NeTExResourceFrame } from '../../data/vehicle-types/vehicleTypeTypes';
import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { useAuth } from '../../auth';
import AutosysSingleQuery from './AutosysSingleQuery';
import AutosysSingleConfirm from './AutosysSingleConfirm';

interface AutosysImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AutosysImportDialog({ open, onClose }: AutosysImportDialogProps) {
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
    setResourceFrame(
      result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames.ResourceFrame
    );
  };

  const onConfirm = async () => {
    const token = await getAccessToken();
    await importVehicle(applicationImportBaseUrl || '', neTExXML, token);
    resetAndClose();
  };

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth>
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
    </Dialog>
  );
}
