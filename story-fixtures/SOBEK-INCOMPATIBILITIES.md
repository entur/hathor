# Sobek ↔ deckplan-sample incompatibilities

Findings from posting the six `deck-plans/Wagon_*.xml` samples into local Sobek
(`:37999`, `POST /services/vehicles/netex`) as one deck plan, 2026-08-20.

Every item below was found by posting and reading the rejection back, not by
inspection. The samples date from 2020 (`version="1.2.2"`); Sobek validates
against NO-NeTEx 2.0.

## 🔴 Blocker — Sobek cannot serve back a deck plan that has decks

`GET /services/vehicles/netex/deckplans/<id>` returns **HTTP 500** for any plan
carrying deck geometry:

```json
{"errors":[{"message":"java.lang.IllegalStateException: Received object of type byte[]"}]}
```

The write succeeds (HTTP 200) and the row is correct over GraphQL — `deckPlans`
lists it with the right name and version. Only the NeTEx read fails.

**Isolated with a control.** Same document shape, same import path, same
codepath — only the deck count differs:

| record | decks | POST | GET |
|---|---|---|---|
| `NMR:DeckPlan:21` | 6 (396 seats) | 200 | **500** |
| `NMR:DeckPlan:22` | 1 (46 seats) | 200 | **500** |
| `NMR:DeckPlan:23` | 0 | 200 | 200 |

So it is the presence of decks, not payload size and not the document shape.
Every pre-existing plan in the dev DB has an empty `<decks/>`, which is why
this has never been hit.

**Consequence for hathor#149.** The read-only `DeckRendering` fetches through
this endpoint, so it cannot render real Sobek data until this is fixed. The
Storybook stories work because they parse the sample XML directly.

## Schema incompatibilities

Each rejected the whole POST until fixed. Listed in the order Sobek hit them.

### 1. `<pos>` must be in the GML namespace

```
unexpected element (uri:"http://www.netex.org.uk/netex", local:"pos").
Expected ... <{http://www.opengis.net/gml/3.2}pos>
```

The samples emit `<pos>` bare, so it inherits the default NeTEx namespace.
Fix: declare `xmlns:gml="http://www.opengis.net/gml/3.2"` and emit `<gml:pos>`.
84 occurrences per wagon, 420 across the six.

### 2. `deckEntranceUsage` is not a valid `PassengerSpace` child

```
unexpected element (uri:"...netex", local:"deckEntranceUsage")
```

Sobek's XSD allows `deckEntrances` and `deckEntranceCouples` but not
`deckEntranceUsage`. Fix: strip it. The renderer does not read it
(`DeckRendering.vue` uses `ds.deckEntrances`), so nothing visual is lost.

### 3. `SequenceFromFront` must be an integer

```
For input string: "2.14"
```

Two entrances in the samples carry `2.14`. Fix: round. Dropping the element
would lose entrance ordering.

### 4. `Deck` has no `Width` / `Length` in Sobek's schema

```
unexpected element (uri:"...netex", local:"Width")
```

The expected-children list for `Deck` covers `deckSpaces`, `spotRows`,
`spotColumns`, `DeckLevelRef`, `Centroid`, `Name`, `Polygon`, `MultiSurface` —
but **not** `Width` or `Length`. The spot-level pair inside `deckSpaces` is
accepted; only the deck-level pair is rejected.

**This is lossy, not just noisy.** Deck outline dimensions cannot be stored.
The editor library defaults to 2.825m × 26.4m when they are absent
(`deck.ts` constructor), so a deck round-tripped through Sobek renders at
those defaults rather than its authored size — the wagons are 2m × 13m.
Geometry has to travel in `Polygon`/`Centroid`, or the schema needs the pair.

### 5. `version="1.0"` is not parseable

```
Received version in netex format. But cannot parse version.
Expecting a long value or the String 'any'. Value is: 1.0
```

1,235 occurrences — the editor writes `attr_version: '1.0'` throughout. Sobek
wants a long or the literal `any`. Fix: rewrite to `version="1"`.

### 6. `FrameDefaults` must carry a time zone

```
Cannot resolve time zone from FrameDefaults in frame NMR:CompositeFrame:1
```

Fix: `<DefaultLocale><TimeZone>Europe/Oslo</TimeZone></DefaultLocale>`. Not a
sample problem — a requirement on any document posted to this endpoint.

## Not Sobek's fault — id collisions between samples

The six files reuse ids across each other: **110 ids appear in more than one
file** (mostly a file and its `_modified` twin — `Deck/id/1`,
`PassengerSpace/id/N`, `SpotRow/id/N`, `deck_level_0`). Merging them into one
`DeckPlan` needs every `id`/`ref` namespaced per wagon.

Once `<deckLevels>` is included alongside `<decks>`, no ref points outside the
merged subtree, so a uniform per-wagon prefix is safe.

## Also relevant

- `keyList` must be stripped before POST or Sobek doubles the entries on every
  write (2 → 4 → 8). See hathor#149 / sobek#180.
- `deckPlans(...)` over GraphQL throws `INTERNAL_ERROR` unless the filter
  carries a `dataOwnerRef`.

## Records left in the local dev DB

`NMR:DeckPlan:21` (6 decks), `:22` (1 deck), `:23` (0 decks, the control), all
owned by AtB `NOG:Authority:cP4aPiJ7c39`. 21 and 22 are unreadable over NeTEx
until the blocker above is fixed.
