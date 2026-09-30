'use client';
import React, { useState, useCallback, useRef } from 'react';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import Input from './ui/form/input/Input';
import { useTableContext } from '../../../context/TableContext';

const Search = ({ searchWith = [] }: { searchWith?: string[] }) => {
  // const dispatch = useAppDispatch();
  // const records = useAppSelector((state) => state.table.records);
  // const isLoading = useAppSelector((state) => state.table.isLoading);
  // const searchQuery = useAppSelector((state) => state.table.searchQuery);

  const { state, dispatch } = useTableContext();
  const { records, isLoading, searchQuery } = state;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      // dispatch(setPage(1));
      dispatch({ type: 'SET_PAGE', payload: 1 });
      // dispatch(setPaginateRecords([]));
      dispatch({ type: 'SET_PAGINATE_RECORDS', payload: [] });
      const filteredRecords = records.filter((record: any) => {
        return searchWith.length === 0
          ? Object.values(record).some((value) =>
              String(value).toLowerCase().includes(query.toLowerCase())
            )
          : searchWith.some((field) =>
              String(record[field]).toLowerCase().includes(query.toLowerCase())
            );
      });
      // dispatch(setPaginateRecords(filteredRecords));
      dispatch({ type: 'SET_PAGINATE_RECORDS', payload: filteredRecords });
      // dispatch(setLoading(false));
      dispatch({ type: 'SET_LOADING', payload: false });
    },
    [dispatch, searchWith, records]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    // setInputValue(query);
    // dispatch(setSearchQuery(query))
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length > 0) {
      // dispatch(setLoading(true));
      dispatch({ type: 'SET_LOADING', payload: true });
      timeoutRef.current = setTimeout(() => {
        handleSearch(query);
      }, 1000);
    } else {
      // dispatch(setLoading(false));
      dispatch({ type: 'SET_LOADING', payload: false });
      // dispatch(setPage(1));
      dispatch({ type: 'SET_PAGE', payload: 1 });
      //   dispatch(setPaginateRecords([]));
    }
  };

  const handleClear = () => {
    // dispatch(setSearchQuery(""))
    // dispatch(setLoading(false));
    // dispatch(setPage(1));

    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'SET_PAGE', payload: 1 });
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search"
        shape="smooth"
        size="sm"
        icon="BiSearch"
        onChange={handleChange}
        value={searchQuery}
      />
      {isLoading && (
        <div className="absolute right-8 top-2.5 text-xs text-muted-800 dark:text-muted-400">
          Loading...
        </div>
      )}
      {searchQuery && (
        <button className="absolute right-2 top-2.5" onClick={handleClear}>
          <ReIcon
            iconName="AiOutlineClose"
            className="text-xs text-muted-800 dark:text-muted-400"
          />
        </button>
      )}
    </div>
  );
};

export default Search;
