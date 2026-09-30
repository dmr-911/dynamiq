import React from 'react';
import FieldRenderer from './FieldRenderer';
import { Field } from '../type';
import FilterDropdown from './FilterDropdown';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';

interface ColumnProps {
  columnFields: Field[];
  selectedFields: Field[];
  onColumnChange: (field: Field) => void;
}

const Column = ({ columnFields, selectedFields, onColumnChange }: ColumnProps) => {
  return (
    <>
      <div className="hidden md:flex">
        <FilterDropdown name="Column" iconName="BiColumns">
          <FieldRenderer
            fields={columnFields}
            selectedFields={selectedFields}
            onCheckboxChange={onColumnChange}
          />
        </FilterDropdown>
      </div>
      <div className="block md:hidden">
        <BaseParagraph size="md" color="muted" weight="semibold">
          Column
        </BaseParagraph>
        <FieldRenderer
          fields={columnFields}
          selectedFields={selectedFields}
          onCheckboxChange={onColumnChange}
        />
      </div>
    </>
  );
};

export default Column;
