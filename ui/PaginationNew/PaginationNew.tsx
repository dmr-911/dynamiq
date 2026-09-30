import { cn } from '../utils/cn';
import _ from 'lodash';
import Button from '../button/Button';
import IconButton from '../button-icon/IconButton';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import BaseParagraph from '../base-paragraph/BaseParagraph';
type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  firstAndLast?: boolean;
  showAll?: boolean;
  showPage?: number;
  showRecords?: boolean;
  displayCount?: boolean;
};
const PaginationNew = ({
  currentPage,
  onPageChange,
  totalCount,
  pageSize,
  firstAndLast,
  showAll,
  showPage = 1,
  showRecords,
  displayCount
}: PaginationProps) => {
  const totalPages: number = Math.ceil(totalCount / pageSize);
  // if (totalPages <= 1) return null;

  const getPageCount = (totalPage: number, currentPage: number, showPage: number) => {
    const half = Math.floor(showPage / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPage, currentPage + half);

    if (currentPage <= half) {
      endPage = Math.min(totalPage, showPage);
    } else if (currentPage + half >= totalPage) {
      startPage = Math.max(1, totalPage - showPage + 1);
    }
    const pageRange = _.range(startPage, endPage + 1);

    if (startPage > totalPage / 2) {
      pageRange.unshift('middle...');
    }
    // Add dots if necessary
    if (startPage > 3) {
      pageRange.unshift(1);
    }

    // add middle
    if (endPage < totalPage / 2) {
      pageRange.push('middle...');
    }

    // add last page number
    if (endPage < totalPage) {
      pageRange.push(totalPage);
    }

    return pageRange;
  };

  // page count wit ...
  const pages = getPageCount(totalPages, currentPage, showPage);

  // page count all
  const grantedTotalPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // handle page changes
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    let newPage = page.toString() === 'middle...' ? Math.ceil(totalPages / 2) : page;
    onPageChange(newPage);
  };

  const countPagesData =
    totalPages <= 1 ? Array(1).fill(1) : showAll ? grantedTotalPages : pages || [];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 md:flex-row',
        !showRecords && !displayCount && 'justify-end'
      )}
    >
      {/* {showRecords && (
        <BaseParagraph as="p" size="md" color="muted" weight="medium">
          Showing{' '}
          {showRecords === 'total_records'
            ? `Total Records ${totalCount}`
            : `Display Records ${pageSize}`}
        </BaseParagraph>
      )} */}
      {showRecords && !displayCount && (
        <BaseParagraph as="p" size="md" color="muted" weight="medium">
          Total Records {totalCount}
        </BaseParagraph>
      )}
      {displayCount && !showRecords && (
        <BaseParagraph as="p" size="md" color="muted" weight="medium">
          Total Records {pageSize}
        </BaseParagraph>
      )}
      {displayCount && showRecords && (
        <BaseParagraph as="p" size="md" color="muted" weight="medium">
          Showing Total Records {pageSize} of {totalCount}
        </BaseParagraph>
      )}
      {/* pagination block */}
      <div className="flex items-center gap-1">
        {/* first */}
        {firstAndLast && (
          <Button disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
            First
          </Button>
        )}

        {/* prev */}
        <IconButton
          type="button"
          className="rtl:rotate-180"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="sr-only">Prev Page</span>
          <ReIcon iconName="AiOutlineLeft" />
        </IconButton>

        {/* pages */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          {countPagesData?.map((page, index) => (
            <IconButton
              key={index}
              variant={currentPage === page ? 'solid' : 'outlined'}
              color={currentPage === page ? 'primary' : 'muted'}
              onClick={() => handlePageChange(page)}
            >
              {page?.toString().includes('...') ? '...' : page}
              {/* {page} */}
            </IconButton>
          ))}
        </div>

        {/* next */}
        <IconButton
          type="button"
          className="rtl:rotate-180"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <span className="sr-only">Next Page</span>
          <ReIcon iconName="AiOutlineRight" />
        </IconButton>

        {/* last */}
        {firstAndLast && (
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            Last
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaginationNew;
