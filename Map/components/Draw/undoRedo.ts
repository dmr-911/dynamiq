import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import {
  Action,
  DrawResult,
  DrawingActionKind,
  Overlay,
  Snapshot,
  State,
  isCircle,
  isMarker,
  isPolygon,
  isPolyline,
  isRectangle
} from './types';

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case DrawingActionKind.UPDATE_OVERLAYS: {
      const overlay = state.now[0];
      if (!overlay) return state;

      const snapshot: Snapshot = {};
      const { geometry } = overlay;

      if (isCircle(geometry)) {
        snapshot.center = geometry.getCenter()?.toJSON();
        snapshot.radius = geometry.getRadius();
      } else if (isMarker(geometry)) {
        snapshot.position = geometry.getPosition()?.toJSON();
      } else if (isPolygon(geometry) || isPolyline(geometry)) {
        snapshot.path = geometry
          .getPath()
          .getArray()
          .map((latLng) => latLng.toJSON());
      } else if (isRectangle(geometry)) {
        snapshot.bounds = geometry.getBounds()?.toJSON();
      }

      return {
        now: [{ ...overlay, snapshot }],
        past: [...state.past, state.now],
        future: []
      };
    }

    case DrawingActionKind.SET_OVERLAY: {
      const { overlay } = action.payload;
      const snapshot: Snapshot = {};

      if (isCircle(overlay)) {
        snapshot.center = overlay.getCenter()?.toJSON();
        snapshot.radius = overlay.getRadius();
      } else if (isMarker(overlay)) {
        snapshot.position = overlay.getPosition()?.toJSON();
      } else if (isPolygon(overlay) || isPolyline(overlay)) {
        snapshot.path = overlay
          .getPath()
          .getArray()
          .map((latLng) => latLng.toJSON());
      } else if (isRectangle(overlay)) {
        snapshot.bounds = overlay.getBounds()?.toJSON();
      }

      return {
        past: [...state.past, state.now],
        now: [
          {
            type: action.payload.type,
            geometry: action.payload.overlay,
            snapshot
          }
        ],
        future: []
      };
    }

    case DrawingActionKind.UNDO: {
      const last = state.past[state.past.length - 1];
      if (!last) return state;

      return {
        past: state.past.slice(0, -1),
        now: last,
        future: [state.now, ...state.future]
      };
    }

    case DrawingActionKind.REDO: {
      const [next, ...restFuture] = state.future;
      if (!next) return state;

      return {
        past: [...state.past, state.now],
        now: next,
        future: restFuture
      };
    }

    case DrawingActionKind.RESET: {
      return {
        past: [],
        now: [],
        future: []
      };
    }

    default:
      return state;
  }
}

export function useDrawingManagerEvents(
  drawingManager: google.maps.drawing.DrawingManager | null,
  overlaysShouldUpdateRef: MutableRefObject<boolean>,
  dispatch: Dispatch<Action>,
  setCurrentOverlay: Dispatch<SetStateAction<google.maps.MVCObject | null>>
) {
  useEffect(() => {
    if (!drawingManager) return;

    const eventListeners: Array<google.maps.MapsEventListener> = [];

    const addUpdateListener = (eventName: string, drawResult: DrawResult) => {
      const updateListener = google.maps.event.addListener(drawResult.overlay, eventName, () => {
        if (eventName === 'dragstart') {
          overlaysShouldUpdateRef.current = false;
        }

        if (eventName === 'dragend') {
          overlaysShouldUpdateRef.current = true;
        }

        if (overlaysShouldUpdateRef.current) {
          dispatch({ type: DrawingActionKind.UPDATE_OVERLAYS });
        }
      });

      eventListeners.push(updateListener);
    };

    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      (drawResult: DrawResult) => {
        // Remove previous overlay
        setCurrentOverlay((prev) => {
          if (prev instanceof google.maps.OverlayView) prev.setMap(null);
          return drawResult.overlay;
        });

        switch (drawResult.type) {
          case google.maps.drawing.OverlayType.CIRCLE:
            ['center_changed', 'radius_changed', 'dragend'].forEach((eventName) =>
              addUpdateListener(eventName, drawResult)
            );
            break;

          case google.maps.drawing.OverlayType.MARKER:
            ['dragend'].forEach((eventName) => addUpdateListener(eventName, drawResult));
            break;

          case google.maps.drawing.OverlayType.POLYGON:
          case google.maps.drawing.OverlayType.POLYLINE:
            if (
              drawResult.overlay instanceof google.maps.Polygon ||
              drawResult.overlay instanceof google.maps.Polyline
            ) {
              const polygonOrPolyline = drawResult.overlay as
                | google.maps.Polygon
                | google.maps.Polyline;
              ['insert_at', 'remove_at', 'set_at', 'dragend'].forEach((eventName) => {
                google.maps.event.addListener(polygonOrPolyline.getPath(), eventName, () => {
                  dispatch({ type: DrawingActionKind.UPDATE_OVERLAYS });
                });
              });
            }
            addUpdateListener('dragend', drawResult);
            break;

          case google.maps.drawing.OverlayType.RECTANGLE:
            ['bounds_changed', 'dragend'].forEach((eventName) =>
              addUpdateListener(eventName, drawResult)
            );
            break;
        }

        dispatch({ type: DrawingActionKind.SET_OVERLAY, payload: drawResult });
        drawingManager.setDrawingMode(null);
      }
    );

    eventListeners.push(overlayCompleteListener);

    return () => {
      eventListeners.forEach((listener) => google.maps.event.removeListener(listener));
    };
  }, [dispatch, drawingManager, overlaysShouldUpdateRef, setCurrentOverlay]);
}

export function useOverlaySnapshots(
  map: google.maps.Map | null,
  state: State,
  overlaysShouldUpdateRef: MutableRefObject<boolean>
) {
  useEffect(() => {
    if (!map || !state.now.length) return;

    const overlay = state.now[0];
    overlaysShouldUpdateRef.current = false;

    overlay.geometry.setMap(map);

    const { radius, center, position, path, bounds } = overlay.snapshot;

    if (isCircle(overlay.geometry)) {
      overlay.geometry.setRadius(radius ?? 0);
      overlay.geometry.setCenter(center ?? null);
    } else if (isMarker(overlay.geometry)) {
      overlay.geometry.setPosition(position);
    } else if (isPolygon(overlay.geometry) || isPolyline(overlay.geometry)) {
      overlay.geometry.setPath(path ?? []);
    } else if (isRectangle(overlay.geometry)) {
      overlay.geometry.setBounds(bounds ?? null);
    }

    overlaysShouldUpdateRef.current = true;

    return () => {
      overlay.geometry.setMap(null);
    };
  }, [map, overlaysShouldUpdateRef, state.now]);
}
