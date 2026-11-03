/**
 * Which registry fields a collection may show, and what a card shows by default.
 * Pure — both views and the toolbar call it, so they can never disagree.
 */
import { humanize } from './humanize.ts';
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
export const norm = (item: string | FieldEntry): FieldEntry =>
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
 * @param fields  the entity's `FIELDS` registry
 * @param columns whitelist with order and optional labels; omit for every
 *                eligible field in registry order
 * @param idLabel caption of the identity field, unless its entry names one
 * @returns columns in display order; ineligible or unknown keys are dropped
 */
export const resolveColumns = (
  fields: Record<string, FieldSpec>,
  columns?: readonly (string | FieldEntry)[],
  idLabel: string = DEFAULT_LABELS.id
): Column[] =>
  (columns ?? Object.keys(fields)).map(norm).flatMap(entry => {
    const spec = fields[entry.field];
    if (!eligible(spec)) return [];
    const identity = isIdSpec(spec);
    const label = entry.label ?? (identity ? idLabel : humanize(entry.field));
    return [
      { key: entry.field, label, spec, render: entry.render, ...(identity ? IDENTITY : PLAIN) },
    ];
  });

/**
 * Resolve what a card shows. An explicit `card` is looked up against the whole
 * registry (a card may show a field the grid hides), keeping a column's `render`;
 * the default derives from the resolved columns.
 *
 * @param fields the entity's `FIELDS` registry
 * @param cols   the resolved columns
 * @param card    explicit card spec; omit for the default
 * @param idLabel caption of the identity field on an explicit card
 * @returns title, subtitle and body fields
 */
export const resolveCard = (
  fields: Record<string, FieldSpec>,
  cols: readonly Column[],
  card?: CardSpec,
  idLabel: string = DEFAULT_LABELS.id
): ResolvedCard => {
  if (card) {
    const pick = (keys: readonly string[]): Column[] =>
      resolveColumns(fields, keys, idLabel).map(c => ({
        ...c,
        render: cols.find(col => col.key === c.key)?.render,
      }));
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
