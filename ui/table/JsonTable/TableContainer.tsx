import React, { useEffect } from 'react';
import { FilterOptions } from '.';
import { useTableContext } from './context/TableContext';
import Filter from './components/Filter/Filter';
import PaginationNew from '../../PaginationNew/PaginationNew';
import { isIdInArray } from './utils';
import Table from './Table';
import { useQueryParams } from './app/(dashboard)/(admin)/admin/role/utils/useQueryParams';

interface TableContainerProps {
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

const TableContainer = ({
  filterOptions,
  tableData,
  config,
  bulkSelect,
  height,
  loading,
  dispatchFn,
  action,
  onChangeGroup,
  onChangeSort,
  onPaginationChange,
  paginationData
}: TableContainerProps) => {
  // const setQueryParam = useSetQueryParam();
  const firstRenderRef = React.useRef<boolean>(false);
  const { state, dispatch } = useTableContext();
  const { sortOnField, records, selectedPaginatOption, pageCount, page, selectedGroup } = state;
  const totalCount = records?.length || 0;
  const showPage = 5;

  const { setQueryParams } = useQueryParams();

  useEffect(() => {
    if (selectedGroup && onChangeGroup) {
      onChangeGroup(selectedGroup);
    }
  }, [state, selectedGroup]);

  useEffect(() => {
    if (loading) {
      dispatch({ type: 'SET_LOADING', payload: true });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loading]);

  useEffect(() => {
    if (sortOnField && onChangeSort) {
      onChangeSort(sortOnField);
    }
  }, [sortOnField]);

  useEffect(() => {
    if (sortOnField && onChangeSort) {
      onChangeSort(sortOnField);
    }
  }, [sortOnField]);

  useEffect(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true;
      dispatch({ type: 'SET_PAGE', payload: 1 });
      dispatch({ type: 'SET_PAGE_COUNT', payload: 10 });
    }
  }, []);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        page: page.toString(),
        pageSize: pageCount.toString()
      });
    }
  }, [page, pageCount]);

  // dispatch from outside of Provider
  useEffect(() => {
    if (dispatchFn) {
      dispatch(dispatchFn);
    }
  }, [dispatchFn]);
  // init all default data on context
  useEffect(() => {
    dispatch({ type: 'INIT_RECORDS', payload: tableData });
    dispatch({ type: 'INIT_FILTER_BY_COLUMN', payload: filterOptions?.colunm });
    dispatch({ type: 'INIT_FILTER_BY_GROUP', payload: filterOptions?.groupBy });
    dispatch({ type: 'INIT_SORT_BY_FIELDS', payload: filterOptions?.sortBy });

    if (sortOnField?.field) {
      dispatch({
        type: 'SORT_TABLE_RECORD',
        payload: { field: sortOnField?.field, order: sortOnField?.order }
      });
    }
  }, [tableData, filterOptions?.colunm, filterOptions?.groupBy, filterOptions?.sortBy]);

  return (
    <div className="space-y-3">
      <Filter actions={filterOptions?.actions} filterOptions={filterOptions} />
      <Table
        tableData={tableData}
        config={config}
        bulkSelect={bulkSelect}
        height={height}
        loading={loading}
        action={action}
      />

      {/* PAGINATION */}
      <PaginationNew
        currentPage={page}
        totalCount={paginationData?.totalRecord}
        pageSize={Number(pageCount) > 0 ? Number(pageCount) : 1}
        onPageChange={(pageNum) => dispatch({ type: 'SET_PAGE', payload: pageNum })}
        firstAndLast={isIdInArray(selectedPaginatOption, 3)}
        showAll={isIdInArray(selectedPaginatOption, 4)}
        showPage={showPage}
        showRecords={isIdInArray(selectedPaginatOption, 1)}
        displayCount={isIdInArray(selectedPaginatOption, 2)}
      />
    </div>
  );
};

export default TableContainer;
