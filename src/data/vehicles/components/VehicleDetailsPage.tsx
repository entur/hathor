import EntityDetailsShell from '../../../pages/shell/EntityDetailsShell.tsx';
import VehicleDetails from './VehicleDetails.tsx';
import { VEHICLES_NEXT_PATH } from './VehicleCollectionPage.tsx';

/**
 * `/next/vehicles/:id` — one vehicle's editor as a full page (#285).
 *
 * @returns {JSX.Element} The vehicle details page.
 */
export default function VehicleDetailsPage() {
  return (
    <EntityDetailsShell
      listPath={VEHICLES_NEXT_PATH}
      renderEditor={host => <VehicleDetails {...host} />}
    />
  );
}
