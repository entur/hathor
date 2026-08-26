export type Page<T> = {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
};

export type PageVars = {
  page?: number;
  size?: number;
};

export const FETCH_ALL_SIZE = 10000;
