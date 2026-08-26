import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TransportModeSprite from '../src/components/icons/TransportModeSprite';
import MenuIconSprite from '../src/components/icons/MenuIconSprite';
import '../src/i18n';
import '../src/theme/transportModeTokens.css';

const theme = createTheme();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TransportModeSprite />
        <MenuIconSprite />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
