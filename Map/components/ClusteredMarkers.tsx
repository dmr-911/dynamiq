import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps';
import Supercluster, { ClusterProperties } from 'supercluster';
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { useSupercluster } from '../hooks/useSupercluster';
import { FeatureMarker } from './FeatureMarker';
import Checkbox from './ui/form/checkbox/Checkbox';
import Select from './ui/form/select/Select';
import { FeaturesClusterMarker } from './FeaturesClusterMarker';
import { useProperty } from '../context/FeatureMapProvider';

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setClusteredData: (
    data: Array<{
      position: { lat: number; lng: number };
      features: Feature<Point>[];
    }>
  ) => void;
  setSelectedMarkerData: (data: Feature<Point> | null) => void;
};

type FeatureLayerType =
  | 'ADMINISTRATIVE_AREA_LEVEL_1'
  | 'ADMINISTRATIVE_AREA_LEVEL_2'
  | 'COUNTRY'
  | 'LOCALITY'
  | 'POSTAL_CODE'
  | 'SCHOOL_DISTRICT';

const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12
};

const defaultStyle: google.maps.FeatureStyleOptions = {
  strokeColor: '#810FCB',
  strokeOpacity: 1.0,
  strokeWeight: 2.0,
  fillColor: 'white',
  fillOpacity: 0.1
};

const clickedStyle: google.maps.FeatureStyleOptions = {
  ...defaultStyle,
  fillColor: '#810FCB',
  fillOpacity: 0.5
};

const hoveredStyle: google.maps.FeatureStyleOptions = {
  ...defaultStyle,
  strokeWeight: 4.0
};

