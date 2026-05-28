import { useTranslation } from 'react-i18next';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';

const CONTEXT_ROWS = 2;
const VEHICLE_FORM_ROWS = 7;
const MODEL_FORM_ROWS = 3;
const CONTEXT_VALUE_HEIGHT = 22;
const CONTEXT_ROW_GAP = 0.5;

/**
 * Loading affordance for the vehicle details sidebar. Wraps the generic
 * {@link FormLayoutSkeleton} with the section shape that matches
 * `VehicleDetails`: title row + 2 context rows + 7 vehicle form rows +
 * 3 model form rows. Section dividers replace the prior inline "Model"
 * sub-heading (one fewer skeleton element, equivalent visual split).
 */
export default function VehicleDetailsSkeleton() {
  const { t } = useTranslation();
  return (
    <FormLayoutSkeleton
      ariaLabel={t('vehicles.loading', 'Loading vehicle…')}
      showTitle
      sections={[
        { rowCount: CONTEXT_ROWS, rowHeight: CONTEXT_VALUE_HEIGHT, rowGap: CONTEXT_ROW_GAP },
        { rowCount: VEHICLE_FORM_ROWS },
        { rowCount: MODEL_FORM_ROWS },
      ]}
    />
  );
}
