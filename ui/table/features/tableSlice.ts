import { MemberGroup } from './Tables/MyMembers/MyMembersTable';
import { SortByField } from './../../../Filter/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface TableState {
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
  selectedPaginatOption:GroupType[];
  pageCount:number;
  page:number,
  searchQuery:string;
  isLoading:boolean
}

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
  paginateRecords:[],
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
  sortOnField: {},
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
  selectedPaginatOption:[
  ],
  pageCount:10,
  page:1,
  searchQuery:"",
  isLoading:false

};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    initRecords: (state, action: PayloadAction<any[]>) => {
      state.records = [...action.payload];
      state.paginateRecords=[...action.payload].slice(0,state.pageCount)
    },
    initFilterByColumn: (state, action: PayloadAction<ColumnType[]>) => {
      state.columns = action.payload;
      state.selectedColumns=action.payload
    },
    initFilterByGroup: (state, action: PayloadAction<ColumnType[]>) => {
      state.groupByFields = action.payload;
    },
    initSortByFields: (state, action: PayloadAction<SortByField>) => {
      state.sortByFields = action.payload;
    },


    setSelectedColumns: (state, action: PayloadAction<ColumnType>) => {
      const columnToToggle = action.payload;
      const isColumnSelected = state.selectedColumns.some((col) => col.id === columnToToggle.id);

      if (isColumnSelected) {
        // If the column is already selected, remove it
        state.selectedColumns = state.selectedColumns.filter((col) => col.id !== columnToToggle.id);
      } else {
        // If the column is not selected, add it
        state.selectedColumns.push(columnToToggle);
      }
    },
    setSelectedGroup: (state, action: PayloadAction<GroupType>) => {
      const selectedGroup = action.payload;
      if (state.selectedGroup.length > 0 && state.selectedGroup[0].id === selectedGroup.id) {
        state.selectedGroup = []; // Reset to an empty array if the same group is selected
      } else {
        state.selectedGroup = [selectedGroup]; // Set the new selected group as the only element in the array
      }
    },
    setSortedFields: (state, action: PayloadAction<SortedFields>) => {
      const selectedField = action.payload;
      state.sortOnField = selectedField;
    },
    sortTableRecord: (state, action: PayloadAction<{
      field:string;
      order:string;
    }>) => {
      const { field, order } = action.payload;

      state.paginateRecords.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        // Check if the values are numeric (string or number)
        const isNumeric = !isNaN(valueA) && !isNaN(valueB);

        if (isNumeric) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        let comparison = 0;
        if (valueA < valueB) {
          comparison = -1;
        } else if (valueA > valueB) {
          comparison = 1;
        }

        return order === 'asc' ? comparison : -comparison;
      });
    },
    setSelectedRecordItems: (state, action: PayloadAction<any>) => {
      const selectedItem = action.payload;
      const isItemSelected = state.selectedRecordItems.some((item) => item.id === selectedItem.id);

      if (isItemSelected) {
        state.selectedRecordItems = state.selectedRecordItems.filter(
          (item) => item.id !== selectedItem.id
        );
      } else {
        state.selectedRecordItems.push(selectedItem);
      }
    },
    setSelectedRecordGroup: (state, action: PayloadAction<any>) => {
      const group = action.payload;
      const isGroupFullySelected = group.groupItems.every((item: any) =>
        state.selectedRecordItems.some((selectedItem) => selectedItem.id === item.id)
      );

      if (isGroupFullySelected) {
        // Deselect the entire group
        state.selectedRecordItems = state.selectedRecordItems.filter(
          (item) => !group.groupItems.some((groupItem: any) => groupItem.id === item.id)
        );
        state.selectedRecordGroup = state.selectedRecordGroup.filter(
          (g) => g.groupId !== group.groupId
        );
      } else {
        // Select the entire group
        group.groupItems.forEach((item: any) => {
          if (!state.selectedRecordItems.some((selectedItem) => selectedItem.id === item.id)) {
            state.selectedRecordItems.push(item);
          }
        });
        if (!state.selectedRecordGroup.some((g) => g.groupId === group.groupId)) {
          state.selectedRecordGroup.push(group);
        }
      }
    },
    selectAllRecords: (state) => {
      const allItems = state.paginateRecords.flatMap((item) =>
        'groupItems' in item ? item.groupItems : [item]
      );
      const allGroups = state.paginateRecords.filter((item): item is MemberGroup => 'groupId' in item);

      if (state.selectedRecordItems.length === allItems.length) {
        // If all items are selected, deselect all
        state.selectedRecordItems = [];
        state.selectedRecordGroup = [];
      } else {
        // Otherwise, select all
        state.selectedRecordItems = allItems;
        state.selectedRecordGroup = allGroups;
      }
    },
    deleteSelectedRecords: (state) => {
      const selectedIds = new Set(state.selectedRecordItems.map((item) => item.id));
      state.paginateRecords = state.paginateRecords.filter((record) => {
        if ('groupItems' in record) {
          record.groupItems = record.groupItems.filter((item: any) => !selectedIds.has(item.id));
          return record.groupItems.length > 0;
        }
        return !selectedIds.has(record.id);
      });
      state.selectedRecordItems = [];
      state.selectedRecordGroup = [];
    },
    setSelectedPaginatOption: (state, action: PayloadAction<GroupType | any>) => {
      // state.selectedPaginatOption = [...state.selectedPaginatOption,selectedField];
      const selectedField = action.payload;
      if (Array.isArray(action.payload)) {
        state.selectedPaginatOption=[]
      }else{
        const isItemSelected = state.selectedPaginatOption.some((item) => item.id === selectedField.id);

        if (isItemSelected) {
          state.selectedPaginatOption = state.selectedPaginatOption.filter(
            (item) => item.id !== selectedField.id
          );
        } else {
          state.selectedPaginatOption.push(selectedField);
        }
      }
     
    },
    setPageCount: (state, action: PayloadAction<number>) => {
      state.pageCount=action.payload
      state.paginateRecords=state.records.slice(0,state.pageCount)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
  
      const startIndex = (state.page - 1) * state.pageCount;
      const endIndex = Number(startIndex) + Number(state.pageCount);
      state.paginateRecords = state.records.slice(Number(startIndex), endIndex);
    },
    setPaginateRecords: (state, action: PayloadAction<any[]>) => {
      const recordsToPaginate = action.payload;
      const startIndex = (state.page - 1) * state.pageCount;
      const endIndex = startIndex + state.pageCount;
      state.paginateRecords = recordsToPaginate.slice(startIndex, endIndex);
     
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery=action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading=action.payload
    },
  }
});

export const {
  initRecords,
  initFilterByColumn,
  initFilterByGroup,
  initSortByFields,

  setSelectedColumns,
  setSelectedGroup,
  setSortedFields,
  sortTableRecord,
  setSelectedRecordItems,
  setSelectedRecordGroup,
  selectAllRecords,
  deleteSelectedRecords,
  setSelectedPaginatOption,
  setPageCount,
  setPage,
  setPaginateRecords,
  setSearchQuery,
  setLoading
} = tableSlice.actions;
export default tableSlice.reducer;
