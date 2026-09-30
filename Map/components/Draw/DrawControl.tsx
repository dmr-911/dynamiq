import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import React from 'react';
import { UndoRedoControl } from './UndoRedoControl';
import { cn } from '../../utils/cn';
import { useDrawingManager } from '../../hooks/useDrawingManager';
import { Overlay } from './types';
import { useProperty } from '../../context/FeatureMapProvider';

const DrawControl = ({
  onChangeDrawing
}: {
  onChangeDrawing?: (drawingData: Array<Overlay> | null) => void;
}) => {
  const { setIsDrawingEnabled, isDrawingEnabled } = useProperty();
  const drawingManager = useDrawingManager();

  return (
    <>
      <MapControl position={ControlPosition.LEFT_TOP}>
        <div className="ml-[10px] mt-2 flex w-[170px] flex-col gap-2 rounded-md border bg-white px-2 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => setIsDrawingEnabled((prev) => !prev)}
            className={cn(
              'rounded px-2 py-1',
              isDrawingEnabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500'
            )}
          >
            {isDrawingEnabled ? 'Disable Draw Mode' : 'Enable Draw Mode'}
          </button>
        </div>
      </MapControl>
      <MapControl position={ControlPosition.TOP_CENTER}>
        {isDrawingEnabled && (
          <UndoRedoControl drawingManager={drawingManager} onChangeDrawing={onChangeDrawing} />
        )}
      </MapControl>
    </>
  );
};

export default DrawControl;
