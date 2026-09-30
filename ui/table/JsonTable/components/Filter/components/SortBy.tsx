import React, { useEffect, useState } from 'react';
import FieldRenderer from './FieldRenderer';
import FilterDropdown from './FilterDropdown';
import { SortByField, Field } from '../type';
import BaseParagraph from './ui/base-paragraph/BaseParagraph';
import { useTableContext } from '../../../context/TableContext';

interface SortByProps {
  onFieldsChange?: (fields: Field[]) => void | undefined;
  onSortChange: (sortFields: { [field: string]: string }) => void | any;
  sortByFields?: SortByField;
  availableFields?: Field[];
}

const SortBy: React.FC<SortByProps> = ({ onFieldsChange, onSortChange, sortByFields }) => {
  const { state, dispatch } = useTableContext();
  const { sortOnField } = state;

  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [selectedSortFields, setSelectedSortFields] = useState<string[]>([sortOnField?.field]);
  const [selectedSortOptions, setSelectedSortOptions] = useState<{ [field: string]: string }>({
    [sortOnField.field]: sortOnField.order
  });

  const handleFieldChange = (field: Field) => {
    setSelectedFields((prevFields) => {
      const newFields = prevFields.some((f) => f.id === field.id)
        ? prevFields.filter((f) => f.id !== field.id)
        : [...prevFields, field];
      // @ts-ignore
      onFieldsChange(newFields);
      return newFields;
    });
  };

  useEffect(() => {
    if (sortOnField?.field === '') {
      setSelectedSortFields([]);
    }
  }, [sortOnField?.field]);

  const handleSortFieldChange = (field: string) => {
    setSelectedSortFields([field]);

    setSelectedSortOptions((prevOptions) => {
      const newOptions = { [field]: prevOptions[field] };
      onSortChange(newOptions);
      return newOptions;
    });
  };

  const handleSortOptionChange = (field: string, option: string) => {
    setSelectedSortOptions((prevOptions) => {
      const newOptions = { [field]: option };
      onSortChange(newOptions);
      return newOptions;
    });
  };

  return (
    <>
      <div className="hidden md:block">
        <FilterDropdown name="Sort" iconName="GoChevronDown">
          <FieldRenderer
            sortByFields={sortByFields}
            selectedFields={selectedFields}
            selectedSortFields={selectedSortFields}
            selectedSortOptions={selectedSortOptions}
            onFieldChange={handleFieldChange}
            onSortFieldChange={handleSortFieldChange}
            onSortOptionChange={handleSortOptionChange}
          />
        </FilterDropdown>
      </div>
      <div className="block md:hidden">
        <BaseParagraph size="md" color="muted" weight="semibold">
          Sort by
        </BaseParagraph>
        <FieldRenderer
          sortByFields={sortByFields}
          selectedFields={selectedFields}
          selectedSortFields={selectedSortFields}
          selectedSortOptions={selectedSortOptions}
          onFieldChange={handleFieldChange}
          onSortFieldChange={handleSortFieldChange}
          onSortOptionChange={handleSortOptionChange}
        />
      </div>
    </>
  );
};

export default SortBy;
