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

  /** A `THREE.Group`, opaque here. */
  export type BusGroup = { position: { x: number } };
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
  /** One off-screen stage, one WebGL context, for shooting many buses in turn. */
  export const mkStageShot: (opts?: { w?: number; h?: number; bg?: string }) => ShotStage;
  /** Camera views over a stage; returns `go(view, instant)`. */
  export const mkViews: (
    stage: ShotStage,
    cur: () => { group: BusGroup | null; len: number }
  ) => (view: string, instant?: boolean) => void;
}
