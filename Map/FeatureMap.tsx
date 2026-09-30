import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Feature, GeoJsonProperties, Point } from 'geojson';
import {
  InfoWindow,
  Map,
  useMap,
  Marker,
  MapControl,
  ControlPosition
} from '@vis.gl/react-google-maps';
import { ClusteredMarkers } from './components/ClusteredMarkers';
import { propertyData } from './geoJsonData';
import PropertyCard from '../../app/(dashboard)/(common)/(member customer)/find-property/components/PropertyCard';
import { transformGeojsonToProperties } from '../utils/transformGeojsonToProperties';
import { usePlaceDetailsByLatLng } from './hooks/usePlaceDetailsByLatLng';
import { cn } from './utils/cn';
import { useUserLocation } from './hooks/useUserLocation ';
import { UndoRedoControl } from './components/Draw/UndoRedoControl';
import { useDrawingManager } from './hooks/useDrawingManager';
import DrawControl from './components/Draw/DrawControl';
import { useProperty } from './context/FeatureMapProvider';

interface FeatureMapProps {
  horizontalView?: boolean;
  height?: string;
}

const FeatureMap = ({ horizontalView = false, height }: FeatureMapProps) => {
  const {
    autoCompletePlace,
    setProperties,
    selectedMarkerData,
    setSelectedMarkerData,
    isBoundaryEnabled,
    setIsDrawingEnabled,
    isDrawingEnabled,
    setLatLngForPlaceDetails
  } = useProperty();
  const map = useMap();
  const [isStreetViewEnabled, setIsStreetViewEnabled] = useState(false);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const streetViewPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const streetViewMarkersRef = useRef<google.maps.Marker[]>([]);
  const streetViewService = useRef<google.maps.StreetViewService | null>(null);

  const {
    latitude: userLatitude,
    longitude: userLongitude,
    error: userLocationError,
    loading: userLocationLoading
  } = useUserLocation();

  const [clusteredData, setClusteredData] = useState<
    | { position: { lat: number; lng: number }; features: Feature<Point, GeoJsonProperties>[] }[]
    | null
  >(null);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarkerData(null);
  }, [setSelectedMarkerData]);

  useEffect(() => {
    if (clusteredData !== null && !isBoundaryEnabled && !isDrawingEnabled) {
      const transformedData = transformGeojsonToProperties(clusteredData) || [];
      setProperties(transformedData);
    }
  }, [clusteredData, isBoundaryEnabled, setProperties]);

  useEffect(() => {
    if (autoCompletePlace && autoCompletePlace.geometry) {
      const newPosition = {
        lat: Number(autoCompletePlace.geometry.location?.lat()),
        lng: Number(autoCompletePlace.geometry.location?.lng())
      };
      setMarkerPosition(newPosition);
    }
  }, [autoCompletePlace]);

  const addMarkersToStreetView = useCallback(() => {
    if (!streetViewPanoramaRef.current) return;

    // Clear existing markers
    streetViewMarkersRef.current.forEach((marker) => marker.setMap(null));
    streetViewMarkersRef.current = [];

    propertyData.features.forEach((feature) => {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: streetViewPanoramaRef.current,
          title: feature.properties?.title || 'Property',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#1e88e5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        });

        streetViewMarkersRef.current.push(marker);

        marker.addListener('click', () => {
          setSelectedMarkerData(feature);
        });
      }
    });
  }, [setSelectedMarkerData]);

  const checkStreetViewAvailability = useCallback((position: google.maps.LatLng) => {
    if (!streetViewService.current) {
      streetViewService.current = new google.maps.StreetViewService();
    }

    return new Promise<boolean>((resolve) => {
      streetViewService.current!.getPanorama({ location: position, radius: 50 }, (data, status) => {
        resolve(status === google.maps.StreetViewStatus.OK);
      });
    });
  }, []);

  const updateMapAndStreetView = useCallback(async () => {
    if (!map || !markerPosition) return;

    map.setZoom(13);
    map.panTo(markerPosition);

    const streetViewAvailable = await checkStreetViewAvailability(
      new google.maps.LatLng(markerPosition.lat, markerPosition.lng)
    );

    setIsStreetViewAvailable(streetViewAvailable);

    if (!streetViewAvailable) {
      setIsStreetViewEnabled(false);
      return;
    }

    // if (isStreetViewEnabled) {
    if (!streetViewPanoramaRef.current) {
      streetViewPanoramaRef.current = new google.maps.StreetViewPanorama(
        document.getElementById('street-view') as HTMLElement,
        {
          position: markerPosition,
          pov: {
            heading: 180,
            pitch: -10
          }
        }
      );

      const streetViewMarker = new google.maps.Marker({
        position: markerPosition,
        map: streetViewPanoramaRef.current,
        draggable: true,
        animation: google.maps.Animation.DROP
      }) as google.maps.Marker;

      streetViewMarker.addListener('dragend', () => {
        const position = streetViewMarker.getPosition();
        if (position) {
          setMarkerPosition({ lat: position.lat(), lng: position.lng() });
        }
      });

      map.setStreetView(streetViewPanoramaRef.current);
      addMarkersToStreetView();
    } else {
      streetViewPanoramaRef.current.setPosition(markerPosition);
    }
    // }
  }, [
    map,
    markerPosition,
    isStreetViewEnabled,
    checkStreetViewAvailability,
    addMarkersToStreetView
  ]);

  useEffect(() => {
    updateMapAndStreetView();

    return () => {
      if (!isStreetViewEnabled && streetViewPanoramaRef.current) {
        streetViewPanoramaRef.current.setVisible(false);
        streetViewPanoramaRef.current = null;
        streetViewMarkersRef.current.forEach((marker) => marker.setMap(null));
        streetViewMarkersRef.current = [];
      }
    };
  }, [updateMapAndStreetView, isStreetViewEnabled]);

  useEffect(() => {
    if (selectedMarkerData && map) {
      const position = {
        lat: selectedMarkerData.geometry.coordinates[1],
        lng: selectedMarkerData.geometry.coordinates[0]
      };
      setMarkerPosition(position);
    }
  }, [selectedMarkerData, map]);

  const onDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        setMarkerPosition(newPosition);
        setLatLngForPlaceDetails(newPosition.lat, newPosition.lng);

        // Check Street View availability at the new marker position
        const streetViewAvailable = await checkStreetViewAvailability(
          new google.maps.LatLng(newPosition.lat, newPosition.lng)
        );

        setIsStreetViewAvailable(streetViewAvailable);

        // Auto-hide Street View if not available
        if (!streetViewAvailable && isStreetViewEnabled) {
          setIsStreetViewEnabled(false);
        } else if (streetViewAvailable && isStreetViewEnabled) {
          // If Street View is enabled and available, update it
          updateMapAndStreetView();
        }
      }
    },
    [
      setLatLngForPlaceDetails,
      checkStreetViewAvailability,
      isStreetViewEnabled,
      updateMapAndStreetView
    ]
  );

  // Toggle function for Street View
  const toggleStreetView = useCallback(() => {
    if (isStreetViewAvailable) {
      setIsStreetViewEnabled((prev) => !prev);
      updateMapAndStreetView();
    } else {
      alert('No Street View available at this location.');
    }
  }, [isStreetViewAvailable, updateMapAndStreetView]);

  const memoizedClusters = useMemo(
    () => (
      <ClusteredMarkers
        geojson={propertyData}
        setClusteredData={setClusteredData}
        setSelectedMarkerData={setSelectedMarkerData}
      />
    ),
    [propertyData, setClusteredData, setSelectedMarkerData]
  );

  useEffect(() => {
    if (map) {
      const clickListener = map.addListener('click', (event: google.maps.MapMouseEvent) => {
        handleInfoWindowClose();
      });

      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }
  }, [map, handleInfoWindowClose]);

  return (
    <div
      className={cn(
        'flex overflow-auto',
        horizontalView ? 'flex-row' : 'flex-col',
        height ? height : 'h-[calc(100vh-145px)]'
      )}
    >
      <Map
        mapId={'e66be7316bfbb58'}
        // mapId={'15431d2b469f209dsfdsfsde'}
        defaultCenter={{ lat: 39.3469134, lng: -98.3567727 }}
        defaultZoom={4.3}
        gestureHandling={'auto'}
        minZoom={3}
        disableDefaultUI
        className={cn(height ? height : 'h-[calc(100vh-145px)]', 'w-full')}
      >
        {/* street view control */}
        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <div className="ml-[10px] flex w-[170px] flex-col gap-2 rounded-md border bg-white px-2 py-1 shadow-sm">
            <button
              onClick={toggleStreetView}
              disabled={!isStreetViewAvailable}
              className={cn(
                'rounded px-2 py-1',
                isStreetViewAvailable
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              )}
            >
              {isStreetViewEnabled ? 'Hide Street View' : 'Show Street View'}
            </button>
          </div>
        </MapControl>

        {markerPosition && <Marker position={markerPosition} draggable onDragEnd={onDragEnd} />}
        {propertyData && memoizedClusters}

        {/* draw control */}
        <DrawControl />

        {/* infoWindow */}
        {selectedMarkerData && (
          <InfoWindow
            // onClose={handleInfoWindowClose}
            position={{
              lat: selectedMarkerData.geometry.coordinates[1],
              lng: selectedMarkerData.geometry.coordinates[0]
            }}
            pixelOffset={[0, -30]}
            headerDisabled
          >
            <PropertyCard property={selectedMarkerData} />
          </InfoWindow>
        )}
      </Map>
      <div
        id="street-view"
        className={cn(
          height ? height : 'h-[calc(100vh-145px)]',
          'w-full',
          (!isStreetViewAvailable || !isStreetViewEnabled) && 'hidden'
        )}
      ></div>
    </div>
  );
};

export default FeatureMap;
