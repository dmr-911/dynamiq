import React, { useState, ChangeEvent, Fragment } from 'react';
import { Field } from '../type';
import BaseHeading from './ui/base-heading/BaseHeading';
import Input from './ui/form/input/Input';
import Checkbox from './ui/form/checkbox/Checkbox';

interface SortOption {
  label: string;
  value: string;
}

interface SortByField {
  [key: string]: SortOption[];
}

interface FieldRendererProps {
  fields?: Field[];
  sortByFields?: SortByField;
  selectedFields?: Field[];
  selectedSortFields: string[];
  selectedSortOptions: { [field: string]: string };
  onFieldChange?: (field: Field) => void;
  onSortFieldChange: (field: string) => void;
  onSortOptionChange: (field: string, option: string) => void;
  paginate?: boolean;
  pageCount?: number;
  setPageCount?: (pageCount: number) => void;
  onCheckboxChange?: (field: string) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  selectedSortFields,
  selectedSortOptions,
  onCheckboxChange,
  fields,
  sortByFields,
  selectedFields,
  onSortFieldChange,
  onSortOptionChange,
  paginate,
  pageCount,
  setPageCount
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (field: Field) => {
    // @ts-ignore
    onCheckboxChange(field);
  };

  const filteredFields = fields?.filter((field) =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSortByFields = sortByFields
    ? Object.entries(sortByFields).filter(
        ([field, options]) =>
          field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          options.some((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  return (
    <div className="flex w-52 flex-col rounded md:p-2">
      <div className="flex flex-col gap-2 p-2">
        {!paginate && (
          <BaseHeading as="h1" size="base" weight="semibold" className="hidden md:block">
            Available Field
          </BaseHeading>
        )}
        {!paginate && (
          <div className="hidden md:block">
            <Input
              placeholder="Search"
              shape="smooth"
              size="sm"
              icon="BiSearch"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        )}
        {paginate && (
          <div>
            <Input
              placeholder="Type number item"
              shape="smooth"
              size="sm"
              icon="BiSearch"
              type="number"
              min={1}
              value={pageCount}
              onChange={(e: ChangeEvent<HTMLInputElement> | any) => {
                const newValue = e.target.value;
                if (setPageCount) {
                  setPageCount(parseInt(newValue));
                }
              }}
            />
          </div>
        )}
        {fields &&
          filteredFields?.map((field: Field) => (
            <Checkbox
              shape="curved"
              color="primary"
              key={field.id}
              label={field.label}
              name={field.label}
              checked={selectedFields?.some((f) => f.id === field.id)}
              onChange={() => handleCheckboxChange(field)}
            />
          ))}
        {sortByFields && (
          <Fragment>
            <BaseHeading as="h3" size="sm" weight="semibold" className="hidden md:block">
              Sort By
            </BaseHeading>
            {filteredSortByFields?.map(([field, options]) => (
              <Fragment key={field}>
                <Checkbox
                  shape="curved"
                  color="primary"
                  label={field}
                  name={field}
                  checked={selectedSortFields.includes(field)}
                  onChange={() => onSortFieldChange(field)}
                />
                {selectedSortFields.includes(field) && (
                  <div className="ml-4 flex flex-col gap-2">
                    {options
                      .filter((option) =>
                        option.label.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((option) => (
                        <Checkbox
                          key={option.value}
                          shape="curved"
                          color="primary"
                          label={option.label}
                          name={`${field}-${option.value}`}
                          checked={selectedSortOptions[field] === option.value}
                          onChange={() => onSortOptionChange(field, option.value)}
                        />
                      ))}
                  </div>
                )}
              </Fragment>
            ))}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default FieldRenderer;
