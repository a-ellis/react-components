import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useSlider from './useSlider';

describe('useSlider', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useSlider());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
