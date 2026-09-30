'use client';
import {  useEffect, useState } from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';
import handleAllDataSelectedRecord from './utils/table';
import { cn } from '../../utils/cn';

type TableProps = {
  columns?: any[];
  records?: any[];
  title?: string;
  wrapperClasses?: string;
  captionClasses?: string;
  tableBodyClasses?: string;
  selectBoxWrapperClass?: string;
  striped?: boolean;
  border?: boolean;
  onSelectedRecords?: (records: any[]) => void;
  showSelectBox?: boolean;
  headerShow?: boolean;
  rowClasses?: (data: any) => string;
  headerClasses?: string;
  cellClasses?: (data: any, value: any) => string;
};

const Table = ({
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
  striped = false,
  onSelectedRecords,
  showSelectBox = false,
  headerShow = true
}: TableProps) => {
  const [tableData, setTableData] = useState<any[]>(records || []);
  //  all selected table area here
  const [selectedRow, setselectedRow] = useState([]);
  // select box function code here for all data
  const handleAllDataSelectedRecords = (e: any) => {
    handleAllDataSelectedRecord(e, selectedRow, setselectedRow, records);
  };
  useEffect(() => {
    onSelectedRecords && onSelectedRecords(selectedRow);
  }, [selectedRow, onSelectedRecords]);

  const getSortedData = (data: any[]) => {
    setTableData(data);
  };

  return (
    <div
      className={cn('w-auto overflow-x-auto custom__scrollbar border-2 border-muted-200 dark:border-muted-600', wrapperClasses && wrapperClasses)}
    >
      <table
        className={cn(
          'w-full border-collapse bg-muted-50-50 dark:bg-muted-800 dark:text-muted-200',
          tableBodyClasses && tableBodyClasses,
          
        )}
      >
        {title && (
          <caption className={cn('text-lg py-2',captionClasses && captionClasses )}>
            {title}
          </caption>
        )}

        {headerShow && (
          <TableHeader
            columns={columns}
            records={tableData}
            handleAllDataSelectedRecords={handleAllDataSelectedRecords}
            selectedRow={selectedRow}
            showSelectBox={showSelectBox}
            getSortingData={getSortedData}
            headerClasses={headerClasses}
            selectBoxWrapperClass={selectBoxWrapperClass}
          />
        )}

        <TableBody
          columns={columns}
          records={tableData}
          striped={striped}
          handleAllDataSelectedRecords={handleAllDataSelectedRecords}
          selectedRow={selectedRow}
          showSelectBox={showSelectBox ? true : headerShow ? showSelectBox : false}
          rowClasses={rowClasses && rowClasses}
          cellClasses={cellClasses && cellClasses}
          selectBoxWrapperClass={selectBoxWrapperClass}
        />
      </table>
    </div>
  );
};

export default Table;
