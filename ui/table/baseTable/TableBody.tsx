'use client';

import { cn } from '../../utils/cn';
import { useState } from 'react';
import Checkbox from '../../form/checkbox/Checkbox';

type TableBodyProps = {
  columns: any[];
  records: any[];
  selectedRow: any[];
  handleAllDataSelectedRecords: (row: any) => void;
  showSelectBox: boolean;
  rowClasses?: (row: any) => string;
  cellClasses?:  ((row: any, value: any) => string | string | undefined) ;
  striped?: boolean;
  selectBoxWrapperClass?: string;
};

const TableBody = ({
  columns,
  records,
  selectedRow,
  handleAllDataSelectedRecords,
  showSelectBox,
  rowClasses,
  cellClasses,
  striped = false,
  selectBoxWrapperClass
}: TableBodyProps) => {
  return (
    <tbody>
      {records?.map((row, index) => {
        return (
          <tr
            key={index}
            className={cn(
              ' block border-b-2 [&:last-child]:border-none md:table-row md:border-b border-muted-200 dark:border-muted-600',
              rowClasses && rowClasses(row)
            )}
          >
            {showSelectBox && (
              <td
                className={cn(
                  // 'w-full flex flex-row-reverse py-2', // Small screens
                  // 'md:w-10 md:flex   md:py-0', // Medium screens and up
                  // 'pt-2 md:pt-0',
                  selectBoxWrapperClass && selectBoxWrapperClass
                )}
              >
                <Checkbox
                  aria-label="row-select"
                  color="primary"
                  checked={selectedRow.some((item) => item.id === row.id)}
                  onChange={() => handleAllDataSelectedRecords(row)}
                />
               
              </td>
            )}
            {columns?.map((col, index) => (
              <td
                key={index}
                className={cn(
                  'flex justify-between items-center px-3 border-b [&:last-child]:border-none md:table-cell border-muted-200 dark:border-muted-600',
                  typeof cellClasses === "string" ? cellClasses : cellClasses ? cellClasses(row, row[col.accessor]) : '',
                  col?.classNames && col?.classNames
                )}
                style={{
                  width: col?.width && `${col?.width}`,
                  textAlign: col?.align && col?.align,
                  color: col?.color && col?.color,
                  background: col?.bg && col?.bg,
                  fontWeight: col?.fontWidth && col?.fontWidth,
                  fontSize: col?.fontSize && col?.fontSize,
                  ...(col?.py && { padding: `${col?.py} 0` }),
                  ...(col?.px && { padding: `0 ${col?.px}` }),
                  ...(col?.pl && { paddingLeft: `${col?.pl}` }),
                  ...(col?.pr && { paddingRight: `${col?.pr}` })
                }}
              >
                <span className="inline-block md:hidden font-bold">{col.header} </span>
                {/* {row[col.accessor]} */}
                {col?.render ? col?.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
