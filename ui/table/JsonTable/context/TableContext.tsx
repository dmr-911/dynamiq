import { SortByField } from './Filter/type';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ColumnType {
  id: any;
  label: string;
}

export interface GroupType {
  id: any;
  label: string;
}

export interface SortedFields {
  [key: string]: string;
}
// Define the state shape
interface TableState {
  // Add all the state properties from your Redux store
  columns: ColumnType[];
  records: any[];
  paginateRecords: any[];
  selectedColumns: ColumnType[];
  sortByFields: SortByField;
  groupByFields: ColumnType[];
  selectedGroup: ColumnType[];
  sortOnField: SortedFields;
  selectedRecordItems: any[];
  selectedRecordGroup: any[];
  paginationFields: GroupType[];
  selectedPaginatOption: GroupType[];
  pageCount: number;
  page: number;
  searchQuery: string;
  isLoading: boolean;
}

// Define action types
type TableAction =
  | { type: 'INIT_RECORDS'; payload: any[] }
  | { type: 'INIT_FILTER_BY_COLUMN'; payload: ColumnType[] }
  | { type: 'INIT_FILTER_BY_GROUP'; payload: ColumnType[] }
  | { type: 'INIT_SORT_BY_FIELDS'; payload: SortByField }
  | { type: 'SET_SELECTED_COLUMNS'; payload: ColumnType }
  | { type: 'SET_SELECTED_GROUP'; payload: GroupType }
  | { type: 'SET_SORT_ON_FIELD'; payload: SortedFields }
  | { type: 'SORT_TABLE_RECORD'; payload: { field: string; order: string } }
  | { type: 'SET_SELECTED_RECORD_ITEMS'; payload: any }
  | { type: 'SET_SELECTED_RECORD_GROUP'; payload: any }
  | { type: 'SELECT_ALL_RECORDS' }
  | { type: 'DESELECT_ALL_RECORDS' }
  | { type: 'DELETE_SELECTED_RECORDS' }
  | { type: 'RESET_STATE' }
  | { type: 'SET_SELECTED_PAGINAT_OPTION'; payload: GroupType | any[] }
  | { type: 'SET_PAGE_COUNT'; payload: number }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGINATE_RECORDS'; payload: any[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const TableContext = createContext<
  | {
      state: TableState;
      dispatch: React.Dispatch<TableAction>;
    }
  | undefined
>(undefined);

const initialState: TableState = {
  columns: [
    // { id: 1, label: 'Member' },
    // { id: 2, label: 'Email' },
    // { id: 3, label: 'Phone' },
    // { id: 4, label: 'Property Listed' },
    // { id: 5, label: 'Customers' },
    // { id: 6, label: 'Status' },
    // { id: 7, label: 'Actions' }
  ],
  records: [],
  paginateRecords: [],
  selectedColumns: [
    // { id: 1, label: 'Member' },
    // { id: 2, label: 'Email' },
    // { id: 3, label: 'Phone' },
    // { id: 4, label: 'Property Listed' },
    // { id: 5, label: 'Customers' },
    // { id: 6, label: 'Status' },
    // { id: 7, label: 'Actions' }
  ],
  sortByFields: {
    // id: [
    //   { label: 'Ascending', value: 'asc' },
    //   { label: 'Descending', value: 'desc' }
    // ],
    // mail: [
    //   { label: 'A - Z', value: 'asc' },
    //   { label: 'Z - A', value: 'desc' }
    // ],
    // phone: [
    //   { label: 'A - Z', value: 'asc' },
    //   { label: 'Z - A', value: 'desc' }
    // ],
    // status: [
    //   { label: 'Ascending', value: 'asc' },
    //   { label: 'Descending', value: 'desc' }
    // ],
    // lastModified: [
    //   { label: 'Ascending', value: 'asc' },
    //   { label: 'Descending', value: 'desc' }
    // ]
  },
  sortOnField: {
    field: '',
    order: ''
  },
  groupByFields: [
    // { id: 1, label: 'status' },
    // { id: 2, label: 'mail' }
  ],
  selectedGroup: [],
  selectedRecordItems: [],
  selectedRecordGroup: [],
  paginationFields: [
    { id: 1, label: 'Total Record Count' },
    { id: 2, label: 'Display Record Count' },
    { id: 3, label: 'Show First & Last Page' },
    { id: 4, label: 'Show All Page' }
  ],
  selectedPaginatOption: [],
  pageCount: 0,
  page: 0,
  searchQuery: '',
  isLoading: false
};

