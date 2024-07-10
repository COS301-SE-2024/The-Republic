import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import ProfileIcon from '@/components/icons/ProfileIcon';

describe('ProfileIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProfileIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});