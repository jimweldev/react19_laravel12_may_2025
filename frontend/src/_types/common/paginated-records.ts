export type PaginatedRecords<T> = {
  records?: T[];
  info?: Info;
};

export type Info = {
  total?: number;
  pages?: number;
};
