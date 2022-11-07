import styled from 'styled-components';

const StyledTrack = styled.div.attrs<TrackProps>(({ offset, scale, isAnimated = false }) => ({
  style: {
    left: `${offset}%`,
    width: `${scale}%`,
    transition: isAnimated ? 'left, width 100ms' : 'none',
  },
}))<TrackProps>`
  display: block;
  position: absolute;
  border-radius: inherit;
  border: 1px solid currentColor;
  border-radius: inherit;
  background-color: currentColor;
  height: inherit;
  top: 50%;
  transform: translateY(-50%);
  will-change: left, width;
`;

export interface TrackProps {
  /** Used to determine how far from the left of the `Slider` the `Track` should begin. */
  offset: number;
  /** Represents the % width of the total `Slider`'s width the `Track` should occupy. */
  scale: number;
  /** Allows CSS transitions to be overriden, e.g. while dragging the `Slider`'s `Handle`. */
  isAnimated?: boolean;
}

/**
 * Component that acts as the visible "fill" indicator for the `Slider`'s `Rail`.
 */
export function Track(props: TrackProps) {
  return <StyledTrack {...props} />;
}
