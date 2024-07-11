import { describe, expect } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import LocationAutocomplete from '@/components/LocationAutocomplete/LocationAutocomplete';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({ user: { id: 'user-id' }, session: 'session-token', error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe('LocationAutocomplete', () => {
  it('renders without crashing', () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  });

  it('handles location selection', () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  });
});
