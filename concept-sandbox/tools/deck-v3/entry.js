/**
 * `<deck-rendering-v3>` and `<deck-grid-v3>`: the v3 deck-plan editor's exact
 * and grid renderers (`DeckExactRenderer.vue`, `OSDMRenderer.vue`; GitLab
 * `opentrainticketing/deckplan-editor`) as custom elements, so the sandbox can
 * show them beside the 2.0.5 `<deck-rendering>` and `DeckGridRenderer`.
 *
 * v3 ships no web component and no self-contained bundle; this file is the whole
 * adapter. `build.mjs` resolves `@v3/*` to a local v3 checkout and bundles Vue,
 * the library and Tailwind into one ES module. Importing it registers the tag
 * tags and re-exports the v3 parser, because a v3 element only draws v3 model
 * objects, and `netexToOsdm`, because its throws are the grid's error messages.
 */
import { defineCustomElement, defineComponent, h } from 'vue';
import { PassengerSpace, PassengerSpot } from 'netex-deckplan-library';
import DeckExactRenderer from '@v3/components/src/components/DeckPlanEditor/components/DeckExactRenderer/DeckExactRenderer.vue';
import OSDMRenderer from '@v3/components/src/components/DeckPlanEditor/components/OSDMRenderer.vue';
import tailwind from '@v3/components/src/assets/main.css?inline';

export { loadNeTEx, netexToOsdm } from 'netex-deckplan-library';

/** Tags the module registers. */
export const TAG = 'deck-rendering-v3',
  GRID_TAG = 'deck-grid-v3';

/** Gridline pitch: one `netexToOsdm` cell, as v3's own `MainPanel` passes it. */
const GRID_SPACING = 100;

/**
 * Host fills its box; `vertical` lays the landscape drawing into a portrait box
 * by giving the renderer the host's swapped dimensions (container-query units)
 * and turning it a quarter.
 */
const HOST_CSS = `
  :host { display: block; width: 100%; height: 100%; container-type: size; }
  .frame { width: 100%; height: 100%; }
  .frame.vertical {
    width: 100cqh; height: 100cqw;
    transform-origin: top left; transform: translateX(100cqw) rotate(90deg);
  }`;

/** Upstream draws the grid at half its box (`h-[50%] w-[50%]`); a pane wants all of it. */
const GRID_CSS = 'svg[aria-label="Deck layout"] { width: 100%; height: 100%; }';

/**
 * Seats of a deck, flattened. Lets the sandbox count what v3 would draw: the
 * renderer itself skips any seat without a `Centroid`.
 *
 * @param {object} deck v3 `Deck` from `loadNeTEx`.
 * @returns {{placed: number, total: number}} Seats with and without a centroid.
 */
export const countSeats = deck => {
  const seats = deck.deckspaces
    .filter(space => space instanceof PassengerSpace)
    .flatMap(space => space.passengerSpots ?? [])
    .filter(spot => spot instanceof PassengerSpot);
  return { placed: seats.filter(seat => seat.Centroid).length, total: seats.length };
};

const DeckRenderingV3 = defineComponent({
  props: { deck: Object, vertical: Boolean },
  styles: [tailwind, HOST_CSS],
  setup(props) {
    return () => {
      const box = props.deck?.polygon?.getBoundingBox();
      return h(
        'div',
        { class: ['frame', { vertical: props.vertical }] },
        box ? h(DeckExactRenderer, { deck: props.deck, boundingBox: box }) : 'No deck polygon'
      );
    };
  },
});

/**
 * The grid reading: takes the OSDM `CoachDeckLayout` rather than the deck, so
 * the page runs `netexToOsdm` itself and can report the decks it refuses.
 */
const DeckGridV3 = defineComponent({
  props: { layout: Object, vertical: Boolean },
  styles: [tailwind, HOST_CSS, GRID_CSS],
  setup(props) {
    return () =>
      h(
        'div',
        { class: ['frame', { vertical: props.vertical }] },
        props.layout && h(OSDMRenderer, { deck: props.layout, gridSpacing: GRID_SPACING })
      );
  },
});

for (const [tag, component] of [
  [TAG, DeckRenderingV3],
  [GRID_TAG, DeckGridV3],
])
  if (!customElements.get(tag)) customElements.define(tag, defineCustomElement(component));
