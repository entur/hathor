import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, FormControlLabel, Paper, Switch, TextField, Typography } from '@mui/material';
import { CARD_MEDIA_ASPECT, type FieldSpec } from '../collection/index.ts';
import en from '../../locales/en/translation.json';
import {
  vehicleTypeFields,
  type VehicleTypeField,
} from '../../data/vehicle-types/types/vehicleTypeFields.ts';
import {
  VEHICLE_TYPE_SECTION_IDS,
  VEHICLE_TYPE_SECTION_LABEL,
  vehicleTypeSections,
} from '../../data/vehicle-types/types/vehicleTypeLayout.ts';
import { FormSections, resolveSections, type Layout, type ResolvedField } from './index.ts';

const MENU_W = 72; // the collapsed nav rail
const FORM_MAX_W = 1140; // PageShell's `lg` container: form + its TOC column

/** The vehicle-types form page's own sections (#280), headed in English. */
const vehicleTypeLayout: Layout<VehicleTypeField> = Object.fromEntries(
  VEHICLE_TYPE_SECTION_IDS.map(s => [
    en[VEHICLE_TYPE_SECTION_LABEL[s] as keyof typeof en],
    vehicleTypeSections[s],
  ])
);
/** Story-local field mappings; the real ones land with each form page (#252 pri 4). */
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

/** Stand-in for the iteru-3dbus picture the form pages will put in column 3. */
const MediaPlaceholder = () => (
  <Box
    sx={{
      aspectRatio: CARD_MEDIA_ASPECT,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 1,
      display: 'grid',
      placeItems: 'center',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      3D bus · {CARD_MEDIA_ASPECT}
    </Typography>
  </Box>
);

interface DemoProps {
  fields: Record<string, FieldSpec>;
  layout: Layout;
  /** Reserve the column-3 picture slot above the TOC. */
  media: boolean;
}

/** Menu | form (| picture + TOC), as the form page will place it; `FormSections` draws column 3. */
const Demo = ({ fields, layout, media }: DemoProps) => (
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
    <FormSections
      sections={resolveSections(fields, layout)}
      renderField={control(fields)}
      aside={media && <MediaPlaceholder />}
    />
  </Box>
);

const meta: Meta<typeof Demo> = {
  title: 'components/FormSections',
  component: Demo,
  args: { media: true },
  argTypes: { media: { control: 'boolean' } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A form body laid out from a `Layout` (#267): stacked sections, field widths by kind or per-field override, a TOC from 3 sections up linked to scrolling both ways, and a picture slot above it (`aside`, toggle `media`).',
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

/** One section → flat, no heading, no TOC; column 3 still holds the picture when `media` is on. */
export const Vehicle: Story = { args: { fields: vehicleFields, layout: vehicleLayout } };

/** Two sections → stacked with headings, below the TOC threshold. */
export const DeckPlan: Story = { args: { fields: deckPlanFields, layout: deckPlanLayout } };
