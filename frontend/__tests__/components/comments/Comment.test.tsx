import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Comment from "@/components/Comment/Comment";
import { useUser } from "@/lib/contexts/UserContext";
import { Comment as CommentType, User } from "@/lib/types";
import mockClsx, { ClassValue } from "clsx";
import { twMerge as mockTwMerge } from "tailwind-merge";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: ClassValue[]) => mockTwMerge(mockClsx(inputs)),
}));

const mockCurrentUser: User = {
  user_id: "user-id",
  email_address: "user@example.com",
  username: "user123",
  fullname: "User Fullname",
  image_url: "http://example.com/image.jpg",
  bio: "User biography",
  total_issues: 10,
  resolved_issues: 5,
  access_token: "abc"
};

const mockComment: CommentType = {
  comment_id: 1,
  content: "New comment",
  issue_id: 3,
  user_id: "user-id",
  parent_id: null,
  created_at: new Date().toString(),
  user: mockCurrentUser,
  is_owner: true,
};

const mockReplies: CommentType[] = [
  {
    comment_id: 1,
    content: "New reply",
    issue_id: 1,
    user_id: "user-1",
    parent_id: 1,
    created_at: new Date().toString(),
    user: {
      user_id: "user-1",
      email_address: "user@example.com",
      username: "user123",
      fullname: "User Fullname",
      image_url: "http://example.com/image.jpg",
      bio: "User biography",
      total_issues: 10,
      resolved_issues: 5,
      access_token: "abc"
    },
    is_owner: false,
  },
];

const fetchMock = jest
  .fn()
  .mockResolvedValue({
    json: jest
    .fn()
    .mockResolvedValue({ success: true, data: [] })
    .mockResolvedValueOnce({ success: true, data: mockReplies}),
    ok: true
  });

global.fetch = fetchMock;

describe("Comment component", () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockCurrentUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the comment with user details", () => {
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={() => {}}
      />,
    );

    expect(screen.getByText(/Fullname/i)).toBeInTheDocument();
    expect(screen.getByText(/reply/i)).toBeInTheDocument();
  });

  it("shows reply button and toggles reply form", () => {
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={() => {}}
      />,
    );

    const replyButton = screen.getByText(/reply/i);
    expect(replyButton).toBeInTheDocument();

    fireEvent.click(replyButton);
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it("shows delete button for owner", async () => {
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={() => {}}
      />,
    );

    await waitFor(() => expect(screen.getByText("New comment")).not.toBeNull());

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("hides reply and delete buttons if user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={() => {}}
      />,
    );

    expect(screen.queryByText("Reply")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("shows and hides replies", async () => {
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={() => {}}
      />,
    );

    await waitFor(() => expect(screen.getByText("New comment")).not.toBeNull());

    const showRepliesButton = screen.getByText(
      `Show replies`,
    );
    expect(showRepliesButton).toBeInTheDocument();

    fireEvent.click(showRepliesButton);
    expect(screen.getByText("Hide replies")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("New reply")).not.toBeNull());

    fireEvent.click(screen.getByText("Hide replies"));
    expect(screen.queryByText("New reply")).toBe(null);
  });

  // This need debugging
  /* it("calls onDelete when delete button is clicked", async () => {
    const mockOnDelete = jest.fn();
    render(
      <Comment
        comment={mockComment}
        onCommentDeleted={mockOnDelete}
      />,
    );

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

    expect(mockOnDelete).toHaveBeenCalledWith(mockComment);
  }); */

  // This should be moved to OnAddComment now
  /* it("calls onReply when a reply is submitted", () => {
    const mockOnReply = jest.fn();
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={true}
        onReply={mockOnReply}
        replies={[]}
      />,
    );

    fireEvent.click(screen.getByText(/eply/i));
    fireEvent.click(screen.getByText(/New reply/i));
  }); */
});
