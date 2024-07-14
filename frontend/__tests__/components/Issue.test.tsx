import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Issue from "@/components/Issue/Issue";
import { useUser } from "@/lib/contexts/UserContext";
import { useRouter } from "next/navigation";

jest.mock("@/lib/contexts/UserContext");

jest.mock("next/navigation", () => ({
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
  }),
}));

const mockUseUser = useUser as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

const mockIssue = {
  issue_id: "1",
  user_id: "1",
  user: {
    user_id: "1",
    fullname: "John Doe",
    image_url: "https://via.placeholder.com/150",
    username: "johndoe",
  },
  created_at: new Date().toISOString(),
  category: { name: "Bug" },
  sentiment: "Neutral",
  location: {
    suburb: "Suburb",
    city: "City",
    province: "Province",
  },
  content: "Issue content",
  image_url: "",
  resolved_at: null,
  comment_count: 0,
  reactions: [],
  user_reaction: null,
  is_anonymous: false,
};

describe("Issue Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockUseUser.mockReturnValue({
      user: { user_id: "1", access_token: "token" },
    });
    mockUseRouter.mockReturnValue({ push: jest.fn() });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("renders Issue component", () => {
    render(<Issue issue={mockIssue} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
    expect(screen.getByText("Suburb, City, Province")).toBeInTheDocument();
    expect(screen.getByText("Issue content")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
  });

  test("handles avatar click", () => {
    const { getByText } = render(<Issue issue={mockIssue} />);
    fireEvent.click(getByText("John Doe"));
  });
});
