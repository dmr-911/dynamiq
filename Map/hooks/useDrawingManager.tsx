import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';
import { propertyData } from '../geoJsonData';
import { useProperty } from '../context/FeatureMapProvider';

export function useDrawingManager(initialValue: google.maps.drawing.DrawingManager | null = null) {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');
  const { setProperties, isDrawingEnabled } = useProperty();

  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(
    initialValue
  );

  // Filter GeoJSON by boundary when map bounds change
  const filterGeoJsonByBoundary = useCallback(
    (overlay: google.maps.Polygon | google.maps.Circle | google.maps.Rectangle) => {
      let bounds: google.maps.LatLngBounds;

      if (overlay instanceof google.maps.Polygon || overlay instanceof google.maps.Polyline) {
        bounds = new google.maps.LatLngBounds();
        overlay.getPath().forEach((latLng) => bounds.extend(latLng));
      } else if (overlay instanceof google.maps.Circle) {
        bounds = overlay.getBounds()!;
      } else {
        bounds = overlay.getBounds()!;
      }

      const filteredFeatures: any = propertyData.features.filter((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        return bounds.contains({ lat, lng });
      });

      setProperties(filteredFeatures);
    },
    [setProperties]
  );

  useEffect(() => {
    if (!map || !drawing || !isDrawingEnabled) return;

    // Create DrawingManager instance
    const newDrawingManager = new drawing.DrawingManager({
      map,
      drawingMode: google.maps.drawing.OverlayType.CIRCLE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      circleOptions: {
        editable: true,
        draggable: true
      },
      polygonOptions: {
        editable: true,
        draggable: true
      },
      rectangleOptions: {
        editable: true,
        draggable: true
      }
    });

    // Function to update bounds dynamically
    const updateBounds = (
      overlay: google.maps.Circle | google.maps.Rectangle | google.maps.Polygon
    ) => {
      filterGeoJsonByBoundary(overlay);
    };

    // Listen for `overlaycomplete` event
    newDrawingManager.addListener(
      'overlaycomplete',
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        const { overlay, type } = event;
        if (overlay !== null) {
          // Update bounds based on the overlay type
          updateBounds(overlay as any);

          // Attach listeners for drag and resize events
          if (type === google.maps.drawing.OverlayType.CIRCLE) {
            const circle = overlay as google.maps.Circle;
            circle.addListener('radius_changed', () => updateBounds(circle));
            circle.addListener('center_changed', () => updateBounds(circle));
          }

          if (type === google.maps.drawing.OverlayType.RECTANGLE) {
            const rectangle = overlay as google.maps.Rectangle;
            rectangle.addListener('bounds_changed', () => updateBounds(rectangle));
          }

          if (
            type === google.maps.drawing.OverlayType.POLYGON ||
            type === google.maps.drawing.OverlayType.POLYLINE
          ) {
            const path = (overlay as google.maps.Polygon).getPath();
            path.addListener('insert_at', () => updateBounds(overlay as any));
            path.addListener('remove_at', () => updateBounds(overlay as any));
            path.addListener('set_at', () => updateBounds(overlay as any));
            overlay.addListener('dragend', () => updateBounds(overlay as any));
          }
        }
      }
    );

    setDrawingManager(newDrawingManager);

    return () => {
      newDrawingManager.setMap(null);
    };
  }, [drawing, map, isDrawingEnabled, filterGeoJsonByBoundary]);

  return drawingManager;
}
