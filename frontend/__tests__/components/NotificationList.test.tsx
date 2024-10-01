import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsList from '../../components/Notifications/NotificationsList';
import { useUser } from "@/lib/contexts/UserContext";
import { subscribe } from "@/lib/api/subscription";
import { ThemeProvider } from 'next-themes';

// Mock the modules
jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/lib/api/subscription", () => ({
  subscribe: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  })),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'example-anon-key';

const mockUseUser = useUser as jest.Mock;
const mockSubscribe = subscribe as jest.Mock;

describe('NotificationsList Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    mockUseUser.mockReturnValue({ user: { user_id: 'test-user' } });
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationsList />
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

//   it('displays loading indicator when fetching data', async () => {
//     mockSubscribe.mockReturnValue(new Promise(() => {})); // Never resolves
//     renderComponent();

//     expect(await screen.findByRole('status')).toBeInTheDocument();
//   });

  it('displays error message when no notifications are available', async () => {
    mockSubscribe.mockResolvedValue(null);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No Notifications')).toBeInTheDocument();
      expect(screen.getByText('You currently have no notifications. Once you receive notifications, they will appear here')).toBeInTheDocument();
    });
  });

  it('renders notifications correctly', async () => {
    const mockNotifications = [
      { type: 'reaction', content: 'reacted', issue_id: '123', created_at: new Date().toISOString() },
      { type: 'comment', content: 'New comment', issue_id: '456', created_at: new Date().toISOString() },
      { type: 'points', content: 'You earned 10 points', created_at: new Date().toISOString() },
      { type: 'resolution', content: 'Issue resolved', issue_id: '789', created_at: new Date().toISOString() },
      { type: 'issue', content: 'New issue reported', issue_id: '101', created_at: new Date().toISOString() },
    ];

    mockSubscribe.mockResolvedValue(mockNotifications);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Someone reacted to an Issue you are involved in.')).toBeInTheDocument();
      expect(screen.getByText('New comment on an issue you\'re following: "New comment"')).toBeInTheDocument();
      expect(screen.getByText('You earned 10 points')).toBeInTheDocument();
      expect(screen.getByText('New resolution logged: Issue resolved')).toBeInTheDocument();
      expect(screen.getByText('New issue reported: New issue reported')).toBeInTheDocument();
    });
  });

  it('handles suspension message for external resolution rejection', async () => {
    const mockNotifications = [
      { type: 'points', content: 'Your external resolution rejected', created_at: new Date().toISOString() },
    ];

    mockSubscribe.mockResolvedValue(mockNotifications);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Your external resolution rejected/)).toBeInTheDocument();
      expect(screen.getByText(/You will be suspended from resolving until/)).toBeInTheDocument();
    });
  });

//   it('renders correct icons for different notification types', async () => {
//     const mockNotifications = [
//       { type: 'reaction', content: 'reacted', issue_id: '123', created_at: new Date().toISOString() },
//       { type: 'comment', content: 'New comment', issue_id: '456', created_at: new Date().toISOString() },
//       { type: 'resolution', content: 'Issue resolved', issue_id: '789', created_at: new Date().toISOString() },
//       { type: 'issue', content: 'New issue', issue_id: '101', created_at: new Date().toISOString() },
//       { type: 'points', content: 'You earned 10 points', created_at: new Date().toISOString() },
//     ];

//     mockSubscribe.mockResolvedValue(mockNotifications);
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(5);
//     });
//   });

  it('renders correct links for different notification types', async () => {
    const mockNotifications = [
      { type: 'reaction', content: 'reacted', issue_id: '123', created_at: new Date().toISOString() },
      { type: 'comment', content: 'New comment', issue_id: '456', created_at: new Date().toISOString() },
      { type: 'resolution', content: 'Issue resolved', issue_id: '789', created_at: new Date().toISOString() },
      { type: 'issue', content: 'New issue', issue_id: '101', created_at: new Date().toISOString() },
      { type: 'points', content: 'You earned 10 points', created_at: new Date().toISOString() },
    ];

    mockSubscribe.mockResolvedValue(mockNotifications);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Someone reacted to an Issue you are involved in.').closest('a')).toHaveAttribute('href', '/issues/123');
      expect(screen.getByText('New comment on an issue you\'re following: "New comment"').closest('a')).toHaveAttribute('href', '/issues/456');
      expect(screen.getByText('New resolution logged: Issue resolved').closest('a')).toHaveAttribute('href', '/issues/789');
      expect(screen.getByText('New issue reported: New issue').closest('a')).toHaveAttribute('href', '/issues/101');
      expect(screen.getByText('You earned 10 points').closest('a')).toHaveAttribute('href', '/leaderboard');
    });
  });
});