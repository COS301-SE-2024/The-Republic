import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from '@/components/SearchBar/SearchBar';

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

describe('SearchBar', () => {
  it('renders without crashing', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'search query' } });
  });

  it('handles search submission', () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'search query' } });
    fireEvent.click(screen.getByText('Search'));
  });
});
