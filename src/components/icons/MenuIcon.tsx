/**
 * Navigation-rail glyph, backed by the inline SVG sprite in
 * {@link MenuIconSprite}. Parallels {@link TransportModeIcon}: renders an
 * `<svg><use href="#menu-…">` that fills with `currentColor`, so the icon
 * inherits its container's text color (e.g. the active nav item's
 * `primary.main`). Decorative — always `aria-hidden`; the surrounding
 * `ListItemText` / `IconButton aria-label` carries the accessible name.
 */

/** Sprite-backed menu glyph names — must match `<symbol id="menu-<name>">`. */
export type MenuIconName = 'home' | 'vehicleTypes' | 'vehicles' | 'deckPlans' | 'menu';

type MenuIconProps = {
  /** Which `#menu-<name>` symbol to render. */
  name: MenuIconName;
  /** Rendered box size in px (square). Defaults to the nav-icon size. */
  size?: number;
};

const DEFAULT_SIZE = 24;

/**
 * @param name Sprite symbol to render (`#menu-<name>`).
 * @param size Square px size; defaults to {@link DEFAULT_SIZE}.
 * @returns An `<svg>` referencing the menu sprite, coloured via `currentColor`.
 */
export default function MenuIcon({ name, size = DEFAULT_SIZE }: MenuIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden={true}
      style={{ fill: 'currentColor', flexShrink: 0 }}
    >
      <use href={`#menu-${name}`} />
    </svg>
  );
}
