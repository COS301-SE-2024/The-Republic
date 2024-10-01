import React from 'react';
import { describe, expect } from "@jest/globals";
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterModal from '@/components/FilterModal/FilterModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({
        user: { id: "user-id" },
        session: "session-token",
        error: null,
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

jest.mock('@/lib/contexts/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: { id: '1', name: 'Test User' },
  })),
}));

jest.mock('@/lib/api/dotVisualization', () => ({
  dotVisualization: jest.fn(() => Promise.resolve([
    { location_id: 1, suburb: 'Test Suburb', city: 'Test City', province: 'Test Province' },
  ])),
}));

describe('FilterModal', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const defaultProps = {
    sortBy: '',
    setSortBy: jest.fn(),
    filter: '',
    setFilter: jest.fn(),
    location: null,
    setLocation: jest.fn(),
    onClose: jest.fn(),
  };

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders correctly', () => {
    renderWithQueryClient(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });





  it('calls onClose when Apply Filters button is clicked', () => {
    renderWithQueryClient(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Apply Filters'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders location dropdown', async () => {
    renderWithQueryClient(<FilterModal {...defaultProps} />);
    expect(await screen.findByText('All Locations')).toBeInTheDocument();
  });


});