// Create a reducer function
function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'INIT_RECORDS':
      return {
        ...state,
        records: action.payload,
        paginateRecords: action.payload.slice(0, state.pageCount)
      };

    case 'INIT_FILTER_BY_COLUMN':
      return {
        ...state,
        columns: action.payload
        // selectedColumns: action.payload
      };

    case 'INIT_FILTER_BY_GROUP':
      return {
        ...state,
        groupByFields: action.payload
      };

    case 'INIT_SORT_BY_FIELDS':
      return {
        ...state,
        sortByFields: action.payload
      };

    case 'SET_SELECTED_COLUMNS':
      const columnToToggle = action.payload;
      console.log(columnToToggle, 'columnToToggle');
      const isColumnSelected = state.selectedColumns.some((col) => col.id === columnToToggle.id);
      return {
        ...state,
        selectedColumns: isColumnSelected
          ? state.selectedColumns.filter((col) => col.id !== columnToToggle.id)
          : [...state.selectedColumns, columnToToggle]
      };

    case 'SET_SELECTED_GROUP':
      const selectedGroup = action.payload;
      return {
        ...state,
        selectedGroup:
          state.selectedGroup.length > 0 && state.selectedGroup[0].id === selectedGroup.id
            ? []
            : [selectedGroup]
      };

    case 'SET_SORT_ON_FIELD':
      return {
        ...state,
        sortOnField: action.payload
      };

    case 'SORT_TABLE_RECORD':
      const { field, order } = action.payload;
      const sortedRecords = [...state.paginateRecords].sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];
        const isNumeric = !isNaN(valueA) && !isNaN(valueB);
        if (isNumeric) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }
        let comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
      return {
        ...state,
        paginateRecords: sortedRecords
      };

    case 'SET_SELECTED_RECORD_ITEMS':
      const selectedItem = action.payload;
      const isItemSelected = state.selectedRecordItems.some((item) => item.id === selectedItem.id);
      return {
        ...state,
        selectedRecordItems: isItemSelected
          ? state.selectedRecordItems.filter((item) => item.id !== selectedItem.id)
          : [...state.selectedRecordItems, selectedItem]
      };

    case 'SET_SELECTED_RECORD_GROUP':
      const group = action.payload;
      const isGroupFullySelected = group.groupItems.every((item: any) =>
        state.selectedRecordItems.some((selectedItem) => selectedItem.id === item.id)
      );
      if (isGroupFullySelected) {
        return {
          ...state,
          selectedRecordItems: state.selectedRecordItems.filter(
            (item) => !group.groupItems.some((groupItem: any) => groupItem.id === item.id)
          ),
          selectedRecordGroup: state.selectedRecordGroup.filter((g) => g.groupId !== group.groupId)
        };
      } else {
        const newSelectedItems = [
          ...state.selectedRecordItems,
          ...group.groupItems.filter(
            (item: any) =>
              !state.selectedRecordItems.some((selectedItem) => selectedItem.id === item.id)
          )
        ];
        const newSelectedGroups = state.selectedRecordGroup.some((g) => g.groupId === group.groupId)
          ? state.selectedRecordGroup
          : [...state.selectedRecordGroup, group];
        return {
          ...state,
          selectedRecordItems: newSelectedItems,
          selectedRecordGroup: newSelectedGroups
        };
      }

    case 'SELECT_ALL_RECORDS':
      const allItems = state.paginateRecords.flatMap((item) =>
        'groupItems' in item ? item.groupItems : [item]
      );
      const allGroups = state.paginateRecords.filter(
        (item): item is MemberGroup => 'groupId' in item
      );
      return {
        ...state,
        selectedRecordItems: state.selectedRecordItems.length === allItems.length ? [] : allItems,
        selectedRecordGroup: state.selectedRecordItems.length === allItems.length ? [] : allGroups
      };

    case 'DESELECT_ALL_RECORDS':
      return {
        ...state,
        selectedRecordItems: [],
        selectedRecordGroup: []
      };

    case 'DELETE_SELECTED_RECORDS':
      const selectedIds = new Set(state.selectedRecordItems.map((item) => item.id));
      return {
        ...state,
        paginateRecords: state.paginateRecords.filter((record) => {
          if ('groupItems' in record) {
            record.groupItems = record.groupItems.filter((item: any) => !selectedIds.has(item.id));
            return record.groupItems.length > 0;
          }
          return !selectedIds.has(record.id);
        }),
        selectedRecordItems: [],
        selectedRecordGroup: []
      };

    case 'SET_SELECTED_PAGINAT_OPTION':
      if (Array.isArray(action.payload)) {
        return { ...state, selectedPaginatOption: [] };
      } else {
        const selectedField = action.payload;
        const isItemSelected = state.selectedPaginatOption.some(
          (item) => item.id === selectedField.id
        );
        return {
          ...state,
          selectedPaginatOption: isItemSelected
            ? state.selectedPaginatOption.filter((item) => item.id !== selectedField.id)
            : [...state.selectedPaginatOption, selectedField]
        };
      }

    case 'SET_PAGE_COUNT':
      return {
        ...state,
        pageCount: action.payload,
        paginateRecords: state.records.slice(0, action.payload)
      };

    case 'SET_PAGE':
      const startIndex = (action.payload - 1) * state.pageCount;
      const endIndex = startIndex + state.pageCount;

      return {
        ...state,
        page: action.payload,
        // paginateRecords: state.records.slice(startIndex, endIndex)
        paginateRecords: state.records
      };

    case 'SET_PAGINATE_RECORDS':
      const recordsToPaginate = action.payload;
      const paginateStartIndex = (state.page - 1) * state.pageCount;
      const paginateEndIndex = paginateStartIndex + state.pageCount;
      return {
        ...state,
        paginateRecords: recordsToPaginate.slice(paginateStartIndex, paginateEndIndex)
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'RESET_STATE':
      return {
        ...state,
        selectedGroup: [],
        sortOnField: {}
      };

    default:
      return state;
  }
}

// Create a TableProvider component
export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  return <TableContext.Provider value={{ state, dispatch }}>{children}</TableContext.Provider>;
};

// Create a custom hook to use the TableContext
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};
