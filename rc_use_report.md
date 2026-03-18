# ResourceFrame Usage Report — Entur Backend Projects

_Generated 2026-03-18 via `gh search code` across the `entur` GitHub organization._

## Summary

ResourceFrame is used by **15 backend projects** at Entur. Two dominant patterns emerge:

1. **Organisations + typesOfValue** — the classic "who operates what" data (Authority, Operator, Branding). Used by most transit-focused backends.
2. **Vehicle domain** — vehicles, vehicleTypes, vehicleModels, deckPlans, equipments. Used almost exclusively by Sobek/Shepet, with scheduled-stock and netex-gbfs-converter reading just `vehicleTypes`.

Everything else (`operationalContexts`, `dataSources`, `schematicMaps`, `blacklists`, `whitelists`, `controlCentres`, `zones`, `responsibilitySets`, `groupsOfOperators`, `groupsOfEntities`) has zero or near-zero actual usage.

---

## Usage by ResourceFrame child property

| Property | Projects |
|---|---|
| `organisations` | extime, uttu, abt-referencedata, agreements-backend, netex-parser-java, netex-gbfs-converter |
| `typesOfValue` | extime, uttu, anu, abt-referencedata, netex-parser-java |
| `vehicleTypes` | sobek, scheduled-stock, netex-gbfs-converter, ashur/netex-tools (filter paths) |
| `vehicles` | sobek, ashur (filter path) |
| `vehicleModels` | sobek |
| `deckPlans` | sobek |
| `equipments` | sobek |
| `schematicMaps` | sobek |
| `operationalContexts` | netex-gbfs-converter |
| `dataSources` | ashur/netex-tools (filter paths only) |
| `frameDefaults` | tiamat, kingu, sobek, abt-referencedata |

### Unused children (across all Entur projects)

`blacklists`, `whitelists`, `controlCentres`, `zones`, `responsibilitySets`, `groupsOfOperators`, `groupsOfEntities`

---

## Usage by project

### netex-parser-java

Shared NeTEx parsing library used by many downstream projects.

**ResourceFrame children:** `organisations` → Authority, Operator; `typesOfValue` → Branding. The `ResourceFrameParser` explicitly skips 15+ other children (`blacklists`, `controlCentres`, `dataSources`, `equipments`, `groupsOfEntities`, `groupsOfOperators`, `operationalContexts`, `responsibilitySets`, `schematicMaps`, `vehicles`, `vehicleEquipmentProfiles`, `vehicleModels`, `vehicleTypes`, `whitelists`, `zones`) with log warnings.

**Top committers:** testower (118), vpaturet (45), assadriaz (2), erlendev (2), hbruch (2)

---

### tiamat

National stop place register. Creates a shell ResourceFrame (id, version, description, frameDefaults) in the exporter. Content (organisations) is populated during streaming export.

**ResourceFrame children:** `description`, `version`, `frameDefaults` (locale/timezone). Organisations added via `StreamingPublicationDelivery`.

**Top committers:** csolem (3003), assadriaz (899), lassetyr (281), solita-sabinaf (40), solita-topip (39), nostra (37), ialuy (36)

---

### kingu

Fare zone / tariff management (Tiamat architecture fork). Same shell-ResourceFrame pattern as Tiamat.

**ResourceFrame children:** `description`, `version`, `id`. Content added during streaming export.

**Top committers:** assadriaz (184), AlexanderBrevig (9), henrik242 (8), vpaturet (3)

---

### sobek

National vehicle register. The heaviest ResourceFrame consumer — both import and export.

**ResourceFrame children (import):** `vehicles`, `vehicleTypes`, `vehicleModels`, `deckPlans`, `equipments`, `schematicMaps`. Six dedicated import handlers process these in dependency order.

**ResourceFrame children (export):** Same set via `SobekResourceFrameExporter` + `StreamingPublicationDelivery`.

**Top committers:** GunnarAtEgde (223), dynnamitt (13), assadriaz (7), vpaturet (2)

---

### shepet

Vehicle NeTEx mediator service. Uses Sobek's `SobekResourceFrameExporter` to create ResourceFrames.

**ResourceFrame children:** `vehicleTypes` (via `sobekResourceFrameExporter.createResourceFrame()`).

**Top committers:** GunnarAtEgde (25)

---

### extime

Avinor flight data → NeTEx converter.

**ResourceFrame children:** `organisations` (Authority, Operator), `typesOfValue` (Branding). Created via `NetexObjectFactory.createResourceFrameElement()`.

**Top committers:** swizzon (238), vpaturet (227), assadriaz (26), nostra (22), AlexanderBrevig (5), Pavloro (5)

---

### uttu

Flexible transport / line export.

