import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CommentList from "@/components/Comment/CommentList";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
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

interface MockUser {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  bio: string;
  is_owner: boolean;
  total_issues: number;
  resolved_issues: number;
  access_token: string;
}

describe("CommentList", () => {
  const mockUser: MockUser = {
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
  };

  const mockToast = {
    toast: jest.fn(),
  };

  const mockComments = [
    {
      comment_id: "1",
      issue_id: "issue1",
      content: "This is a comment",
      user: {
        user_id: "user123",
        fullname: "User Fullname",
        image_url: "http://example.com/image.jpg",
      },
      parent_id: null,
      is_owner: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the component", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true, data: mockComments }),
    });
    global.fetch = fetchMock;

    render(<CommentList issueId="issue1" />);

    await waitFor(() => {
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });
  });

  it("handles comment deletion", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue({ success: true, data: mockComments }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });
    global.fetch = fetchMock;

    render(<CommentList issueId="issue1" />);

    await waitFor(() => {
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    deleteButtons.forEach((button) => fireEvent.click(button));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Are you sure you want to delete this comment? This action cannot be undone.",
        ),
      ).toBeInTheDocument();
    });

    const secondDeleteButtons = screen.getAllByText("Delete");
    secondDeleteButtons.forEach((button) => fireEvent.click(button));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: "Comment deleted successfully",
      });
      expect(screen.queryByText("This is a comment")).not.toBeInTheDocument();
    });
  });

  it("handles comment fetching errors", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("Fetch error"));
    global.fetch = fetchMock;

    render(<CommentList issueId="issue1" />);

    await waitFor(() => {
      expect(console.error).not.toBe(null);
    });
  });

  it("handles comment deletion errors", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue({ success: true, data: mockComments }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Deletion error" }),
      });
    global.fetch = fetchMock;

    render(<CommentList issueId="issue1" />);

    await waitFor(() => {
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    deleteButtons.forEach((button) => fireEvent.click(button));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Are you sure you want to delete this comment? This action cannot be undone.",
        ),
      ).toBeInTheDocument();
    });

    const secondDeleteButtons = screen.getAllByText("Delete");
    secondDeleteButtons.forEach((button) => fireEvent.click(button));

    await waitFor(() => {
      expect(console.error).not.toBe(null);
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: "Failed to delete comment",
      });
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });
  });
});
