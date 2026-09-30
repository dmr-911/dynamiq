import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

import reducer, { useDrawingManagerEvents, useOverlaySnapshots } from './undoRedo';
import { DrawingActionKind, Overlay } from './types';
import { ReIcon } from '../components/ReIcon/ReIcon';

interface Props {
  drawingManager: google.maps.drawing.DrawingManager | null;
  onChangeDrawing?: (drawingData: Array<Overlay> | null) => void;
}

export const UndoRedoControl = ({ drawingManager, onChangeDrawing }: Props) => {
  const map = useMap();

  const [state, dispatch] = useReducer(reducer, {
    past: [],
    now: [],
    future: []
  });

  const overlaysShouldUpdateRef = useRef<boolean>(true);
  const [currentOverlay, setCurrentOverlay] = useState<google.maps.MVCObject | null>(null);

  useDrawingManagerEvents(drawingManager, overlaysShouldUpdateRef, dispatch, setCurrentOverlay);
  useOverlaySnapshots(map, state, overlaysShouldUpdateRef);

  const handleUndo = () => {
    if (currentOverlay instanceof google.maps.OverlayView) {
      currentOverlay.setMap(null);
    }
    dispatch({ type: DrawingActionKind.UNDO });
    setCurrentOverlay(state.past[state.past.length - 1]?.[0]?.geometry || null);
  };

  const handleRedo = () => {
    if (currentOverlay instanceof google.maps.OverlayView) {
      currentOverlay.setMap(null);
    }
    dispatch({ type: DrawingActionKind.REDO });
    setCurrentOverlay(state.future[state.future.length - 1]?.[0]?.geometry || null);
  };

  const handleReset = () => {
    if (currentOverlay instanceof google.maps.OverlayView) {
      currentOverlay.setMap(null);
    }
    setCurrentOverlay(null);
    dispatch({ type: DrawingActionKind.RESET });
  };

  useEffect(() => {
    if (onChangeDrawing && state.now.length > 0) {
      onChangeDrawing(state.now);
    }
  }, [state, onChangeDrawing]);

  return (
    <div className="mt-1 flex items-center rounded bg-white">
      <button onClick={handleUndo} disabled={!state.past.length} className="disabled:opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
        </svg>
      </button>
      <button onClick={handleRedo} disabled={!state.future.length} className="disabled:opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
        </svg>
      </button>
      {currentOverlay && (
        <button
          onClick={handleReset}
          className="rounded rounded-l-none bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          <ReIcon iconName="BiReset" />
          {/* Reset */}
        </button>
      )}
    </div>
  );
};
