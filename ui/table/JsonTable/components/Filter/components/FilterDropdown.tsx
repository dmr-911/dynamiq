import React from 'react';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import Button from './ui/button/Button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover/Popover';
import { useTableContext } from '../../../context/TableContext';

const FilterDropdown = ({
  children,
  name,
  iconName
}: {
  children: React.ReactNode;
  name: string;
  iconName?: string;
}) => {
  // const selectedRecordItems = useAppSelector((state) => state.table.selectedRecordItems);
  const { state } = useTableContext();
  const { selectedRecordItems } = state;
  return (
    <Popover indicatorArrow offsetDistance={10}>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="solid"
          shape="rounded"
          color="muted"
          disabled={name === 'Actions' && !selectedRecordItems.length}
        >
          {name}
          {iconName && <ReIcon iconName={iconName} />}
          {name === 'Actions' && selectedRecordItems.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-muted-200">
              {selectedRecordItems.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
