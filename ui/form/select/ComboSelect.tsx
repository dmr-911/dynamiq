import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import Button from '../../button/Button';
import Checkbox from '../checkbox/Checkbox';
import { cn } from '../../../utils/cn';
import ToggleBox from '../../toggle-box/ToggleBox';
import FormError from '../../FormError';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
  [key: string]: any;
}

export interface OptionGroup {
  title: string;
  options: (Option | OptionGroup)[];
}

type OptionOrGroup = Option | OptionGroup;

interface SelectComponentProps {
  options: OptionOrGroup[];
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
  onBlur?: () => void;
  onTouch?: () => void;
  withAccordion?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  withoutOptions?: boolean;
}

function isOptionGroup(option: OptionOrGroup): option is OptionGroup {
  return 'title' in option && Array.isArray((option as OptionGroup).options);
}

function flattenOptions(options: OptionOrGroup[]): Option[] {
  return options.reduce((acc: Option[], curr: OptionOrGroup) => {
    if (isOptionGroup(curr)) {
      return [...acc, ...flattenOptions(curr.options)];
    }
    return [...acc, curr];
  }, []);
}

function ComboSelect({
  name = '',
  id,
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
  onBlur,
  onTouch,
  withAccordion = false,
  disabled = false,
  withoutOptions = false
}: SelectComponentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const flatOptions = flattenOptions(options);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelectedOptions(Array.isArray(value) ? value : [value]);
    } else if (defaultValue) {
      setSelectedOptions(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    } else {
      const initiallySelectedOptions = flatOptions.filter((option) => option.selected);
      setSelectedOptions(initiallySelectedOptions);
      onChange(multiple ? initiallySelectedOptions : initiallySelectedOptions[0] || null);
    }
  }, [value, defaultValue, multiple]);

  const filteredOptions =
    query === ''
      ? options
      : options.reduce((acc: OptionOrGroup[], curr: OptionOrGroup) => {
          if (isOptionGroup(curr)) {
            const filteredGroup = {
              ...curr,
              options: curr.options.filter(
                (option) =>
                  !isOptionGroup(option) &&
                  option.label.toLowerCase().includes(query.toLowerCase()) &&
                  !option.disabled
              )
            };
            return filteredGroup.options.length > 0 ? [...acc, filteredGroup] : acc;
          }
          if (curr.label.toLowerCase().includes(query.toLowerCase()) && !curr.disabled) {
            return [...acc, curr];
          }
          return acc;
        }, []);

  function handleOptionToggle(option: Option) {
    let newSelectedOptions: Option[];
    if (multiple) {
      newSelectedOptions = selectedOptions.some((o) => o.value === option.value)
        ? selectedOptions.filter((o) => o.value !== option.value)
        : [...selectedOptions, option];
    } else {
      newSelectedOptions = selectedOptions.some((o) => o.value === option.value) ? [] : [option];
    }
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    setQuery('');
    setInputValue('');
    inputRef.current?.focus();
    if (onTouch) onTouch();
  }

  function removeOption(optionToRemove: Option) {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    inputRef.current?.focus();
    if (onTouch) onTouch();
  }

  function toggleSelectAllOptions() {
    const selectableOptions = flatOptions.filter((option) => !option.disabled);
    const newSelectedOptions =
      selectedOptions.length === selectableOptions.length ? [] : selectableOptions;
    setSelectedOptions(newSelectedOptions);
    onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
    if (onTouch) onTouch();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (withoutOptions && event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      const newOption: Option = {
        label: inputValue.trim(),
        value: inputValue.trim().toLowerCase().replace(/\s+/g, '-')
      };
      
      const newSelectedOptions = multiple 
        ? [...selectedOptions, newOption]
        : [newOption];
      
      setSelectedOptions(newSelectedOptions);
      onChange(multiple ? newSelectedOptions : newOption);
      setInputValue('');
      setQuery('');
      if (onTouch) onTouch();
      return;
    }

    if (event.key === 'Backspace' && inputValue === '' && selectedOptions.length > 0) {
      event.preventDefault();
      const newSelectedOptions = selectedOptions.slice(0, -1);
      setSelectedOptions(newSelectedOptions);
      onChange(multiple ? newSelectedOptions : newSelectedOptions[0] || null);
      if (onTouch) onTouch();
    }
  }

  function renderOptions(options: OptionOrGroup[], level = 0) {
    return options.map((option, idx) => {
      if (isOptionGroup(option)) {
        return (
          <div key={`group-${idx}-${level}`}>
            {withAccordion ? (
              <ToggleBox
                open
                classes={{
                  container: 'p-0 px-2 py-2'
                }}
                header={
                  <div className="font-semibold text-muted-500 dark:text-muted-400">
                    {option.title}
                  </div>
                }
              >
                <div className="pl-2">{renderOptions(option.options, level + 1)}</div>
              </ToggleBox>
            ) : (
              <div>
                <div
                  key={`group-${idx}-${level}`}
                  className="px-2 font-semibold text-muted-500 dark:text-muted-400"
                >
                  {option.title}
                </div>
                <div className="pl-2">{renderOptions(option.options, level + 1)}</div>
              </div>
            )}
          </div>
        );
      }
      return (
        <ComboboxOption
          key={`option-${option.value}-${level}`}
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
                checked={selectedOptions.some((o) => o.value === option.value)}
                readOnly
                disabled={disabled}
              />
              <span
                className={`block truncate ${
                  selectedOptions.some((o) => o.value === option.value)
                    ? 'font-medium'
                    : 'font-normal'
                }`}
              >
                {option.label}
              </span>
            </div>
          )}
        </ComboboxOption>
      );
    });
  }

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setQuery(value);
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium capitalize text-muted-400 dark:text-muted-300">
          {label}
        </label>
      )}
      <Combobox
        as="div"
        className={cn('max-w-full', floating && 'relative')}
        value={selectedOptions}
        onChange={() => {}}
        multiple={multiple}
        disabled={disabled}
      >
        <div className="relative w-full">
          <div
            className={`w-full rounded-md border bg-white p-2 pr-10 text-muted-600 placeholder:text-muted-300 focus-within:border-muted-300 focus-within:shadow-lg focus-within:shadow-muted-300/30 hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300 dark:placeholder:text-muted-600 dark:focus-within:shadow-muted-800/20 dark:hover:border-muted-600 ${
              error ? 'border-red-500 dark:border-red-500' : ''
            } ${showSelectedBadges && selectedOptions.length > 0 ? 'rounded-b-none' : ''}`}
          >
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium dark:bg-muted-950 dark:text-muted-400',
                    multiple ? 'bg-blue-100 text-blue-800' : ''
                  )}
                >
                  {option.label}
                  {multiple && (
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
                  )}
                </div>
              ))}
              <ComboboxInput
                name={name}
                autoComplete="new-password"
                id={id}
                ref={inputRef}
                className="flex-1 bg-transparent outline-none"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={(e) => handleBlur(e)}
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
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
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

        {!withoutOptions && (
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
                {selectedOptions.length === flatOptions.filter((o) => !o.disabled).length
                  ? 'Deselect all options'
                  : 'Select all options'}
              </Button>
            )}
            {renderOptions(filteredOptions)}
          </ComboboxOptions>
        )}
      </Combobox>
    </div>
  );
}

export default ComboSelect;