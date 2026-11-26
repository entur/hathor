import type { ThemeOptions } from '@mui/material/styles';

/** One `@font-face` of a theme (abzu's `fonts.faces` shape); `src` is a URL or a path from the app base. */
export interface ThemeFontFace {
  family: string;
  src: string;
  format?: string;
  weight?: string;
  style?: string;
  display?: string;
  unicodeRange?: string;
}

export interface ThemeConfig extends ThemeOptions {
  /** The header's title for an installation that wants its own; the app's translated
   *  short title (`app.shortTitle`) otherwise. */
  applicationName?: string;
  companyName: string;
  logoUrl: string;
  logoHeight: number;
  /** Font files the theme loads; `typography.fontFamily` is what uses them. */
  fonts?: { faces: ThemeFontFace[] };
  //add your own custom additions here.
}

declare module '@mui/material/styles' {
  interface Theme {
    applicationName?: string;
    companyName: string;
    logoUrl: string;
    logoHeight: number;
    // add more custom fields here
  }
  interface ThemeOptions {
    applicationName?: string;
    companyName?: string;
    logoUrl?: string;
    logoHeight?: number;
    // add more custom fields here
  }
}
