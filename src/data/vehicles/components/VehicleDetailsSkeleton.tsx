import { Box, Divider, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormLayout } from '../../components/FormLayout.tsx';

const CONTEXT_ROWS = 2;
const VEHICLE_FORM_ROWS = 7;
const MODEL_FORM_ROWS = 3;
const TITLE_HEIGHT = 28;
const ID_PILL_WIDTH = 144;
const ID_PILL_HEIGHT = 24;
const INPUT_HEIGHT = 37;
const CONTEXT_VALUE_HEIGHT = 22;
const CONTEXT_ROW_GAP = 0.5;
const SECTION_HEADING_HEIGHT = 16;
const ANIM = 'wave' as const;

interface SkeletonRowProps {
  height?: number;
}

/** Two-cell row: label-width text on the left, full-width rounded block on
 *  the right — mirrors the `FieldRow` pairing in `VehicleEditForm`. Uses
 *  `display: contents` so both halves become grid items of the parent. */
function SkeletonRow({ height = INPUT_HEIGHT }: SkeletonRowProps) {
  return (
    <Box sx={{ display: 'contents' }}>
      <Skeleton animation={ANIM} variant="text" width="60%" />
      <Skeleton animation={ANIM} variant="rounded" height={height} />
    </Box>
  );
}

/**
 * Loading affordance for the vehicle details sidebar. Renders a wave-animated
 * skeleton that mirrors {@link VehicleDetails}'s real layout (title row,
 * NetexId pill, two context rows, vehicle form rows, model section heading,
 * model form rows). Wrapped in `role="status"` + `aria-label` so screen
 * readers announce the loading state even though the visible "Loading
 * vehicle…" text was removed in favour of the skeleton.
 */
export default function VehicleDetailsSkeleton() {
  const { t } = useTranslation();
  const vehicleRows = Array.from({ length: VEHICLE_FORM_ROWS });
  const modelRows = Array.from({ length: MODEL_FORM_ROWS });
  const contextRows = Array.from({ length: CONTEXT_ROWS });

  return (
    <Box
      role="status"
      aria-label={t('vehicles.loading', 'Loading vehicle…')}
      sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}
    >
      <FormLayout sx={{ mb: 1 }}>
        <Skeleton animation={ANIM} variant="text" height={TITLE_HEIGHT} width="70%" />
        <Skeleton
          animation={ANIM}
          variant="rounded"
          width={ID_PILL_WIDTH}
          height={ID_PILL_HEIGHT}
        />
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <FormLayout rowGap={CONTEXT_ROW_GAP} sx={{ mb: 2 }}>
        {contextRows.map((_, i) => (
          <SkeletonRow key={`ctx-${i}`} height={CONTEXT_VALUE_HEIGHT} />
        ))}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <FormLayout>
        {vehicleRows.map((_, i) => (
          <SkeletonRow key={`v-${i}`} />
        ))}
        <Skeleton
          animation={ANIM}
          variant="rectangular"
          height={1}
          sx={{ gridColumn: '1 / -1', my: 0.5 }}
        />
        <Skeleton
          animation={ANIM}
          variant="text"
          width="20%"
          height={SECTION_HEADING_HEIGHT}
          sx={{ gridColumn: '1 / -1' }}
        />
        {modelRows.map((_, i) => (
          <SkeletonRow key={`m-${i}`} />
        ))}
      </FormLayout>
    </Box>
  );
}
