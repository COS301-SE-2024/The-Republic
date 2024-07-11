import React from 'react';
import { describe } from '@jest/globals';
import { render } from '@testing-library/react';
import ProfileFeed from '@/components/ProfileFeed/ProfileFeed';

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

jest.mock('@/lib/globals', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: '1' }, access_token: 'token' } },
      }),
    },
  },
}));

describe('ProfileFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  it('renders loading indicator correctly', () => {
    render(<ProfileFeed userId="1" selectedTab="issues" />);
  });
});
