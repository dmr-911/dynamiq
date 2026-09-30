import React, { type FC } from 'react';
import { DOTS, usePagination } from './hooks/usePagination';
import IconButton from '../button-icon/IconButton';
import { ReIcon } from '../../components/ReIcon/ReIcon';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonShape?: 'straight' | 'rounded' | 'smooth' | 'curved' | 'full';
}

const Pagination: FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  buttonSize = 'md',
  buttonShape = 'smooth'
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || (paginationRange !== undefined && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange !== undefined ? paginationRange[paginationRange.length - 1] : 0;
  return (
    <ul className="flex justify-center gap-1 text-sm font-medium">
      {/* Left navigation arrow */}
      <li>
        <IconButton
          type="button"
          className="rtl:rotate-180"
          size={buttonSize}
          shape={buttonShape}
          disabled={currentPage === 1}
          onClick={onPrevious}
        >
          <span className="sr-only">Prev Page</span>
          <ReIcon iconName="AiOutlineLeft" className="h-4 w-4 scale-95" />
        </IconButton>
      </li>
      {paginationRange?.map((pageNumber: any, index) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="pagination-item dots">
              <IconButton type="button" size={buttonSize} shape={buttonShape}>
                <ReIcon iconName="AiOutlineRight" className="h-4 w-4" />
              </IconButton>
            </li>
          );
        }

        // Render our Page Pills
        return (
          <li key={index}>
            <IconButton
              type="button"
              size={buttonSize}
              shape={buttonShape}
              color={pageNumber === currentPage ? 'primary' : 'default'}
              onClick={() => onPageChange(pageNumber)}
            >
              <span>{pageNumber}</span>
            </IconButton>
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li>
        <IconButton
          type="button"
          className="rtl:rotate-180"
          size={buttonSize}
          shape={buttonShape}
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          <span className="sr-only">Prev Page</span>
          <ReIcon iconName="AiOutlineRight" className="h-4 w-4 scale-95" />
        </IconButton>
      </li>
    </ul>
  );
};

export default Pagination;
