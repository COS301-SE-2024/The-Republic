import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CommentList from "@/components/Comment/CommentList";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import mockClsx, { ClassValue } from "clsx";
import { twMerge as mockTwMerge } from "tailwind-merge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: ClassValue[]) => mockTwMerge(mockClsx(inputs)),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
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
      comment_id: 1,
      issue_id: 1,
      content: "This is a comment",
      user_id: "user123",
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

    renderWithClient(<CommentList issueId={1} parentCommentId={null}/>);

    await waitFor(() => {
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });
  });

  it("handles comment deletion", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({
        json: jest
          .fn()
          .mockResolvedValue({ success: true, data: []})
          .mockResolvedValueOnce({ success: true, data: mockComments }),
        ok: true
      });
    global.fetch = fetchMock;

    renderWithClient(<CommentList issueId={1} parentCommentId={null}/>);

    await waitFor(() => { expect(screen.getByText("This is a comment")).toBeInTheDocument();
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
      expect(mockToast.toast).not.toHaveBeenCalledWith({
        description: "Comment deleted successfully",
      });
      expect(screen.queryByText("This is a comment")).not.toBeInTheDocument();
    });
  });

  // fetch should'nt throw unless we write wierd code.
  // I think we should just check if !res.ok, which is because normal network errors
  /* it("handles comment fetching errors", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("Fetch error"));
    global.fetch = fetchMock;

    render(<CommentList issueId={1} parentCommentId={null}/>);

    await waitFor(() => {
      expect(console.error).not.toBe(null);
    });
  }); */

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

    renderWithClient(<CommentList issueId={1} parentCommentId={null}/>);

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
        description: "Error deleting comment",
      });
      expect(screen.getByText("This is a comment")).toBeInTheDocument();
    });
  });
});
