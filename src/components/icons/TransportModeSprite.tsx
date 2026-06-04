/**
 * Hidden SVG sprite holding all `<symbol id="tm-*">` definitions used by
 * `TransportModeIcon`. Mount once at app root.
 *
 * @warning POTENTIAL PROPRIETARY ASSETS — license status UNVERIFIED.
 * Several symbols below are direct or indirect adaptations of Entur's
 * design-system icons (Linje — https://linje.entur.no/identitet/verktoykassen/ikoner).
 * The Entur Linje site is publicly readable but does not publish an
 * explicit reuse license for icon assets. Before publishing this
 * codebase as an external product, forking it outside Entur, or
 * embedding it in any non-Entur deliverable, EITHER (a) obtain written
 * permission from Entur for icon reuse, OR (b) replace these symbols
 * with independently authored shapes. Symbols whose docstrings note
 * "adapted from Entur Linje" are direct lifts (currently `tm-taxi`,
 * `tm-cableway`, `tm-funicular`, `tm-lift`); the rest originated either
 * in `concept-sandbox/claude-design.html` (the sandbox's own provenance
 * is unverified — same risk) or were drawn fresh for this project
 * (`tm-trolleyBus`, `tm-snowAndIce`).
 *
 * Symbols sourced from `concept-sandbox/claude-design.html` (lines
 * 2079–2167) on the `ui-sandboxing` branch, with one edit:
 * - `id="tm-ferry"` renamed to `id="tm-WATER"` to match NeTEx
 *   `TransportModeEnumeration`.
 *
 * Edits to either side of the mirror must be kept in lockstep. See
 * `concept-sandbox/README.md` and `FORK_DECISIONS.md` → "Transport-mode
 * icon strategy".
 */
/**
 * Hidden SVG sprite — mount once at app root before any `TransportModeIcon`.
 * @returns A `display:none` SVG containing all `<symbol id="tm-*">` defs.
 */
