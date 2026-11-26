import { describe, expect, it, vi } from 'vitest';
import type { Colour, Scene } from '@entur/iteru-3dbus';
import { groundOf, themeStage } from './stageTheme.ts';

const colour = () => {
  const c: Colour = { set: vi.fn(() => c), multiplyScalar: vi.fn(() => c) };
  return c;
};

describe('stageTheme', () => {
  it('shades the ground off the background, darker on light and lighter on dark', () => {
    expect(groundOf('rgb(255, 255, 255)')).toBe('rgb(240, 240, 240)');
    expect(groundOf('rgb(0, 0, 0)')).toBe('rgb(15, 15, 15)');
  });

  it('paints sky, fog, ground and bounce; leaves the lights and buses be', () => {
    const [sky, fog, ground, bounce] = [colour(), colour(), colour(), colour()];
    const scene: Scene = {
      background: sky,
      fog: { color: fog },
      children: [
        { isHemisphereLight: true, groundColor: bounce },
        { isMesh: true, material: { color: ground } },
        {},
      ],
    };
    themeStage(scene, 'rgb(20, 20, 20)');
    expect(sky.set).toHaveBeenCalledWith('rgb(20, 20, 20)');
    expect(fog.set).toHaveBeenCalledWith('rgb(20, 20, 20)');
    expect(ground.set).toHaveBeenCalledWith('rgb(34, 34, 34)');
    expect(ground.multiplyScalar).toHaveBeenCalledWith(expect.closeTo(1 / 1.45));
    expect(bounce.set).toHaveBeenCalledWith('#2a3138');
  });
});
