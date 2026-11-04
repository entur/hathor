import { Box } from '@mui/material';
import { CARD_MEDIA_ASPECT } from '../../collection/index.ts';
import { BusPicture, type BusPictureProps } from './BusPicture.tsx';

/**
 * A {@link BusPicture} in a picture area of its own, for a place with no card
 * around it (a form page's column 3): 16:10 on the card's `action.hover` ground,
 * a size container for the note; a line of text in place of the picture
 * (`data-card-media-compact`) shrinks it to that line.
 *
 * @param {BusPictureProps} props dims, paint and mode, as `BusPicture`
 * @returns {JSX.Element} the framed picture
 */
export function BusPictureFrame(props: BusPictureProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: CARD_MEDIA_ASPECT,
        containerType: 'size',
        bgcolor: 'action.hover',
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
      <BusPicture {...props} />
    </Box>
  );
}
