import { describe, expect, it } from 'vitest';
import { mkScenery } from './scenery.ts';

const COLOURS = {
  sky: '#d9ddf2',
  ground: '#a3a4bb',
  road: '#8c8eab',
  line: '#ffffff',
  buildings: ['#c4c5d6', '#b5b6cb', '#a7a8c0'],
};
// What the test reads of three's objects (the ambient types name only what scenery builds with).
type Obj = {
  children: Obj[];
  position: { x: number; y: number; z: number };
  geometry: { type: string; parameters: { height?: number } };
};
const parts = () => (mkScenery(COLOURS) as unknown as Obj).children;
const buildings = () => parts().filter(m => m.geometry.type !== 'PlaneGeometry');

describe('mkScenery', () => {
  it('is the same street every time', () => {
    const at = () => parts().map(m => [m.geometry.type, m.position.x, m.position.y, m.position.z]);
    expect(at()).toEqual(at());
  });

  it('lays a road under the bus, at the origin, just over the ground', () => {
    const [road] = parts();
    expect(road.geometry.type).toBe('PlaneGeometry');
    expect(road.position.x).toBe(0);
    expect(road.position.y).toBeGreaterThan(0);
    expect(Math.abs(road.position.z)).toBeLessThan(3.5);
  });

  it('stands houses and flats both sides, clear of where the camera orbits', () => {
    const bs = buildings();
    expect(bs.some(b => b.position.z > 0)).toBe(true);
    expect(bs.some(b => b.position.z < 0)).toBe(true);
    bs.forEach(b => expect(Math.abs(b.position.z)).toBeGreaterThanOrEqual(45));
    // Some rise well over a bus: they break the skyline.
    expect(Math.max(...bs.map(b => b.geometry.parameters.height ?? 0))).toBeGreaterThan(12);
    expect(bs.some(b => b.geometry.type === 'CylinderGeometry')).toBe(true); // pitched roofs
  });
});
