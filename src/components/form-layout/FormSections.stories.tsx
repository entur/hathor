import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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
import { vehicleFields, vehicleLayout } from '../../data/vehicles/types/vehicleFields.ts';
import { deckPlanFields, deckPlanLayout } from '../../data/deck-plans/types/deckPlanFields.ts';
import {
  EditFooter,
  FormSections,
  resolveSections,
  type Layout,
  type ResolvedField,
} from './index.ts';

const MENU_W = 72; // the collapsed nav rail
const FORM_MAX_W = 1140; // PageShell's `lg` container: form + its TOC column

/** The vehicle-types form page's own sections (#280), headed in English. */
const vehicleTypeLayout: Layout<VehicleTypeField> = Object.fromEntries(
  VEHICLE_TYPE_SECTION_IDS.map(s => [
    en[VEHICLE_TYPE_SECTION_LABEL[s] as keyof typeof en],
    vehicleTypeSections[s],
  ])
);
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
  /** Add the page's Save / Cancel at the form's end, as `EditorFrame` does (#293). */
  footer: boolean;
  /** Footer state: tinted band, live Save. */
  dirty: boolean;
}

/** Menu | form (| picture + TOC), as the form page will place it; `FormSections` draws column 3. */
const Demo = ({ fields, layout, media, footer, dirty }: DemoProps) => (
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
    {/* Fixed height, as the form page: from `lg` the form column scrolls on its own (#293). */}
    <Box sx={{ height: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column' }}>
      <FormSections
        sections={resolveSections(fields, layout)}
        renderField={control(fields)}
        aside={media && <MediaPlaceholder />}
        footer={footer && <EditFooter dirty={dirty} onSave={fn()} onCancel={fn()} />}
      />
    </Box>
  </Box>
);

const meta: Meta<typeof Demo> = {
  title: 'components/form-layout/FormSections',
  component: Demo,
  args: { media: true, footer: false, dirty: false },
  argTypes: {
    media: { control: 'boolean' },
    footer: { control: 'boolean' },
    dirty: { control: 'boolean', if: { arg: 'footer' } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "A form body laid out from a `Layout` (#267): stacked sections, field widths by kind or per-field override, a TOC from 3 sections up linked to scrolling both ways, and a picture slot above it (`aside`, toggle `media`). Toggle `footer` for the form page's `EditFooter`, last in the form column. From `lg` (in a fixed-height host) the form column scrolls while column 3 stays put (#293).",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

/** Six sections → TOC in column 3; scrolling moves the mark, a pick scrolls the form. Footer on. */
export const VehicleType: Story = {
  args: { fields: vehicleTypeFields, layout: vehicleTypeLayout, footer: true },
};

/** The vehicle form page's own section (#285): one → flat, no heading, no TOC; column 3 still holds the picture when `media` is on. */
export const Vehicle: Story = { args: { fields: vehicleFields, layout: vehicleLayout } };

/** The deck-plan form page's own section (#287): one → flat, no heading, no TOC. */
export const DeckPlan: Story = { args: { fields: deckPlanFields, layout: deckPlanLayout } };
