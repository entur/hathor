import type { TypographyVariantsOptions } from '@mui/material/styles';
import type { ThemeConfig } from './theme-config';

/** The parts of the local theme taken over: its font faces and family. */
type FontBits = Pick<ThemeConfig, 'fonts'> & { typography?: { fontFamily?: string } };

// Written by `npm run local-nationale-setup` (licensed, gitignored): absent on CI and in forks,
// where the glob finds nothing and themes keep their own fonts.
const [local] = Object.values(
  import.meta.glob<FontBits>('../../public/theme-nationale.json', {
    eager: true,
    import: 'default',
  })
);

/**
 * `theme` with Nationale's font faces and family laid over it, when this checkout has
 * Nationale set up locally; else `theme` as is. For stories: the app gets it via config.json.
 *
 * @param {ThemeConfig} theme the theme the story renders in
 * @returns {ThemeConfig} the same theme, in Nationale when it is found
 */
export const withLocalNationale = (theme: ThemeConfig): ThemeConfig =>
  local?.fonts
    ? {
        ...theme,
        fonts: local.fonts,
        // A theme JSON's typography is an object, never MUI's palette function.
        typography: {
          ...(theme.typography as TypographyVariantsOptions),
          fontFamily: local.typography?.fontFamily,
        },
      }
    : theme;
