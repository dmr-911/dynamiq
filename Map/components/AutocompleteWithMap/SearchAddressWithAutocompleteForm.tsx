'use client';
import React, { useEffect } from 'react';
import { Autocomplete } from '../../Autocomplete';
import MapWithStreetView from '../../MapWithStreetView';
import { useProperty } from '../../context/FeatureMapProvider';

// Helper function to get address components by type
const getAddressFromComponent = (
  addressComponents: google.maps.GeocoderAddressComponent[] | undefined,
  type: string
) => {
  const component = addressComponents?.find((comp: any) => comp.types.includes(type));
  return component ? component.long_name : '';
};

type SearchAddressWithAutocompleteProps = {
  label?: string;
  lockAddress?: boolean;
  onChange?: (address: { [key: string]: string | number }, fullAddress?: string) => void;
  withMap?: boolean;
  errors?: any;
  name: string;
  formik?: any;
  unsortedData?: any;
  handleUnsortedData?: any;
  error?: boolean | undefined;
  onBlur?: any;
  defaultValue?: string;
  showStreetView?: boolean;
  mapHeight?: string;
  onBoundaryChange?: any;
};

const SearchAddressWithAutocomplete = ({
  lockAddress = true,
  error = false,
  onChange,
  withMap = true,
  errors = {},
  name,
  formik,
  label,
  onBlur,
  defaultValue,
  showStreetView = true,
  mapHeight = '240px',
  onBoundaryChange
}: SearchAddressWithAutocompleteProps) => {
  const { autoCompletePlace, setAutoCompletePlace, placeDetails } = useProperty();

  const [addressData, setAddressData] = React.useState<{ [key: string]: string | number }>({
    apt: '',
    streetNumber: 0,
    streetName: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: 0,
    longitude: 0
  });
  const [fullAddress, setFullAddress] = React.useState('');

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
        country: getAddressFromComponent(addressComponents, 'country'),
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
          country: getAddressFromComponent(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockAddress, placeDetails]);

  // set default value
  useEffect(() => {
    //  setAddressData(getIn(formik.values, name));
    onChange && onChange(addressData, fullAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressData]);

  return (
    <div className="flex w-full flex-col gap-2">
      {withMap && (
        <MapWithStreetView
          height={`h-[${mapHeight}]`}
          showStreetView={showStreetView}
          onChangeDrawing={(value) => {
            const polygon = value?.find((item) => item?.type === 'polygon');
            const newPolygonData = {
              snapshot: polygon?.snapshot,
              type: polygon?.type
            };
            onBoundaryChange && onBoundaryChange(newPolygonData);
          }}
        />
      )}
      {!!label && <label className="font-sans text-[.85rem] text-muted-400">{label}</label>}
      <Autocomplete
        error={error}
        onBlur={onBlur}
        onPlaceSelect={(place) => {
          setFullAddress(place?.formatted_address || '');
          setAutoCompletePlace(place);
        }}
        // onFieldChange={(value) => {
        //   formik.setFieldValue(name, value);
        // }}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default SearchAddressWithAutocomplete;
