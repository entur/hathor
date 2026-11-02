/** The `<link rel="icon">` in index.html; its static href is the pre-config default. */
const FAVICON_SELECTOR = 'link[rel="icon"]';

/**
 * Points the page favicon at the per-environment icon from config.json. Page CSS
 * cannot reach a favicon (it renders as an isolated image), so each environment
 * ships its own SVG and config picks one.
 *
 * @param {string | undefined} faviconPath Icon URL, e.g. `/assets/M-favicon-prod.svg`;
 *   unset keeps the index.html default.
 * @returns {void}
 */
export const applyFavicon = (faviconPath?: string): void => {
  const link = document.querySelector<HTMLLinkElement>(FAVICON_SELECTOR);
  if (faviconPath && link) link.href = faviconPath;
};
