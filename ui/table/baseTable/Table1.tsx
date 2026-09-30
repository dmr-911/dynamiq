'use client';
import { HTMLProps, useEffect, useState } from 'react';
// import style from './style.module.css';
import TableBody from './TableBody1';
import TableHeader from './TableHeader1';
import handleAllDataSelectedRecord from './utils/table';
import TableFooter from './TableFooter';
import { cn } from '../../utils/cn';
const style = {};
type DyTableProps = {
  columns?: any[];
  records?: any[];
  title?: string;
  wrapperClasses?: string;
  captionClasses?: string;
  tableBodyClasses?: string;
  selectBoxWrapperClass?: string;
  // stripedColor?: string;
  // stripedHoverColor?: string;
  striped?: boolean;
  border?: boolean;
  onSelectedRecords?: (records: any[]) => void;
  showSelectBox?: boolean;
  headerShow?: boolean;
  // paginationValue?: any;
  // isPagination?: boolean;
  rowClasses?: (data: any) => string;
  headerClasses?: string;
  // tableBodyStyle?: React.CSSProperties;
  cellClasses?: (data: any, value: any) => string;
  // footerClasses?: string;
  // footerData?: any;
};

const DyTable = ({
  columns = [],
  records = [],
  title,
  wrapperClasses,
  captionClasses,
  tableBodyClasses,
  headerClasses,
  rowClasses,
  cellClasses,
  selectBoxWrapperClass,
  stripedColor,
  stripedHoverColor,
  striped = false,
  border = false,
  onSelectedRecords,
  showSelectBox = false,
  headerShow = true
  // paginationValue,
  // isPagination = true,

  // footerClasses,
  // footerData
}: DyTableProps) => {
  const [tableData, setTableData] = useState<any[]>(records || []);
  //  all selected table area here
  const [toggleProduct, setToggleProduct] = useState([]);
  // select box function code here for all data
  const handleAllDataSelectedRecords = (e: any) => {
    handleAllDataSelectedRecord(e, toggleProduct, setToggleProduct, records);
  };
  useEffect(() => {
    onSelectedRecords && onSelectedRecords(toggleProduct);
  }, [toggleProduct, onSelectedRecords]);

  const getSortedData = (data: any[]) => {
    setTableData(data);
  };

  return (
    <div className={style.table_area}>
      <div
        className={cn('w-auto overflow-x-auto custom__scrollbar', wrapperClasses && wrapperClasses)}
      >
        <table
          className={cn(
            // style.table__container,
            'w-full',
            border && style.border,
            striped && style.table__striped,
            tableBodyClasses && tableBodyClasses
          )}
          // style={tableBodyStyle && tableBodyStyle}
        >
          {title && (
            <caption className={cn(captionClasses ? captionClasses : style.caption)}>
              {' '}
              {title}
            </caption>
          )}
          {/* table header and body */}

          {headerShow && (
            <TableHeader
              columns={columns}
              records={tableData}
              handleAllDataSelectedRecords={handleAllDataSelectedRecords}
              toggleProduct={toggleProduct}
              showSelectBox={showSelectBox}
              getSortingData={getSortedData}
              headerClasses={headerClasses}
              selectBoxWrapperClass={selectBoxWrapperClass}
            />
          )}

          <TableBody
            columns={columns}
            records={tableData}
            stripedColor={stripedColor && stripedColor}
            stripedHoverColor={stripedHoverColor && stripedHoverColor}
            striped={striped}
            handleAllDataSelectedRecords={handleAllDataSelectedRecords}
            toggleProduct={toggleProduct}
            showSelectBox={showSelectBox ? true : headerShow ? showSelectBox : false}
            rowClasses={rowClasses && rowClasses}
            cellClasses={cellClasses && cellClasses}
            selectBoxWrapperClass={selectBoxWrapperClass}
          />

          {/* {footerData && (
            <TableFooter footerData={footerData} footerClasses={footerClasses && footerClasses} />
          )} */}
        </table>
      </div>
      {/* {isPagination && paginationValue} */}
    </div>
  );
};

export default DyTable;
