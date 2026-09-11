/**
 * Two patches that make a schema-valid NeTEx deck plan render correctly in
 * `@opentrainticketing/netex-deckplan-editor`'s `<deck-rendering>` element.
 *
 * Written for whoever maintains that element. Nothing here is specific to the
 * page that calls it: both functions are string in, string out, and depend on
 * nothing but `DOMParser` / `XMLSerializer`.
 *
 * ---
 *
 * **The short version.** A NeTEx `DeckPlan` and the 2.0.5 renderer describe the
 * same railcar in terms that do not meet, in four ways. Each is documented in
 * full at the constant or function that answers it; this is the map.
 *
 * 1. **Extent.** `Deck` extends `Zone`, not `OnboardSpace`, so it has no
 *    `Width`/`Length` in its content model — and those are the only fields the
 *    renderer reads for a deck's size. The geometry `Zone` *does* give it
 *    (`Centroid`, `gml:Polygon`) is dropped on parse. With nothing to read, the
 *    constructor falls back to a literal 2.825 x 26.4 m car, which for most of
 *    the 81-fragment corpus this module was verified against (see below) is
 *    narrower than its own seats — and since the `<svg>` is
 *    sized from that same figure with no `viewBox`, the overflow is *clipped*.
 *    → `invalidateXMLForDeckExtent`
 *
 * 2. **Frame.** NeTEx writes a position along-then-across. Artwork of the same
 *    cars plots across-then-along. That swap is a transpose — determinant −1 —
 *    and the only orientation lever the element offers is `vertical`, a
 *    `rotate(90, …)` whose determinant is +1. No rotation composes a
 *    reflection, so the two differ by a mirror that survives every setting.
 *    → `hackXMLForDeckEdPlacement`
 *
 * 3. **Facing.** The backrest is drawn at the seat's `+x` edge and `forwards`
 *    adds `rotate(180)`, which points a forward-facing passenger at the rear of
 *    the car. `forwards` and `backwards` are transposed.
 *    → `INVERTED_ORIENTATION`
 *
 * 4. **Spot extents.** `PassengerSpot.getShape()` reads `Width` onto the deck's
 *    x — the car's *length* — and `Length` onto its y. NeTEx means the
 *    opposite. Latent on a near-square seat, a quarter-turn error on a berth.
 *    → `hackXMLForDeckEdPlacement`
 *
 * Two further exports exist for a caller that wants to *explain* the patches
 * rather than only apply them — `MIRRORED_ORIENTATION` / `INVERTED_ORIENTATION`
 * name which rewrite answers which fault — alongside `DECL_RE` and `kids`,
 * which are the patches' own plumbing, exported so a caller doing its own
 * traversal of these documents need not restate them.
 *
 * (1) is a contract gap: no document can be both valid and renderable, because
 * the fields the renderer needs are the fields the schema forbids. (2), (3) and
 * (4) are plain bugs in the renderer, and each could be fixed there instead —
 * at which point the matching constant or block here should be deleted, which
 * is why they are kept separable rather than merged into one rewrite.
 *
 * **These are rendering patches, not corrections.** The document going in is
 * the one that is right. Output is for `parseNeTEx` only: (1) deliberately
 * invalidates the document, and (2)–(4) deliberately state things about the car
 * that are false, so that a renderer reading them the wrong way round arrives
 * at the truth. Never write the result back to disk, and never send it to a
 * NeTEx consumer.
 *
 * Verified against `netex-deckplan-editor@2.0.5` over 81 generated fragments.
 * Evidence for each claim sits with the thing it justifies.
 */

/** XML declaration a fragment file opens with. */
export const DECL_RE = /^\s*<\?xml[^>]*\?>\s*/;

/** Decimals kept on a derived extent — what the source coordinates carry. */
const EXTENT_DP = 4;

/**
 * `Orientation` values that change under a mirror of the across axis, and
 * what they become. `forwards` and `backwards` run along the car and are
 * their own reflections, so they are absent rather than mapped to themselves.
 */
export const MIRRORED_ORIENTATION = { leftwards: 'rightwards', rightwards: 'leftwards' };

