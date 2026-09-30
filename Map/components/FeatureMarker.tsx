import React, { useCallback } from 'react';
import { AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { ReIcon } from '../components/ReIcon/ReIcon';
import Tag from './ui/tag/Tag';

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  featureId: string;
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => void;
  feature?: any;
};

export const FeatureMarker = ({ position, featureId, onMarkerClick, feature }: TreeMarkerProps) => {
  const { properties } = feature || {};
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId]
  );
  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      className={'relative flex flex-col items-center'}
    >
      {properties?.price && (
        <Tag
          variant="solid"
          color="default"
          shape="curved"
          shadow="success"
          className="absolute -top-2 right-0"
        >
          {properties.price}
        </Tag>
      )}
      <ReIcon iconName="FaMapMarkerAlt" className="text-3xl leading-none text-red-500" />
    </AdvancedMarker>
  );
};
