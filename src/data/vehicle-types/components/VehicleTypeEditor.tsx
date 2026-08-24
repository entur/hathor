import { useCustomization } from '../../../contexts/CustomizationContext.tsx';
import VehicleTypeDetails from './VehicleTypeDetails.tsx';
import DetailsModern from './ModernVTDetails.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

interface VehicleTypeEditorProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  row: VehicleType | null;
  mode: 'view' | 'edit';
  /** List refetch run after a successful save, so the table reflects the new values. */
  onSaved?: () => Promise<void>;
}

/**
 * Picks the VehicleType sidebar editor from the `Experimental` setting:
 * on → the `@entur/mui-comps-nmr` {@link DetailsModern} form, off → the
 * in-repo {@link VehicleTypeDetails}.
 *
 * A component rather than a bare branch inside the caller's `renderEditor`
 * so it subscribes to `CustomizationContext` itself and re-renders on toggle
 * — the editor node is committed once into `EditingContext` and would
 * otherwise keep whichever editor was current when the slider opened.
 *
 * @param row     Resolved row, or `null` for a not-found deep link.
 * @param mode    Initial mode ('view' or 'edit').
 * @param onSaved Optional list refetch run after a successful save.
 */
export default function VehicleTypeEditor({ row, mode, onSaved }: VehicleTypeEditorProps) {
  const { useExperimental } = useCustomization();

  // 'new' resolves to the empty-row factory (id ''), which the modern form
  // reads as create — it wants the prop absent, not blank.
  return useExperimental ? (
    <DetailsModern
      mode="edit"
      netexId={row?.id || undefined}
      name={row?.name?.value}
      version={row?.version}
      onSaved={onSaved}
    />
  ) : (
    <VehicleTypeDetails vehicleType={row} onSaved={onSaved} mode={mode} />
  );
}
