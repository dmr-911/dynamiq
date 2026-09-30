import { useState, useEffect } from 'react';

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useUserLocation = (): UserLocation => {
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    // Success callback when the location is fetched
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setLoading(false);
    };

    // Error callback in case of a failure
    const handleError = (error: GeolocationPositionError) => {
      setError(`Error: ${error.message}`);
      setLoading(false);
    };

    // Fetch the user's location
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

    // Optional: Watch the user's location if it changes over time
    // const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);
    // Cleanup on unmount
    // return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { ...location, error, loading };
};
