import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddCommentForm from '@/components/Comment/AddCommentForm';

// Mock Supabase client
jest.mock('@/lib/globals', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

// Mock dependencies
jest.mock('@/lib/contexts/UserContext', () => ({
  useUser: () => ({
    user: { access_token: 'mock-token', image_url: 'mock-url', fullname: 'Mock User' },
  }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('AddCommentForm', () => {
  const mockOnCommentAdded = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          Classification: {
            Category1: { Score: 0.1 },
            Category2: { Score: 0.1 },
            Category3: { Score: 0.1 },
          },
        }),
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({ success: true, data: { content: 'Test comment' } }),
      }));
    
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://mockbackend.com';
    process.env.NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY = 'mock-key';
    process.env.NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL = 'http://mockcontent.com';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'example-anon-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AddCommentForm issueId="123" onCommentAdded={mockOnCommentAdded} />
    );

    expect(getByPlaceholderText('Add Comment...')).toBeInTheDocument();
    expect(getByText('Post anonymously')).toBeInTheDocument();
    expect(getByText('Send')).toBeInTheDocument();
  });

  it('submits a comment successfully', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AddCommentForm issueId="123" onCommentAdded={mockOnCommentAdded} />
    );

    fireEvent.change(getByPlaceholderText('Add Comment...'), { target: { value: 'Test comment' } });
    fireEvent.click(getByText('Send'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(mockOnCommentAdded).toHaveBeenCalledWith({ content: 'Test comment' });
    });
  });
});