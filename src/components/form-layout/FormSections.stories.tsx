import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { FieldSpec } from '../collection/types.ts';
import { SectionToc } from '../SectionToc.tsx';
import {
  FormSections,
  resolveSections,
  tocSections,
  type Layout,
  type ResolvedField,
} from './index.ts';

// Linje docs TOC: `max-width: 15rem`, sticky with a 2rem gap.
const TOC_WIDTH = '15rem',
  TOC_TOP = '2rem';
const MENU_W = 72; // the collapsed nav rail
const FORM_MAX_W = 900; // inside PageShell's `lg` container, beside the TOC

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
const HALF = '1/2' as const;
const vehicleLayout: Layout<keyof typeof vehicleFields> = {
  Vehicle: [
    'name',
    { field: 'registrationNumber', width: HALF },
    { field: 'operationalNumber', width: HALF },
    'transportType',
    'buildDate',
    'registrationDate',
    { field: 'chassisNumber', width: HALF },
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

/** Menu | form | TOC, as the form page will place it; the TOC column only when
 *  `tocSections` lists something. Below `lg` the TOC is a dropdown above the form. */
const Demo = ({ fields, layout }: DemoProps) => {
  const sections = resolveSections(fields, layout);
  const toc = tocSections(sections);
  const [active, setActive] = useState(toc[0]);
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const nav = toc.length > 0 && (
    <SectionToc
      sections={toc}
      active={active}
      onSelect={setActive}
      variant={wide ? 'list' : 'dropdown'}
      sx={{
        position: 'sticky',
        top: wide ? TOC_TOP : 0,
        pt: wide ? 0 : 1, // room for the dropdown's floating label
        zIndex: 1,
        bgcolor: 'background.default',
      }}
    />
  );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          wide && nav
            ? `${MENU_W}px minmax(0, ${FORM_MAX_W}px) ${TOC_WIDTH}`
            : `${MENU_W}px minmax(0, ${FORM_MAX_W}px)`,
        gap: 3,
        alignItems: 'start',
        p: 2,
      }}
    >
      <Paper variant="outlined" sx={{ position: 'sticky', top: 0, height: '100vh' }} />
      <Box sx={{ minWidth: 0, pb: '60vh' /* lets the last section reach the reading band */ }}>
        {!wide && nav}
        <FormSections
          sections={sections}
          renderField={control(fields)}
          active={active}
          onActiveChange={setActive}
        />
      </Box>
      {wide && nav}
    </Box>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'next-form-layout/FormSections',
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
