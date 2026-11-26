/**
 * A bus stage in the theme's colours: the sky the colour behind the picture, the ground and
 * the scenery shades of the primary colour, so they break clearly from the sky.
 *
 * shortcut: recolours the package's scenes from outside — `mkStage` has no `bg` option, unlike
 * `mkStageShot`, and picks its colours by `prefers-color-scheme`, and neither takes a ground;
 * pass them in once iteru-3dbus takes them, and drop the scene walk here.
 */
import type { Scene } from '@entur/iteru-3dbus';
import { alpha, decomposeColor, type Palette } from '@mui/material/styles';
import { over } from '../../../utils/colorOver.ts';

// The package's shot stage (dist-lib/index.js): the ground 6% toward black on a light
// background, toward white on a dark one; its bounce colours for each.
const GROUND_SHADE = 0.06,
  LIGHT_BOUNCE = '#bfc8ce',
  DARK_BOUNCE = '#2a3138';
/** A lit ground's light on an open floor (hemisphere 2.4, sun 2.7 · cos 46°, fill 0.8 · cos 66°,
 *  over π): a lit surface's albedo is its colour divided by it. */
export const FLOOR_LIGHT = 1.45;
// Above this brightness a background is light: the shot stage's own split, Rec. 709 weights
// on the sRGB values as they are (not MUI's linearised luminance, which calls a mid-grey dark).
const LIGHT_BRIGHTNESS = 0.5,
  REC709 = [0.2126, 0.7152, 0.0722];
// Shares of `primary.main` over paper: the ground, the road a step darker, the buildings
// lighter than the ground (they stand back, toward the sky).
const GROUND_MIX = 0.4,
  ROAD_MIX = 0.5,
  BUILDING_MIX = [0.26, 0.32, 0.38];

/** The colours of a bus stage, all opaque. */
export interface StageColours {
  sky: string;
  ground: string;
  road: string;
  /** The road's markings. */
  line: string;
  buildings: string[];
}

/** Light as the package judges a background (dist-lib/index.js `oe`). */
const isLight = (css: string) =>
  decomposeColor(css).values.reduce((sum, v, i) => sum + (REC709[i] ?? 0) * (v / 255), 0) >
  LIGHT_BRIGHTNESS;

/**
 * A stage's colours from the theme: the sky is a card picture's background (`action.hover` on
 * paper), the rest is `primary.main` on paper.
 *
 * @param {Palette} palette the theme's palette
 * @returns {StageColours} the colours
 */
export const stageColours = (palette: Palette): StageColours => {
  const paper = palette.background.paper;
  const mix = (share: number) => over(paper, alpha(palette.primary.main, share));
  return {
    sky: over(paper, palette.action.hover),
    ground: mix(GROUND_MIX),
    road: mix(ROAD_MIX),
    line: paper,
    buildings: BUILDING_MIX.map(mix),
  };
};

/**
 * The package's own ground on a background, as a card's bitmap has it.
 *
 * @param {string} bg the colour behind the picture, opaque
 * @returns {string} the ground, as `rgb()`
 */
export const groundOf = (bg: string): string => {
  return over(
    bg,
    isLight(bg) ? `rgba(0, 0, 0, ${GROUND_SHADE})` : `rgba(255, 255, 255, ${GROUND_SHADE})`
  );
};

/**
 * Recolours a stage's scene: sky and fog (a live stage has them; a shot's sky is the
 * picture's background), the ground disc, and the bounce light.
 *
 * @param {Scene} scene the stage's scene (a bus group's parent once added)
 * @param {Pick<StageColours, 'sky' | 'ground'>} colours the sky, and the ground as it should look
 */
export const themeStage = (scene: Scene, { sky, ground }: Pick<StageColours, 'sky' | 'ground'>) => {
  scene.background?.set(sky);
  scene.fog?.color.set(sky);
  const light = isLight(sky);
  scene.children.forEach(c => {
    // The live ground is lit, the shot's is not; a shot's shadow catcher keeps its colour.
    const m = c.isMesh ? c.material : undefined;
    if (m?.type === 'MeshStandardMaterial') m.color.set(ground).multiplyScalar(1 / FLOOR_LIGHT);
    if (m?.type === 'MeshBasicMaterial') m.color.set(ground);
    if (c.isHemisphereLight) c.groundColor?.set(light ? LIGHT_BOUNCE : DARK_BOUNCE);
  });
};
