import { ReIcon } from '../../components/ReIcon/ReIcon';
import IconButton from './ui/button-icon/IconButton';
import Button from './ui/button/Button';
import Checkbox from './ui/form/checkbox/Checkbox';
import { setSortedFields, sortTableRecord } from './ui/table/features/tableSlice';
import FlexTableHeading from './ui/table/flexTable/FlexTableHeading';
import FlexTableRow from './ui/table/flexTable/FlexTableRow';
import { countTotalRecords } from './ui/table/utils/countTotalRecords';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { cn } from '../../../utils/cn';
import React, { useEffect, useState } from 'react';
import { useTableContext } from '../context/TableContext';
import { MemberInfo } from './Tables/MyMembers/MyMembersTable';
import { replaceUnderscoresWithSpaces } from '../../../utils';

export interface columnsJson {
  label: string;
  cellType: 'grow' | 'stable' | 'shrink';
  headerClass?: string;
  cellClass?: string;
  accessor: string;
  render?: (cellData: any) => void;
  sorted?: boolean;
}
interface PropertyItem {
  selectedItems: MemberInfo[];
  selectedGroups: any[];
  handleSelectAll?: () => void;
  bulkSelect?: boolean;
  columns: any;
  records?: any[];
  action?: any;
}

const TableHeader = ({
  selectedItems,
  selectedGroups,
  handleSelectAll,
  bulkSelect = true,
  columns = [],
  action
}: PropertyItem) => {
  // const dispatch = useAppDispatch();
  // const paginateRecords = useAppSelector((state) => state.table.paginateRecords);
  const { state, dispatch } = useTableContext();
  const { paginateRecords } = state;

  const [sortedField, setSortedField] = useState({
    field: '',
    order: ''
  });

  const toggleSortingField = (sortedField: any) => {
    setSortedField((prev) => {
      if (prev.field === sortedField) {
        // Toggle the sort order
        return {
          field: sortedField,
          order: prev.order === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // Set the new sort field to ascending order
        return {
          field: sortedField,
          order: 'asc'
        };
      }
    });
  };

  useEffect(() => {
    // dispatch(setSortedFields({}));
    // dispatch(sortTableRecord(sortedField));
    if (sortedField.field) {
      dispatch({ type: 'SET_SORT_ON_FIELD', payload: sortedField });
      dispatch({ type: 'SORT_TABLE_RECORD', payload: sortedField });
    }
  }, [sortedField]);

  const renderBulkSelectIcon = () => {
    if (selectedItems.length > 0 && selectedItems.length === countTotalRecords(paginateRecords)) {
      return (
        <Checkbox
          shape="rounded"
          color="primary"
          icon="BiCheck"
          checked={selectedItems.length > 0 || selectedGroups.length > 0}
          onChange={handleSelectAll}
        />
      );
    } else {
      return (
        <Checkbox
          shape="rounded"
          color="primary"
          icon="AiOutlineMinus"
          checked={selectedItems.length > 0 || selectedGroups.length > 0}
          onChange={handleSelectAll}
        />
      );
    }
  };
  return (
    <FlexTableRow rounded="md" border={false} className="mb-2 flex items-center bg-muted-100 p-0">
      {/* bulk select  */}

      {bulkSelect && (
        <FlexTableHeading type="shrink" className="w-10 text-center">
          {renderBulkSelectIcon()}
        </FlexTableHeading>
      )}
      {/* dynamic header  */}
      {columns &&
        columns?.column?.map((col: any, idx: number) => (
          <FlexTableHeading key={idx} type="stable" className={col.class}>
            {/* <p className="truncate">{col.name}</p> */}
            <p className="inline-flex items-center gap-1">
              {replaceUnderscoresWithSpaces(col.header ? col.header : col.name)}{' '}
              {col?.sortWith && (
                <ReIcon
                  onClick={() => toggleSortingField(col?.sortWith)}
                  className={cn(
                    'inline cursor-pointer',
                    sortedField.field === col.name && sortedField.order === 'desc' && 'rotate-180',
                    'transition-all duration-300'
                  )}
                  iconName={
                    sortedField.field === col.name && sortedField.order === 'asc'
                      ? 'CgSortZa'
                      : sortedField.field === col.name && sortedField.order === 'desc'
                        ? 'CgSortZa'
                        : 'BiSortAlt2'
                  }
                />
              )}
            </p>
          </FlexTableHeading>
        ))}

      {action && (
        <FlexTableHeading type="shrink" className="flex-1 text-end">
          <p className="truncate">Actions</p>
        </FlexTableHeading>
      )}
    </FlexTableRow>
  );
};

export default TableHeader;
