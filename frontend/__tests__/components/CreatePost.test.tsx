import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import CreatePost from "@/components/CreatePost/CreatePost";
import { useUser } from "@/lib/contexts/UserContext";
import { useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const mockOrganization = {
  name: "Test Organization",
  profile_photo: "http://example.com/org-image.jpg",
};

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
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

  it("renders CreatePost component", () => {
    const { getByPlaceholderText, getByText } = renderWithClient(<CreatePost organization={mockOrganization} />);
    expect(getByPlaceholderText("What's new with the organization?")).toBeInTheDocument();
    expect(getByText("Post")).toBeInTheDocument();
  });

  it("enables Post button when text is entered", () => {
    const { getByPlaceholderText, getByText } = renderWithClient(<CreatePost organization={mockOrganization} />);
    const textarea = getByPlaceholderText("What's new with the organization?");
    fireEvent.change(textarea, { target: { value: "New post content" } });
    expect(getByText("Post")).not.toBeDisabled();
  });
});