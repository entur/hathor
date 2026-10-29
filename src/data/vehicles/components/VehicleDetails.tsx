import { useTranslation } from 'react-i18next';
import SidebarEditorRail from '../../../components/sidebar/SidebarEditorRail.tsx';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import type { EntityWrite } from '../../../hooks/useEntityEditor.ts';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import type { Vehicle } from '../types/vehicle.ts';
import VehicleEditor from './VehicleEditor.tsx';

interface VehicleDetailsProps {
  /** Vehicle netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /** Fire-and-forget report of each committed write (the list refetch). */
  onWritten?: (write: EntityWrite<Vehicle>) => void;
}

/**
 * Sidebar host for {@link VehicleEditor}, opened via `/vehicles?selected=<id>`:
 * closing drops `?selected=`, a create advances it to the new id, and the
 * editor's controls are the sidebar's {@link SidebarEditorRail}.
 *
 * @param {VehicleDetailsProps} props - Id and the write report.
 * @returns {JSX.Element} The Vehicle editor with its sidebar rail.
 */
export default function VehicleDetails({ id, onWritten }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const closeSlider = useCloseSliderParam(VEHICLE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_SELECTED_PARAM);
  return (
    <VehicleEditor
      id={id}
      onClose={closeSlider}
      onCreated={advanceCreated}
      onWritten={onWritten}
      actions={api => (
        <SidebarEditorRail
          api={api}
          onCollapse={closeSlider}
          deactivateConfirm={{
            title: t('vehicle.deactivateConfirmTitle'),
            message: t('vehicle.deactivateConfirmMessage'),
          }}
        />
      )}
    />
  );
}
