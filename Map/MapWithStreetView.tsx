'use client';
import { cn } from './utils/cn';
import { ControlPosition, Map, MapControl, Marker, useMap } from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReIcon } from './components/ReIcon/ReIcon';
import DrawControl from './components/Draw/DrawControl';
import { useProperty } from './context/FeatureMapProvider';
import { Overlay } from './components/Draw/types';

type MapWithStreetViewProps = {
  horizontalView?: boolean;
  height?: string;
  markerPosition?: {
    lat: number;
    lng: number;
  };
  onChangeDrawing?: (drawingData: Array<Overlay> | null) => void;
  showStreetView?: boolean;
};

const MapWithStreetView = ({
  horizontalView = true,
  height = 'h-80',
  onChangeDrawing,
  showStreetView = true
}: MapWithStreetViewProps) => {
  const { autoCompletePlace, setLatLngForPlaceDetails } = useProperty();
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(false);
  const [isStreetViewEnabled, setIsStreetViewEnabled] = useState(true);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const streetViewPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const streetViewService = useRef<google.maps.StreetViewService | null>(null);
  const streetViewContainerRef = useRef<HTMLDivElement>(null);
  const streetViewMarkerRef = useRef<google.maps.Marker | null>(null);
  const map = useMap();

  const calculateHeading = useCallback((from: google.maps.LatLng, to: google.maps.LatLng) => {
    return google.maps.geometry.spherical.computeHeading(from, to);
  }, []);

  const updateStreetViewPOV = useCallback(
    (panorama: google.maps.StreetViewPanorama, markerPos: google.maps.LatLng) => {
      const panoramaPos = panorama.getPosition();
      if (panoramaPos) {
        const heading = calculateHeading(panoramaPos, markerPos);

        // Adjust pitch to center the marker vertically in the Street View viewport
        const pitch = 0; // You can adjust this value based on your need

        panorama.setPov({
          heading: 176,
          pitch: pitch, // You can dynamically calculate this if needed
          zoom: -10 // Adjust zoom if needed
        } as any);
      }
    },
    [calculateHeading]
  );

  useEffect(() => {
    if (!map) return;
    if (autoCompletePlace && autoCompletePlace.geometry) {
      const newPosition = {
        lat: Number(autoCompletePlace.geometry.location?.lat()),
        lng: Number(autoCompletePlace.geometry.location?.lng())
      };

      map.panTo(newPosition);
      map.setZoom(13);
      setMarkerPosition(newPosition);
      handleStreetView(newPosition);
    }
  }, [autoCompletePlace, map]);

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

  const handleStreetView = useCallback(
    async (position: { lat: number; lng: number }) => {
      const streetViewAvailable = await checkStreetViewAvailability(
        new google.maps.LatLng(position.lat, position.lng)
      );

      setIsStreetViewAvailable(streetViewAvailable);

      if (streetViewAvailable && streetViewContainerRef.current && isStreetViewEnabled) {
        if (!streetViewPanoramaRef.current) {
          streetViewPanoramaRef.current = new google.maps.StreetViewPanorama(
            streetViewContainerRef.current,
            {
              position: position,
              pov: {
                heading: 0,
                pitch: 0
              }
            }
          );

          if (map) {
            streetViewMarkerRef.current = new google.maps.Marker({
              position: position,
              map: streetViewPanoramaRef.current,
              draggable: true
            });

            streetViewMarkerRef.current.addListener('dragend', onDragEnd);
            map.setStreetView(streetViewPanoramaRef.current);
          }
        } else {
          streetViewPanoramaRef.current.setPosition(position);
        }

        // Update Street View POV to point towards the marker
        if (streetViewPanoramaRef.current) {
          updateStreetViewPOV(
            streetViewPanoramaRef.current,
            new google.maps.LatLng(position.lat, position.lng)
          );
        }

        if (streetViewMarkerRef.current) {
          streetViewMarkerRef.current.setPosition(position);
        }
      } else if (map && !isStreetViewEnabled) {
        map.setStreetView(null);
      }
    },
    [
      checkStreetViewAvailability,
      isStreetViewEnabled,
      streetViewContainerRef,
      map,
      updateStreetViewPOV
    ]
  );

  const onDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        setMarkerPosition(newPosition);
        map.panTo(newPosition);
        setLatLngForPlaceDetails(newPosition.lat, newPosition.lng);
        handleStreetView(newPosition);

        // Update Street View POV when marker is dragged
        if (streetViewPanoramaRef.current) {
          updateStreetViewPOV(streetViewPanoramaRef.current, e.latLng);
        }
      }
    },
    [map, handleStreetView, setLatLngForPlaceDetails, updateStreetViewPOV]
  );

  const toggleStreetView = useCallback(() => {
    setIsStreetViewEnabled((prev) => {
      if (!prev && markerPosition) {
        handleStreetView(markerPosition);
        if (map) {
          map.setStreetView(streetViewPanoramaRef.current);
        }
      } else {
        if (map) {
          map.setStreetView(null);
        }
      }
      return !prev;
    });
  }, [handleStreetView, markerPosition, map]);

  useEffect(() => {
    if (!map) return;
    if (isStreetViewEnabled) {
      handleStreetView(markerPosition || { lat: 39.3469134, lng: -98.3567727 });
    }
  }, [handleStreetView, isStreetViewEnabled, markerPosition]);

  if (!window.google) return null;
  return (
    <div
      className={cn(
        'flex overflow-auto',
        horizontalView ? 'flex-row' : 'flex-col',
        height ? height : 'h-[calc(100vh-145px)]'
      )}
    >
      <Map
        // mapId={'78385dffa46246e9'}
        // mapId={'3b3e6c0b0b0b0b0b'}
        mapId={'15431d2b469f209dsfdsfsde'}
        defaultCenter={markerPosition || { lat: 39.3469134, lng: -98.3567727 }}
        defaultZoom={4.3}
        // gestureHandling="cooperative"
        minZoom={3}
        disableDefaultUI
        fullscreenControl
        mapTypeControl
        zoomControl
        className={cn(height ? height : 'h-[calc(100vh-145px)]', 'w-full')}
      >
        {showStreetView && (
          <MapControl position={ControlPosition.LEFT_BOTTOM}>
            <button
              className={
                'ml-[10px] flex w-[70px] items-center justify-center gap-2 rounded-md border bg-blue-500 px-4 py-2 text-white shadow-sm disabled:bg-slate-500'
              }
              disabled={!isStreetViewAvailable}
              onClick={toggleStreetView}
            >
              <ReIcon
                iconName="FaStreetView"
                className={cn(isStreetViewEnabled ? 'text-white' : 'text-muted-300')}
              />
            </button>
          </MapControl>
        )}
        {markerPosition && <Marker position={markerPosition} draggable onDragEnd={onDragEnd} />}
        {/* draw control */}
        <DrawControl onChangeDrawing={onChangeDrawing} />
      </Map>
      <div
        ref={streetViewContainerRef}
        className={cn(
          height ? height : 'h-[calc(100vh-145px)]',
          'w-full',
          (!isStreetViewAvailable || !isStreetViewEnabled) && 'hidden'
        )}
      ></div>
    </div>
  );
};

export default MapWithStreetView;
