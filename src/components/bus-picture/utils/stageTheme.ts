/**
 * The live stage in the theme's colours, as the bitmap: sky and fog the colour behind the
 * picture, the ground a shade off it, the bounce light the package's light or dark one.
 *
 * shortcut: recolours `mkStage`'s scene from outside — it has no `bg` option, unlike
 * `mkStageShot`, and picks its colours by `prefers-color-scheme`; pass `bg` to `mkStage`
 * once iteru-3dbus takes one, and drop this file.
 */
import type { Scene } from '@entur/iteru-3dbus';
import { getLuminance } from '@mui/material/styles';
import { over } from '../../../utils/colorOver.ts';

// The package's shot stage (dist-lib/index.js): the ground 6% toward black on a light
// background, toward white on a dark one; its bounce colours for each.
const GROUND_SHADE = 0.06,
  LIGHT_BOUNCE = '#bfc8ce',
  DARK_BOUNCE = '#2a3138';
// The live ground is lit, the shot's is not: the light on an open floor (hemisphere 2.4,
// sun 2.7 · cos 46°, fill 0.8 · cos 66°, over π) — its albedo is the colour divided by it.
const FLOOR_LIGHT = 1.45;

/**
 * The ground's colour on a background, as the bitmap's.
 *
 * @param {string} bg the colour behind the picture, opaque
 * @returns {string} the ground, as `rgb()`
 */
export const groundOf = (bg: string): string => {
  const light = getLuminance(bg) > 0.5;
  return over(
    bg,
    light ? `rgba(0, 0, 0, ${GROUND_SHADE})` : `rgba(255, 255, 255, ${GROUND_SHADE})`
  );
};

/**
 * Recolours a live stage's scene for a background.
 *
 * @param {Scene} scene the stage's scene (a bus group's parent once added)
 * @param {string} bg the colour behind the picture, opaque
 */
export const themeStage = (scene: Scene, bg: string): void => {
  scene.background?.set(bg);
  scene.fog?.color.set(bg);
  const light = getLuminance(bg) > 0.5;
  scene.children.forEach(c => {
    if (c.isMesh) c.material?.color.set(groundOf(bg)).multiplyScalar(1 / FLOOR_LIGHT);
    if (c.isHemisphereLight) c.groundColor?.set(light ? LIGHT_BOUNCE : DARK_BOUNCE);
  });
};
