import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Stack,
  type SelectChangeEvent,
} from '@mui/material';
import { useCustomization } from '../../contexts/CustomizationContext.tsx';
import { useTranslation } from 'react-i18next';

/** A theme's label is its file name — only the active theme is loaded (abzu `ThemeSwitcher`). */
const themeLabel = (path: string) =>
  (path.split('/').pop() ?? path)
    .replace(/\.json$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { themes, themePath, setThemePath } = useCustomization();
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value as string);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {themes.length > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography id="theme-select-label">{t('settings.theme')}</Typography>
              <FormControl>
                <Select
                  labelId="theme-select-label"
                  value={themePath}
                  onChange={(event: SelectChangeEvent) => setThemePath(event.target.value)}
                  notched={false}
                >
                  {themes.map(path => (
                    <MenuItem key={path} value={path}>
                      {themeLabel(path)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>{t('settings.language')}</Typography>
            <FormControl>
              <Select
                labelId="language-select-label"
                value={i18n.resolvedLanguage}
                onChange={handleLanguageChange}
                label={t('settings.language')}
                notched={false}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="nb">Norsk (Bokmål)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
