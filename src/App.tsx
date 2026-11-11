import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header.tsx';
import Menu from './components/Menu.tsx';
import Home from './pages/Home';
import { CssBaseline, Toolbar, Box, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { useCustomization } from './contexts/CustomizationContext.tsx';
import { useAppTheme } from './hooks/useAppTheme';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { EditingProvider } from './contexts/EditingContext.tsx';
import {
  NavRailProvider,
  useNavRail,
  RAIL_COLLAPSED_W,
  RAIL_EXPANDED_W,
} from './contexts/NavRailContext.tsx';
import SessionExpiredDialog from './components/dialogs/SessionExpiredDialog.tsx';
import PageShell from './pages/shell/PageShell.tsx';
import VehicleTypeCollectionPage from './data/vehicle-types/components/VehicleTypeCollectionPage.tsx';
import VehicleTypeDetailsPage from './data/vehicle-types/components/VehicleTypeDetailsPage.tsx';
import VehicleCollectionPage from './data/vehicles/components/VehicleCollectionPage.tsx';
import VehicleDetailsPage from './data/vehicles/components/VehicleDetailsPage.tsx';
import DeckPlanCollectionPage from './data/deck-plans/components/DeckPlanCollectionPage.tsx';
import DeckPlanDetailsPage from './data/deck-plans/components/DeckPlanDetailsPage.tsx';
import TransportModeSprite from './components/icons/TransportModeSprite.tsx';
import MenuIconSprite from './components/icons/MenuIconSprite.tsx';
import { useIsFeatureOn } from './config/featureFlags.ts';
import { MAIN_CONTENT_ID } from './components/header/Header.tsx';
import './theme/transportModeTokens.css';

function AppShell({ children }: { children: ReactNode }) {
  const { expanded } = useNavRail();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Mobile renders Menu as a temporary Drawer (overlay), so no rail gutter — emit 0.
  const railWidth = isMobile ? 0 : expanded ? RAIL_EXPANDED_W : RAIL_COLLAPSED_W;
  return (
    <Box className="app-root" sx={{ '--nav-rail-width': `${railWidth}px` }}>
      {children}
    </Box>
  );
}

export default function App() {
  const { useCustomFeatures } = useCustomization();

  const { theme } = useAppTheme(useCustomFeatures);
  const isFeatureOn = useIsFeatureOn();
  const deckPlans = (page: ReactNode) =>
    isFeatureOn('DeckPlans') ? page : <Navigate to="/" replace />;

  return (
    <ThemeProvider theme={theme}>
      <NavRailProvider>
        <EditingProvider>
          <CssBaseline />
          <Header />
          <Menu />
          <Toolbar
            sx={{
              minHeight: { xs: '64px' },
            }}
          />
          <AppShell>
            <Box component="main" id={MAIN_CONTENT_ID} tabIndex={-1} className="app-content">
              <TransportModeSprite />
              <MenuIconSprite />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute element={<PageShell />} />}>
                  <Route path="vehicle-types" element={<VehicleTypeCollectionPage />} />
                  <Route path="vehicle-types/:id" element={<VehicleTypeDetailsPage />} />
                  <Route path="vehicles" element={<VehicleCollectionPage />} />
                  <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
                  <Route path="deck-plans" element={deckPlans(<DeckPlanCollectionPage />)} />
                  <Route path="deck-plans/:id" element={deckPlans(<DeckPlanDetailsPage />)} />
                </Route>
              </Routes>
            </Box>
          </AppShell>
          <SessionExpiredDialog />
        </EditingProvider>
      </NavRailProvider>
    </ThemeProvider>
  );
}
