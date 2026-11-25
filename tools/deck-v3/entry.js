/**
 * `<deck-rendering-v3>`: the v3 deck-plan editor's exact renderer
 * (`DeckExactRenderer.vue`, GitLab `opentrainticketing/deckplan-editor`) as a
 * custom element, so the sandbox can show it beside the 2.0.5 `<deck-rendering>`.
 *
 * v3 ships no web component and no self-contained bundle; this file is the whole
 * adapter. `build.mjs` resolves `@v3/*` to a local v3 checkout and bundles Vue,
 * the library and Tailwind into one ES module. Importing it registers the tag
 * and re-exports the v3 parser, because a v3 element only draws v3 model objects.
 */
import { defineCustomElement, defineComponent, h } from 'vue';
import { PassengerSpace, PassengerSpot } from 'netex-deckplan-library';
import DeckExactRenderer from '@v3/components/src/components/DeckPlanEditor/components/DeckExactRenderer/DeckExactRenderer.vue';
import tailwind from '@v3/components/src/assets/main.css?inline';

export { loadNeTEx, getDecksBoundingBox } from 'netex-deckplan-library';

/** Tag the module registers. */
export const TAG = 'deck-rendering-v3';

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

if (!customElements.get(TAG)) customElements.define(TAG, defineCustomElement(DeckRenderingV3));
