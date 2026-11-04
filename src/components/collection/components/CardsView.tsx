/**
 * Card flow layout: one MUI `Card` per row in a CSS auto-fill grid. Display
 * only — the rows it gets are already filtered, sorted, paged and keyed.
 * Imports nothing from `@mui/x-data-grid`, so a cards-only host never loads it.
 */
import { Fragment, type ReactNode } from 'react';
import {
  alpha,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  type CardProps,
  type TypographyProps,
} from '@mui/material';
import type { CollectionLabels, Column, KeyedRow, ResolvedCard, RowEdit } from '../types.ts';
import { displayValue, EMPTY_TEXT, fullTitle, valueList } from '../utils/values.ts';
import { EditLink } from './EditLink.tsx';

// A card never gets narrower than this (or the whole row, on a screen narrower
// than that); the row wraps instead. A card with a picture needs more room.
const CARD_MIN_PX = { text: 260, picture: 320 } as const;
// The picture's shape at the card's width: the 3D preview's box. A card's
// picture area too, unless a height is reserved for it.
const MEDIA_ASPECT = '16 / 10';
// The heading over a card's picture sits at its bottom edge — on the 3D
// shot's light ground plane — over a fade of the card's own paper rising from
// the edge, opaque enough at the text to read over any picture.
const SCRIM_ALPHA = 0.85;
// Media that is a line of text rather than a picture marks itself with this.
const COMPACT = '[data-card-media-compact]';
const CHIP_KINDS: readonly Column['spec']['kind'][] = ['enum', 'enumMulti'];

/** One value as text: the shown form as a card reads it, the full one on hover, a dash when
 *  empty — or the column's `render`. The identity is muted. */
const ValueText = ({
  row,
  col,
  labels,
  ...typography
}: { row: unknown; col: Column; labels: CollectionLabels } & TypographyProps) => (
  <Typography
    noWrap
    title={fullTitle(row, col)}
    color={col.muted ? 'text.secondary' : undefined}
    {...typography}
  >
    {col.render ? col.render(row) : col.cardText(displayValue(row, col, labels), row) || EMPTY_TEXT}
  </Typography>
);

const CardValue = ({
  row,
  col,
  labels,
}: {
  row: unknown;
  col: Column;
  labels: CollectionLabels;
}) => {
  const chips = !col.render && CHIP_KINDS.includes(col.spec.kind) ? valueList(row, col.spec) : [];
  return chips.length ? (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {chips.map(c => (
        <Chip key={c} size="small" variant="outlined" label={c} />
      ))}
    </Box>
  ) : (
    <ValueText row={row} col={col} labels={labels} variant="body2" />
  );
};

export interface CardsViewProps {
  /** The visible page, keyed (`keyRows`). */
  rows: readonly KeyedRow[];
  card: ResolvedCard;
  labels: CollectionLabels;
  /** Set → a picture area on every card, filled with what it returns, the heading laid
   *  over its bottom edge. Omitted → text cards. */
  media?: (row: unknown) => ReactNode;
  /** With `media`: the picture area's height in px (`EntityCollectionProps`). */
  reservedHeightForImg?: number;
  cardProps?: CardProps;
  /** Set → an Edit link at the foot of every card. */
  edit?: RowEdit;
}

type HeadingProps = { row: unknown; card: ResolvedCard; labels: CollectionLabels };

/** A card's first two lines: the title (a dash when there is none) and the subtitle. */
const CardHeading = ({ row, card, labels }: HeadingProps) => (
  <>
    {card.title ? (
      <ValueText row={row} col={card.title} labels={labels} variant="subtitle1" component="div" />
    ) : (
      <Typography variant="subtitle1" component="div">
        {EMPTY_TEXT}
      </Typography>
    )}
    {card.subtitle ? (
      <ValueText
        row={row}
        col={card.subtitle}
        labels={labels}
        variant="body2"
        color="text.secondary"
      />
    ) : null}
  </>
);

