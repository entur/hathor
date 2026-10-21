import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TransportModeSprite from '../src/components/icons/TransportModeSprite';
import MenuIconSprite from '../src/components/icons/MenuIconSprite';
import { ConfigContext, type Config } from '../src/contexts/configContext';
import '../src/i18n';
import '../src/theme/transportModeTokens.css';

const theme = createTheme();

// Stories render every flag-gated feature; a missing flag would hide it (isFeatureOn).
const STORY_CONFIG: Config = { sandboxFeatures: { DeckPlans: true }, enableDeckPlanRefs: true };

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
      <ConfigContext.Provider value={STORY_CONFIG}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TransportModeSprite />
          <MenuIconSprite />
          <Story />
        </ThemeProvider>
      </ConfigContext.Provider>
    ),
  ],
};

export default preview;