/**
 * `Orientation` values the renderer draws the wrong way round, and what they
 * have to say instead to come out right.
 *
 * Kept apart from `MIRRORED_ORIENTATION` because it is a different fault with
 * a different life expectancy. The mirror swap above follows from the
 * reflection: reflect a car and its sideways seats genuinely do turn around.
 * This one follows from nothing — 2.0.5 draws the backrest at the seat's `+x`
 * edge and then turns it by 180° for `forwards`, which points a
 * forward-facing passenger at the back of the car. The two enum values are
 * simply transposed.
 *
 * Measured rather than assumed: across A5-1's 48 seats, `forwards` and
 * `backwards` track the source drawing's two seat glyphs exactly, 24 and 24
 * with no exceptions, and the drawing puts the headrest at the opposite end
 * from the one the renderer does in every case. The bays settle which end of
 * the glyph is the headrest — rows sharing a table face each other.
 *
 * A reflection cannot reach this: it sends an angle to its negative, and
 * `forwards` (180°) and `backwards` (0°) are both their own negatives. So it
 * survives the mirror, and has to be undone on its own.
 *
 * Delete this — and only this — if the renderer's mapping is ever corrected.
 */
export const INVERTED_ORIENTATION = { forwards: 'backwards', backwards: 'forwards' };

/** Every `Orientation` rewrite the patch makes, from both causes above. */
const SWAPPED_ORIENTATION = { ...MIRRORED_ORIENTATION, ...INVERTED_ORIENTATION };

/**
 * Direct children of an element by local name, namespace ignored.
 *
 * `getElementsByTagName*` walks the whole subtree, and a deck's spots and
 * entrances carry `Width`, `Length` and geometry of their own — asking the
 * deck for its width that way answers with a seat's.
 *
 * @param {Element} el Parent to look under.
 * @param {string} name Local name to match.
 * @returns {Element[]} Matching children, in document order.
 */
export const kids = (el, name) => [...el.children].filter(c => c.localName === name);

/**
 * Parse a `<decks>` fragment, refusing anything that is not well-formed.
 *
 * Both patches start here, and both have to: the second re-parses what the
 * first wrote, so a malformed document must announce itself rather than
 * silently produce a `<parsererror>` tree that the loops below would then walk
 * to no effect.
 *
 * @param {string} xml Fragment text, declaration optional.
 * @returns {Document} The parsed document.
 * @throws {Error} If the document does not parse.
 */
const parseFragment = xml => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(`deck fragment does not parse: ${err.textContent.trim()}`);
  return doc;
};

/**
 * Serialise a patched document, carrying its declaration over exactly once.
 *
 * Browsers disagree about whether `serializeToString` reproduces the XML
 * declaration — Chrome emits it, Firefox does not — so neither prepending
 * it nor trusting it is right on its own. Prepending alone yields two on
 * Chrome, which the bundle's own parser forgives (it reads a stray
 * declaration as just another processing instruction) but a strict
 * `DOMParser` rejects outright: `XML declaration allowed only at the start
 * of the document`. That is the whole reason these patches have to be
 * composable — the second one re-parses what the first one wrote.
 *
 * @param {Document} doc Patched document.
 * @param {string} src The text it was parsed from, declaration and all.
 * @returns {string} `doc` serialised behind `src`'s declaration.
 */
const serialize = (doc, src) =>
  (src.match(DECL_RE)?.[0] ?? '') + new XMLSerializer().serializeToString(doc).replace(DECL_RE, '');

/**
 * Restate every deck's extent in the two elements the renderer reads.
 *
 * A deck's size is the one thing a NeTEx document cannot say and the
 * renderer cannot do without. `Deck` extends `Zone` directly, so it never
 * reaches `OnboardSpace` and has no `Width` / `Length` in its content
 * model; what `Zone` gives it instead — `Centroid` and a `gml:Polygon` —
 * the 2.0.5 bundle drops on parse, its lowercase `polygon` key never
 * matching the `Polygon` that namespace-stripping hands it. With nothing to
 * read the constructor falls back to a literal 2.825 x 26.4 m car, which on
 * most of the corpus is narrower than its own seats: the renderer sizes the
 * `<svg>` from that same figure and emits no `viewBox`, so the overflow is
 * clipped rather than merely drawn outside the outline.
 *
 * So the extent is copied from the outline into the elements the renderer
 * does read, and the document stops validating — which is the whole of what
 * this function does, and why it is named for it. Hand the result to
 * `parseNeTEx`, never to sobek, and never write it back to disk.
 *
 * The outline stays where it is. The renderer ignores it, and it is the
 * only statement of the extent a schema will take, so dropping it would
 * leave the fragment saying nothing true about its own size.
 *
 * `Width` and `Length` are appended last, out of the `xs:sequence` they
 * would need to sit in — the parser matches children by name, not by
 * position (verified against 2.0.5 with both placements), and an invalid
 * document is better off wearing its invalidity where a reader will see it.
 *
 * A deck already carrying `Width` — the editor's own samples do, which is
 * why they are the only fragments in the set that draw correctly — is left
 * exactly as it is.
 *
 * @param {string} validXML A `<decks>`-rooted fragment whose decks state
 *   their extent as a `gml:Polygon`, declaration included.
 * @returns {string} The same document with each deck's extent restated as
 *   `Width` / `Length`: renderable, and no longer schema-valid.
 * @throws {Error} If the document does not parse.
 */