/**
 * The top of a card with media: the picture area, always there so every card has the
 * same shape whether or not the host fills it, with the card's heading laid
 * over its bottom edge — unless the host fills it with a compact line of text
 * (`data-card-media-compact`): then the area is just the heading and that line. The heading comes first in reading order; an unfilled
 * picture is hidden from assistive tech, the heading never is. The picture
 * stands on the area's bottom edge: a reserved height (which overrides the
 * area's own 16:10) cuts its top.
 */
const CardMediaArea = ({
  media,
  reservedHeightForImg,
  ...heading
}: HeadingProps & { media?: ReactNode; reservedHeightForImg?: number }) => (
  <Box
    sx={{
      position: 'relative',
      // Explicit, or a reserved height would size the width from the ratio.
      width: '100%',
      aspectRatio: MEDIA_ASPECT,
      height: reservedHeightForImg,
      // So media can place things in the part that shows (`cqh`), not in the
      // whole picture, whose top a reserved height cuts.
      containerType: 'size',
      bgcolor: 'action.hover',
      borderBottom: 1,
      borderColor: 'divider',
      overflow: 'hidden',
      // Media marked `data-card-media-compact` (a line of text, no picture): the area
      // shrinks to the heading and that line under it, both in flow, as they are read.
      [`&:has(${COMPACT})`]: {
        aspectRatio: 'auto',
        height: 'auto',
        containerType: 'normal',
        '& > *': { position: 'static', aspectRatio: 'auto', background: 'none' },
      },
    }}
  >
    <Box
      data-card-heading=""
      sx={{
        position: 'absolute',
        insetInline: 0,
        bottom: 0,
        zIndex: 1,
        px: 2,
        pt: 2,
        pb: 1,
        background: t =>
          `linear-gradient(transparent, ${alpha(t.palette.background.paper, SCRIM_ALPHA)})`,
      }}
    >
      <CardHeading {...heading} />
    </Box>
    <Box
      data-card-media=""
      aria-hidden={media == null || media === false ? true : undefined}
      sx={{
        position: 'absolute',
        insetInline: 0,
        bottom: 0,
        aspectRatio: MEDIA_ASPECT,
        '& > img': { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
      }}
    >
      {media}
    </Box>
  </Box>
);

/**
 * Render rows as a wrapping grid of cards.
 *
 * @param rows      the visible page, keyed
 * @param card      resolved title, subtitle and body fields
 * @param labels    yes/no wording for switches
 * @param media     set → a picture area on every card, filled with what it returns
 * @param reservedHeightForImg with `media`: the picture area's height in px
 * @param cardProps spread onto every `Card`
 * @param edit      set → an Edit link on every card
 * @returns the card list
 */
export function CardsView({
  rows,
  card,
  labels,
  media,
  reservedHeightForImg,
  cardProps,
  edit,
}: CardsViewProps): React.ReactNode {
  const pictured = media !== undefined;
  const minPx = pictured ? CARD_MIN_PX.picture : CARD_MIN_PX.text;
  return (
    <Box
      role="list"
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minPx}px, 100%), 1fr))`,
        gap: 2,
      }}
    >
      {rows.map(({ key, entity: row }) => (
        <Card key={key} role="listitem" variant="outlined" {...cardProps}>
          {pictured ? (
            <CardMediaArea
              row={row}
              card={card}
              labels={labels}
              media={media(row)}
              reservedHeightForImg={reservedHeightForImg}
            />
          ) : null}
          <CardContent>
            {pictured ? null : <CardHeading row={row} card={card} labels={labels} />}
            <Box
              component="dl"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                columnGap: 1.5,
                rowGap: 0.5,
                m: 0,
                mt: pictured ? 0 : 1,
              }}
            >
              {card.fields.map(col => (
                <Fragment key={col.key}>
                  <Typography component="dt" variant="caption" color="text.secondary">
                    {col.label}
                  </Typography>
                  <Box component="dd" sx={{ m: 0, minWidth: 0 }}>
                    <CardValue row={row} col={col} labels={labels} />
                  </Box>
                </Fragment>
              ))}
            </Box>
          </CardContent>
          {edit ? (
            <CardActions>
              <EditLink row={row} edit={edit} label={labels.edit} />
            </CardActions>
          ) : null}
        </Card>
      ))}
    </Box>
  );
}
