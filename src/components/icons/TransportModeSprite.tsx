/**
 * Hidden SVG sprite holding all `<symbol id="tm-*">` definitions used by
 * `TransportModeIcon`. Mount once at app root.
 *
 * Symbols mirrored from `concept-sandbox/claude-design.html` (lines
 * 2079–2167) on the `ui-sandboxing` branch, with two edits:
 * - `id="tm-ferry"` renamed to `id="tm-water"` to match NeTEx
 *   `TransportModeEnumeration`.
 * - `tm-unknown` symbol added as catch-all fallback for the 6 NeTEx modes
 *   the sandbox sprite never drew (taxi, cableway, funicular, lift,
 *   trolleyBus, snowAndIce) and for the synthetic `'unknown'` mode.
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
        <symbol id="tm-bus" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5.4C2 5.18 2.18 5 2.4 5h11.2c.22 0 .4.18.4.4v5.2a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H2.4a.4.4 0 0 1-.4-.4V5.4Zm2 .9a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H6a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 6 6.3H4Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H9a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 9 6.3H7Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H12a.3.3 0 0 0 .3-.3V6.6a.3.3 0 0 0-.3-.3h-2Z"
          />
          <circle cx="4.7" cy="12" r="1" fill="currentColor" />
          <circle cx="11.3" cy="12" r="1" fill="currentColor" />
        </symbol>
        <symbol id="tm-coach" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.4 4.6C1.4 4.27 1.67 4 2 4h12c.33 0 .6.27.6.6v6.4a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H1.8a.4.4 0 0 1-.4-.4V4.6Zm1.9.7a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3H3.3Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-1.9Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h2a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-2ZM1.8 9h12.4v.7H1.8V9Z"
          />
          <circle cx="4.5" cy="12" r="1" fill="currentColor" />
          <circle cx="11.5" cy="12" r="1" fill="currentColor" />
        </symbol>
        <symbol id="tm-rail" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 4.6C3 4.27 3.27 4 3.6 4h7.4c.19 0 .37.08.5.21l2.35 2.4c.12.12.19.29.19.46V11.1a.4.4 0 0 1-.4.4h-.94a1.5 1.5 0 0 1-2.94 0H6.84a1.5 1.5 0 0 1-2.94 0H3.4a.4.4 0 0 1-.4-.4V4.6Zm.9.8a.3.3 0 0 1 .3-.3h2.4a.3.3 0 0 1 .3.3v2a.3.3 0 0 1-.3.3H4.2a.3.3 0 0 1-.3-.3v-2Zm4.4 0a.3.3 0 0 1 .3-.3H10c.1 0 .19.05.24.12l1.55 1.9c.11.13.02.34-.15.34H8.6a.3.3 0 0 1-.3-.3v-1.76Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        <symbol id="tm-tram" viewBox="0 0 16 16">
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
        <symbol id="tm-metro" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2Z"
          />
          <path fill="currentColor" d="M5 5h6v1.2H8.6V12H7.4V6.2H5z" />
        </symbol>
        <symbol id="tm-water" viewBox="0 0 16 16">
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
        <symbol id="tm-air" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.6 6.3a.6.6 0 0 1-.36.56L5.1 10.6a.4.4 0 0 1-.43-.08L2.3 8.2c-.24-.23-.1-.63.24-.65l1.2-.07 1.8.8L7.7 7.44l-3.1-1.5a.2.2 0 0 1 .04-.37l.9-.22c.12-.03.25 0 .35.06L9 7.05l4.2-1.86c.51-.23 1.1-.05 1.4.4.03.05.05.12.05.2v.51Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        <symbol id="tm-unknown" viewBox="0 0 16 16">
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
      </defs>
    </svg>
  );
}
