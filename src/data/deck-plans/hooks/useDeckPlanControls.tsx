import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FormTextField } from '../../../components/FormFields.tsx';
import { mergeNameText } from '../../netex/multilingualString.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import type { DeckPlanField } from '../types/deckPlanFields.ts';

export interface DeckPlanControlsOptions {
  value: DeckPlan;
  onChange: (next: DeckPlan) => void;
  mode: 'view' | 'edit';
  /** How view mode locks a field: `disabled` (the sidebar) or `readOnly` (the form page, #267). */
  lock?: 'disabled' | 'readOnly';
}

/**
 * One control per editable deck-plan field, so the sidebar's form and the form page's
 * section draw the same fields (#287).
 *
 * @param {DeckPlanControlsOptions} options value, onChange, mode and view-mode lock
 * @returns {(key: DeckPlanField) => ReactNode} the control for a field key (nothing for a
 *   key the form doesn't edit)
 */
export function useDeckPlanControls({
  value,
  onChange,
  mode,
  lock = 'disabled',
}: DeckPlanControlsOptions): (key: DeckPlanField) => ReactNode {
  const { t } = useTranslation();
  const locked = mode === 'view' ? { [lock]: true } : {};
  return key =>
    key === 'name' || key === 'description' ? (
      <FormTextField
        id={`deckPlan-${key}`}
        label={t(`deckPlans.field.${key}`)}
        value={value[key]?.value ?? ''}
        onChange={text => onChange({ ...value, [key]: mergeNameText(value[key], text) })}
        {...locked}
      />
    ) : null;
}
