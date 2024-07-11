import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileHeader from '@/components/ProfileHeader/ProfileHeader';
import { User } from '@/lib/types';

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

const user: User = {
  user_id: '1',
  email_address: 'user@example.com',
  username: 'user1',
  fullname: 'User One',
  image_url: 'http://example.com/avatar.jpg',
  bio: 'This is a bio',
  is_owner: true,
  total_issues: 5,
  resolved_issues: 3,
};

describe('ProfileHeader', () => {
  it('renders profile header correctly', () => {
    render(<ProfileHeader user={user} isOwner={true} handleUpdate={() => {}} handleCancel={() => {}} isEditing={false} setIsEditing={() => {}} />);
    
    expect(screen.getByText(/User One/)).toBeInTheDocument();
    expect(screen.getByText(/user1/)).toBeInTheDocument();
    expect(screen.getByText(/This is a bio/)).toBeInTheDocument();
  });

  it('handles edit button click correctly', () => {
    const setIsEditing = jest.fn();
    render(<ProfileHeader user={user} isOwner={true} handleUpdate={() => {}} handleCancel={() => {}} isEditing={false} setIsEditing={setIsEditing} />);
    
    fireEvent.click(screen.getByText(/Edit Profile/));
    expect(setIsEditing).toHaveBeenCalledWith(true);
  });
});
