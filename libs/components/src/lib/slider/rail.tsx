import styled from 'styled-components';

const StyledRail = styled.div`
  display: block;
  position: absolute;
  background-color: currentColor;
  border-radius: inherit;
  opacity: 0.25;
  width: 100%;
  height: inherit;
  top: 50%;
  transform: translateY(-50%);
`;

/**
 * A simple component that acts as the semi-transparent background bar spanning the full width of the `Slider`.
 */
export function Rail() {
  return <StyledRail />;
}
