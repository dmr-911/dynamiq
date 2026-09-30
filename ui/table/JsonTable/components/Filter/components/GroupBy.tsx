import React from 'react';
import FieldRenderer from './FieldRenderer';
import FilterDropdown from './FilterDropdown';
import { Field } from '../type';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';

interface GroupByProps {
  groupByFields: Field[];
  selectedFields: Field[];
  onGroupByChange: (field: Field) => void;
}

const GroupBy: React.FC<GroupByProps> = ({ groupByFields, selectedFields, onGroupByChange }) => {
  return (
    <>
      <div className="hidden md:block">
        <FilterDropdown name="Group By" iconName="GoChevronDown">
          <FieldRenderer
            fields={groupByFields}
            selectedFields={selectedFields}
            onCheckboxChange={onGroupByChange}
          />
        </FilterDropdown>
      </div>
      <div className="block md:hidden">
        <BaseParagraph size="md" color="muted" weight="semibold">
          Group by
        </BaseParagraph>
        <FieldRenderer
          fields={groupByFields}
          selectedFields={selectedFields}
          onCheckboxChange={onGroupByChange}
        />
      </div>
    </>
  );
};

export default GroupBy;
