'use client';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import Checkbox from '../../form/checkbox/Checkbox';
type TableHeaderProps = {
  columns: any[];
  records: any[];
  handleAllDataSelectedRecords: (e: any) => void;
  selectedRow: any[];
  showSelectBox: boolean;
  getSortingData: (data: any[]) => void;
  headerClasses?: string;
  selectBoxWrapperClass?: string;
};

const TableHeader = ({
  columns,
  records,
  handleAllDataSelectedRecords,
  selectedRow,
  showSelectBox,
  getSortingData,
  headerClasses,
  selectBoxWrapperClass
}: TableHeaderProps) => {
  const initialSortConfig = columns?.reduce((acc, column) => {
    if (column?.sortable) {
      acc[column?.accessor] = { key: column?.accessor, direction: 'asc' };
    }
    return acc;
  }, {});
  const [sortConfig, setSortConfig] = useState(initialSortConfig || {});
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
    <thead
      className={cn(
        'text-left hidden md:table-header-group border-b border-muted-200 dark:border-muted-600 bg-gray-100 dark:bg-muted-700 dark:text-muted-200',
        headerClasses && headerClasses
      )}
    >
      <tr>
        {showSelectBox && (
          <th className={cn('pt-3', selectBoxWrapperClass && selectBoxWrapperClass)}>
            <Checkbox
              aria-label="header-select"
              color="primary"
              icon={selectedRow.length===records.length?"BiCheck":"AiOutlineMinus"}
              checked={selectedRow.length >0}
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
                color: column?.color && column?.color,
                background: column?.bg && column?.bg,
                textAlign: column?.align && column?.align,
                fontWeight: column?.fontWidth && column?.fontWidth,
                fontSize: column?.fontSize && column?.fontSize,
                ...(column?.py && { padding: `${column?.py} 0` }),
                ...(column?.px && { padding: `0 ${column?.px}` }),
                ...(column?.pl && { paddingLeft: `${column?.pl}` }),
                ...(column?.pr && { paddingRight: `${column?.pr}` })
              }}
              className={cn("py-2 px-4", column?.align === "end" && "text-right")}
              key={index}
            >
              <div className={cn("flex items-center gap-1 font-normal", 
                                 column?.align === "end" && "justify-end",
                                 column?.align === "center" && "justify-center")}>
                {column?.header}
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
                            className={`sorted duration-1000 transition-all ease-linear ${sortConfig[column.accessor].key === column.accessor ? 'sorted' : ''}`}
                          >
                            <ReIcon iconName="AiOutlineArrowUp" />
                          </span>
                        ) : (
                          <span
                            onClick={() => handleSort(column.accessor)}
                            className="duration-1000 transition-all ease-linear sorted"
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
