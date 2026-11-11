import EntityDetailsShell from '../../../pages/shell/EntityDetailsShell.tsx';
import VehicleTypeDetails from './VehicleTypeDetails.tsx';
import { VEHICLE_TYPES_PATH } from './VehicleTypeCollectionPage.tsx';

/**
 * `/vehicle-types/:id` — one vehicle type's editor as a full page.
 *
 * @returns {JSX.Element} The vehicle-type details page.
 */
export default function VehicleTypeDetailsPage() {
  return (
    <EntityDetailsShell
      listPath={VEHICLE_TYPES_PATH}
      renderEditor={host => <VehicleTypeDetails {...host} />}
    />
  );
}
