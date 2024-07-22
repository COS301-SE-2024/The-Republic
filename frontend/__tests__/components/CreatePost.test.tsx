import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import CreatePost from "@/components/CreatePost/CreatePost";
import { useUser } from "@/lib/contexts/UserContext";
import { useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  }),
}));

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe("CreatePost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({
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
        access_token: "access_token_value",
      },
    });
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders CreatePost button", () => {
    const { getByText } = renderWithClient(<CreatePost />);
    expect(getByText("Create a post")).toBeInTheDocument();
  });

  it("opens the dialog on button click", () => {
    const { getByText, getByRole } = renderWithClient(<CreatePost />);
    fireEvent.click(getByText("Create a post"));
    expect(getByRole("dialog")).toBeInTheDocument();
  });
});
