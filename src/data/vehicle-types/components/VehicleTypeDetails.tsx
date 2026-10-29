import { useTranslation } from 'react-i18next';
import SidebarEditorRail from '../../../components/sidebar/SidebarEditorRail.tsx';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import type { EntityWrite } from '../../../hooks/useEntityEditor.ts';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import VehicleTypeEditor from './VehicleTypeEditor.tsx';

interface VehicleTypeDetailsProps {
  /** VehicleType netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /** Fire-and-forget report of each committed write (the list refetch). */
  onWritten?: (write: EntityWrite<VehicleType>) => void;
}

/**
 * Sidebar host for {@link VehicleTypeEditor}, opened via
 * `/vehicle-types?selected=<id>`: closing drops `?selected=`, a create advances
 * it to the new id, and the editor's controls are the sidebar's
 * {@link SidebarEditorRail}.
 *
 * @param {VehicleTypeDetailsProps} props - Id and the write report.
 * @returns {JSX.Element} The VehicleType editor with its sidebar rail.
 */
export default function VehicleTypeDetails({ id, onWritten }: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const closeSlider = useCloseSliderParam(VEHICLE_TYPE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_TYPE_SELECTED_PARAM);
  return (
    <VehicleTypeEditor
      id={id}
      onClose={closeSlider}
      onCreated={advanceCreated}
      onWritten={onWritten}
      actions={api => (
        <SidebarEditorRail
          api={api}
          onCollapse={closeSlider}
          deactivateConfirm={{
            title: t('vehicleType.deactivateConfirmTitle'),
            message: t('vehicleType.deactivateConfirmMessage'),
          }}
        />
      )}
    />
  );
}
