import { Box, Typography } from '@mui/material';
import { CARD_MEDIA_ASPECT } from '../../collection/index.ts';
import { BusPicture, type BusPictureProps } from './BusPicture.tsx';

/**
 * A {@link BusPicture} in a picture area of its own, for a place with no card
 * around it (a form page's column 3): 16:10 on the card's `action.hover` ground,
 * painted on paper whatever lies behind (the shot's own ground), a size container for the note; a line of text in place of the picture
 * (`data-card-media-compact`) shrinks it to that line. A `placeholder` stands in the
 * full-size box instead, e.g. "Select type" on a vehicle with no type to draw (#285).
 *
 * @param {BusPictureProps & { placeholder?: string }} props dims, paint and mode, as
 *   `BusPicture`, or the placeholder text
 * @returns {JSX.Element} the framed picture
 */
export function BusPictureFrame({
  placeholder,
  ...bus
}: BusPictureProps & { placeholder?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: CARD_MEDIA_ASPECT,
        containerType: 'size',
        // Opaque: `BusPicture` shoots onto paper under the hover tint, whatever is behind.
        background: t =>
          `linear-gradient(${t.palette.action.hover}, ${t.palette.action.hover}) ${t.palette.background.paper}`,
        borderRadius: 1,
        overflow: 'hidden',
        '& > img': { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
        '&:has([data-card-media-compact])': {
          aspectRatio: 'auto',
          containerType: 'normal',
          pt: 1.5,
        },
      }}
    >
      {placeholder ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
          data-testid="bus-picture-placeholder"
        >
          {placeholder}
        </Typography>
      ) : (
        <BusPicture {...bus} />
      )}
    </Box>
  );
}
