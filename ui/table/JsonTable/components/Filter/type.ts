export interface Field {
  id: any;
  label: string;
}

export interface Fields {
  available_field?: Field[];
  sort_option?: Field[];
  order_by?: Field[];
}

export interface SortOption {
  label: string;
  value: string;
}

export interface SortByField {
  [key: string]: SortOption[];
}
