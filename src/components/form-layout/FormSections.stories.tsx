import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, FormControlLabel, Paper, Switch, TextField, Typography } from '@mui/material';
import type { FieldSpec } from '../collection/types.ts';
import { FormSections, resolveSections, type Layout, type ResolvedField } from './index.ts';

const MENU_W = 72; // the collapsed nav rail
const FORM_MAX_W = 1140; // PageShell's `lg` container: form + its TOC column

/** Story-local registries; the real ones land with each form page (#252 pri 3–4). */
const vehicleTypeFields = {
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'] },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
  length: { kind: 'number', path: ['length'] },
  width: { kind: 'number', path: ['width'] },
  height: { kind: 'number', path: ['height'] },
  weight: { kind: 'number', path: ['weight'] },
  propulsionTypes: { kind: 'enumMulti', path: ['propulsionTypes'] },
  fuelTypes: { kind: 'enumMulti', path: ['fuelTypes'] },
  selfPropelled: { kind: 'switch', path: ['selfPropelled'] },
  euroClass: { kind: 'text', path: ['euroClass'] },
  totalCapacity: { kind: 'number', path: ['passengerCapacity', 'totalCapacity'] },
  seatingCapacity: { kind: 'number', path: ['passengerCapacity', 'seatingCapacity'] },
  standingCapacity: { kind: 'number', path: ['passengerCapacity', 'standingCapacity'] },
  pushchairCapacity: { kind: 'number', path: ['passengerCapacity', 'pushchairCapacity'] },
  wheelchairPlaceCapacity: {
    kind: 'number',
    path: ['passengerCapacity', 'wheelchairPlaceCapacity'],
  },
  pramPlaceCapacity: { kind: 'number', path: ['passengerCapacity', 'pramPlaceCapacity'] },
  bicycleRackCapacity: { kind: 'number', path: ['passengerCapacity', 'bicycleRackCapacity'] },
  formDragCoefficient: { kind: 'number', path: ['formDragCoefficient'] },
  rollResistanceCoefficient: { kind: 'number', path: ['rollResistanceCoefficient'] },
  maximumEngineEffectKW: { kind: 'number', path: ['maximumEngineEffectKW'] },
  hybridCategory: { kind: 'enum', path: ['hybridCategory'] },
  vehicles: { kind: 'grid', path: ['vehicles'] },
} satisfies Record<string, FieldSpec>;

/** Dimensions split out of General, one row of four (plan decisions 1–2). */
const vehicleTypeLayout: Layout<keyof typeof vehicleTypeFields> = {
  General: ['name', 'transportMode', 'lowFloor'],
  Dimensions: (['length', 'width', 'height', 'weight'] as const).map(field => ({
    field,
    width: '1/4' as const,
  })),
  'Propulsion and performance': ['propulsionTypes', 'fuelTypes', 'selfPropelled', 'euroClass'],
  'Passenger capacity': [
    'totalCapacity',
    'seatingCapacity',
    'standingCapacity',
    'pushchairCapacity',
    'wheelchairPlaceCapacity',
    'pramPlaceCapacity',
    'bicycleRackCapacity',
  ],
  Environment: [
    'formDragCoefficient',
    'rollResistanceCoefficient',
    'maximumEngineEffectKW',
    'hybridCategory',
  ],
  Vehicles: ['vehicles'],
};

const vehicleFields = {
  name: { kind: 'text', path: ['name'] },
  registrationNumber: { kind: 'text', path: ['registrationNumber'] },
  operationalNumber: { kind: 'text', path: ['operationalNumber'] },
  transportType: { kind: 'reference', path: ['transportType', 'id'] },
  buildDate: { kind: 'date', path: ['buildDate'] },
  registrationDate: { kind: 'date', path: ['registrationDate'] },
  chassisNumber: { kind: 'text', path: ['chassisNumber'] },
  description: { kind: 'text', path: ['description'] },
} satisfies Record<string, FieldSpec>;

/** One flat section; short codes at half width, regrouped to pack in pairs (decisions 3–4). */
const vehicleLayout: Layout<keyof typeof vehicleFields> = {
  Vehicle: [
    'name',
    { field: 'registrationNumber', width: '1/2' },
    { field: 'operationalNumber', width: '1/2' },
    'transportType',
    'buildDate',
    'registrationDate',
    { field: 'chassisNumber', width: '1/2' },
    'description',
  ],
};

const deckPlanFields = {
  name: { kind: 'name', path: ['name'] },
  description: { kind: 'text', path: ['description'] },
  xml: { kind: 'text', path: ['xml'] },
} satisfies Record<string, FieldSpec>;

/** XML stacked under General, not a tab (decision 5): two sections, so no TOC. */
const deckPlanLayout: Layout<keyof typeof deckPlanFields> = {
  General: ['name', 'description'],
  XML: ['xml'],
};

/** Story stand-in for the host's controls; real forms draw their own `FormFields`. */
const control =
  (fields: Record<string, FieldSpec>) =>
  ({ key, label }: ResolvedField) => {
    const { kind } = fields[key];
    if (kind === 'grid')
      return (
        <Typography variant="body2" color="text.secondary">
          {label}: the host draws the related records here (chips today)
        </Typography>
      );
    if (kind === 'switch') return <FormControlLabel control={<Switch />} label={label} />;
    return (
      <TextField
        size="small"
        fullWidth
        label={label}
        type={kind === 'number' ? 'number' : kind === 'date' ? 'date' : 'text'}
        multiline={key === 'xml' || key === 'description'}
        minRows={key === 'xml' ? 12 : undefined}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    );
  };

interface DemoProps {
  fields: Record<string, FieldSpec>;
  layout: Layout;
}

/** Menu | form (| TOC), as the form page will place it; `FormSections` draws the TOC itself. */
const Demo = ({ fields, layout }: DemoProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: `${MENU_W}px minmax(0, ${FORM_MAX_W}px)`,
      gap: 3,
      alignItems: 'start',
      p: 2,
    }}
  >
    <Paper variant="outlined" sx={{ position: 'sticky', top: 0, height: '100vh' }} />
    <FormSections sections={resolveSections(fields, layout)} renderField={control(fields)} />
  </Box>
);

const meta: Meta<typeof Demo> = {
  title: 'components/FormSections',
  component: Demo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A form body laid out from a `Layout` (#267): stacked sections, field widths by kind or per-field override, a TOC from 3 sections up linked to scrolling both ways.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

/** Six sections → TOC in column 3; scrolling moves the mark, a pick scrolls the form. */
export const VehicleType: Story = {
  args: { fields: vehicleTypeFields, layout: vehicleTypeLayout },
};

/** One section → flat, no heading, no TOC. */
export const Vehicle: Story = { args: { fields: vehicleFields, layout: vehicleLayout } };

/** Two sections → stacked with headings, below the TOC threshold. */
export const DeckPlan: Story = { args: { fields: deckPlanFields, layout: deckPlanLayout } };
