import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import { useUser } from "@/lib/contexts/UserContext";
import Sidebar from "@/components/Sidebar/Sidebar";

// Mock the entire globals module
jest.mock("@/lib/globals", () => ({
  supabase: {
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn(),
    }),
  },
}));

// Mock the useUser hook
jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Add this import for the toBeInTheDocument matcher
import "@testing-library/jest-dom";

describe("Sidebar", () => {
  it("renders all expected tabs when user is logged in", () => {
    // Mock a logged-in user
    (useUser as jest.Mock).mockReturnValue({ 
      user: { 
        user_id: '123', 
        fullname: 'Test User', 
        username: 'testuser', 
        image_url: 'https://example.com/avatar.jpg' 
      } 
    });

    render(<Sidebar isOpen={true} onClose={() => {}} />);
    
    // Check for the presence of each expected tab
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders login tab when user is not logged in", () => {
    // Mock a logged-out user
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Sidebar isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    
    // These should not be present when logged out
    expect(screen.queryByText("Organizations")).not.toBeInTheDocument();
    expect(screen.queryByText("Leaderboard")).not.toBeInTheDocument();
  });
});