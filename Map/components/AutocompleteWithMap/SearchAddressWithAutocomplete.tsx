'use client';
import React, { useEffect } from 'react';
import { Autocomplete } from '../../Autocomplete';
import Input from './ui/form/input/Input';
import MapWithStreetView from '../../MapWithStreetView';
import { useProperty } from '../../context/FeatureMapProvider';
import Button from './ui/button/Button';
import { getIn } from 'formik';
import dynamic from 'next/dynamic';
const DynamicForm = dynamic(() => import('@/components/DynamicForm/DynamicForm'), {
  ssr: false,
  loading: () => <>Loading...</>, // Show loading component while form loads
});

// Helper function to get address components by type
const getAddressFromComponent = (
  addressComponents: google.maps.GeocoderAddressComponent[] | undefined,
  type: string
) => {
  const component = addressComponents?.find((comp: any) => comp.types.includes(type));
  return component ? component.long_name : '';
};

type SearchAddressWithAutocompleteProps = {
  lockAddress?: boolean;
  onChange?: (address: { [key: string]: string | number }) => void;
  withMap?: boolean;
  errors?: any;
  name: string;
  formik: any;
  setOpen?: any;
  isCancel?: boolean;
};

const SearchAddressWithAutocomplete = ({
  lockAddress = true,
  onChange,
  withMap = true,
  errors = {},
  name,
  formik,
  setOpen,
  isCancel
}: SearchAddressWithAutocompleteProps) => {
  const { autoCompletePlace, setAutoCompletePlace, placeDetails } = useProperty();
  const [addressData, setAddressData] = React.useState<{ [key: string]: string | number }>({
    apt: '',
    streetNumber: 0,
    streetName: '',
    county: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: 0,
    longitude: 0
  });

  // Update the autocomplete place when the address data changes
  useEffect(() => {
    if (autoCompletePlace) {
      const addressComponents = autoCompletePlace.address_components;
      const geometry = autoCompletePlace?.geometry?.location;

      // Update the address data
      setAddressData({
        apt: '', // You might want to handle this separately as it's not provided by autocomplete
        streetNumber: getAddressFromComponent(addressComponents, 'street_number'),
        streetName: getAddressFromComponent(addressComponents, 'route'),
        county: getAddressFromComponent(addressComponents, 'administrative_area_level_2'),
        city: getAddressFromComponent(addressComponents, 'locality'),
        state: getAddressFromComponent(addressComponents, 'administrative_area_level_1'),
        zipCode: getAddressFromComponent(addressComponents, 'postal_code'),
        latitude: geometry?.lat() || 0,
        longitude: geometry?.lng() || 0
      });
    }
  }, [autoCompletePlace]);

  //lock address only change lat and lng when lockAddress is true
  useEffect(() => {
    if (placeDetails) {
      if (lockAddress) {
        setAddressData({
          ...addressData,
          latitude: placeDetails?.geometry?.location?.lat() || 0,
          longitude: placeDetails?.geometry?.location?.lng() || 0
        });
      } else {
        setAddressData({
          apt: '', // You might want to handle this separately as it's not provided by autocomplete
          streetNumber: getAddressFromComponent(placeDetails?.address_components, 'street_number'),
          streetName: getAddressFromComponent(placeDetails?.address_components, 'route'),
          county: getAddressFromComponent(
            placeDetails?.address_components,
            'administrative_area_level_2'
          ),
          city: getAddressFromComponent(placeDetails?.address_components, 'locality'),
          state: getAddressFromComponent(
            placeDetails?.address_components,
            'administrative_area_level_1'
          ),
          zipCode: getAddressFromComponent(placeDetails?.address_components, 'postal_code'),
          latitude: placeDetails?.geometry?.location?.lat() || 0,
          longitude: placeDetails?.geometry?.location?.lng() || 0
        });
      }
    }
  }, [lockAddress, placeDetails]);

  // set default value
  useEffect(() => {
    setAddressData(getIn(formik?.values, name));
  }, [formik?.values, name]);

  const addressAutoCompleteForm = {
    name: 'AddressAutoComplete',
    grid: 4,
    submit: {
      // store: 'localStorage', // local Storage, session Storage, cookies
      // key_name: 'name-form',
      // endPoint: '/name-form',
      // method: 'UPDATE', // INSERT, UPSERT, DELETE, UPDATE
      function: async ({
        values,
        formik,
        schema,
        setErrors
      }: {
        values: any;
        formik: any;
        schema: any;
        setErrors: any;
      }) => {
        console.log(values, 'values');

        try {
        } catch (error) { }
      }
    },
    items: [
      {
        index: 1,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'text',
        id: 'apt/suit',
        label: 'Apt/Suit',
        name: 'apt',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        autoComplete: 'new-password',
        validation: {
          type: 'string',
          validations: {}
        }
      },
      {
        index: 2,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'number',
        id: 'street_number',
        label: 'Street Number',
        name: 'streetNumber',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'number',
          validations: {}
        }
      },
      {
        index: 3,
        widths: {
          default: '100%',
          greaterThan1440: '50%',
          between890And1440: '50%',
          between600And890: '100%'
        },
        type: 'text',
        id: 'street_name',
        label: 'Street Name',
        name: 'streetName',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'string',
          validations: {}
        }
      },
      {
        index: 4,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'text',
        id: 'county',
        label: 'County',
        name: 'county',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'string',
          validations: {}
        }
      },
      {
        index: 5,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'text',
        id: 'city',
        label: 'City',
        name: 'city',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'string',
          validations: {}
        }
      },
      {
        index: 6,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'text',
        id: 'state',
        label: 'State',
        name: 'state',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'string',
          validations: {}
        }
      },
      {
        index: 7,
        widths: {
          default: '100%',
          greaterThan1440: '25%',
          between890And1440: '25%',
          between600And890: '100%'
        },
        type: 'number',
        id: 'zip',
        label: 'Zip Code',
        name: 'zipCode',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'number',
          validations: {
            min: {
              value: 5,
              message: 'Zip code is required'
            }
          }
        }
      },
      {
        index: 8,
        widths: {
          default: '100%',
          greaterThan1440: '50%',
          between890And1440: '50%',
          between600And890: '100%'
        },
        type: 'number',
        id: 'latitude',
        label: 'Latitude',
        name: 'latitude',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'number',
          validations: {}
        }
      },
      {
        index: 9,
        widths: {
          default: '100%',
          greaterThan1440: '50%',
          between890And1440: '50%',
          between600And890: '100%'
        },
        type: 'number',
        id: 'longitude',
        label: 'Longitude',
        name: 'longitude',
        placeholder: '',
        size: 'md',
        color: 'default',
        shape: 'smooth',
        required: true,
        autoComplete: 'new-password',
        validation: {
          type: 'number',
          validations: {}
        }
      }
    ]
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {withMap && <MapWithStreetView />}

      <Autocomplete onPlaceSelect={(place) => setAutoCompletePlace(place)} />
      <div>
        <DynamicForm
          formData={addressAutoCompleteForm}
          defaultValue={addressData}
          isRealTime
          setRealTimeValues={(data) => onChange({ ...addressData, ...data })}
        >
          {/* Buttons */}
          <div className="col-span-full flex items-center justify-end gap-4 rounded-b-xl py-3">
            {isCancel && (
              <Button
                onClick={() => setOpen(false)}
                color="muted"
                shape="smooth"
                size="sm"
                type="button"
              >
                Cancel
              </Button>
            )}
            <Button color="primary" shape="smooth" size="sm" type="submit">
              Submit
            </Button>
          </div>
        </DynamicForm>
      </div>
    </div>
  );
};

export default SearchAddressWithAutocomplete;
