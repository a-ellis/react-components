import styled from 'styled-components';

const StyledPreview = styled.div`
  font-family: 'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont, 'Segoe UI',
    'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 3rem auto;
  max-width: 31.25rem;
`;

export const decorators = [
  // @ts-expect-error it actually could be any Story
  (Story) => (
    <StyledPreview>
      <Story />
    </StyledPreview>
  ),
];

export const parameters = {
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