**ResourceFrame children:** `organisations` (Authority, Operator), `typesOfValue` (Branding). Created via `NetexObjectFactory.createResourceFrame()` inside `NetexCommonFileProducer`.

**Top committers:** testower (907), vpaturet (68), esuomi (35), solita-sabinaf (29), assadriaz (27), henrik242 (20)

---

### anu

Stop place data cache / converter.

**ResourceFrame children:** `typesOfValue` → `PurposeOfGrouping`. Read via `Converters.createPurposeOfGroupingMap(Collection<ResourceFrame>)`.

**Top committers:** lassetyr (98), assadriaz (17), AlexanderBrevig (4), kimbim (2)

---

### abt-referencedata

Ticketing / fare reference data.

**ResourceFrame children:** `typesOfValue` (TypeOfCustomerAccount, TypeOfFareContract, TypeOfAccessRightAssignment, TypeOfResponsibilityRole, TypeOfFareProduct), `organisations` (Authority, Operator), `frameDefaults` (reads `defaultLocale.defaultLanguage`).

**Top committers:** seime (242), erlendnils1 (206), skjolber (114), olereidar (97), LudBjork (46)

---

### agreements-backend

Contract / agreement management (Kotlin).

**ResourceFrame children:** `organisations` (Authority, Operator). Created in `TransmodelMapper.toNeTEx()` with id `"NOG:ResourceFrame:1"`.

**Top committers:** dkoding (196), dagkodingentur (187), bjornend (180), ParJonsson (46), andlien (46), Pavloro (45)

---

### scheduled-stock

Scheduled rolling stock management (Kotlin).

**ResourceFrame children:** `vehicleTypes` — extracts `Train` and `CompoundTrain` instances via `TrainHandler.findTrainDefinitions()`.

**Top committers:** hanschristianbrodwallnielsen (659), andlien (233), anddah2 (151), BredeYabo (120), pernillejohnsen (87), helenensemmerud (87)

---

### netex-gbfs-converter

NeTEx ↔ GBFS shared mobility converter (Kotlin). Custom Jackson XML model, not using netex-java-model.

**ResourceFrame children:** `organisations` (Authority, Operator), `operationalContexts`, `vehicleTypes`, `typeOfEquipments`.

**Top committers:** henrik242 (7)

---

### ashur

NeTEx import filtering / cleaning (Kotlin). Defines XPath-style skip-paths for import profiles.

**ResourceFrame paths filtered:** `ResourceFrame/dataSources`, `ResourceFrame/vehicleTypes`, `ResourceFrame/vehicles` (both top-level and inside CompositeFrame).

**Top committers:** erlendev (156), assadriaz (10), henrik242 (1)

---

### netex-tools

NeTEx pipeline toolkit (Kotlin). Uses same filter paths as ashur.

**ResourceFrame paths referenced:** `ResourceFrame/dataSources`, `ResourceFrame/vehicleTypes` (both top-level and inside CompositeFrame).

**Top committers:** erlendev (45), assadriaz (22), t2gran (6), ialuy (1)

---

### netex-validator-java

NeTEx validation library. Structural validation only — checks ResourceFrame cardinality and ID uniqueness, does not read children.

**ResourceFrame usage:** Validates "exactly one ResourceFrame should be present" in single-frame deliveries. Checks ID uniqueness across frame types.

**Top committers:** vpaturet (265), erlendev (10), assadriaz (7), henrik242 (7), eibakke (4)

---

## Entity extraction summary

| Entity type | Extracted from | Projects |
|---|---|---|
| Authority | `organisations` | extime, uttu, abt-referencedata, agreements-backend, netex-parser-java, netex-gbfs-converter |
| Operator | `organisations` | extime, uttu, abt-referencedata, agreements-backend, netex-parser-java, netex-gbfs-converter |
| Branding | `typesOfValue` | extime, uttu, netex-parser-java |
| PurposeOfGrouping | `typesOfValue` | anu |
| TypeOfCustomerAccount | `typesOfValue` | abt-referencedata |
| TypeOfFareContract | `typesOfValue` | abt-referencedata |
| TypeOfAccessRightAssignment | `typesOfValue` | abt-referencedata |
| TypeOfResponsibilityRole | `typesOfValue` | abt-referencedata |
| TypeOfFareProduct | `typesOfValue` | abt-referencedata |
| Train | `vehicleTypes` | scheduled-stock |
| CompoundTrain | `vehicleTypes` | scheduled-stock |
| VehicleType | `vehicleTypes` | sobek, netex-gbfs-converter |
| Vehicle | `vehicles` | sobek |
| VehicleModel | `vehicleModels` | sobek |
| DeckPlan | `deckPlans` | sobek |
| Equipment | `equipments` | sobek |
| SchematicMap | `schematicMaps` | sobek |
