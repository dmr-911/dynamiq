import React, { useState, useEffect, useRef } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import Button from '../../button/Button';
import Checkbox from '../checkbox/Checkbox';
import { cn } from '../../utils/cn';

export interface Option {
  value?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  [key: string]: any;
}

interface SelectComponentProps {
  options: Option[];
  onChange: (value: Option | Option[] | null) => void;
  value?: Option | Option[] | null;
  multiple?: boolean;
  defaultValue?: Option | Option[] | null;
  error?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  showSelectedBadges?: boolean;
  floating?: boolean;
  onBlur?: () => void; // Add onBlur prop
  onTouch?: () => void; // Add onTouch prop
  formik?: any;
}

function MultiSelect({
  options,
  onChange,
  value,
  multiple = false,
  defaultValue = null,
  error,
  placeholder = 'Select...',
  label,
  className = '',
  showSelectedBadges = false,
  floating = true,
  onBlur, // Use onBlur
  onTouch // Use onTouch
}: SelectComponentProps) {
  // console.log("formik errors", formik?.errors)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelectedOptions(Array.isArray(value) ? value : [value]);
    } else if (defaultValue) {
      setSelectedOptions(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    } else {
      const initiallySelectedOptions = options?.filter((option) => option.selected);
      setSelectedOptions(initiallySelectedOptions);

      onChange(multiple ? initiallySelectedOptions : initiallySelectedOptions[0] || null);
    }
  }, [value, defaultValue, multiple, options]);

  const filteredOptions =
    query === ''
      ? options
      : options.filter(
          (option) => option.label.toLowerCase().includes(query.toLowerCase()) && !option.disabled
        );

  function getOptionIdentifier(option: Option): string {
    return option.value ?? option.name ?? option.label;
  }

  function handleOptionToggle(option: Option) {
    const optionIdentifier = getOptionIdentifier(option);
    let newSelectedOptions: Option[];
    if (multiple) {
      newSelectedOptions = selectedOptions.some((o) => getOptionIdentifier(o) === optionIdentifier)
        ? selectedOptions.filter((o) => getOptionIdentifier(o) !== optionIdentifier)
        : [...selectedOptions, option];
    } else {
      newSelectedOptions = selectedOptions.some((o) => getOptionIdentifier(o) === optionIdentifier)
        ? []
        : [option];
    }
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    setQuery('');
    inputRef.current?.focus();
    if (onTouch) onTouch(); // Trigger onTouch
  }

  function removeOption(optionToRemove: Option) {
    const optionIdentifier = getOptionIdentifier(optionToRemove);
    const newSelectedOptions = selectedOptions.filter(
      (option) => getOptionIdentifier(option) !== optionIdentifier
    );
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    inputRef.current?.focus();
    if (onTouch) onTouch(); // Trigger onTouch
  }

  function toggleSelectAllOptions() {
    const selectableOptions = filteredOptions.filter((option) => !option.disabled);
    const newSelectedOptions =
      selectedOptions.length === selectableOptions.length ? [] : selectableOptions;
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    if (onTouch) onTouch(); // Trigger onTouch
  }

  return (
    <div className={cn('z-50', className, floating && 'h-auto')}>
      {label && (
        <label className="mb-1 block px-2 text-sm font-medium capitalize text-muted-400 dark:text-muted-300">
          {label}
        </label>
      )}
      <Combobox
        as="div"
        className={cn('max-w-full', floating && 'relative')}
        value={selectedOptions}
        onChange={(value) => {
          console.log('selectedOptions', value);
        }} // We'll handle changes manually
        multiple={true}
      >
        <div className="relative w-full">
          <div
            className={`w-full rounded-md border bg-white p-2 pr-10 text-muted-600 placeholder:text-muted-300 focus-within:border-muted-300 focus-within:shadow-lg focus-within:shadow-muted-300/30 hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300 dark:placeholder:text-muted-600 dark:focus-within:shadow-muted-800/20 dark:hover:border-muted-600 ${
              error ? 'border-red-500' : ''
            } ${showSelectedBadges && selectedOptions.length > 0 ? 'rounded-b-none' : ''}`}
          >
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-muted-950 dark:text-muted-400"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeOption(option);
                    }}
                    className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove {option.label}</span>×
                  </button>
                </span>
              ))}
              <ComboboxInput
                ref={inputRef}
                className="flex-1 bg-transparent outline-none"
                displayValue={() => query}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => {
                  if (onBlur) onBlur(); // Trigger onBlur
                }}
                placeholder={selectedOptions.length === 0 ? placeholder : ''}
              />
            </div>
          </div>
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ReIcon iconName="HiSelector" className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        {showSelectedBadges && selectedOptions.length > 0 && (
          <div className="rounded-md rounded-t-none border border-muted-300 p-2 dark:border-muted-700">
            <p className="text-sm text-muted-400 dark:text-muted-300">Selected Items</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {selectedOptions?.map((option) => (
                <span
                  key={getOptionIdentifier(option)}
                  className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-muted-950 dark:text-muted-400"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={() => removeOption(option)}
                    className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove {option.label}</span>×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <ComboboxOptions
          transition
          className={cn(
            'custom__scrollbar mt-1 max-h-60 w-full origin-top overflow-auto rounded-md border border-gray-300 bg-white transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300',
            floating && 'absolute z-50'
          )}
        >
          {multiple && (
            <Button
              variant="pastel"
              color="info"
              className="w-full"
              shape="straight"
              type="button"
              onClick={toggleSelectAllOptions}
            >
              {selectedOptions.length === filteredOptions.filter((o) => !o.disabled).length
                ? 'Deselect all options'
                : 'Select all options'}
            </Button>
          )}
          {filteredOptions?.map((option, idx) => (
            <ComboboxOption
              key={idx}
              value={option}
              disabled={option.disabled}
              onClick={() => handleOptionToggle(option)}
              className={({ active, disabled }) =>
                `relative cursor-pointer select-none px-2 py-2 ${
                  active ? 'bg-primary-600 text-muted-50' : 'text-muted-400 dark:text-muted-500'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`
              }
            >
              {({ disabled }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    color="primary"
                    checked={selectedOptions.some(
                      (o) => getOptionIdentifier(o) === getOptionIdentifier(option)
                    )}
                    readOnly
                    disabled={disabled}
                  />
                  <span
                    className={`block truncate ${selectedOptions.some((o) => o.value === option.value) ? 'font-medium' : 'font-normal'}`}
                  >
                    {option.label}
                  </span>
                </div>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default MultiSelect;
