import { type App } from 'vue';
import { parseNeTEx } from './helpers/parser';
import type { DeckPlan } from './models/netex/deckplan/deckPlan';
import { type Availability, PassengerSpotAvailability } from './models/view/seats';
import '@/assets/lib.css';
declare const _default: {
  install: (app: App) => void;
  DeckRenderingElement: unknown;
  parseNeTEx: (xml: string) => DeckPlan[];
};
export default _default;
export * from './components/editor';
export * from './components/renderer';
export * from './models';
export { parseNeTEx, type Availability, PassengerSpotAvailability };
