/**
 * Placeholder deck plan rendered when a real plan carries an empty `<decks/>`.
 *
 * Fed through the *same* bundle's `parseNeTEx` as real plans — see
 * `loadDeckRenderer` — because the renderer matches deck spaces with
 * `instanceof`. The library's own `DeckPlan.empty()` is deliberately not used:
 * it lives on the Vue entry, so reaching it would load a second copy of the
 * models and break that identity.
 *
 * Shape mirrors `Deck.empty()` — one bare deck, no deck spaces. The nesting is
 * fixed by the library's parser, which walks
 * `dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan`.
 */
export const GHOST_DECK_PLAN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <CompositeFrame version="1" id="GHOST:CompositeFrame:1">
      <frames>
        <ResourceFrame version="1" id="GHOST:ResourceFrame:1">
          <deckPlans>
            <DeckPlan version="1" id="GHOST:DeckPlan:1">
              <decks>
                <Deck version="1" id="GHOST:Deck:1">
                  <Width>2.825</Width>
                  <Length>26.4</Length>
                </Deck>
              </decks>
            </DeckPlan>
          </deckPlans>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;
