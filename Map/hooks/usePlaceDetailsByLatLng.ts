import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

interface PlaceDetails {
  placeDetails: google.maps.places.PlaceResult | null;
  loading: boolean;
  error: Error | null;
  setLatLng: (lat: number, lng: number) => void; // Function to accept lat/lng dynamically
}

export const usePlaceDetailsByLatLng = (): PlaceDetails => {
  const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [latLng, setLatLngState] = useState<{ lat: number; lng: number } | null>(null); // Store lat/lng

  const map = useMap(); // Get the map instance
  const places = useMapsLibrary('places'); // Get the places library

  // Function to accept latitude and longitude
  const setLatLng = useCallback((lat: number, lng: number) => {
    setLatLngState({ lat, lng });
  }, []);

  useEffect(() => {
    if (!places || !map || !latLng) return;

    setLoading(true);
    setError(null);

    const { lat, lng } = latLng;
    const location = new google.maps.LatLng(lat, lng);

    // Create the PlacesService instance
    const placesService = new google.maps.places.PlacesService(map);
    const geocoder = new google.maps.Geocoder(); // Geocoder to reverse geocode the lat/lng

    // Reverse geocoding to get the place_id
    geocoder.geocode({ location }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const placeId = results[0].place_id;

        // Fetch detailed place data using placeId
        const detailRequestOptions = {
          placeId,
          fields: [
            'address_components',
            'geometry',
            'icon',
            'name',
            'place_id',
            'formatted_address'
          ]
        };

        placesService.getDetails(detailRequestOptions, (placeDetailsResult, detailsStatus) => {
          if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
            setPlaceDetails(placeDetailsResult);
          } else {
            setError(new Error('Failed to fetch place details.'));
          }
          setLoading(false);
        });
      } else {
        setError(new Error('Reverse geocoding failed.'));
        setLoading(false);
      }
    });
  }, [places, map, latLng]);

  return { placeDetails, loading, error, setLatLng }; // Return setLatLng function
};
