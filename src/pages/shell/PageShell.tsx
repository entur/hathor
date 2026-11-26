import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { APP_HEADER_HEIGHT_PX } from '../../components/Menu.tsx';

/**
 * Outer frame for the collection and entity-details pages — their layout route
 * (#252). A full-height
 * column under the app header; the child route fills a full-width {@link Container}
 * (side gutters only) via `<Outlet/>`: a collection uses all of it, a form page caps
 * and centres itself.
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
        maxWidth={false}
        sx={{ flex: 1, minHeight: 0, py: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
