'use client';
import React, { type FC, Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import type { VariantProps } from 'class-variance-authority';
import { inputVariants } from '../../../ui/variants/input-variants';
import Loader from '../../../ui/loader/Loader';
import { ReIcon } from '../components/ReIcon/ReIcon';
import FlexTable from '../../../ui/table/flexTable/FlexTable';
import FlexTableRow from '../../../ui/table/flexTable/FlexTableRow';
import FlexTableHeading from '../../../ui/table/flexTable/FlexTableHeading';
import FlexTableCell from '../../../ui/table/flexTable/FlexTableCell';
import { cn } from '../../utils/cn';
import { useFetchRealEstateAddressQuery } from './features/realEstateApiSlice';

// Types
interface RealEstateItem {
  id: string;
  address: string;
  apn: string;
  house: string;
  fips: string;
}

interface RealEstateAutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color' | 'value'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  value?: RealEstateItem;
  disabled?: boolean;
  loading?: boolean;
  classNames?: string;
}

// Constants
const DEBOUNCE_DELAY = 500;
const MAX_HEIGHT = 250;

// Utilities
const createDebouncedFunction = (callback: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

const RealEstateAutocomplete: FC<RealEstateAutocompleteProps> = ({
  value,
  label,
  size = 'md',
  color = 'default',
  shape = 'smooth',
  disabled,
  loading = false,
  classNames,
  error,
  onChange,
  ...props
}) => {
  // State
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RealEstateItem | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowOptions, setShouldShowOptions] = useState(false);

  // API Query
  const { data: realEstateData, isFetching } = useFetchRealEstateAddressQuery(
    { query: debouncedQuery },
    { skip: !shouldShowOptions || !debouncedQuery }
  );

  // Memoized values
  const inputClassName = useMemo(() => {
    return inputVariants({
      size,
      color,
      shape,
      className: cn(
        'peer relative text-start pl-2',
        // sizeClasses[size],
        error && '!border-error-500',
        disabled && '!pointer-events-none !cursor-not-allowed !opacity-50',
        loading &&
          'pointer-events-none !select-none !text-transparent !shadow-none placeholder:!text-transparent'
      )
    });
  }, [size, color, shape, error, disabled, loading]);

  // Handlers
  const debouncedSearch = useCallback(
    createDebouncedFunction((searchQuery: string) => {
      setDebouncedQuery(searchQuery);
      setLocalLoading(false);
      setShouldShowOptions(true);
    }, DEBOUNCE_DELAY),
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setLocalLoading(true);
      setIsOpen(true);

      if (newQuery.trim() === '') {
        setDebouncedQuery('');
        setLocalLoading(false);
        setShouldShowOptions(false);
        setSelected(null);
      } else {
        debouncedSearch(newQuery);
      }
    },
    [debouncedSearch]
  );

  const handleSelect = useCallback(
    (item: RealEstateItem | null) => {
      setSelected(item);
      setIsOpen(false);
      setShouldShowOptions(false);
      if (item) {
        setQuery(item.address);
      }
      onChange?.(item as any);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    if (query.trim() !== '') {
      setShouldShowOptions(true);
    }
  }, [query]);

  // Effects
  useEffect(() => {
    if (value) {
      setSelected(value);
      setQuery(value.address);
    }
  }, [value]);

  useEffect(() => {
    const shouldShow = Boolean(
      (realEstateData?.data?.data?.length > 0 || isFetching) && debouncedQuery !== ''
    );
    setIsOpen(shouldShow);
  }, [isFetching, realEstateData?.data?.data?.length, debouncedQuery]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsOpen(false);
      setQuery('');
      setSelected(null);
      setShouldShowOptions(false);
    };
  }, []);

  // Render methods
  const renderTableHeader = () => (
    <FlexTableRow
      rounded="md"
      border={false}
      className="mb-2 flex w-full items-center bg-muted-100 p-0"
    >
      {['Address', 'APN', 'House', 'FIPS'].map((heading) => (
        <FlexTableHeading key={heading} type="grow" className="w-full flex-1">
          <p>{heading}</p>
        </FlexTableHeading>
      ))}
    </FlexTableRow>
  );

  const renderTableCell = (item: RealEstateItem, field: keyof RealEstateItem) => (
    <FlexTableCell
      key={field}
      label={field.charAt(0).toUpperCase() + field.slice(1)}
      type="grow"
      className="flex w-full flex-1 items-start justify-between gap-3"
    >
      <div className="flex flex-col items-end text-right md:items-start md:text-left">
        {item[field] || '-'}
      </div>
    </FlexTableCell>
  );

  return (
    <div className={`relative w-full ${classNames}`}>
      <Combobox value={selected} onChange={handleSelect} nullable>
        <div className="relative mt-1">
          {label && <label className="font-sans text-[.85rem] text-muted-400">{label}</label>}
          <div className="relative z-0 w-full font-sans">
            <Combobox.Input
              className={inputClassName}
              //@ts-ignore
              displayValue={(item: RealEstateItem) => item?.address || query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              value={query}
              {...props}
            />

            {(localLoading || isFetching) && (
              <div
                className={cn(
                  'absolute end-5 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500',
                  {
                    'h-8 w-8': size === 'sm',
                    'h-10 w-10': size === 'md',
                    'h-12 w-12': size === 'lg'
                  }
                )}
              >
                <Loader classNames="text-primary-400" size={20} thickness={4} />
              </div>
            )}

            <Combobox.Button
              className={cn(
                'peer:focus-visible:[&>svg]:rotate-180 absolute end-0 top-0 flex items-center justify-center',
                {
                  'h-8 w-8': size === 'sm',
                  'h-10 w-10': size === 'md',
                  'h-12 w-12': size === 'lg'
                },
                loading && '!pointer-events-none !select-none !text-transparent !opacity-0'
              )}
              onClick={() => setIsOpen((open) => !open)}
            >
              <ReIcon
                iconName="MdOutlineKeyboardArrowUp"
                className="h-4 w-4 text-muted-400 transition-transform duration-300"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            show={isOpen}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options
              className={cn(
                'slimscroll absolute z-50 mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-none dark:shadow-muted-800/20 sm:text-sm',
                {
                  'rounded-md': shape === 'rounded',
                  'rounded-lg': shape === 'smooth',
                  'rounded-xl': shape === 'curved' || shape === 'full',
                  'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800':
                    color === 'default' || color === 'muted',
                  'border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950':
                    color === 'contrast' || color === 'mutedContrast'
                }
              )}
              static
            >
              {!shouldShowOptions || (realEstateData?.data?.data?.length === 0 && query !== '') ? (
                <div className="relative cursor-default select-none px-4 py-2 text-muted-700">
                  Nothing found.
                </div>
              ) : (
                <FlexTable
                  rowgap="md"
                  header={renderTableHeader()}
                  body={
                    <div className={`max-h-[${MAX_HEIGHT}px] overflow-auto`}>
                      {realEstateData?.data?.data?.map((item: RealEstateItem) => (
                        <Combobox.Option
                          key={item.id}
                          className={({ active }) =>
                            cn(
                              'relative flex cursor-default select-none items-center py-1 transition-colors duration-300',
                              {
                                'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700': active,
                                'text-muted-600 dark:text-muted-400': !active,
                                'rounded-md': shape === 'rounded',
                                'rounded-lg': shape === 'smooth',
                                'rounded-xl': shape === 'curved' || shape === 'full'
                              }
                            )
                          }
                          value={item}
                        >
                          {() => (
                            <div className="w-full">
                              <FlexTableRow
                                rounded="md"
                                className={cn(
                                  'cursor-pointer',
                                  selected?.address === item.address &&
                                    'bg-primary-500 text-muted-100 dark:bg-primary-500'
                                )}
                                onClick={() => handleSelect(item)}
                              >
                                {(['address', 'apn', 'house', 'fips'] as const).map((field) =>
                                  renderTableCell(item, field)
                                )}
                              </FlexTableRow>
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                    </div>
                  }
                />
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default RealEstateAutocomplete;
