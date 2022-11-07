import { useCallback, useEffect, useState } from 'react';

/**
 * Utility function that transforms `MouseEvent` coords to `Coordinates`.
 */
const getEventCoordinates = (e: MouseEvent) => ({
  x: e.clientX,
  y: e.clientY,
});

export interface Coordinates {
  /** Represents X coordinate from `MouseEvent` */
  x: number;
  /** Represents Y coordinate from `MouseEvent` */
  y: number;
}

export interface UseCoordinateTrackingParams {
  /** Ref to the element to attach event listeners to for coordinate tracking. */
  ref: React.MutableRefObject<HTMLDivElement | null>;
  /** Represents disabled state of the `Slider`. When `true`, stops listening to tracking events.  */
  disabled?: boolean;
}

export interface UseCoordinateTracking {
  /** Coordinates of most recently tracked event. */
  coordinates: Coordinates;
  /** Denotes when the `ref` element is actively being interacted with. */
  dragging: boolean;
}

/**
 * Custom hook that returns coordinates from `MouseEvent`s attached to the provided element `ref`.
 */
export function useCoordinateTracking({ ref, disabled }: UseCoordinateTrackingParams): UseCoordinateTracking {
  const initialCoordinates = { x: 0, y: 0 };
  const [coordinates, setCoordinates] = useState<Coordinates>(initialCoordinates);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleMoveStartEvent = useCallback(
    (e: MouseEvent) => {
      // Return early if disabled or right-click
      if (disabled || e.button !== 0) {
        return;
      }

      const newCoordinates = getEventCoordinates(e);
      setCoordinates(newCoordinates);

      setDragging(true);
    },
    [disabled]
  );

  const handleMoveEvent = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;

      const newCoordinates = getEventCoordinates(e);
      setCoordinates(newCoordinates);
    },
    [dragging]
  );

  const handleMoveEndEvent = useCallback(() => {
    setDragging(false);
  }, []);

  /**
   * Used to attach event listeners to `ref` element's closest `document`. Listening to `document` allows
   * for continued tracking when the mouse has left the `ref` element, but is still within the nearest document.
   *
   * This allows for interactivty similar to the native `input` of `type="range"`.
   */
  const startListeningToDocumentEvents = useCallback(() => {
    const doc = ref.current?.ownerDocument || document;

    doc.addEventListener('mousemove', handleMoveEvent);
    doc.addEventListener('mouseup', handleMoveEndEvent);
    doc.addEventListener('onmouseleave', handleMoveEndEvent);
  }, [ref, handleMoveEvent, handleMoveEndEvent]);

  // Inverse of the above
  const stopListeningToDocumentEvents = useCallback(() => {
    const doc = ref.current?.ownerDocument || document;

    doc.removeEventListener('mousemove', handleMoveEvent);
    doc.removeEventListener('mouseup', handleMoveEndEvent);
    doc.removeEventListener('onmouseleave', handleMoveEndEvent);
  }, [ref, handleMoveEvent, handleMoveEndEvent]);

  useEffect(() => {
    const { current: slider } = ref;

    slider?.addEventListener('mousedown', handleMoveStartEvent);
    startListeningToDocumentEvents();

    return () => {
      slider?.removeEventListener('mousedown', handleMoveStartEvent);
      stopListeningToDocumentEvents();
    };
  }, [startListeningToDocumentEvents, stopListeningToDocumentEvents, handleMoveStartEvent, ref]);

  useEffect(() => {
    // Remove document event listeners whenever `Slider` is disabled.
    if (disabled) {
      stopListeningToDocumentEvents();
    }
  }, [stopListeningToDocumentEvents, disabled]);

  return { coordinates, dragging };
}
