import { SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { Feature, Point } from 'geojson';
import { usePlaceDetailsByLatLng } from '../hooks/usePlaceDetailsByLatLng';

export interface PropertyTypes {
  id: any;
  image: string;
  title: string;
  location: {
    city: string;
    state?: string; // Allow state to be optional
    country: string;
    zip_code: string;
    latitude: number;
    longitude: number;
  };
  price: string;
  beds: number;
  baths: number;
  length: number;
  featured: boolean;
  amenities: any[];
  features: any[];
}

type FeatureMapContextType = {
  isListView: boolean;
  toggleListView: () => void;
  properties: PropertyTypes[];
  setProperties: React.Dispatch<SetStateAction<PropertyTypes[]>>;

  // map
  selectedMarkerData: Feature<Point> | null;
  setSelectedMarkerData: React.Dispatch<SetStateAction<Feature<Point> | null>>;

  // boundary
  isBoundaryEnabled: boolean;
  setIsBoundaryEnabled: React.Dispatch<SetStateAction<boolean>>;

  // drawing
  isDrawingEnabled: boolean;
  setIsDrawingEnabled: React.Dispatch<SetStateAction<boolean>>;

  // map autocomplete
  autoCompletePlace: google.maps.places.PlaceResult | null;
  setAutoCompletePlace: React.Dispatch<SetStateAction<google.maps.places.PlaceResult | null>>;

  // get place details
  placeDetails: any;
  placeDetailsLoading: boolean;
  placeDetailsError: any;
  setLatLngForPlaceDetails: (lat: number, lng: number) => void;
};

const FeatureContext = createContext<FeatureMapContextType>({
  isListView: false,
  toggleListView: () => {},
  properties: [],
  setProperties: () => {},
  selectedMarkerData: null,
  setSelectedMarkerData: () => {},
  isBoundaryEnabled: false,
  setIsBoundaryEnabled: () => {},
  isDrawingEnabled: false,
  setIsDrawingEnabled: () => {},
  autoCompletePlace: null,
  setAutoCompletePlace: () => {},
  placeDetails: null,
  placeDetailsLoading: false,
  placeDetailsError: null,
  setLatLngForPlaceDetails: () => {}
});

type PropertyProviderProps = {
  children: React.ReactNode;
};
export const FeatureMapProvider = ({ children }: PropertyProviderProps) => {
  const [isListView, setIsListView] = useState(false);
  // properties
  const [properties, setProperties] = useState<PropertyTypes[]>([]);

  // set map marker data
  const [selectedMarkerData, setSelectedMarkerData] = useState<Feature<Point> | null>(null);
  // boundary
  const [isBoundaryEnabled, setIsBoundaryEnabled] = useState<boolean>(false);

  // drawing
  const [isDrawingEnabled, setIsDrawingEnabled] = useState<boolean>(false);

  // map autocomplete address
  const [autoCompletePlace, setAutoCompletePlace] = useState<google.maps.places.PlaceResult | null>(
    null
  );

  // get place details
  const {
    placeDetails,
    loading: placeDetailsLoading,
    error: placeDetailsError,
    setLatLng: setLatLngForPlaceDetails
  } = usePlaceDetailsByLatLng();

  //toggle list view
  const toggleListView = () => {
    setIsListView(!isListView);
  };

  return (
    <FeatureContext.Provider
      value={{
        isListView,
        toggleListView,
        properties,
        setProperties,
        selectedMarkerData,
        setSelectedMarkerData,
        isBoundaryEnabled,
        setIsBoundaryEnabled,
        isDrawingEnabled,
        setIsDrawingEnabled,
        autoCompletePlace,
        setAutoCompletePlace,
        placeDetails,
        setLatLngForPlaceDetails,
        placeDetailsLoading,
        placeDetailsError
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useProperty = () => useContext(FeatureContext);
