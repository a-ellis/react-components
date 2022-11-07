import { ForwardedRef, forwardRef, ReactNode, useState } from 'react';
import styled from 'styled-components';

/**
 * This element is used to show the current `value` as a tooltip above the `Handle`.
 */
const StyledTooltip = styled.div.attrs<HandleProps & { isFocused?: boolean; isHovered?: boolean }>(
  ({ valueLabel, dragging, isFocused, isHovered }) => {
    let scale = 0;

    if (valueLabel === 'on') {
      scale = 1;
    } else if (valueLabel === 'auto') {
      scale = dragging || isFocused || isHovered ? 1 : 0;
    }

    return {
      style: {
        transform: `translateX(-50%) translateY(-30%) scale(${scale})`,
      },
    };
  }
)<HandleProps & { isFocused?: boolean; isHovered?: boolean }>`
  display: block;
  position: absolute;
  user-select: none;
  bottom: 100%;
  left: 50%;
  padding: 0.25rem 0.5rem;
  min-width: 1.25rem;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 0.25rem;
  backface-visibility: hidden;
  will-change: transform;
  transition: all 100ms ease;
  color: white;
  text-align: center;

  &:after {
    position: absolute;
    content: '';
    display: block;
    width: 0;
    height: 0;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 7px solid rgba(0, 0, 0, 0.75);
  }
`;

/**
 * HTML Button used as the base element for the `Handle` as it provides many
 * features needed for acting as the interactable element of the `Slider`.
 */
const StyledHandle = styled.button.attrs<HandleProps>(({ offset, dragging }) => ({
  style: {
    left: `${offset}%`,
    transition: dragging ? 'none' : 'left 100ms',
  },
}))<HandleProps>`
  display: block;
  position: absolute;
  color: currentColor;
  background-color: currentColor;
  border: none;
  border-radius: 50%;
  height: 1.125rem;
  width: 1.125rem;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  transition: all 100ms ease;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 20%);

  &:before {
    display: block;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: currentColor;
    opacity: 0;
    transform: scale(0);
    transform-origin: center;
    will-change: transform;
    transition: all 200ms ease;
  }

  &:not(:disabled) {
    cursor: pointer;

    &:hover,
    &:focus,
    &:active {
      outline: none;

      :before {
        opacity: 0.25;
        transform: ${(props) => (props.dragging ? 'scale(2.5)' : 'scale(2)')};
      }
    }
  }
`;

export interface HandleProps {
  /** Represents how far from the left side of the `Slider` the `Handle` should be placed. */
  offset: number;
  /** Derived from `MouseEvent`s, when `true`, represents that the `Handle` is currently being moved.  */
  dragging?: boolean;
  /** The current `value` of the `Slider`. */
  value?: number;
  /** Represents the `disabled` state of the `Slider`. When `true`, prevents CSS style rules that express interactvity. */
  disabled?: boolean;
  /** Determines when to show the value label tooltip: `on` for always, `auto` for when interacting with the Slider, and `off` to hide completely. */
  valueLabel?: 'on' | 'off' | 'auto';
  /** Allows for specifying the `tabIndex` of the underlying `button` element. */
  tabIndex?: number;
  /** Sets HTML `autofocus` attribute on underlying `button`. When `true`, the `Slider`'s handle will be immediately focused. */
  autoFocus?: boolean;
}

/**
 * Component that acts as the interactable handle of the `Slider`.
 */
export const Handle = forwardRef(
  (
    { children, value, tabIndex, ...restProps }: HandleProps & { children?: ReactNode },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>();
    const [isHovered, setIsHovered] = useState<boolean>();
    const renderTooltip = restProps.valueLabel !== 'off';

    return (
      <StyledHandle
        {...restProps}
        ref={ref}
        type="button"
        tabIndex={tabIndex}
        onClick={(e) => e.preventDefault()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderTooltip && (
          <StyledTooltip {...restProps} isFocused={isFocused} isHovered={isHovered}>
            {value}
          </StyledTooltip>
        )}
        {children}
      </StyledHandle>
    );
  }
);
