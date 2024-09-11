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
  it("renders all expected tabs", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Sidebar isOpen={true} onClose={() => {}} username="" fullname="" imageUrl="" />);
    
    // Check for the presence of each expected tab
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders user information when logged in", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        fullname: "Test User",
        username: "testuser",
        image_url: "https://example.com/avatar.jpg",
      },
    });

    render(<Sidebar isOpen={true} onClose={() => {}} username="testuser" fullname="Test User" imageUrl="https://example.com/avatar.jpg" />);
    
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});