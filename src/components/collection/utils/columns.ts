/**
 * Which mapped fields a collection may show, and what a card shows by default.
 * Pure — both views and the toolbar call it, so they can never disagree.
 */
import {
  DEFAULT_LABELS,
  type CardSpec,
  type Column,
  type FieldEntry,
  type FieldSpec,
  type ResolvedCard,
} from '../types.ts';
import { compactId, compactIdEntry, idMatches, isIdSpec, withVersion } from './values.ts';

/** A bare key as an entry, so every column reads alike. */
const norm = (item: string | FieldEntry): FieldEntry =>
  typeof item === 'string' ? { field: item } : item;

const TITLE_KEY = 'name'; // default card title when the entity has one
const CARD_DEFAULT_FIELDS = 6;

/** `grid` relations need a table of their own; `patched` fields are not on the
 *  wire yet, so a list fetched from sobek never carries them. */
const eligible = (spec: FieldSpec | undefined): spec is FieldSpec =>
  !!spec && spec.kind !== 'grid' && !spec.patched;

type Rules = Pick<Column, 'display' | 'matches' | 'entryLabel' | 'cardText' | 'muted'>;
const same = (text: string): string => text;
/** Every field but the identity shows and matches its text as is. */
const PLAIN: Rules = {
  display: same,
  matches: (have, typed) => have === typed,
  entryLabel: same,
  cardText: same,
  muted: false,
};
/** The identity shows compact and matches on its last segment, full id as a fallback. */
const IDENTITY: Rules = {
  display: compactId,
  matches: idMatches,
  entryLabel: compactIdEntry,
  cardText: withVersion,
  muted: true,
};

/**
 * Resolve the columns a collection shows.
 *
 * @param fields  the entity's `FIELDS` field mapping
 * @param columns whitelist with order and optional labels; omit for every
 *                eligible field in field mapping order
 * @param idLabel caption of the identity field, unless its entry names one
 * @param fieldLabel caption of any other field, unless its entry names one
 * @returns columns in display order; ineligible or unknown keys are dropped
 */
export const resolveColumns = (
  fields: Record<string, FieldSpec>,
  columns?: readonly (string | FieldEntry)[],
  idLabel: string = DEFAULT_LABELS.id,
  fieldLabel: (key: string) => string = DEFAULT_LABELS.field
): Column[] =>
  (columns ?? Object.keys(fields)).map(norm).flatMap(entry => {
    const spec = fields[entry.field];
    if (!eligible(spec)) return [];
    const identity = isIdSpec(spec);
    const label = entry.label ?? (identity ? idLabel : fieldLabel(entry.field));
    return [
      {
        key: entry.field,
        label,
        spec,
        render: entry.render,
        ...(identity ? IDENTITY : PLAIN),
      },
    ];
  });

/**
 * Resolve what a card shows. An explicit `card` is looked up against the whole
 * field mapping (a card may show a field the grid hides), a shown column as resolved —
 * its label and `render`; the default derives from the resolved columns.
 *
 * @param fields the entity's `FIELDS` field mapping
 * @param cols   the resolved columns
 * @param card    explicit card spec; omit for the default
 * @param idLabel caption of the identity field on an explicit card
 * @param fieldLabel caption of any other field on an explicit card
 * @returns title, subtitle and body fields
 */
export const resolveCard = (
  fields: Record<string, FieldSpec>,
  cols: readonly Column[],
  card?: CardSpec,
  idLabel: string = DEFAULT_LABELS.id,
  fieldLabel: (key: string) => string = DEFAULT_LABELS.field
): ResolvedCard => {
  if (card) {
    // A shown column comes as resolved (its label and render); any other field from the field mapping.
    const pick = (keys: readonly string[]): Column[] =>
      keys.flatMap(
        k => cols.find(c => c.key === k) ?? resolveColumns(fields, [k], idLabel, fieldLabel)
      );
    return {
      title: pick([card.title])[0],
      subtitle: card.subtitle ? pick([card.subtitle])[0] : undefined,
      fields: pick(card.fields),
    };
  }
  const title = cols.find(c => c.key === TITLE_KEY) ?? cols[0];
  return {
    title,
    subtitle: undefined,
    fields: cols.filter(c => c !== title).slice(0, CARD_DEFAULT_FIELDS),
  };
};
