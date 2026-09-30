import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';
import { useProperty } from '../context/FeatureMapProvider';

export const useMapAutocomplete = () => {
  const places = useMapsLibrary('places');
  const { autoCompletePlace } = useProperty();

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  useEffect(() => {
    if (places) {
      setAutocompleteService(new places.AutocompleteService());
      // Create a dummy element for PlacesService (it requires a DOM element)
      const dummyElement = document.createElement('div');
      setPlacesService(new places.PlacesService(dummyElement));
      setSessionToken(new places.AutocompleteSessionToken());
    }
  }, [places]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue || !sessionToken) return;

      setFetchingData(true);

      const request = { input: inputValue, sessionToken };
      try {
        const response = await autocompleteService.getPlacePredictions(request);
        setPredictionResults(response.predictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictionResults([]);
      } finally {
        setFetchingData(false);
      }
    },
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const onSelect = useCallback(
    (
      prediction: google.maps.places.AutocompletePrediction | string,
      onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
    ) => {
      if (typeof prediction === 'string' || !placesService || !places) return;

      setFetchingData(true);

      const detailRequestOptions = {
        placeId: prediction.place_id,
        fields: ['address_components', 'geometry', 'icon', 'name', 'place_id', 'formatted_address']
      };

      placesService.getDetails(detailRequestOptions, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          onPlaceSelect(placeDetails);
          setInputValue(placeDetails?.formatted_address ?? '');
          setSessionToken(new places.AutocompleteSessionToken());
        } else {
          console.error('Error fetching place details:', status);
          onPlaceSelect(null);
        }
        setFetchingData(false);
      });
    },
    [placesService, places]
  );

  //set default value if any
  useEffect(() => {
    if (autoCompletePlace) {
      setInputValue(autoCompletePlace?.formatted_address || '');
    }
  }, [autoCompletePlace]);

  return {
    inputValue,
    predictionResults,
    fetchingData,
    onInputChange,
    onSelect,
    setPredictionResults,
    setInputValue
  };
};
