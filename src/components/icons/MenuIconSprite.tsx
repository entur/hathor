/**
 * Hidden SVG sprite holding the `<symbol id="menu-*">` definitions used by
 * {@link MenuIcon} for the navigation rail. Mount once at app root (next to
 * {@link TransportModeSprite}).
 *
 * Glyph paths are lifted verbatim from the already-installed
 * `@mui/icons-material` (Google Material Icons / Material Symbols, Apache-2.0
 * — free to embed). Using a sprite keeps the menu on the same inline-SVG
 * `<use href>` architecture as the transport-mode icons rather than rendering
 * a different mechanism (`<img>` / SvgIcon component) for the nav.
 *
 * symbol → MUI source:
 *   menu-home         ← Home
 *   menu-vehicleTypes ← TramOutlined  (outline reads as the "type"/blueprint)
 *   menu-vehicles     ← Tram          (solid reads as the concrete unit)
 *   menu-deckPlans    ← GridView      (fill-rule evenodd)
 *   menu-menu         ← Menu          (hamburger / rail toggle)
 *
 * All symbols fill with `currentColor`, so a `<use>` inherits its container's
 * text color (lets the active nav item recolor its glyph for free).
 */
export default function MenuIconSprite() {
  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" aria-hidden={true}>
      <defs>
        <symbol id="menu-home" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </symbol>
        <symbol id="menu-vehicleTypes" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m13 5 .75-1.5H17V2H7v1.5h4.75L11 5c-3.13.09-6 .73-6 3.5V17c0 1.5 1.11 2.73 2.55 2.95L6 21.5v.5h2l2-2h4l2 2h2v-.5l-1.55-1.55h-.01.01C17.89 19.73 19 18.5 19 17V8.5c0-2.77-2.87-3.41-6-3.5m-1.97 2h1.94c2.75.08 3.62.58 3.9 1H7.13c.28-.42 1.15-.92 3.9-1m-.18 10.95H7.74C7.3 17.84 7 17.45 7 17v-1h3.89c-.24.27-.39.61-.39 1 0 .36.13.69.35.95M17 17c0 .45-.3.84-.74.95h-3.11c.22-.26.35-.59.35-.95 0-.39-.15-.73-.39-1H17zm0-3H7v-4h10z"
          />
        </symbol>
        <symbol id="menu-contractualVehicleTypes" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d="M12.9004 10.8008C14.06 10.801 15 11.7407 15 12.9004C14.9998 14.0599 14.0599 14.9998 12.9004 15C11.7407 15 10.801 14.06 10.8008 12.9004C10.8008 11.7406 11.7406 10.8008 12.9004 10.8008ZM12.9004 12C12.4033 12 12 12.4033 12 12.9004C12.0002 13.3973 12.4035 13.8008 12.9004 13.8008C13.3971 13.8006 13.8006 13.3971 13.8008 12.9004C13.8008 12.4035 13.3973 12.0002 12.9004 12ZM9 2.40039C10.7121 2.40039 12.0996 3.78792 12.0996 5.5C12.0996 7.21208 10.7121 8.59961 9 8.59961H6C4.95066 8.59961 4.09961 9.45066 4.09961 10.5C4.09961 11.5493 4.95066 12.4004 6 12.4004H10V13.5996H6C4.28792 13.5996 2.90039 12.2121 2.90039 10.5C2.90039 8.78792 4.28792 7.40039 6 7.40039H9C10.0493 7.40039 10.9004 6.54934 10.9004 5.5C10.9004 4.45066 10.0493 3.59961 9 3.59961H6V2.40039H9ZM3.09961 1C4.25928 1 5.19901 1.93999 5.19922 3.09961C5.19922 4.25941 4.25941 5.19922 3.09961 5.19922C1.93998 5.19902 1 4.25929 1 3.09961C1.00021 1.94011 1.94011 1.0002 3.09961 1ZM3.09961 2.19922C2.60285 2.19942 2.19943 2.60285 2.19922 3.09961C2.19922 3.59654 2.60272 3.9998 3.09961 4C3.59667 4 4 3.59667 4 3.09961C3.99979 2.60273 3.59654 2.19922 3.09961 2.19922Z"
          />
        </symbol>
        <symbol id="menu-vehicles" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06m-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m5-4.5H7V9h10z"
          />
        </symbol>
        <symbol id="menu-deckPlans" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M3 3v8h8V3zm6 6H5V5h4zm-6 4v8h8v-8zm6 6H5v-4h4zm4-16v8h8V3zm6 6h-4V5h4zm-6 4v8h8v-8zm6 6h-4v-4h4z"
          />
        </symbol>
        <symbol id="menu-menu" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
        </symbol>
      </defs>
    </svg>
  );
}
