import React, { useRef } from 'react';
import styled from 'styled-components';
import { Handle } from './handle';
import { useSlider } from './hooks';
import { Rail } from './rail';
import { Track } from './track';

interface RootProps {
  /** Used to set base `color` of root element, which is inherited by child elements. */
  color?: string;
  /** When `true`, applies disabled-type styling to the root element's `color` and `cursor` style rules. */
  disabled?: boolean;
  /** Denotes if the `Slider` is using a `valueLabel`. When `true`, adds additional margin-top to accommodate for tooltip element. */
  hasValueLabel?: boolean;
}

/**
 * The root container for the `Slider`.
 */
const StyledRoot = styled.div.attrs<RootProps>(({ disabled, color }) => ({
  style: {
    color: disabled ? 'gray' : color,
  },
}))<RootProps>`
  display: inline-block;
  position: relative;
  border-radius: 1rem;
  width: 100%;
  height: 0.25rem;
  padding: 0.75rem 0;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  margin-top: ${(props) => (props.hasValueLabel ? '2rem' : '0.625rem')};
  margin-bottom: 0.625rem;
  margin-left: 0.563rem;
  margin-right: 0.563rem;
`;

/**
 * Hidden input element which drives the `Slider`'s input-like behavior and form integration.
 */
const HiddenInput = styled.input`
  visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  margin: 0;
  border: none;
  box-sizing: border-box;
`;

/**
 * `SliderProps` extends `React.InputHTMLAttributes<HTMLInputElement>` as all additional
 * of this type are spread onto the underlying hidden input element.
 */
export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Sets the minimum allowed value of the Slider, rounded to the nearest integer. Should not equal `max`. */
  min?: number;
  /** Sets the maximum allowed value of the Slider, rounded to the nearest integer. Should not be equal to `min`.  */
  max?: number;
  /** The value of the Slider, rounded to the nearest integer. Setting this prop makes the Slider controlled. */
  value?: number;
  /** Sets the default value of the Slider when uncontrolled. */
  defaultValue?: number;
  /** Determines when to show the value label tooltip: `on` for always, `auto` for when interacting with the Slider, and `off` to hide completely. */
  valueLabel?: 'on' | 'auto' | 'off';
  /** Sets the base color of the Slider, which is inherited in child components.  */
  color?: string;
  /** Sets the `disabled` state of relevant HTML elements within the Slider and prevents interactivity that would update `value`. */
  disabled?: boolean;
  /** Callback function invoked when the Slider's `value` changes. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A customizable slider element that acts as a stand-in for an HTML `input` of `type="range"`.
 */
export function Slider({
  min = 0,
  max = 100,
  value: valueProp,
  defaultValue,
  disabled,
  valueLabel = 'off',
  onChange,
  color = '#2b9fe2',
  tabIndex,
  autoFocus,
  ...inputProps
}: SliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  const hasValueLabel = valueLabel !== 'off';

  const { trackingOffset, trackingScale, handleOffset, dragging, value } = useSlider({
    min: roundedMin,
    max: roundedMax,
    disabled,
    rootRef,
    handleRef,
    inputRef,
    value: valueProp,
    defaultValue,
  });

  return (
    <StyledRoot ref={rootRef} disabled={disabled} color={color} hasValueLabel={hasValueLabel}>
      <Rail />
      <Track offset={trackingOffset} scale={trackingScale} isAnimated={!dragging} />

      <Handle
        ref={handleRef}
        offset={handleOffset}
        dragging={dragging}
        valueLabel={valueLabel}
        value={value}
        disabled={disabled}
        tabIndex={tabIndex}
        autoFocus={autoFocus}
      >
        <HiddenInput
          {...inputProps}
          ref={inputRef}
          type="range"
          min={roundedMin}
          max={roundedMax}
          value={value}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={onChange || (() => {})}
        />
      </Handle>
    </StyledRoot>
  );
}

export default Slider;
