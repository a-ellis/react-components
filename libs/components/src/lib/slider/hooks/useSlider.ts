import { MutableRefObject, useCallback, useEffect } from 'react';
import { percentToValue, clampValueToRange, valueToPercent } from '../utils';
import { useControlledValue } from './useControlledValue';
import { Coordinates, useCoordinateTracking } from './useCoordinateTracking';

/** Represents the return value from `useSlider` hook. */
export interface UseSlider {
  /** How far from the left, as a percentage, the `Track` should be shown on the `Slider`. */
  trackingOffset: number;
  /** Represents the % width the `Track` should occupy on the `Slider`. */
  trackingScale: number;
  /** How far from the left, as a percentage, the `Handle` should be shown on the `Slider`. */
  handleOffset: number;
  /** Denotes if the `Slider`'s is currently being interacted with. */
  dragging: boolean;
  /** The current `value` of the `Slider`. */
  value: number;
}

export interface UserSliderParams {
  /** Ref for accessing DOM APIs on the `Slider`'s root element. */
  rootRef: MutableRefObject<HTMLDivElement | null>;
  /** Ref for accessing DOM APIs on the `Slider`'s handle element. */
  handleRef: MutableRefObject<HTMLButtonElement | null>;
  /** Ref for accessing DOM APIs on the `Slider`'s input element. */
  inputRef: MutableRefObject<HTMLInputElement | null>;
  /** The minimum allowed value of the `Slider`. Should not equal `max`. */
  min: number;
  /** The maximum allowed value of the `Slider`. Should not equal `min`. */
  max: number;
  /** Represents the controlled `value` prop assigned to the `Slider`. */
  value?: number;
  /** Sets a default value on the underlying input element when uncontrolled. */
  defaultValue?: number;
  /** Represents the disabled state of the `Slider`. */
  disabled?: boolean;
}

/**
 * Custom hook which provides the underlying interactivity and `value` state management for a `Slider` component.
 */
export function useSlider({
  min,
  max,
  value: valueProp,
  defaultValue,
  disabled,
  rootRef,
  handleRef,
  inputRef,
}: UserSliderParams): UseSlider {
  const [value = 0, setValue] = useControlledValue({ controlledValue: valueProp, defaultValue, inputRef });
  const { coordinates, dragging } = useCoordinateTracking({ ref: rootRef, disabled });
  const boundedValue = clampValueToRange(value, min, max);
  const trackingOffset = valueToPercent(min, min, max);
  const trackingScale = valueToPercent(boundedValue, min, max) - trackingOffset;
  const handleOffset = valueToPercent(boundedValue, min, max);

  /**
   * Calculates and sets a new `value` derived from `x` coordinate and `rootRef`'s `boundingClientRect`.
   */
  const calculateNewValue = useCallback(
    ({ x }: Coordinates) => {
      if (!rootRef.current) return;

      const { width, left } = rootRef.current.getBoundingClientRect() || {};
      const percent = (x - left) / width;
      const derivedValue = percentToValue(percent, min, max);
      const newValue = clampValueToRange(derivedValue, min, max);

      setValue(newValue);
    },
    [min, max, rootRef, setValue]
  );

  useEffect(() => {
    // Prevent calculating new values when disabled or not being interacted with.
    if (disabled || !dragging) return;

    calculateNewValue(coordinates);
  }, [coordinates, disabled, dragging, calculateNewValue]);

  useEffect(() => {
    // Clamps any changes to `value` which fall outside of the `min` or `max`.
    if (value < min || value > max) {
      const boundedValue = clampValueToRange(value, min, max);
      setValue(boundedValue);
    }
  }, [value, min, max, setValue]);

  useEffect(() => {
    if (disabled) return;

    const { current: handle } = handleRef;

    // Enables changing the `value` via keyboard events.
    const handleKeyDown = ({ code, shiftKey }: KeyboardEvent) => {
      if (handle && handle === document.activeElement) {
        // When `shift` modifier is used, step in 10% increments.
        const step = shiftKey ? Math.round(max / 10) : 1;

        if (code === 'ArrowRight' || code === 'ArrowUp') {
          setValue(value + step);
        }

        if (code === 'ArrowLeft' || code === 'ArrowDown') {
          setValue(value - step);
        }
      }
    };

    handle?.addEventListener('keydown', handleKeyDown);

    return () => {
      handle?.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRef, value, max, disabled, setValue]);

  return {
    trackingOffset,
    trackingScale,
    handleOffset,
    dragging,
    value,
  };
}

export default useSlider;
