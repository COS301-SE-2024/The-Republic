import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfile from '@/components/EditProfile/EditProfile';
import { User } from '@/lib/types';

// Mock dependencies
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('@/lib/globals', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id' },
            access_token: 'test-access-token',
          },
        },
      }),
    },
  },
}));

jest.mock('@/lib/utils', () => ({
  checkImageFileAndToast: jest.fn().mockResolvedValue(true),
  cn: (...args: any[]) => args.join(' '),
}));

describe('EditProfile', () => {
  const mockUser: User = {
    user_id: 'test-user-id',
    fullname: 'Test User',
    username: 'testuser',
    bio: 'Test bio',
    image_url: 'https://example.com/test.jpg',
  };

  const mockOnUpdate = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockUser }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue(mockUser.fullname);
    expect(screen.getByLabelText(/Username/i)).toHaveValue(mockUser.username);
    expect(screen.getByLabelText(/Bio/i)).toHaveValue(mockUser.bio);
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'New Name' } });
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('New Name');
  });

  it('handles image upload', () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Upload Image/i), { target: { files: [file] } });
    
    expect(screen.getByText(/Remove/i)).toBeInTheDocument();
  });

  it('handles save', async () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/test-user-id'),
        expect.any(Object)
      );
      expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
    });
  });

  it('handles cancel', () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('handles image removal', () => {
    render(<EditProfile user={mockUser} onUpdate={mockOnUpdate} onCancel={mockOnCancel} />);
    
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Upload Image/i), { target: { files: [file] } });
    
    fireEvent.click(screen.getByText(/Remove/i));
    expect(screen.queryByText(/Remove/i)).not.toBeInTheDocument();
  });
});