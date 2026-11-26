import { describe, expect, it, vi } from 'vitest';
import type { Colour, Scene } from '@entur/iteru-3dbus';
import { createTheme, getLuminance } from '@mui/material/styles';
import { groundOf, stageColours, themeStage } from './stageTheme.ts';

const colour = () => {
  const c: Colour = { set: vi.fn(() => c), multiplyScalar: vi.fn(() => c) };
  return c;
};

describe('stageTheme', () => {
  it('shades the ground off the background, darker on light and lighter on dark', () => {
    expect(groundOf('rgb(255, 255, 255)')).toBe('rgb(240, 240, 240)');
    expect(groundOf('rgb(0, 0, 0)')).toBe('rgb(15, 15, 15)');
    // A mid-grey is light to the package (plain sRGB brightness 0.6), as a card's shot has it.
    expect(groundOf('rgb(153, 153, 153)')).toBe('rgb(144, 144, 144)');
  });

  it('draws the ground and road from primary, clearly off the sky', () => {
    const palette = createTheme({
      palette: { primary: { main: '#181C56' }, action: { hover: '#d9ddf2' } },
    }).palette;
    const c = stageColours(palette);
    expect(c.sky).toBe('rgb(217, 221, 242)');
    expect(c.ground).toBe('rgb(163, 164, 187)');
    expect(c.road).toBe('rgb(140, 142, 171)');
    // The sky is light, the ground a good step darker, the road darker still.
    expect(getLuminance(c.sky) - getLuminance(c.ground)).toBeGreaterThan(0.25);
    expect(getLuminance(c.ground)).toBeGreaterThan(getLuminance(c.road));
    c.buildings.forEach(b => expect(getLuminance(b)).toBeGreaterThan(getLuminance(c.ground)));
  });

  it('paints sky, fog, lit and unlit ground, and bounce; leaves the rest be', () => {
    const [sky, fog, litGround, flatGround, shadow, bounce] = Array.from({ length: 6 }, colour);
    const scene: Scene = {
      background: sky,
      fog: { color: fog },
      children: [
        { isHemisphereLight: true, groundColor: bounce },
        { isMesh: true, material: { type: 'MeshStandardMaterial', color: litGround } },
        { isMesh: true, material: { type: 'MeshBasicMaterial', color: flatGround } },
        { isMesh: true, material: { type: 'ShadowMaterial', color: shadow } },
        {},
      ],
    };
    themeStage(scene, { sky: 'rgb(20, 20, 20)', ground: 'rgb(60, 60, 90)' });
    expect(sky.set).toHaveBeenCalledWith('rgb(20, 20, 20)');
    expect(fog.set).toHaveBeenCalledWith('rgb(20, 20, 20)');
    expect(litGround.set).toHaveBeenCalledWith('rgb(60, 60, 90)');
    expect(litGround.multiplyScalar).toHaveBeenCalledWith(expect.closeTo(1 / 1.45));
    expect(flatGround.set).toHaveBeenCalledWith('rgb(60, 60, 90)');
    expect(flatGround.multiplyScalar).not.toHaveBeenCalled();
    expect(shadow.set).not.toHaveBeenCalled();
    expect(bounce.set).toHaveBeenCalledWith('#2a3138');
  });
});
