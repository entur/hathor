import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { APP_HEADER_HEIGHT_PX } from '../../components/Menu.tsx';

/** Route prefix of the shell's pages while they run beside the legacy views (#252). */
export const NEXT_BASE = '/next';

// MUI `lg` = 1200px: content width cap; Container adds the responsive side gutters.
const CONTENT_MAX_WIDTH = 'lg';

/**
 * Outer frame for the collection and entity-details pages — the layout route
 * at {@link NEXT_BASE}, parallel to `GenericDataViewPage`. A full-height
 * column under the app header; the child route fills a left-aligned, width-capped
 * {@link Container} via `<Outlet/>`.
 *
 * @returns {JSX.Element} The page frame around the matched child route.
 */
export default function PageShell() {
  return (
    <Box
      sx={{
        height: `calc(100dvh - ${APP_HEADER_HEIGHT_PX}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth={CONTENT_MAX_WIDTH}
        sx={{ ml: 0, flex: 1, minHeight: 0, py: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
