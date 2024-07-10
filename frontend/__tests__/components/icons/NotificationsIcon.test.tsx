import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import NotificationsIcon from '@/components/icons/NotificationsIcon';

describe('NotificationsIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotificationsIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});