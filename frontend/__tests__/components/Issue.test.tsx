import React from "react";
import { describe, expect, jest, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Issue from "@/components/Issue/Issue";
import { useUser } from "@/lib/contexts/UserContext";
import { useRouter } from "next/navigation";

jest.mock('@/lib/globals', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      update: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-anon-key';

jest.mock("@/lib/contexts/UserContext");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}));

const mockUseUser = useUser as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();

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
  image_url: "https://example.com/image.jpg",
  resolved_at: null,
  comment_count: 5,
  reactions: [],
  user_reaction: null,
  is_anonymous: false,
};

describe("Issue Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: { user_id: "1", access_token: "token" },
    });
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  test("renders Issue component with all elements", () => {
    render(<Issue issue={mockIssue} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
    expect(screen.getByText("Suburb, City, Province")).toBeInTheDocument();
    expect(screen.getByText("Issue content")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
    expect(screen.getByAltText("Issue")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("avatar is clickable for non-anonymous user", () => {
    render(<Issue issue={mockIssue} />);
    const avatar = screen.getByText("J");
    expect(avatar.closest('div')).toHaveStyle('cursor: pointer');
  });

  test("avatar is not clickable for anonymous user", () => {
    const anonymousIssue = { ...mockIssue, is_anonymous: true };
    render(<Issue issue={anonymousIssue} />);
    const avatar = screen.getByText("J");
    expect(avatar.closest('div')).toHaveStyle('cursor: default');
  });

  test("navigates to profile page on avatar click for non-anonymous user", () => {
    render(<Issue issue={mockIssue} />);
    const avatar = screen.getByText("J");
    fireEvent.click(avatar);
    expect(mockPush).toHaveBeenCalledWith(`/profile/${mockIssue.user.user_id}`);
  });

  test("handles comment click", () => {
    render(<Issue issue={mockIssue} />);
    fireEvent.click(screen.getByText("5"));
    expect(mockPush).toHaveBeenCalledWith("/issues/1");
  });

  test("renders resolved badge when issue is resolved", () => {
    const resolvedIssue = { ...mockIssue, resolved_at: new Date().toISOString() };
    render(<Issue issue={resolvedIssue} />);
    expect(screen.getByText(/Resolved/)).toBeInTheDocument();
  });

  test("shows more menu for issue owner", () => {
    render(<Issue issue={mockIssue} />);
    expect(screen.getByTitle("More Options")).toBeInTheDocument();
  });

  test("does not show more menu for non-owner", () => {
    mockUseUser.mockReturnValue({
      user: { user_id: "2", access_token: "token" },
    });
    render(<Issue issue={mockIssue} />);
    expect(screen.queryByTitle("More Options")).not.toBeInTheDocument();
  });

  test("handles subscribe button click", () => {
    render(<Issue issue={mockIssue} />);
    fireEvent.click(screen.getByTitle("Subscribe"));
    expect(screen.getByText("Subscribe to Issue")).toBeInTheDocument();
    expect(screen.getByText("Subscribe to Category")).toBeInTheDocument();
    expect(screen.getByText("Subscribe to Location")).toBeInTheDocument();
  });
});