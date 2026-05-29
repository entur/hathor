import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.tsx';
import Menu from './components/Menu.tsx';
import Home from './pages/Home';
import { SearchProvider } from './components/search';
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
import VehicleTypeView from './data/vehicle-types/VehicleTypeView.tsx';
import VehicleTypeDetails from './data/vehicle-types/VehicleTypeDetails.tsx';
import DeckPlanView from './data/deck-plans/DeckPlanView.tsx';
import DeckPlanDetailsView from './data/deck-plans/DeckPlanDetailsView.tsx';
import VehicleView from './data/vehicles/components/VehicleView.tsx';
import VehicleCreatePage from './pages/VehicleCreatePage.tsx';
import TransportModeSprite from './components/icons/TransportModeSprite.tsx';
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

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <SearchProvider>
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
                <Box className="app-content">
                  <TransportModeSprite />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/vehicle-types"
                      element={<ProtectedRoute element={<VehicleTypeView />} />}
                    />
                    <Route
                      path="/vehicles"
                      element={<ProtectedRoute element={<VehicleView />} />}
                    />
                    <Route
                      path="/vehicles/new"
                      element={<ProtectedRoute element={<VehicleCreatePage />} />}
                    />
                    <Route
                      path="/deck-plans"
                      element={<ProtectedRoute element={<DeckPlanView />} />}
                    />
                    <Route
                      path="/deck-plans/:id"
                      element={<ProtectedRoute element={<DeckPlanDetailsView />} />}
                    />
                    <Route
                      path="/vehicle-types/new"
                      element={<ProtectedRoute element={<VehicleTypeDetails />} />}
                    />
                    <Route
                      path="/vehicle-types/:id"
                      element={<ProtectedRoute element={<VehicleTypeDetails />} />}
                    />
                  </Routes>
                </Box>
              </AppShell>
              <SessionExpiredDialog />
            </EditingProvider>
          </NavRailProvider>
        </ThemeProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}
