export const numVal = (n: number | undefined) => (n != null ? String(n) : '');
export const parseNum = (s: string) => {
  if (s === '') return undefined;
  const v = Number(s);
  return Number.isNaN(v) ? undefined : v;
};
