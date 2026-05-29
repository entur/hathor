import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.tsx';
import Home from './pages/Home';
import { SearchProvider } from './components/search';
import { CssBaseline, Toolbar, Box, ThemeProvider } from '@mui/material';
import { useCustomization } from './contexts/CustomizationContext.tsx';
import { useAppTheme } from './hooks/useAppTheme';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { EditingProvider } from './contexts/EditingContext.tsx';
import SessionExpiredDialog from './components/dialogs/SessionExpiredDialog.tsx';
import VehicleTypeView from './data/vehicle-types/components/VehicleTypeView.tsx';
import VehicleTypeEditor from './data/vehicle-types/pending-move/VehicleTypeEditor.tsx';
import DeckPlanView from './data/deck-plans/DeckPlanView.tsx';
import DeckPlanDetailsView from './data/deck-plans/DeckPlanDetailsView.tsx';
import VehicleView from './data/vehicles/components/VehicleView.tsx';
import VehicleCreatePage from './pages/VehicleCreatePage.tsx';
import TransportModeSprite from './components/icons/TransportModeSprite.tsx';
import './theme/transportModeTokens.css';

export default function App() {
  const { useCustomFeatures } = useCustomization();

  const { theme } = useAppTheme(useCustomFeatures);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <SearchProvider>
        <ThemeProvider theme={theme}>
          <EditingProvider>
            <CssBaseline />
            <Header />
            <Toolbar
              sx={{
                minHeight: { xs: '64px' },
              }}
            />
            <Box className="app-root">
              <Box className="app-content">
                <TransportModeSprite />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/vehicle-types"
                    element={<ProtectedRoute element={<VehicleTypeView />} />}
                  />
                  <Route path="/vehicles" element={<ProtectedRoute element={<VehicleView />} />} />
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
                    element={<ProtectedRoute element={<VehicleTypeEditor />} />}
                  />
                </Routes>
              </Box>
            </Box>
            <SessionExpiredDialog />
          </EditingProvider>
        </ThemeProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}
