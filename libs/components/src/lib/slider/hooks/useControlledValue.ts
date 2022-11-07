import { useCallback, useState } from 'react';
import { clampValueToRange } from '../utils';

export interface UseControlledValueParams {
  /** Represents the controlled input `value` passed down from `Slider` props. */
  controlledValue: number | undefined;
  /** The minimum allowed value of the `Slider`. Should not equal `max`. */
  min?: number;
  /** The maximum allowed value of the `Slider`. Should not equal `min`. */
  max?: number;
  /** The default value provided to `Slider`. Used to initialize internal `valueState`. */
  defaultValue?: number;
  /** Ref to the underlying input element that holds `Slider`'s value. */
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export type UserControlledValue = [number | undefined, (newValue: number) => void];

/**
 * Custom hook that either:
 *  A - Sets and stores internal `valueState` as `value` when there's no controlled value provided.
 *  B - Programtically assigns derived controlled `value` to input via `inputRef` and dispatches `change` event.
 */
export function useControlledValue({
  controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  inputRef,
}: UseControlledValueParams): UserControlledValue {
  const isControlled = controlledValue != null;
  const [valueState, setValueState] = useState(Math.round(defaultValue));
  const value = clampValueToRange(isControlled ? Math.round(controlledValue) : valueState, min, max);

  /**
   * Used when the `value` is controlled. When called with a `newValue`, programatically assigns value
   * directly to `inputRef` and triggers `change` event so parent of `Slider` is notified of `value` change via `onChange` prop
   */
  const dispatchInputChange = useCallback(
    (newValue: number) => {
      const { current: input } = inputRef;

      if (input && !Number.isNaN(newValue)) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(input, newValue);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    [inputRef]
  );

  /**
   * Setter function that handles how the `newValue` should be set, as determined by `isControlled`.
   */
  const setValue = useCallback(
    (newValue: number) => {
      if (!isControlled) {
        setValueState(newValue);
      } else {
        dispatchInputChange(newValue);
      }
    },
    [isControlled, dispatchInputChange]
  );

  return [value, setValue];
}
