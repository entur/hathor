import { Fragment, useState } from 'react';
import { Box, Divider, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormStack } from '../../../components/FormLayout.tsx';
import PillTabs from '../../../components/PillTabs.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { CodeValue } from '../../code-values/types/codeValueTypes.ts';
import { sectionFields, type VehicleTypeSection } from '../types/vehicleTypeLayout.ts';
import { useVehicleTypeControls } from '../hooks/useVehicleTypeControls.tsx';

/** Editor tabs — General (identity + dimensions) first, then the field-group tabs. */
type TabKey = 'general' | 'propulsion' | 'capacity' | 'environment' | 'vehicles';
// Each tab's sections of `vehicleTypeSections`; General's two are split by a divider.
const TAB_SECTIONS: Record<TabKey, readonly VehicleTypeSection[]> = {
  general: ['general', 'dimensions'],
  propulsion: ['propulsion'],
  capacity: ['capacity'],
  environment: ['environment'],
  vehicles: ['vehicles'],
};
const TABS = Object.keys(TAB_SECTIONS) as TabKey[];

interface VehicleTypeFormProps {
  value: VehicleType;
  onChange: (next: VehicleType) => void;
  mode: 'view' | 'edit';
  /** Sobek's emission-standard code list; the stored value is always offered too. */
  euroClasses: readonly CodeValue[];
}

/**
 * The sidebar's VehicleType editor — a tabbed FormStack driven by
 * `value`/`onChange`/`mode`. Tabs: General (identity + dimensions) · Propulsion/perf.
 * · Passenger Capacity · Environment · Vehicles (read-only links to the vehicles
 * route), over `vehicleTypeSections` and the controls the form page draws too.
 *
 * @param value       Current VehicleType (gql-shaped).
 * @param onChange    Fired with the merged next value on every field edit.
 * @param mode        `'view'` disables all inputs; `'edit'` enables them.
 * @param euroClasses Emission-class choices (Sobek `EMISSION_STANDARD` code list).
 */
export default function VehicleTypeForm(props: VehicleTypeFormProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>('general');
  const control = useVehicleTypeControls(props);

  return (
    <Box>
      <PillTabs value={tab} onChange={(_e, v: TabKey) => setTab(v)}>
        {TABS.map(k => (
          <Tab key={k} value={k} label={t(`vehicleType.tab.${k}`)} />
        ))}
      </PillTabs>
      {tab === 'vehicles' ? (
        <Box data-testid="vtype-tab-vehicles">{control('vehicles')}</Box>
      ) : (
        <FormStack data-testid={`vtype-tab-${tab}`}>
          {TAB_SECTIONS[tab].map((section, i) => [
            i > 0 && <Divider key={`divider-${section}`} />,
            ...sectionFields(section).map(key => <Fragment key={key}>{control(key)}</Fragment>),
          ])}
        </FormStack>
      )}
    </Box>
  );
}
