import { Skeleton } from '@mui/material';
import { CARD_MEDIA_ASPECT, type FieldSpec } from '../../collection/types.ts';
import { CHECKBOX_ROW_PX } from '../../FormFields.tsx';
import { FIELD_RADIUS_PX } from '../../../theme/createThemeFromConfig.ts';
import type { Section } from '../utils/sections.ts';
import { FormSections, type FormSectionsProps } from './FormSections.tsx';

// The loaded field's height (MUI's small filled field, Linje's 48 px), so the page doesn't jump
// when the record lands.
const FIELD_PX = 48;

/** Column 3's picture while loading, in `BusPictureFrame`'s aspect. */
export const PictureSkeleton = () => (
  <Skeleton
    variant="rounded"
    sx={{ width: '100%', height: 'auto', aspectRatio: CARD_MEDIA_ASPECT }}
  />
);

export interface FormSkeletonProps<K extends string> extends Pick<
  FormSectionsProps<K>,
  'tocLabel' | 'sectionLabel' | 'aside'
> {
  /** The form's own sections, from `resolveSections`. */
  sections: readonly Section<K>[];
  /** The entity's field mapping: a field's kind picks its block's height. */
  fields: Record<K, FieldSpec>;
}

/**
 * The form's loading state, drawn through {@link FormSections} with the form's own sections:
 * same headings, widths, gaps and table of contents, a block where each control goes.
 *
 * @param {FormSkeletonProps} props the sections, the field mapping, TOC and heading labels
 * @returns {JSX.Element} the form's shape in skeleton blocks
 */
export function FormSkeleton<K extends string>({ fields, ...sections }: FormSkeletonProps<K>) {
  return (
    <FormSections
      {...sections}
      renderField={f => (
        <Skeleton
          variant="rounded"
          height={fields[f.key].kind === 'switch' ? CHECKBOX_ROW_PX : FIELD_PX}
          sx={{ borderRadius: `${FIELD_RADIUS_PX}px` }}
        />
      )}
    />
  );
}
