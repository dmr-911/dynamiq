import React from 'react';
import FilterDropdown from './FilterDropdown';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { deleteSelectedRecords } from './ui/table/features/tableSlice';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';
import { useTableContext } from '../../../context/TableContext';

const actionList = [
  {
    id: 2,
    icon: 'AiOutlineDelete',
    type: 'delete',
    label: 'Delete',
    describedText: 'Delete selected items'
  },
  { id: 3, icon: 'AiFillEdit', type: '', label: 'Edit', describedText: 'Delete selected items' },
  {
    id: 8,
    icon: 'AiOutlineMail',
    type: '',
    label: 'Send Email',
    describedText: 'Send mail to selected items'
  },
  {
    id: 9,
    icon: 'LiaSmsSolid',
    type: '',
    label: 'Send SMS',
    describedText: 'Send SMS to selected items'
  }
];

const BulkAction = ({ actions }: { actions: any }) => {
  // const selectedRecordItems = useAppSelector((state) => state.table.selectedRecordItems);
  const { state } = useTableContext();
  const { selectedRecordItems } = state;
  return (
    <>
      <div className="hidden md:block">
        <FilterDropdown name="Actions" iconName="AiOutlineInteraction">
          {/* <BulkActionList actionList={actionList} /> */}
          {actions && actions(selectedRecordItems)}
        </FilterDropdown>
      </div>
      <div className="block md:hidden">
        <div className="flex items-center justify-between gap-x-3">
          <BaseParagraph size="md" color="muted" weight="semibold">
            Bulk actions
          </BaseParagraph>
          {selectedRecordItems.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-muted-200">
              {selectedRecordItems.length}
            </span>
          )}
        </div>
        {/* <BulkActionList actionList={actionList} /> */}
        {actions && actions(selectedRecordItems)}
      </div>
    </>
  );
};

export default BulkAction;

const BulkActionList = ({ actionList }: { actionList: any[] }) => {
  const dispatch = useAppDispatch();
  const handleActionClick = (action: any) => {
    if (action?.type === 'delete') {
      dispatch(deleteSelectedRecords());
    }
  };
  return (
    <div className="flex w-52 flex-col gap-2 rounded p-2">
      {actionList.map((action) => (
        <div
          key={action.id}
          className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800"
          onClick={() => handleActionClick(action)}
        >
          <ReIcon
            iconName={action.icon}
            className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"
          />
          <div className="option-content flex flex-col">
            <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
              {action.label}
            </span>
            <span className="block font-sans text-xs leading-tight text-muted-400">
              {action.describedText.length > 40
                ? `${action.describedText.slice(0, 40)}...`
                : action.describedText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
