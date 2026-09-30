import React from 'react';
import { GroupType, TableProvider } from './context/TableContext';
import { SortByField } from './components/Filter/type';
import TableContainer from './TableContainer';

export interface FilterOptions {
  groupBy: GroupType[];
  sortBy: SortByField;
  colunm: GroupType[];
  actions?: any;
  searchWith?: string[];
}

interface JsonTableProps {
  filterOptions: FilterOptions;
  tableData: any[];
  config: any;
  bulkSelect?: boolean;
  height?: string;
  loading?: boolean;
  dispatchFn?: {
    type: any;
    payload?: any;
  };
  action?: any;
  onChangeGroup?: (group: any) => void;
  onChangeSort?: (sort: any) => void;
  onPaginationChange?: (page: any) => void;
  paginationData?: any;
}
const JsonTable = ({
  filterOptions,
  tableData,
  config,
  bulkSelect = true,
  height,
  loading,
  dispatchFn,
  action,
  onChangeGroup,
  onChangeSort,
  onPaginationChange,
  paginationData
}: JsonTableProps) => {
  return (
    <TableProvider>
      <TableContainer
        filterOptions={filterOptions}
        tableData={tableData}
        config={config}
        bulkSelect={bulkSelect}
        height={height}
        loading={loading}
        dispatchFn={dispatchFn}
        action={action}
        onChangeGroup={onChangeGroup}
        onChangeSort={onChangeSort}
        onPaginationChange={onPaginationChange}
        paginationData={paginationData}
      />
    </TableProvider>
  );
};

export default JsonTable;
