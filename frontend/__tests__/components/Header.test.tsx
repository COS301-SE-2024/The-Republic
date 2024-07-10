import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import Header from '@/components/Header/Header';
// import { useParams } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import * as NextThemes from 'next-themes';
import * as NextRouter from 'next/navigation';
import { useRouter } from 'next/router';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn(() => <img alt="" />)
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock the next-themes hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}));

// Mock the next/router hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/lib/contexts/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      user_id: "user123",
      email_address: "user@example.com",
      username: "user123",
      fullname: "User Fullname",
      image_url: "http://example.com/image.jpg",
      bio: "User biography",
      is_owner: true,
      total_issues: 10,
      resolved_issues: 5,
      access_token: "access_token_value"
    },
  })),
}));

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

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('updates logo source based on theme', () => {
    (NextThemes.useTheme as jest.Mock).mockImplementation(() => ({ theme: 'dark' }));
    const { rerender } = render(<Header />);
    (NextThemes.useTheme as jest.Mock).mockImplementation(() => ({ theme: 'light' }));
    rerender(<Header />);
  });

  it('renders HomeAvatar if user is present', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { issueId: '1' }
    });
    (useUser as jest.Mock).mockReturnValue({ user: { access_token: 'test-token' } });
    const { queryByText } = render(<Header />);
    expect(queryByText('Sign Up')).toBeNull();
  });

  it('navigates to /signup when Sign Up button is clicked', () => {
    const pushMock = jest.fn();
    (NextRouter.useRouter as jest.Mock).mockImplementation(() => ({ push: pushMock }));
    (useUser as jest.Mock).mockReturnValue({ user: null });
    const { getByText } = render(<Header />);
    const signUpButton = getByText((content, element) => 
      content === 'Sign Up' && element && element.tagName.toLowerCase() === 'button' ? true : false
    );
    fireEvent.click(signUpButton);
    expect(pushMock).toHaveBeenCalledWith('/signup');
  });
});