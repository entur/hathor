import EntityDetailsShell from '../../../pages/shell/EntityDetailsShell.tsx';
import VehicleTypeDetails from './VehicleTypeDetails.tsx';
import type { VehicleTypeKind } from '../types/vehicleTypeTypes.ts';
import { VEHICLE_TYPE_KIND_CONFIG } from '../utils/vehicleTypeKindConfig.ts';

/**
 * `/vehicle-types/:id` (PHYSICAL) or `/contractual-vehicle-types/:id` (CONTRACTUAL) — one
 * vehicle type's editor as a full page.
 *
 * @param {{ kind: VehicleTypeKind }} props The kind this route edits.
 * @returns {JSX.Element} The vehicle-type details page.
 */
export default function VehicleTypeDetailsPage({ kind }: { kind: VehicleTypeKind }) {
  return (
    <EntityDetailsShell
      listPath={VEHICLE_TYPE_KIND_CONFIG[kind].path}
      renderEditor={host => <VehicleTypeDetails key={kind} {...host} kind={kind} />}
    />
  );
}
