export const numVal = (n: number | undefined) => (n != null ? String(n) : '');
export const parseNum = (s: string) => (s === '' ? undefined : Number(s));
