import { Skeleton } from '@mui/material';
import type { FieldSpec } from '../../collection/types.ts';
import type { Section } from '../utils/sections.ts';
import { FormSections, type FormSectionsProps } from './FormSections.tsx';

// The loaded form's control heights: Linje's 48 px field, the 42 px checkbox row (20 px box
// padded 11 px) — so the page doesn't jump when the record lands.
const FIELD_PX = 48,
  CHECKBOX_PX = 42,
  FIELD_RADIUS_PX = 8;

/** Column 3's picture while loading: `BusPictureFrame`'s 16:10. */
export const PictureSkeleton = () => (
  <Skeleton variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '16 / 10' }} />
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
          height={fields[f.key].kind === 'switch' ? CHECKBOX_PX : FIELD_PX}
          sx={{ borderRadius: `${FIELD_RADIUS_PX}px` }}
        />
      )}
    />
  );
}
