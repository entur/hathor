import { useTranslation } from 'react-i18next';
import { vehicleTypeViewConfig } from './vehicleTypeViewConfig.tsx';
import GenericDataViewPage from '../../../pages/GenericDataViewPage.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { OrderBy } from '../hooks/useVehicleTypes.ts';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import NewEntityFab from '../../../components/NewEntityFab.tsx';

export default function VehicleTypeView() {
  const { t } = useTranslation();
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();

  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{
        ...vehicleTypeViewConfig,
        addAction: (
          <NewEntityFab
            label={t('vehicleTypes.actions.new')}
            to="/vehicle-types?selected=new"
            testid="create-vehicle-type-fab"
          />
        ),
      }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