export const invalidateXMLForDeckExtent = validXML => {
  const doc = parseFragment(validXML);

  for (const deck of doc.getElementsByTagNameNS('*', 'Deck')) {
    if (kids(deck, 'Width').length) continue;

    // One fixed descent, not a fan-out: Zone > gml:Polygon > gml:exterior >
    // gml:LinearRing > gml:posList. Missing any step leaves the deck alone.
    const ring = ['Polygon', 'exterior', 'LinearRing', 'posList'].reduce(
      (el, name) => el && kids(el, name)[0],
      deck
    );
    if (!ring) continue;

    // `pos` is along-then-across, and the ring is written through the same
    // transpose — so the odd coordinates span the car's width.
    const co = ring.textContent.trim().split(/\s+/).map(Number);
    if (co.length < 4 || co.some(Number.isNaN)) continue;
    const span = off => {
      const vs = co.filter((_, i) => i % 2 === off);
      return Number((Math.max(...vs) - Math.min(...vs)).toFixed(EXTENT_DP));
    };

    for (const [name, m] of [
      ['Width', span(1)],
      ['Length', span(0)],
    ]) {
      const el = doc.createElementNS(deck.namespaceURI, name);
      el.textContent = String(m);
      deck.append(el);
    }
  }

  return serialize(doc, validXML);
};

/**
 * Reflect every position in the document so the rendering comes out the way
 * the source drawing of the same car does.
 *
 * The two panes disagree by a reflection, not by a turn. NeTEx `pos` is
 * along-then-across; the drawings are across-then-along. That swap is a
 * transpose — determinant −1 — and the only orientation lever the element
 * offers is `vertical`, a `rotate(90, …)` whose determinant is +1. No
 * setting composes a reflection out of rotations, which is why every
 * quarter-turn of either pane fixes one axis and breaks the other.
 *
 * Where the reflection lands is worth being exact about, because the
 * component's own geometry decides it and not a preference:
 *
 *   - `Deck.getBoundingBox()` returns `{width: Length, height: Width}`, so
 *     unrotated the SVG's x is the car's length and its y is its width.
 *   - Every `getShape` reads `Centroid.x` onto that x and `Centroid.y` onto
 *     that y — `pos` order, straight through.
 *   - `vertical` wraps the lot in `rotate(90, h/2, h/2)` with `h` the across
 *     extent in px. In SVG's y-down frame that is a clockwise quarter-turn:
 *     `x' = h − y`, `y' = x`.
 *
 * So the across coordinate reaches the screen negated and the along
 * coordinate does not. Pre-negating across cancels it exactly: the deck
 * draws mirrored end-for-end about its own centreline, which is the drawing
 * the legacy system makes.
 *
 * It has to happen here, in the mapping, rather than as a `scaleX(-1)` on
 * the result. A pixel mirror moves the glyphs with the geometry, so the
 * seat labels come out backwards — the row that reads `1 2 · 3 4` becomes
 * `Ɛ ⇂ · ⇂ Ɛ` rather than reading correctly on the correct side.
 *
 * Four things ride along with the coordinates:
 *
 *   - `Orientation` drives a seat's backrest through `forwards: 180`,
 *     `rightwards: 90`, `leftwards: -90`, `backwards: 0`. Reflection sends
 *     an angle θ to −θ, so the two across-axis values trade places
 *     (`MIRRORED_ORIENTATION`). Left alone, every sideways seat would face
 *     out of the car it belongs to.
 *   - The two along-axis values are fixed points of that reflection, and
 *     are swapped anyway (`INVERTED_ORIENTATION`) — not because the mirror
 *     asks for it but because the renderer has them the wrong way round.
 *     See that constant for the measurement; the short of it is that the
 *     mirror cannot reach this fault and it has to be undone separately.
 *   - Each spot's own `Width` / `Length` are exchanged, for a third fault
 *     the mirror cannot reach either: the renderer reads them onto the
 *     opposite axes from the ones NeTEx names them for. A mirror preserves
 *     extents, so this survives it untouched.
 *   - `VehicleSide` is deliberately *not* touched. It is already right —
 *     the artwork's `leftSide` door is the document's `leftSide` door — and
 *     the mirror is what finally draws it on that side. Swapping it here
 *     would spend the fix twice and land back where we started.
 *
 * `Width` is read from the element the component reads, so the mirror is
 * about the same extent the renderer lays out against; run this after
 * `invalidateXMLForDeckExtent`, which is what puts that element there. A
 * deck without one is left untouched rather than mirrored about a guess.
 *
 * Like `invalidateXMLForDeckExtent`, this is a rendering patch and not a
 * correction: the input is the document that is *right*. Hand the result to
 * `parseNeTEx`, never to sobek, and never write it back to disk.
 *
 * @param {string} xml A `<decks>`-rooted fragment whose decks carry
 *   `Width`, declaration included.
 * @returns {string} The same document with every position reflected across
 *   the deck's centreline and every `Orientation` swapped for the value
 *   that makes the renderer draw the seat the way the drawing does.
 * @throws {Error} If the document does not parse.
 */
