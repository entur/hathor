import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { mergeNameText } from '../../netex/multilingualString.ts';
import { FormLayout, FieldRow } from '../../../components/FormLayout.tsx';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

export interface DeckPlanCreateFormValue {
  DeckPlan: DeckPlan;
}

interface DeckPlanCreateFormProps {
  value: DeckPlanCreateFormValue;
  onChange: (next: DeckPlanCreateFormValue) => void;
  mode: 'view' | 'edit';
}

export default function DeckPlanCreateForm({ value, onChange, mode }: DeckPlanCreateFormProps) {
  const { t } = useTranslation();
  const v = value.DeckPlan;
  const ro = mode === 'view';
  const setV = (patch: Partial<DeckPlan>) => onChange({ ...value, DeckPlan: { ...v, ...patch } });

  return (
    <FormLayout>
      <FieldRow id="DeckPlan-name" label={t('deckPlans.field.name', 'Name')}>
        <TextField
          id="DeckPlan-name"
          value={v.name?.value ?? ''}
          onChange={e => setV({ name: mergeNameText(v.name, e.target.value) })}
          disabled={ro}
          size="small"
          fullWidth
        />
      </FieldRow>
    </FormLayout>
  );
}
