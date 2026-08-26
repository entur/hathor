import { useTranslation } from 'react-i18next';
import { vehicleViewConfig } from './vehicleViewConfig.tsx';
import GenericDataViewPage from '../../../pages/GenericDataViewPage.tsx';
import NewEntityFab from '../../../components/NewEntityFab.tsx';
import type { VehicleGQLShaped, VehicleColumnKey } from '../types/vehicleGqlShaped.ts';

/**
 * `/vehicles` route entry point. URL-filter affordances will arrive with
 * the Sobek `vehicles(filter)` pushdown (GH #24).
 */
export default function VehicleView() {
  const { t } = useTranslation();
  return (
    <GenericDataViewPage<VehicleGQLShaped, VehicleColumnKey>
      viewConfig={{
        ...vehicleViewConfig,
        addAction: (
          <NewEntityFab
            label={t('vehicles.actions.new', 'New Vehicle')}
            to="/vehicles?selected=new"
            testid="create-vehicle-fab"
          />
        ),
      }}
    />
  );
}
