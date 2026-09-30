'use client';

import { cn } from '../../utils/cn';
import { useState } from 'react';

type TableBodyProps = {
  columns: any[];
  records: any[];
  toggleProduct: any[];
  handleAllDataSelectedRecords: (row: any) => void;
  showSelectBox: boolean;
  rowClasses?: (row: any) => string;
  cellClasses?: (row: any, value: any) => string;
  stripedColor?: string;
  stripedHoverColor?: string;
  striped?: boolean;
  selectBoxWrapperClass?: string;
};

const TableBody = ({
  columns,
  records,
  toggleProduct,
  handleAllDataSelectedRecords,
  showSelectBox,
  rowClasses,
  cellClasses,
  stripedColor,
  stripedHoverColor,
  striped = false,
  selectBoxWrapperClass
}: TableBodyProps) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (striped && stripedHoverColor) {
      setHoveredRow(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };
  return (
    <tbody
    //  style={{ display: "block", width: "100%", height: "150px", overflow: "auto" }}
    // className="h-10 overflow-y-auto w-full block "
    >
      {/* table body html code */}
      {records?.map((row, index) => {
        const rowStyle = {
          background:
            striped && index % 2 !== 0 && !hoveredRow
              ? stripedColor
              : striped && index % 2 !== 0 && hoveredRow === index
                ? stripedHoverColor
                : undefined
        };
        return (
          <tr
            key={index}
            // style={rowStyle}
            // onMouseEnter={() => handleMouseEnter(index)}
            // onMouseLeave={handleMouseLeave}
            className={rowClasses && rowClasses(row)}
          >
            {showSelectBox && (
              <td
                // style={{ textAlign: 'right' }}
                className={cn('w-7', selectBoxWrapperClass && selectBoxWrapperClass)}
              >
                <input
                  aria-label="row-select"
                  type="checkbox"
                  checked={toggleProduct.some((item) => item.id === row.id)}
                  onChange={() => handleAllDataSelectedRecords(row)}
                />
              </td>
            )}
            {columns?.map((col, index) => (
              <td
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
                key={index}
                className={`${
                  cellClasses && cellClasses(row, row[col.accessor])
                } ${col?.classNames && col?.classNames}`}
              >
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
