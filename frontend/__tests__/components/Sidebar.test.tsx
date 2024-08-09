import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { useUser } from "@/lib/contexts/UserContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation(() => ({
        unsubscribe: jest.fn(),
      })),
    }),
  }),
}));

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });
  

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders correctly for logged-in users", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        user_id: "1",
        email_address: "user@example.com",
        username: "user1",
        fullname: "User One",
        image_url: "http://example.com/avatar.jpg",
        bio: "This is a bio",
        is_owner: true,
        total_issues: 5,
        resolved_issues: 3,
        access_token: "access_token_example",
      },
    });

    render(<Sidebar />);
    expect(screen.getByText("User One")).toBeInTheDocument();
  });

  it("renders correctly for guests", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Sidebar />);
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