export const hackXMLForDeckEdPlacement = xml => {
  const doc = parseFragment(xml);

  for (const deck of doc.getElementsByTagNameNS('*', 'Deck')) {
    const w = Number(kids(deck, 'Width')[0]?.textContent);
    // NaN when the deck carries no `Width` at all — see the note above.
    if (Number.isNaN(w) || w <= 0) continue;

    /** Reflect one across-coordinate about the deck's centreline. */
    const flip = c => Number((w - c).toFixed(EXTENT_DP));

    // Every `gml:pos` under the deck, its own Centroid included: the
    // component ignores that one, but a fragment mirrored in its parts and
    // not in its whole would describe a car that does not exist.
    for (const pos of deck.getElementsByTagNameNS('*', 'pos')) {
      const [along, across] = pos.textContent.trim().split(/\s+/).map(Number);
      if (Number.isNaN(along) || Number.isNaN(across)) continue;
      pos.textContent = `${along} ${flip(across)}`;
    }

    // The outline, written through the same transpose — odd indices span
    // the width. Its extent is invariant under the mirror, so this changes
    // nothing the renderer reads; it keeps the outline around the contents
    // it is supposed to bound.
    for (const list of deck.getElementsByTagNameNS('*', 'posList')) {
      const co = list.textContent.trim().split(/\s+/).map(Number);
      if (co.length % 2 !== 0 || co.some(Number.isNaN)) continue;
      list.textContent = co.map((v, i) => (i % 2 ? flip(v) : v)).join(' ');
    }

    // A third fault, and again not the mirror's: `PassengerSpot.getShape()`
    // reads `Width` onto the deck's x — the car's *length* — and `Length`
    // onto its y. NeTEx means the opposite, which the corpus states twice
    // over: A5-1's seats sit exactly `Width` (0.5776 m) apart across a row,
    // and WLAB-2's berths are `Width` 1.8412 m of a 3.3213 m car, drawn
    // transverse in its artwork. Exchanging the pair puts each spot's own
    // extent back on the axis it belongs to.
    //
    // Every spot, not just the beds: a seat is transposed by the same
    // fault, it is simply harder to see at 0.58 × 0.79 than a berth is at
    // 1.84 × 0.76. Deck `Width`/`Length` are pointedly left alone — those
    // are what `invalidateXMLForDeckExtent` just wrote for this renderer,
    // and it reads them the right way round.
    for (const spot of deck.getElementsByTagNameNS('*', 'PassengerSpot')) {
      const [wEl, lEl] = ['Width', 'Length'].map(n => kids(spot, n)[0]);
      if (wEl && lEl) [wEl.textContent, lEl.textContent] = [lEl.textContent, wEl.textContent];
    }

    // Both causes at once: the mirror turns sideways seats around, and the
    // renderer has forwards and backwards the wrong way up. Between them
    // every value in the enum is rewritten.
    for (const o of deck.getElementsByTagNameNS('*', 'Orientation')) {
      const swap = SWAPPED_ORIENTATION[o.textContent.trim()];
      if (swap) o.textContent = swap;
    }
  }

  return serialize(doc, xml);
};
