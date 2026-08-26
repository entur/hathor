import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { mergeNameText } from '../../netex/multilingualString.ts';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

interface DeckPlanCreateFormProps {
  value: DeckPlan;
  onChange: (next: DeckPlan) => void;
  mode: 'view' | 'edit';
}

export default function DeckPlanCreateForm({ value, onChange, mode }: DeckPlanCreateFormProps) {
  const { t } = useTranslation();
  const ro = mode === 'view';
  const setV = (patch: Partial<DeckPlan>) => onChange({ ...value, ...patch });

  return (
    <FormLayout>
      <FieldRow id="deckPlan-name" label={t('deckPlans.field.name', 'Name')}>
        <TextField
          id="deckPlan-name"
          value={value.name?.value ?? ''}
          onChange={e => setV({ name: mergeNameText(value.name, e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );
}
