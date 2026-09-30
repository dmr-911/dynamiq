import React, { useCallback } from 'react';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

type TreeClusterMarkerProps = {
  clusterId: number;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    clusterId: number,
    position: google.maps.LatLngLiteral
  ) => void;
  position: google.maps.LatLngLiteral;
  size: number;
  sizeAsText: string;
};

export const FeaturesClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId
}: TreeClusterMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId, position),
    [onMarkerClick, marker, clusterId, position]
  );
  const markerSize = Math.floor(48 + Math.sqrt(size) * 2);
  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={'marker cluster'}
      style={{ width: markerSize, height: markerSize }}
    >
      <div className="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-blue-300">
        <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-blue-400">
          <div className="flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full bg-blue-500 text-sm text-white">
            <span>{sizeAsText}</span>
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};
