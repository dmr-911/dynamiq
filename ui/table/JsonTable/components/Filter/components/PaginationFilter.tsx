import React, { useState } from 'react';
import FieldRenderer from './FieldRenderer';
import FilterDropdown from './FilterDropdown';
import { Field } from '../type';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';
import { useTableContext } from '../../../context/TableContext';

interface PaginationProps {
  paginationFields: Field[];
  selectedFields: Field[];
  onPaginationChange: (field: Field) => void;
}

const PaginationFilter = ({
  paginationFields,
  selectedFields,
  onPaginationChange
}: PaginationProps) => {
  // const dispatch=useAppDispatch()
  // const pageCount = useAppSelector((state) => state.table.pageCount);
  const { state, dispatch } = useTableContext();
  const { pageCount } = state;
  return (
    <>
      <div className="hidden md:block">
        <FilterDropdown name="Pagination" iconName="TbArrowsSort">
          <FieldRenderer
            paginate
            pageCount={pageCount}
            setPageCount={(count: number) => dispatch({ type: 'SET_PAGE_COUNT', payload: count })}
            fields={paginationFields}
            selectedFields={selectedFields}
            onCheckboxChange={onPaginationChange}
          />
        </FilterDropdown>
      </div>
      <div className="block md:hidden">
        <BaseParagraph size="md" color="muted" weight="semibold">
          Pagination
        </BaseParagraph>
        <FieldRenderer
          paginate
          pageCount={pageCount}
          // setPageCount={(count:number)=>dispatch(setPageCount(count))}
          setPageCount={(count: number) => dispatch({ type: 'SET_PAGE_COUNT', payload: count })}
          fields={paginationFields}
          selectedFields={selectedFields}
          onCheckboxChange={onPaginationChange}
        />
      </div>
    </>
  );
};

export default PaginationFilter;
