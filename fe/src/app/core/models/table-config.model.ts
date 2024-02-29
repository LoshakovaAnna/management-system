export interface TableConfigModel {
  pageSize: number;
  pageIndex: number;
  sortField: string;
  sortDirection: number;
}

export const DEFAULT_TABLE_CONFIG: TableConfigModel = {
  pageSize: 5,
  pageIndex: 0,
  sortField: '',
  sortDirection: 0

};

export  enum SortDirectionEnum {
  'asc' = 1,
  'desc' = -1
}
