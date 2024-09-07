import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountManagement from '../../../components/settings/AccountManagement';

// Mock the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn(),
  }),
}));

// Mock the utils
jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  cn: (...classes: string[]) => classes.join(" "),
  signOutWithToast: jest.fn(),
}));

// Mock Supabase
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
      update: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe('AccountManagement', () => {
  it('renders without crashing', () => {
    render(<AccountManagement />);
    expect(screen.getByText('Account Management')).toBeInTheDocument();
  });

  it('toggles anonymous mode', () => {
    render(<AccountManagement />);
    const toggleSwitch = screen.getByRole('switch');
    
    expect(screen.getByText('Default to Public')).toBeInTheDocument();
    
    fireEvent.click(toggleSwitch);
    
    expect(screen.getByText('Default to Anonymous')).toBeInTheDocument();
  });

  it('shows delete account dialog when button is clicked', () => {
    render(<AccountManagement />);
    const deleteButton = screen.getByText('Delete Account');
    
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Are you sure you want to delete your account?')).toBeInTheDocument();
  });

  it('calls toast when anonymous mode is toggled', () => {
    const { toast } = require("@/components/ui/use-toast").useToast();

    render(<AccountManagement />);
    const toggleSwitch = screen.getByRole('switch');
    
    fireEvent.click(toggleSwitch);
    
    expect(toast).toHaveBeenCalledWith({
      title: "Default anonymity updated",
      description: "Your default anonymity is now set to anonymous.",
    });
  });
});