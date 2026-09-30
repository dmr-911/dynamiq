'use client';
import React, {
  type InputHTMLAttributes,
  type FC,
  Fragment,
  useState,
  useCallback,
  useEffect
} from 'react';
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

interface ComboBoxItem {
  id?: string;
  name: string;
  icon?: string;
  image?: string;
}

export interface ComboBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  multiple?: boolean;
  error?: string;
  value?: any;
  disabled?: boolean;
  loading?: boolean;
  classNames?: string;
}

const debounce = (func: any, delay: any) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const RealEstateAutocomplete: FC<ComboBoxProps> = ({
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
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: realEstateData,
    isError,
    isSuccess,
    error: fetchError,
    isLoading,
    isFetching
  } = useFetchRealEstateAddressQuery({ query: debouncedQuery });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setLocalLoading(true);
    debouncedSearch(newQuery);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
      setLocalLoading(false);
      setIsOpen(true);
      setSelected(null);
    }, 500),
    []
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setIsOpen(false);
      setQuery('');
      setSelected(null);
    };
  }, []);

  // if results are found setIsOpen to true
  useEffect(() => {
    if ((realEstateData && realEstateData.length > 0) || isFetching) {
      setIsOpen(true);
    }
    if (debouncedQuery === '') {
      setIsOpen(false);
    }
  }, [isFetching, realEstateData, debouncedQuery]);

  // selected item is changed
  useEffect(() => {
    if (selected) {
      if (onChange) onChange(selected);
    }
  }, [selected]);

  // set default value if there is value

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  return (
    <div className={`relative w-full ${classNames}`}>
      <Combobox value={selected} onChange={(newValue) => setSelected(newValue)} nullable>
        <div className="relative mt-1">
          {!!label && <label className="font-sans text-[.85rem] text-muted-400">{label}</label>}
          <div className="relative z-0 w-full font-sans">
            <Combobox.Input
              className={inputVariants({
                size,
                color,
                shape,
                className: `peer relative text-start ${size === 'sm' && selected?.icon ? 'pe-2 ps-8' : ''} ${size === 'md' && selected?.icon ? 'pe-3 ps-10' : ''} ${size === 'lg' && selected?.icon ? 'pe-4 ps-12' : ''} ${size === 'sm' && selected?.image ? 'pe-2 ps-8' : ''} ${size === 'md' && selected?.image ? 'pe-3 ps-11' : ''} ${size === 'lg' && selected?.image ? 'pe-4 ps-12' : ''} ${size === 'sm' && !selected?.icon ? 'px-2' : ''} ${size === 'md' && !selected?.icon ? 'px-3' : ''} ${size === 'lg' && !selected?.icon ? 'px-4' : ''} ${size === 'sm' && !selected?.image ? 'px-2' : ''} ${size === 'md' && !selected?.image ? 'px-3' : ''} ${size === 'lg' && !selected?.image ? 'px-4' : ''} ${error ? '!border-error-500' : ''} ${disabled ? '!pointer-events-none !cursor-not-allowed !opacity-50' : ''} ${
                  loading
                    ? 'pointer-events-none !select-none !text-transparent !shadow-none placeholder:!text-transparent'
                    : ''
                } `
              })}
              displayValue={(item: any) => item?.address || ''}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              {...props}
            />

            {(localLoading || isLoading || isFetching) && (
              <div
                className={`absolute end-5 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
              >
                <Loader classNames="text-primary-400" size={20} thickness={4} />
              </div>
            )}
            <Combobox.Button
              className={`peer:focus-visible:[&>svg]:rotate-180 absolute end-0 top-0 flex items-center justify-center ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''} ${loading ? '!pointer-events-none !select-none !text-transparent !opacity-0' : ''} `}
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
              className={`slimscroll absolute z-50 mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-none dark:shadow-muted-800/20 sm:text-sm ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'curved' ? 'rounded-xl' : ''} ${shape === 'full' ? 'rounded-xl' : ''} ${
                color === 'default'
                  ? 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'
                  : ''
              } ${
                color === 'contrast'
                  ? 'border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950'
                  : ''
              } ${
                color === 'muted'
                  ? 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'
                  : ''
              } ${
                color === 'mutedContrast'
                  ? 'border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950'
                  : ''
              } `}
              static
            >
              {realEstateData?.data?.data?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-muted-700">
                  Nothing found.
                </div>
              ) : (
                <FlexTable
                  rowgap="md"
                  header={
                    <div className="w-full">
                      <FlexTableRow
                        rounded="md"
                        border={false}
                        className="mb-2 flex w-full items-center bg-muted-100 p-0"
                      >
                        <FlexTableHeading type="grow" className="w-full flex-1">
                          <p>Address</p>
                        </FlexTableHeading>
                        <FlexTableHeading type="grow" className="w-full flex-1">
                          <p>APN</p>
                        </FlexTableHeading>
                        <FlexTableHeading type="grow" className="w-full flex-1">
                          <p>House</p>
                        </FlexTableHeading>
                        <FlexTableHeading type="grow" className="w-full flex-1">
                          <p>FIPS</p>
                        </FlexTableHeading>
                      </FlexTableRow>
                    </div>
                  }
                  body={
                    <div className={`max-h-[250px] overflow-auto`}>
                      {realEstateData?.data?.data?.map((item: any) => (
                        <Combobox.Option
                          key={item.id}
                          className={({ active }) =>
                            `relative flex cursor-default select-none items-center py-1 transition-colors duration-300 ${
                              active
                                ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700'
                                : 'text-muted-600 dark:text-muted-400'
                            } ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'curved' ? 'rounded-xl' : ''} ${shape === 'full' ? 'rounded-xl' : ''} `
                          }
                          value={item}
                        >
                          {() => (
                            <div className="w-full">
                              <FlexTableRow
                                rounded="md"
                                className={cn(
                                  selected?.address === item?.address &&
                                    'bg-primary-500 text-muted-100 dark:bg-primary-500'
                                )}
                                onClick={() => {
                                  setSelected(item);
                                  setIsOpen(false);
                                }}
                              >
                                <FlexTableCell
                                  label="Address"
                                  type="grow"
                                  className="flex w-full flex-1 items-start justify-between gap-3"
                                >
                                  <div className="flex flex-col items-end text-right md:items-start md:text-left">
                                    {item?.address || '-'}
                                  </div>
                                </FlexTableCell>
                                <FlexTableCell
                                  label="APN"
                                  type="grow"
                                  className="flex w-full flex-1 items-start justify-between gap-3"
                                >
                                  <div className="flex flex-col items-end text-right md:items-start md:text-left">
                                    {item?.apn || '-'}
                                  </div>
                                </FlexTableCell>
                                <FlexTableCell
                                  label="House"
                                  type="grow"
                                  className="flex w-full flex-1 items-start justify-between gap-3"
                                >
                                  <div className="flex flex-col items-end text-right md:items-start md:text-left">
                                    {item?.house || '-'}
                                  </div>
                                </FlexTableCell>
                                <FlexTableCell
                                  label="FIPS"
                                  type="grow"
                                  className="flex w-full flex-1 items-start justify-between gap-3"
                                >
                                  <div className="flex flex-col items-end text-right md:items-start md:text-left">
                                    {item?.fips || '-'}
                                  </div>
                                </FlexTableCell>
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
