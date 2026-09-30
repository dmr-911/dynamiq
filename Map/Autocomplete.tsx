import React, { useEffect } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react';
import { ReIcon } from './components/ReIcon/ReIcon';
import { cn } from './utils/cn';
import { useMapAutocomplete } from './hooks/useMapAutocomplete';
import { useProperty } from './context/FeatureMapProvider';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  error?: boolean;
  onBlur?: () => void;
  defaultValue?: string;
  onFieldChange?: (value: any) => void;
}

export const Autocomplete = ({
  onPlaceSelect,
  error,
  onBlur,
  defaultValue,
  onFieldChange
}: Props) => {
  const { setAutoCompletePlace } = useProperty();
  const {
    inputValue,
    predictionResults,
    fetchingData,
    onInputChange,
    onSelect,
    setPredictionResults,
    setInputValue
  } = useMapAutocomplete();

  // SET DEFAULT VALUE
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="z-50 w-full min-w-[170px]">
      <Combobox
        value={inputValue}
        onChange={(value) => value !== null && onSelect(value, onPlaceSelect)}
      >
        <div className="relative rounded-md shadow-sm">
          <ComboboxInput
            className={cn(
              'w-full rounded-lg border bg-white py-2 pl-3 pr-7 text-sm text-muted-600 dark:border-muted-500 dark:bg-muted-800 dark:text-muted-300',
              'focus:outline-none data-[focus]:outline data-[focus]:-outline-offset-2 data-[focus]:outline-muted-200 dark:data-[focus]:outline-muted-500',
              error && 'border-error-500'
            )}
            autoComplete="off"
            placeholder="Address, city, state"
            value={inputValue}
            onChange={(e) => {
              // onFieldChange && onFieldChange(e.target.value);
              onInputChange(e.target.value);
            }}
            onBlur={onBlur}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 pr-2">
            {(predictionResults.length > 0 && inputValue) || inputValue ? (
              <ReIcon
                iconName="FaTimes"
                className="text-lg text-muted-300 transition-colors duration-300 hover:text-error"
                aria-hidden="true"
                onClick={() => {
                  setInputValue('');
                  setPredictionResults([]);
                  setAutoCompletePlace(null);
                }}
              />
            ) : (
              <ReIcon
                iconName="FaSearch"
                className="text-lg text-muted-400 transition-colors duration-300"
                aria-hidden="true"
              />
            )}
          </ComboboxButton>
        </div>
        <ComboboxOptions
          className={cn(
            'absolute z-50 w-[var(--input-width)] origin-top rounded-md border bg-white p-1 text-muted-600 shadow-md transition duration-200 ease-out empty:invisible dark:border-muted-500 dark:bg-muted-800 dark:text-muted-300'
          )}
        >
          {predictionResults.map((prediction) => (
            <ComboboxOption
              key={prediction.place_id}
              value={prediction}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-blue-100 dark:data-[focus]:bg-blue-900"
            >
              {prediction?.description}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
        {/* {fetchingData && <div>Loading...</div>} */}
      </Combobox>
    </div>
  );
};
