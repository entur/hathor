import { DeckPlan } from '@/models/netex/deckplan/deckPlan';
export declare const parseNeTEx: (xml: string) => DeckPlan[];
export declare const extractEquipments: (equipmentsObj: any) => any[];
export declare const parseDeckplanOrNetex: (xml: string) => [DeckPlan, object | undefined];
