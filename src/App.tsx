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
import VehicleTypeView from './pages/VehicleTypeView.tsx';
import VehicleImportView from './pages/VehicleImportView.tsx';

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
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/vehicle-type"
                    element={<ProtectedRoute element={<VehicleTypeView />} />}
                  />
                  <Route
                    path="/vehicle-import"
                    element={<ProtectedRoute element={<VehicleImportView />} />}
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
