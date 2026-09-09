/** Seat pitch along the deck and half the aisle gap across it, in metres. */
const PITCH = 0.9,
  AISLE = 0.75;

/** Seat footprint, and the deck's fixed width, in metres. */
const SEAT = 0.7,
  DECK_WIDTH = 2.825;

/** One deck to synthesise: an optional `<Name>` and a seat count. */
export interface SampleDeck {
  name?: string;
  seats: number;
}

/**
 * Build a NeTEx `PublicationDelivery` carrying one deck plan.
 *
 * Story and test fixture only — not app code. It exists so stories can drive
 * the real parser and renderer without a backend; production documents come
 * from `useDeckPlanXml`. Nesting matches what the library's parser walks
 * (`dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan`) and
 * what live Sobek returns.
 *
 * Seats are laid out in rows of two either side of an aisle, each with a
 * `Centroid` — without one the renderer stacks every seat at the origin.
 *
 * @param decks Decks to synthesise; an empty array yields `<decks/>`, the
 *   shape real Sobek data comes back with and the SAMPLE ghost's trigger.
 * @param id NeTEx id for the synthesised plan. Callers that render through
 *   the editor must pass the id their form carries — the render path selects
 *   the plan by id, as the save path patches by it.
 * @returns A complete NeTEx document.
 */
export function mkSampleDeckPlanXml(decks: SampleDeck[], id = 'SAMPLE:DeckPlan:1'): string {
  const body = decks.map(mkDeck).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <CompositeFrame version="1" id="SAMPLE:CompositeFrame:1">
      <frames>
        <ResourceFrame version="1" id="SAMPLE:ResourceFrame:1">
          <deckPlans>
            <DeckPlan version="1" id="${id}">
              ${decks.length === 0 ? '<decks/>' : `<decks>${body}</decks>`}
            </DeckPlan>
          </deckPlans>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;
}

/** One `<Deck>`, long enough to hold its seats. */
function mkDeck({ name, seats }: SampleDeck, d: number): string {
  const rows = Math.ceil(seats / 2);
  const spots = Array.from({ length: seats }, (_, i) => mkSpot(d, i)).join('');
  return `
                <Deck version="1" id="SAMPLE:Deck:${d + 1}">
                  ${name ? `<Name>${name}</Name>` : ''}
                  <deckSpaces>
                    <PassengerSpace version="1" id="SAMPLE:PassengerSpace:${d + 1}">
                      <passengerSpots>${spots}
                      </passengerSpots>
                    </PassengerSpace>
                  </deckSpaces>
                  <Width>${DECK_WIDTH}</Width>
                  <Length>${(rows + 1) * PITCH + 0.6}</Length>
                </Deck>`;
}

/** One `<PassengerSpot>`, placed by row and side of the aisle. */
function mkSpot(d: number, i: number): string {
  const row = Math.floor(i / 2),
    side = i % 2;
  const x = 1.2 + row * PITCH,
    y = DECK_WIDTH / 2 + (side ? AISLE : -AISLE);
  return `
                        <PassengerSpot version="1" id="SAMPLE:PassengerSpot:${d + 1}-${i + 1}">
                          <Label>${row + 1}${side ? 'B' : 'A'}</Label>
                          <Orientation>backwards</Orientation>
                          <Centroid><Location><pos>${x.toFixed(2)} ${y.toFixed(2)}</pos></Location></Centroid>
                          <Width>${SEAT}</Width>
                          <Length>${SEAT}</Length>
                        </PassengerSpot>`;
}