export default function TransportModeSprite() {
  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" aria-hidden={true}>
      <defs>
        {/* ────────── Road ────────── */}
        <symbol id="tm-BUS" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5.4C2 5.18 2.18 5 2.4 5h11.2c.22 0 .4.18.4.4v5.2a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H2.4a.4.4 0 0 1-.4-.4V5.4Zm2 .9a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H6a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 6 6.3H4Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H9a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 9 6.3H7Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H12a.3.3 0 0 0 .3-.3V6.6a.3.3 0 0 0-.3-.3h-2Z"
          />
          <circle cx="4.7" cy="12" r="1" fill="currentColor" />
          <circle cx="11.3" cy="12" r="1" fill="currentColor" />
        </symbol>
        <symbol id="tm-COACH" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.4 4.6C1.4 4.27 1.67 4 2 4h12c.33 0 .6.27.6.6v6.4a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H1.8a.4.4 0 0 1-.4-.4V4.6Zm1.9.7a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3H3.3Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-1.9Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h2a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-2ZM1.8 9h12.4v.7H1.8V9Z"
          />
          <circle cx="4.5" cy="12" r="1" fill="currentColor" />
          <circle cx="11.5" cy="12" r="1" fill="currentColor" />
        </symbol>
        {/*
         * tm-taxi — adapted from Entur Linje design-system Car.svg
         * (https://linje.entur.no/komponenter/ressurser/icons → Car.svg).
         * Original Entur fill `#181C56` swapped for `currentColor` so the
         * `--tm-taxi` token (which happens to match `#181C56` exactly,
         * see `transportModeTokens.css`) drives the color via
         * `colorVarFor('taxi')`. A roof-sign rect is layered on top of
         * the unmodified Car silhouette to distinguish taxi from car.
         *
         * @warning Direct lift from a third-party asset whose license is
         * UNVERIFIED. See file-level warning above. Replace with an
         * independently authored shape before any non-Entur publication.
         */}
        <symbol id="tm-TAXI" viewBox="0 0 16 16">
          <path fill="currentColor" d="M6.5 1.4h3v1.6h-3z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 7.2L12.91 3.86C12.74 3.35 12.22 3 11.64 3H4.37C3.78 3 3.26 3.35 3.10 3.86L2 7.2C1.45 7.2 1 7.65 1 8.20v3.50c0 .28.22.50.50.50H2v.67c0 .61.49 1.10 1.10 1.10c.61 0 1.10-.49 1.10-1.10v-.67h7.6v.67c0 .61.49 1.10 1.10 1.10C13.51 13.97 14 13.47 14 12.87v-.67h.50C14.78 12.20 15 11.98 15 11.70V8.20C15 7.65 14.55 7.20 14 7.20ZM3.27 7.13L4.11 4.39C4.17 4.19 4.38 4.05 4.60 4.05H11.40C11.62 4.05 11.83 4.19 11.89 4.39L12.73 7.13C12.74 7.17 12.71 7.20 12.68 7.20H3.33C3.29 7.20 3.26 7.17 3.27 7.13ZM2.80 8.20C3.24 8.20 3.60 8.56 3.60 9.00C3.60 9.44 3.24 9.80 2.80 9.80C2.36 9.80 2 9.44 2 9.00C2 8.56 2.36 8.20 2.80 8.20ZM13.20 8.20C13.64 8.20 14 8.56 14 9.00C14 9.44 13.64 9.80 13.20 9.80C12.76 9.80 12.40 9.44 12.40 9.00C12.40 8.56 12.76 8.20 13.20 8.20Z"
          />
        </symbol>
        {/*
         * tm-trolleyBus — fresh drawing in the same spirit as tm-bus.
         * Reuses the tm-bus body verbatim and layers an overhead trolley
         * wire across the canvas top with two pantograph poles dropping
         * from the wire to the bus roof. No third-party source.
         */}
        <symbol id="tm-TROLLEY_BUS" viewBox="0 0 16 16">
          <path fill="currentColor" d="M.5 1.5h15v.6H.5z" />
          <path fill="currentColor" d="M5.5 2.1h.5v2.9h-.5z" />
          <path fill="currentColor" d="M10 2.1h.5v2.9H10z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5.4C2 5.18 2.18 5 2.4 5h11.2c.22 0 .4.18.4.4v5.2a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H2.4a.4.4 0 0 1-.4-.4V5.4Zm2 .9a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H6a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 6 6.3H4Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H9a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 9 6.3H7Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H12a.3.3 0 0 0 .3-.3V6.6a.3.3 0 0 0-.3-.3h-2Z"
          />
          <circle cx="4.7" cy="12" r="1" fill="currentColor" />
          <circle cx="11.3" cy="12" r="1" fill="currentColor" />
        </symbol>
        {/* ────────── Rail ────────── */}
        <symbol id="tm-RAIL" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 4.6C3 4.27 3.27 4 3.6 4h7.4c.19 0 .37.08.5.21l2.35 2.4c.12.12.19.29.19.46V11.1a.4.4 0 0 1-.4.4h-.94a1.5 1.5 0 0 1-2.94 0H6.84a1.5 1.5 0 0 1-2.94 0H3.4a.4.4 0 0 1-.4-.4V4.6Zm.9.8a.3.3 0 0 1 .3-.3h2.4a.3.3 0 0 1 .3.3v2a.3.3 0 0 1-.3.3H4.2a.3.3 0 0 1-.3-.3v-2Zm4.4 0a.3.3 0 0 1 .3-.3H10c.1 0 .19.05.24.12l1.55 1.9c.11.13.02.34-.15.34H8.6a.3.3 0 0 1-.3-.3v-1.76Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        <symbol id="tm-TRAM" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7.7 1.5h.6v1.2h-.6z" />
          <path fill="currentColor" d="M5.5 2.7h5v.6h-5z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6 4C3.27 4 3 4.27 3 4.6v6.4c0 .22.18.4.4.4h.54a1.8 1.8 0 0 0 3.52 0H8.54a1.8 1.8 0 0 0 3.52 0h.54a.4.4 0 0 0 .4-.4V4.6c0-.33-.27-.6-.6-.6H3.6Zm.7 1.7a.3.3 0 0 1 .3-.3H7a.3.3 0 0 1 .3.3v1.8A.3.3 0 0 1 7 7.8H4.6a.3.3 0 0 1-.3-.3V5.7Zm5 0a.3.3 0 0 1 .3-.3h2.1a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3H9.6a.3.3 0 0 1-.3-.3V5.7Z"
          />
          <circle cx="5.7" cy="11.5" r=".9" fill="currentColor" />
          <circle cx="10.3" cy="11.5" r=".9" fill="currentColor" />
          <path fill="currentColor" d="M2 13.6h12v.5H2z" />
        </symbol>
        <symbol id="tm-METRO" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2Z"
          />
          <path fill="currentColor" d="M5 5h6v1.2H8.6V12H7.4V6.2H5z" />
        </symbol>
        {/* ────────── Cable ────────── */}
        {/*
         * tm-cableway — adapted from Entur Linje design-system Cableway.svg
         * (https://linje.entur.no/komponenter/ressurser/icons → Cableway.svg).
         * Original Entur fill `#642E88` swapped for `currentColor` so the
         * `--tm-cableway` token drives the color via `colorVarFor('cableway')`.
         *
         * @warning Direct lift from a third-party asset whose license is
         * UNVERIFIED. See file-level warning above.
         */}
        <symbol id="tm-CABLEWAY" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.295 1.803L9.378 2.787c.028-.283-.029-.568-.188-.806L13.094 1l.201.803zM8.168 1.924c.408 0 .74.332.74.74 0 .409-.332.74-.74.74-.408 0-.74-.331-.74-.74 0-.408.332-.74.74-.74zM13.179 7.935c-.044-.197-.219-.336-.421-.336H3.578c-.202 0-.377.139-.421.336L2.011 13.003c-.031.15.002.307.091.433l1.002 1.385c.081.112.211.179.35.179h9.429c.138 0 .268-.067.35-.179l1.002-1.385c.089-.126.121-.282.091-.433L13.179 7.935zM5.49 11.502c0 .24-.193.433-.432.433H3.762c-.13 0-.255-.06-.337-.162-.082-.102-.112-.235-.084-.364l.381-1.727c.043-.199.219-.34.421-.34h.911c.239 0 .432.193.432.432v1.728zM9.984 11.503c0 .238-.194.432-.432.432H6.961c-.239 0-.432-.193-.432-.432V9.775c0-.238.193-.432.432-.432h2.591c.238 0 .432.193.432.432v1.728zM12.911 11.774c-.082.103-.206.162-.337.162h-1.296c-.239 0-.432-.193-.432-.432V9.775c0-.238.193-.432.432-.432h.913c.202 0 .378.14.421.339l.381 1.728c.028.128-.002.262-.082.364zM6.959 2.541L3.041 3.525l.202.803L7.147 3.348c-.16-.239-.216-.524-.188-.807zM8.582 3.814v1.724h1.43v.828H6.324v-.828h1.43V3.814c.131.047.267.084.414.084.147 0 .283-.037.414-.084z"
          />
        </symbol>
        {/*
         * tm-funicular — adapted from Entur Linje design-system Funicular.svg
         * (https://linje.entur.no/komponenter/ressurser/icons → Funicular.svg).
         * Original Entur fill `#78469A` swapped for `currentColor` so the
         * `--tm-funicular` token drives the color via `colorVarFor('funicular')`.
         *
         * @warning Direct lift from a third-party asset whose license is
         * UNVERIFIED. See file-level warning above.
         */}
        <symbol id="tm-FUNICULAR" viewBox="0 0 16 16">
          <path fill="currentColor" d="M15 9.125L1 13.135v.99l14-4.01v-.99z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.38 11.52L13.633 8.42c.217-.06.367-.257.367-.482V3.825c0-.985-.933-1.702-1.885-1.45L3.487 4.668c-.876.233-1.487 1.026-1.487 1.933v4.63c0 .199.189.342.38.29zM11.297 5.44c0 .111.09.2.2.2h1.6c.11 0 .2-.089.2-.2V4.025c0-.516-.481-.897-.983-.779l-.863.202c-.09.022-.154.102-.154.195v1.798zM10.596 6.19c0 .11-.09.2-.2.2h-2.1c-.11 0-.2-.09-.2-.2V4.507c0-.091.061-.17.149-.194l2.1-.552c.127-.033.251.063.251.194V6.19zM4.195 7.597c0 .11-.09.2-.2.2h-1.1c-.11 0-.2-.09-.2-.2v-1.06c0-.456.308-.854.749-.968l.5-.13c.127-.033.251.063.251.194v1.964zM7.196 7.125c.11 0 .2-.09.2-.2V4.808c0-.13-.12-.225-.247-.195l-2.1.505c-.09.022-.153.102-.153.195v1.611c0 .11.089.2.2.2h2.1z"
          />
        </symbol>
        {/*
         * tm-lift — derived from tm-cableway (above) with three edits to
         * give chair-lift semantics distinct from gondola/cable-car:
         *   1. Wrapped in a `<g transform>` that mirrors horizontally
         *      (cable now angles top-LEFT instead of top-right) and
         *      scales Y by 0.88 (~12% shorter).
         *   2. The middle (large) cabin window is removed — leaves the
         *      two corner windows, reading as a smaller chair.
         *   3. Color comes from `--tm-lift` (forest-green placeholder)
         *      instead of `--tm-cableway` (purple).
         *
         * @warning Same proprietary-asset risk as tm-cableway since the
         * silhouette is derived from Entur Linje. See file-level warning.
         */}
        <symbol id="tm-LIFT" viewBox="0 0 16 16">
          <g transform="translate(16 1) scale(-1 0.88)">
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.295 1.803L9.378 2.787c.028-.283-.029-.568-.188-.806L13.094 1l.201.803zM8.168 1.924c.408 0 .74.332.74.74 0 .409-.332.74-.74.74-.408 0-.74-.331-.74-.74 0-.408.332-.74.74-.74zM13.179 7.935c-.044-.197-.219-.336-.421-.336H3.578c-.202 0-.377.139-.421.336L2.011 13.003c-.031.15.002.307.091.433l1.002 1.385c.081.112.211.179.35.179h9.429c.138 0 .268-.067.35-.179l1.002-1.385c.089-.126.121-.282.091-.433L13.179 7.935zM5.49 11.502c0 .24-.193.433-.432.433H3.762c-.13 0-.255-.06-.337-.162-.082-.102-.112-.235-.084-.364l.381-1.727c.043-.199.219-.34.421-.34h.911c.239 0 .432.193.432.432v1.728zM12.911 11.774c-.082.103-.206.162-.337.162h-1.296c-.239 0-.432-.193-.432-.432V9.775c0-.238.193-.432.432-.432h.913c.202 0 .378.14.421.339l.381 1.728c.028.128-.002.262-.082.364zM6.959 2.541L3.041 3.525l.202.803L7.147 3.348c-.16-.239-.216-.524-.188-.807zM8.582 3.814v1.724h1.43v.828H6.324v-.828h1.43V3.814c.131.047.267.084.414.084.147 0 .283-.037.414-.084z"
            />
          </g>
        </symbol>
        {/* ────────── Water ────────── */}
        <symbol id="tm-WATER" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7 3.2h2v1.6H7z" />
          <path fill="currentColor" d="M5.5 5h5l.5 1.5h-6z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 7h11l-.6 1.8a.5.5 0 0 1-.47.34H3.57a.5.5 0 0 1-.47-.34L2.5 7Z"
          />
          <path
            fill="currentColor"
            d="M1.5 10.3l.25.55c.26.56.85.9 1.46.84.5-.05.98-.29 1.34-.66.2-.21.54-.21.74 0 .36.37.84.61 1.34.66.5.05 1.01-.09 1.4-.4a.55.55 0 0 1 .66 0c.4.31.9.45 1.4.4.5-.05.98-.29 1.34-.66.2-.21.54-.21.74 0 .36.37.84.61 1.34.66.61.06 1.2-.28 1.46-.84l.25-.55-1-.35-.1.24c-.1.22-.33.35-.56.32a.8.8 0 0 1-.57-.28 1.32 1.32 0 0 0-1.86 0 .8.8 0 0 1-.57.28c-.22.03-.45-.07-.58-.24a1.57 1.57 0 0 0-1.78 0c-.13.17-.36.27-.58.24a.8.8 0 0 1-.57-.28 1.32 1.32 0 0 0-1.86 0 .8.8 0 0 1-.57.28c-.23.03-.46-.1-.56-.32l-.1-.24-1 .35Z"
          />
        </symbol>
        {/* ────────── Air ────────── */}
        <symbol id="tm-AIR" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.6 6.3a.6.6 0 0 1-.36.56L5.1 10.6a.4.4 0 0 1-.43-.08L2.3 8.2c-.24-.23-.1-.63.24-.65l1.2-.07 1.8.8L7.7 7.44l-3.1-1.5a.2.2 0 0 1 .04-.37l.9-.22c.12-.03.25 0 .35.06L9 7.05l4.2-1.86c.51-.23 1.1-.05 1.4.4.03.05.05.12.05.2v.51Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        {/* ────────── Snow ────────── */}
        {/*
         * tm-snowAndIce — fresh drawing. Six-armed snowflake formed by
         * three vertical rects rotated 0°, 60°, 120° around (8, 8).
         * No third-party source.
         */}
        <symbol id="tm-SNOW_AND_ICE" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7.4 1h1.2v14H7.4z" />
          <path fill="currentColor" d="M7.4 1h1.2v14H7.4z" transform="rotate(60 8 8)" />
          <path fill="currentColor" d="M7.4 1h1.2v14H7.4z" transform="rotate(120 8 8)" />
        </symbol>
        {/* ────────── Unknown (its own glyph; not the catch-all) ────────── */}
        <symbol id="tm-UNKNOWN" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2Z"
          />
          <path
            fill="currentColor"
            d="M6.2 6.4c0-1 .8-1.8 1.9-1.8s1.9.8 1.9 1.8c0 .7-.4 1.2-1 1.5-.6.3-.9.6-.9 1v.5H7v-.6c0-.7.4-1.1 1-1.4.4-.2.7-.5.7-.9 0-.5-.4-.9-.9-.9s-.9.4-.9.9H6.2Zm1.3 4.5h1.1V12H7.5v-1.1Z"
          />
        </symbol>
        {/*
         * Generic fallback glyph — shared by every enum member without bespoke
         * art (OTHER, FERRY, INTERCITY_RAIL, URBAN_RAIL, SELF_DRIVE, ANY_MODE,
         * ALL). Each aliases `#tm-fallback`, so `#tm-${mode}` always resolves.
         */}
        <g id="tm-fallback">
          <rect x="3" y="5" width="10" height="6.5" rx="1.4" fill="currentColor" />
          <circle cx="5.6" cy="12.4" r="1" fill="currentColor" />
          <circle cx="10.4" cy="12.4" r="1" fill="currentColor" />
        </g>
        <symbol id="tm-OTHER" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-FERRY" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-INTERCITY_RAIL" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-URBAN_RAIL" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-SELF_DRIVE" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-ANY_MODE" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
        <symbol id="tm-ALL" viewBox="0 0 16 16">
          <use href="#tm-fallback" />
        </symbol>
      </defs>
    </svg>
  );
}
