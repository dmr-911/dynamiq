'use client';

import React, { useState } from 'react';
import GroupBy from './components/GroupBy';
import SortBy from './components/SortBy';
import Column from './components/Column';
import PaginationFilter from './components/PaginationFilter';
import FilterQuery from './components/FilterQuery';
import BulkAction from './components/BulkAction';
import { Field, SortByField } from './type';
import { ColumnType, GroupType, useTableContext } from '../../context/TableContext';
import Search from './components/Search';
import IconButton from './ui/button-icon/IconButton';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import { Tooltip } from './ui/tooltip/Tooltip';
import Drawer from './ui/drawer/Drawer';

const Filter = ({
  actions,
  filterOptions
}: {
  actions: any;
  filterOptions: {
    groupBy: GroupType[];
    sortBy: SortByField;
    colunm: GroupType[];
    actions?: any;
    searchWith?: string[];
  };
}) => {
  const { state, dispatch } = useTableContext();
  const {
    columns,
    selectedColumns,
    sortByFields,
    groupByFields,
    selectedGroup,
    paginationFields,
    selectedPaginatOption
  } = state;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleColumnToggle = (column: ColumnType) => {
    dispatch({ type: 'SET_SELECTED_COLUMNS', payload: column });
  };

  const handleGroupToggle = (group: GroupType) => {
    dispatch({ type: 'SET_SELECTED_GROUP', payload: group });
  };

  const handleSortChange = (data: { [key: string]: string }) => {
    if (Object.keys(data).length > 0) {
      const [field, order] = Object.entries(data)[0];
      dispatch({ type: 'SORT_TABLE_RECORD', payload: { field, order } });

      dispatch({ type: 'SET_SORT_ON_FIELD', payload: { field, order } });
    }
  };

  const handlePaginatFieldSelect = (field: any) => {
    dispatch({ type: 'SET_SELECTED_PAGINAT_OPTION', payload: field });
  };

  // reset all filter options
  const handleResetFilter = () => {
    dispatch({ type: 'INIT_FILTER_BY_COLUMN', payload: filterOptions?.colunm });
    dispatch({ type: 'INIT_FILTER_BY_GROUP', payload: filterOptions?.groupBy });
    dispatch({ type: 'INIT_SORT_BY_FIELDS', payload: filterOptions?.sortBy });
    // dispatch({type:"SET_SORTED_FIELDS",payload:{}})
    dispatch({ type: 'SET_SELECTED_PAGINAT_OPTION', payload: [] });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_PAGE_COUNT', payload: 10 });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    dispatch({ type: 'DESELECT_ALL_RECORDS' });

    dispatch({ type: 'RESET_STATE' });
    dispatch({ type: 'SET_SORT_ON_FIELD', payload: { field: '', order: '' } });
  };

  return (
    <div className="flex items-center gap-2 overflow-auto">
      <div className="hidden items-center gap-2 md:flex">
        <AllFilters
          columns={columns}
          groupByFields={groupByFields}
          handleColumnToggle={handleColumnToggle}
          handleGroupToggle={handleGroupToggle}
          handleSortChange={handleSortChange}
          selectedColumns={selectedColumns}
          selectedGroup={selectedGroup}
          selectedPagination={selectedPaginatOption}
          sortByFields={sortByFields}
          togglePaginationField={handlePaginatFieldSelect}
          paginationFields={paginationFields}
          actions={actions}
        />
      </div>
      {/* search */}
      <Search searchWith={filterOptions?.searchWith} />
      <div className="flex gap-1">
        {/* mobile filter open */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          size="sm"
          variant="solid"
          shape="rounded"
          className="block md:hidden"
        >
          <ReIcon iconName="BiFilter" />
        </IconButton>
        {/* grid */}
        {/* <IconButton size="sm" variant="solid" shape="rounded">
          <ReIcon iconName="BiGridAlt" />
        </IconButton> */}
        {/* order */}
        <Tooltip content="Reset">
          <IconButton
            onClick={handleResetFilter}
            size="sm"
            variant="pastel"
            shape="rounded"
            color="error"
          >
            <ReIcon iconName="BiReset" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        placement={'left'}
        setIsOpen={setDrawerOpen}
        isOpen={drawerOpen}
        backdropColor="black"
        backdropOpacity={0.5}
        width=""
      >
        <div className="custom__scrollbar flex h-screen flex-col items-start gap-4 overflow-auto p-4">
          <AllFilters
            columns={columns}
            groupByFields={groupByFields}
            handleColumnToggle={handleColumnToggle}
            handleGroupToggle={handleGroupToggle}
            handleSortChange={handleSortChange}
            selectedColumns={selectedColumns}
            selectedGroup={selectedGroup}
            selectedPagination={selectedPaginatOption}
            sortByFields={sortByFields}
            togglePaginationField={handlePaginatFieldSelect}
            paginationFields={paginationFields}
            actions={actions}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default Filter;

interface AllFilterProps {
  groupByFields: GroupType[];
  paginationFields: GroupType[];
  sortByFields: SortByField;
  columns: ColumnType[];
  selectedGroup: Field[];
  selectedColumns: ColumnType[];
  selectedPagination: any[];
  handleGroupToggle: (group: GroupType) => void;
  handleSortChange: (data: any) => void;
  handleColumnToggle: (column: ColumnType) => void;
  togglePaginationField: (field: any) => void;
  actions?: any;
}

const AllFilters = ({
  groupByFields,
  sortByFields,
  columns,
  selectedGroup,
  selectedColumns,
  selectedPagination,
  handleGroupToggle,
  handleSortChange,
  handleColumnToggle,
  togglePaginationField,
  paginationFields,
  actions
}: AllFilterProps) => {
  return (
    <>
      <GroupBy
        groupByFields={groupByFields}
        selectedFields={selectedGroup}
        onGroupByChange={handleGroupToggle}
      />
      <SortBy sortByFields={sortByFields} onSortChange={handleSortChange} />
      <Column
        columnFields={columns}
        selectedFields={selectedColumns}
        onColumnChange={handleColumnToggle}
      />
      <PaginationFilter
        paginationFields={paginationFields}
        selectedFields={selectedPagination}
        onPaginationChange={togglePaginationField}
      />
      <FilterQuery />
      <BulkAction actions={actions} />
    </>
  );
};
