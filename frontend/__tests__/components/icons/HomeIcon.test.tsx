import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import HomeIcon from '@/components/icons/HomeIcon';

describe('HomeIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<HomeIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});