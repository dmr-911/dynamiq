'use client';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import { ReIcon } from '../ps-production/ReIcon/ReIcon';
type TableHeaderProps = {
  columns: any[];
  records: any[];
  handleAllDataSelectedRecords: (e: any) => void;
  toggleProduct: any[];
  showSelectBox: boolean;
  getSortingData: (data: any[]) => void;
  headerClasses?: string;
  selectBoxWrapperClass?: string;
};

const TableHeader = ({
  columns,
  records,
  handleAllDataSelectedRecords,
  toggleProduct,
  showSelectBox,
  getSortingData,
  headerClasses,
  selectBoxWrapperClass
}: TableHeaderProps) => {
  //init sorting sorted data
  const initialSortConfig = columns?.reduce((acc, column) => {
    if (column?.sortable) {
      acc[column?.accessor] = { key: column?.accessor, direction: 'asc' };
    }
    return acc;
  }, {});
  const [sortConfig, setSortConfig] = useState(initialSortConfig || {});
  // sorting function code here
  const handleSort = (key: any) => {
    const direction = sortConfig[key].direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig = { ...sortConfig, [key]: { key, direction } };

    const resultData =
      records?.length &&
      [...records]?.sort((a, b) => {
        if (direction === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        } else if (direction === 'desc') {
          return a[key] < b[key] ? 1 : -1;
        }
        return 0;
      });

    getSortingData && getSortingData(resultData || []);
    setSortConfig(newSortConfig);
  };
  return (
    <thead className={cn('text-left', headerClasses && headerClasses)}>
      <tr>
        {/* columns header html code  */}
        {showSelectBox && (
          <th
            role="rowheader"
            // style={{ width: '30px', paddingLeft: '30px' }}
            className={cn('w-7', selectBoxWrapperClass && selectBoxWrapperClass)}
          >
            <input
              aria-label="header-select"
              type="checkbox"
              checked={toggleProduct.length === records.length}
              onChange={() => {
                handleAllDataSelectedRecords('all');
              }}
            />
          </th>
        )}
        {columns?.map((column, index) => {
          return (
            <th
              style={{
                width: column?.width && `${column?.width}`,
                textAlign: column?.align && column?.align,
                color: column?.color && column?.color,
                background: column?.bg && column?.bg,
                fontWeight: column?.fontWidth && column?.fontWidth,
                fontSize: column?.fontSize && column?.fontSize,
                ...(column?.py && { padding: `${column?.py} 0` }),
                ...(column?.px && { padding: `0 ${column?.px}` }),
                ...(column?.pl && { paddingLeft: `${column?.pl}` }),
                ...(column?.pr && { paddingRight: `${column?.pr}` })
              }}
              role="rowheader"
              key={index}
            >
              <div className="flex items-center gap-1 font-normal ">
                {/* header name  */}
                {column?.header}
                {/* header actions  */}
                {column?.sortable && (
                  <span
                    className="cursor-pointer"
                    onClick={() => column?.sortable && handleSort(column?.accessor)}
                  >
                    {sortConfig[column.accessor].key === column.accessor && (
                      <span>
                        {sortConfig[column.accessor].direction === 'asc' ? (
                          <span
                            onClick={() => handleSort(column.accessor)}
                            className={` sorted duration-1000 transition-all ease-linear ${
                              sortConfig[column.accessor].key === column.accessor ? 'sorted' : ''
                            }`}
                          >
                            <ReIcon iconName="AiOutlineArrowUp" />
                          </span>
                        ) : (
                          <span
                            onClick={() => handleSort(column.accessor)}
                            className=" duration-1000 transition-all ease-linear sorted"
                          >
                            <ReIcon iconName="AiOutlineArrowDown" />
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
