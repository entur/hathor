/**
 * Ambient types for `@entur/iteru-3dbus`, which ships none — narrowed to what
 * `bus-picture` uses. three.js objects stay opaque, so hathor needs no
 * `@types/three`. Remove this file if upstream ships declarations.
 */
declare module '@entur/iteru-3dbus/core' {
  /** Schema errors of a bus input; empty when it is valid. */
  export const validate: (inp: unknown) => string[];
  /** Total length in mm, bellows included. */
  export const total: (inp: unknown) => number;
  /** Metres per mm, the scene's unit. */
  export const MM: number;
  /** The bus-input JSON Schema. */
  export const schema: {
    properties: Record<string, { minimum?: number; maximum?: number }>;
    $defs: Record<string, { properties: Record<string, { minimum?: number; maximum?: number }> }>;
  };
}

declare module '@entur/iteru-3dbus' {
  export { total, MM } from '@entur/iteru-3dbus/core';

  /** A `THREE.Color`, as far as hathor sets it. */
  export interface Colour {
    set: (css: string) => Colour;
    multiplyScalar: (s: number) => Colour;
  }
  /** A `THREE.Scene`, as far as hathor recolours it. */
  export interface Scene {
    background: Colour | null;
    fog: { color: Colour } | null;
    children: {
      isMesh?: boolean;
      isHemisphereLight?: boolean;
      material?: { color: Colour };
      groundColor?: Colour;
    }[];
  }
  /** A `THREE.Group`, opaque here but for its place and the scene it was added to. */
  export type BusGroup = { position: { x: number }; parent: Scene | null };
  /** A `THREE.Vector3`, as far as the camera motion reads and writes it. */
  export interface Vec3 {
    x: number;
    y: number;
    z: number;
    set: (x: number, y: number, z: number) => void;
    lerp: (to: Vec3, t: number) => void;
  }
  /** The live stage: a canvas in the host element, orbit controls, a frame loop. */
  export interface Stage {
    cam: { position: Vec3 };
    /** `OrbitControls`: `start` fires when the reader grabs the view. */
    ctl: {
      target: Vec3;
      addEventListener: (type: 'start', fn: () => void) => void;
      removeEventListener: (type: 'start', fn: () => void) => void;
    };
    /** Run every frame, before the render. */
    ticks: (() => void)[];
    add: (group: BusGroup) => void;
    drop: (group: BusGroup) => void;
    /** Stops the loop, frees the WebGL context and removes the canvas. */
    dispose: () => void;
  }
  export interface ShotStage {
    cam: { position: { lerp: (to: unknown, t: number) => void } };
    ctl: { target: unknown };
    add: (group: BusGroup) => void;
    drop: (group: BusGroup) => void;
    /** Renders the stage to a PNG. */
    shot: () => Promise<Blob>;
    /** Gives the WebGL context back. */
    dispose: () => void;
  }

  /** SVG face maps per box side for a valid input. */
  export const faces: (inp: unknown) => unknown;
  export const mkBus: (inp: unknown, maps: unknown, opts?: { detail?: number }) => BusGroup;
  /** A live stage in `el` (sky and ground follow `prefers-color-scheme`); throws without WebGL. */
  export const mkStage: (el: HTMLElement) => Stage;
  /** One off-screen stage, one WebGL context, for shooting many buses in turn. */
  export const mkStageShot: (opts?: { w?: number; h?: number; bg?: string }) => ShotStage;
  /** Camera views over a stage; returns `go(view, instant)`. */
  export const mkViews: (
    stage: Pick<ShotStage, 'cam' | 'ctl'> | Stage,
    cur: () => { group: BusGroup | null; len: number }
  ) => (view: string, instant?: boolean) => void;
}
