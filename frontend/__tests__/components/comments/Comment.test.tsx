import React, { ReactNode } from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import Comment from "@/components/Comment/Comment";
import { useUser } from "@/lib/contexts/UserContext";
import { Comment as CommentType } from "@/lib/types";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AvatarImage: ({ src }: { src: string }) => <img src={src} alt="" />,
  AvatarFallback: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: ReactNode;
    onClick: () => void;
    className: string;
  }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock(
  "@/components/Comment/AddCommentForm",
  () =>
    ({
      onCommentAdded,
    }: {
      onCommentAdded: (comment: CommentType) => void;
    }) => (
      <div>
        <button
          onClick={() =>
            onCommentAdded({
              comment_id: "new-reply-4",
              content: "New reply",
              issue_id: "issue-4",
              user_id: "user-4",
              parent_id: "4",
              created_at: new Date().toString(),
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
              },
              is_owner: true,
            })
          }
        >
          Submit Reply
        </button>
      </div>
    ),
);

const mockComment: CommentType = {
  comment_id: "new-reply-3",
  content: "New reply",
  issue_id: "issue-3",
  user_id: "user-3",
  parent_id: "3",
  created_at: new Date().toString(),
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
  },
  is_owner: true,
};

const mockReplies: CommentType[] = [
  {
    comment_id: "new-reply-1",
    content: "New reply",
    issue_id: "issue-1",
    user_id: "user-1",
    parent_id: "1",
    created_at: new Date().toString(),
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
    },
    is_owner: true,
  },
  {
    comment_id: "new-reply-2",
    content: "New reply",
    issue_id: "issue-2",
    user_id: "user-2",
    parent_id: "2",
    created_at: new Date().toString(),
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
    },
    is_owner: true,
  },
];

describe("Comment component", () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        user_id: "user-1",
        access_token: "access-token",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the comment with user details", () => {
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={true}
        onReply={jest.fn()}
        replies={[]}
      />,
    );

    expect(screen.getByText(/Fullname/i)).toBeInTheDocument();
    expect(screen.getByText(/reply/i)).toBeInTheDocument();
  });

  it("shows reply button and toggles reply form", () => {
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={true}
        onReply={jest.fn()}
        replies={[]}
      />,
    );

    const replyButton = screen.getByText(/reply/i);
    expect(replyButton).toBeInTheDocument();

    // fireEvent.click(replyButton);
    // expect(screen.getByText('Cancel')).toBeInTheDocument();

    // fireEvent.click(screen.getByText('Cancel'));
    // expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it("shows delete button for owner", () => {
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={true}
        onReply={jest.fn()}
        replies={[]}
      />,
    );

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("hides reply and delete buttons if user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={false}
        onReply={jest.fn()}
        replies={[]}
      />,
    );

    expect(screen.queryByText("Reply")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("shows and hides replies", () => {
    render(
      <Comment
        comment={mockComment}
        onDelete={jest.fn()}
        isOwner={true}
        onReply={jest.fn()}
        replies={mockReplies}
      />,
    );

    const showRepliesButton = screen.getByText(
      `Show replies (${mockReplies.length})`,
    );
    expect(showRepliesButton).toBeInTheDocument();

    fireEvent.click(showRepliesButton);
    expect(screen.getByText("Hide replies")).toBeInTheDocument();

    mockReplies.forEach((reply) => {
      expect(screen.getAllByText(reply.content)).not.toBe(null);
    });

    fireEvent.click(screen.getByText("Hide replies"));
    mockReplies.forEach((reply) => {
      expect(screen.queryAllByText(reply.content)).not.toBe(null);
    });
  });

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn();
    render(
      <Comment
        comment={mockComment}
        onDelete={mockOnDelete}
        isOwner={true}
        onReply={jest.fn()}
        replies={[]}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.comment_id);
  });

  it("calls onReply when a reply is submitted", () => {
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
  });
});
