import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider } from '@mui/material';
import TransportModeSprite from '../src/components/icons/TransportModeSprite';
import MenuIconSprite from '../src/components/icons/MenuIconSprite';
import { ConfigContext, type Config } from '../src/contexts/configContext';
import { createThemeFromConfig } from '../src/theme/createThemeFromConfig';
import type { ThemeConfig } from '../src/theme/theme-config';
import { withLocalNationale } from '../src/theme/localNationale';
import { fontFaceCss } from '../src/theme/themeFonts';
import themeDev from '../.github/environments/theme-dev.json';
import '../src/i18n';
import '../src/theme/transportModeTokens.css';

// Stories render in dev's Entur theme, as the app does (#264) — in Nationale when it is set up locally.
const STORY_THEME = withLocalNationale(themeDev as ThemeConfig);
const theme = createThemeFromConfig(STORY_THEME);

// Its `@font-face` rules in `<head>`, once, as the app's theme hook puts them.
if (STORY_THEME.fonts)
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style data-theme-font>${fontFaceCss(STORY_THEME.fonts.faces)}</style>`
  );

// Stories render every flag-gated feature; a missing flag would hide it (useIsFeatureOn).
const STORY_CONFIG: Config = { sandboxFeatures: { DeckPlans: true, BusPictures: true } };

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
