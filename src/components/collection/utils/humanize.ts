/**
 * Turn a camelCase field key into a default human label. Overridable per field
 * via the layout entry's `label`, so this only needs to be a sensible default.
 */
export const humanize = (key: string): string => {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
};
