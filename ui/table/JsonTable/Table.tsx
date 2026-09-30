import React, { useCallback, useMemo } from 'react';
import { useTableContext } from './context/TableContext';
import FlexTable from '../flexTable/FlexTable';
import TableHeader from './components/TableHeader';
import RenderTableRow from './components/RenderTableRow';
import { cn } from '../../utils/cn';
import DataNotFound from './DataNotFound/DataNotFound';

const Table = ({
  config,
  bulkSelect,
  height,
  loading,
  action
}: {
  tableData: any[];
  config: any;
  bulkSelect?: boolean;
  height?: string;
  loading?: boolean;
  action?: any;
}) => {
  const { state, dispatch } = useTableContext();
  const {
    selectedColumns,
    selectedGroup,
    sortOnField,
    paginateRecords,
    selectedRecordItems,
    selectedRecordGroup,
    searchQuery,
    isLoading
  } = state;

  // group paginatedata
  const groupRecords = useCallback((paginateRecords: any[], groupBy: string) => {
    const groups: { [key: string]: any[] } = {};
    paginateRecords.forEach((record) => {
      const groupValue = record[groupBy as keyof any];
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(record);
    });

    return Object.entries(groups).map(([groupValue, groupItems], index) => ({
      groupId: `group-${index + 1}`,
      title: `${groupBy} ${groupValue}`,
      groupItems
    }));
  }, []);

  // sort data with group
  const sortAndGroupRecords = useCallback(
    (records: any[]) => {
      let processedRecords = [...records];

      // Apply grouping
      if (selectedGroup.length > 0) {
        return groupRecords(processedRecords, selectedGroup[0].label.toLowerCase());
      }

      return processedRecords;
    },
    [sortOnField, selectedGroup, groupRecords]
  );

  // Use sortAndGroupRecords to create dataToRender
  const dataToRender = useMemo(() => {
    // return sortAndGroupRecords(paginateRecords);
    return paginateRecords;
  }, [paginateRecords, sortAndGroupRecords, selectedGroup, sortOnField]);

  // Memoize the filtered tableColunms
  const filteredColumns = useMemo(() => {
    // If no columns are selected, return the entire config
    if (selectedColumns.length === 0) {
      return config;
    }

    // Filter the column array in config based on selectedColumns
    const filteredColumnArray = config?.column?.filter((column: any) =>
      selectedColumns.some((selectedColumn) => selectedColumn.label === column.name)
    );

    // Return a new config object with the filtered columns
    return {
      ...config,
      column: filteredColumnArray
    };
  }, [selectedColumns, config]);

  const handleSelect = (item: any) => {
    dispatch({ type: 'SET_SELECTED_RECORD_ITEMS', payload: item });
  };

  const handleSelectAll = () => {
    dispatch({ type: 'SELECT_ALL_RECORDS' });
  };

  const handleSelectGroup = (group: any) => {
    dispatch({ type: 'SET_SELECTED_RECORD_GROUP', payload: group });
  };

  return (
    <FlexTable
      rowgap="md"
      header={
        <>
          <TableHeader
            columns={filteredColumns}
            records={dataToRender}
            selectedItems={selectedRecordItems}
            selectedGroups={selectedRecordGroup}
            handleSelectAll={handleSelectAll}
            bulkSelect={bulkSelect}
            action={action}
          />
        </>
      }
      body={
        <div
          className={cn(
            'custom__scrollbar h-[calc(100vh-291px)] overflow-y-auto pr-1',
            height && height
          )}
        >
          {loading ? (
            <DataNotFound state="loading" />
          ) : isLoading ? (
            <DataNotFound state="loading" />
          ) : dataToRender.length > 0 ? (
            <RenderTableRow
              columns={filteredColumns}
              records={dataToRender}
              selectedItems={selectedRecordItems}
              handleSelect={handleSelect}
              handleSelectGroup={handleSelectGroup}
              bulkSelect={bulkSelect}
              action={action}
            />
          ) : (
            <DataNotFound
              state="no_results"
              title={
                searchQuery ? `No record found with '${searchQuery}' keyword` : 'Data Not Found'
              }
            />
          )}
        </div>
      }
    />
  );
};
export default Table;