export const ClusteredMarkers: React.FC<ClusteredMarkersProps> = ({
  geojson,
  setClusteredData,
  setSelectedMarkerData
}) => {
  const { setProperties, isBoundaryEnabled, setIsBoundaryEnabled } = useProperty();
  const map = useMap();
  const { clusters, getLeaves, getClusterExpansionZoom } = useSupercluster(
    geojson,
    superclusterOptions
  );

  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [selectedFeatureLayer, setSelectedFeatureLayer] = useState<FeatureLayerType>(
    'ADMINISTRATIVE_AREA_LEVEL_1'
  );
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);

  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);

  // set selected feature layer
  const handleFeatureLayerChange = useCallback((newLayer: FeatureLayerType) => {
    setSelectedFeatureLayer(newLayer);
  }, []);

  // toggle boundary feature layer
  const handleBoundaryToggle = useCallback(() => {
    setIsBoundaryEnabled((prev) => !prev);
  }, []);

  // filter geojson by boundary when map bounds change
  const filterGeoJsonByBoundary = useCallback(
    (viewport: google.maps.LatLngBounds) => {
      const filteredFeatures: any = geojson.features.filter((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        return viewport.contains({ lat, lng });
      });

      setProperties(filteredFeatures);
    },
    [geojson]
  );

  // update boundary feature layer for spacific property bounds
  const updatePropertyBoundary = useCallback(
    ({ geojson, map }: { geojson: FeatureCollection<Point>; map: google.maps.Map }) => {
      if (!map) return;

      if (geojson.features.length > 0) {
        geojson?.features.forEach((feature) => {
          if (feature?.properties?.boundary?.type === 'Polygon') {
            map.data.add({
              geometry: new google.maps.Data.Polygon([
                feature?.properties?.boundary?.snapshot?.path
              ])
            });
            map.data.setStyle({
              fillColor: 'green',
              strokeWeight: 1,
              strokeColor: 'yellow'
            });
          }
        });
      }
    },
    [geojson, map]
  );

  // enable boundary feature layer when map bounds change or boundary is toggled
  useEffect(() => {
    if (!map) return;
    // update boundary feature layer for spacific property bounds
    updatePropertyBoundary({ geojson, map });
    // const outerCoords = [
    //   {
    //     lat: 27.289876260055866,
    //     lng: -82.48144139241838
    //   },
    //   {
    //     lat: 27.28996088046771,
    //     lng: -82.48124961447381
    //   },
    //   {
    //     lat: 27.289825011042684,
    //     lng: -82.48117853593492
    //   },
    //   {
    //     lat: 27.289791639579544,
    //     lng: -82.48126704883241
    //   },
    //   {
    //     lat: 27.289817860015724,
    //     lng: -82.48128180098199
    //   },
    //   {
    //     lat: 27.289767802814012,
    //     lng: -82.48138238382005
    //   }
    // ];

    // map.data.add({
    //   geometry: new google.maps.Data.Polygon([outerCoords])
    // });

    const clearPreviousFeatureLayer = (layer: google.maps.FeatureLayer | null) => {
      if (layer) {
        google.maps.event.clearListeners(layer, 'click');
        google.maps.event.clearListeners(layer, 'mousemove');
        google.maps.event.clearListeners(layer, 'mouseout');
        layer.style = null;
      }
    };

    const applyFeatureLayerStyles = (layer: google.maps.FeatureLayer) => {
      layer.style = (params: any) => {
        const placeId = params.feature.placeId;
        if (selectedFeatureIds.includes(placeId)) {
          return clickedStyle;
        } else if (hoveredFeatureId === placeId) {
          return hoveredStyle;
        }
        return defaultStyle;
      };

      layer.addListener('click', async (e: google.maps.FeatureMouseEvent) => {
        const clickedFeatureIds = e.features.map((f: any) => f.placeId);
        setSelectedFeatureIds(clickedFeatureIds);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId: clickedFeatureIds[0] }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const viewport = results[0].geometry.viewport;
            filterGeoJsonByBoundary(viewport);
          } else {
            console.error('Geocoding request failed:', status);
          }
        });
      });

      layer.addListener('mousemove', (e: google.maps.FeatureMouseEvent) => {
        const hoverFeatureIds = e.features.map((f: any) => f.placeId);

        if (e.features[0]) {
          setHoveredFeatureId(hoverFeatureIds[0]);
        }
      });

      layer.addListener('mouseout', () => {
        setHoveredFeatureId(null);
      });
    };

    const listener = map.addListener('idle', () => {
      setMapBounds(map.getBounds() || null);
    });

    if (isBoundaryEnabled) {
      //@ts-ignore
      const featureLayer = map.getFeatureLayer(selectedFeatureLayer);
      clearPreviousFeatureLayer(featureLayer);
      applyFeatureLayerStyles(featureLayer);

      setMapBounds(map.getBounds() || null);

      return () => {
        clearPreviousFeatureLayer(featureLayer);
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, isBoundaryEnabled, selectedFeatureLayer, selectedFeatureIds, hoveredFeatureId]);

  // Handle cluster expansion zoom
  useEffect(() => {
    if (!mapBounds || clusters.length === 0) return;

    const visibleFeatures = clusters.filter((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return mapBounds.contains({ lat, lng });
    });

    const infoWindowData = visibleFeatures.slice(0, 10).map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const clusterProperties = feature.properties as ClusterProperties;

      return {
        position: { lat, lng },
        features: clusterProperties.cluster
          ? getLeaves(clusterProperties.cluster_id)
          : [feature as Feature<Point>]
      };
    });
    setClusteredData(infoWindowData);
  }, [mapBounds, clusters, getLeaves, setClusteredData]);

  // Handle cluster click
  const handleClusterClick = useCallback(
    (position: { lat: number; lng: number }, clusterId: number) => {
      const expansionZoom = getClusterExpansionZoom(clusterId);
      map?.setZoom(expansionZoom);
      map?.panTo(position);
    },
    [getClusterExpansionZoom, map]
  );

  // Handle marker click
  const handleMarkerClick = useCallback(
    (feature: Feature<Point>) => {
      setSelectedMarkerData(feature);
    },
    [setSelectedMarkerData]
  );

  // Render markers with clusters
  const renderedClusters = useMemo(
    () =>
      clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const position = { lat, lng };
        const clusterProperties = feature.properties as ClusterProperties;

        return clusterProperties.cluster ? (
          <FeaturesClusterMarker
            key={`cluster-${feature.id}`}
            clusterId={clusterProperties.cluster_id}
            position={position}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            onMarkerClick={() => handleClusterClick(position, clusterProperties.cluster_id)}
          />
        ) : (
          <FeatureMarker
            key={`marker-${feature.id}`}
            featureId={feature.id as string}
            position={position}
            onMarkerClick={() => handleMarkerClick(feature as Feature<Point>)}
            feature={feature}
          />
        );
      }),
    [clusters, handleClusterClick, handleMarkerClick]
  );

  return (
    <>
      <MapControl position={ControlPosition.LEFT_TOP}>
        <div className="ml-[10px] mt-2 flex w-[170px] flex-col gap-2 rounded-md border bg-white px-2 py-1 shadow-sm">
          <BoundaryToggle isEnabled={isBoundaryEnabled} onToggle={handleBoundaryToggle} />
          {isBoundaryEnabled && (
            <FeatureLayerDropdown
              onSelect={handleFeatureLayerChange}
              selectedLayer={selectedFeatureLayer}
            />
          )}
          {renderedClusters}
        </div>
      </MapControl>
    </>
  );
};

// Boundary Toggle
const BoundaryToggle: React.FC<{
  isEnabled: boolean;
  onToggle: () => void;
}> = ({ isEnabled, onToggle }) => {
  return (
    <div>
      <Checkbox
        readOnly
        checked={isEnabled}
        onChange={onToggle}
        label={isEnabled ? 'Hide Boundaries' : 'Show Boundaries'}
        color={'primary'}
      />
    </div>
  );
};

// Boundary Feature Layer Dropdown
const FeatureLayerDropdown: React.FC<{
  onSelect: (layer: FeatureLayerType) => void;
  selectedLayer: FeatureLayerType;
}> = ({ onSelect, selectedLayer }) => {
  const layers: FeatureLayerType[] = [
    'ADMINISTRATIVE_AREA_LEVEL_1',
    // 'ADMINISTRATIVE_AREA_LEVEL_2',
    'COUNTRY'
    // 'LOCALITY',
    // 'POSTAL_CODE',
    // 'SCHOOL_DISTRICT'
  ];

  return (
    <Select
      size="sm"
      className="max-w-[170px]"
      options={layers.map((layer) => ({
        label: layer,
        value: layer
      }))}
      value={selectedLayer}
      onChange={(e) => onSelect(e.target.value as FeatureLayerType)}
    />
  );
};
