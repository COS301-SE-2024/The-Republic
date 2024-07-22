import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import AddCommentForm from "@/components/Comment/AddCommentForm";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

jest.mock("react-textarea-autosize", () => ({
  __esModule: true,
  default: jest.fn(
    (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
      <textarea {...props} />
    ),
  ),
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

describe("AddCommentForm", () => {
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

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue(mockToast);
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    renderWithClient(<AddCommentForm issueId="1" onCommentAdded={jest.fn()} />);
    expect(screen.getByPlaceholderText("Add Comment...")).toBeInTheDocument();
  });

  it("submits a comment", async () => {
    const onCommentAdded = jest.fn();
    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: { content: "This is a comment" },
      }),
    });
    global.fetch = fetchMock;

    renderWithClient(<AddCommentForm issueId="1" onCommentAdded={onCommentAdded} />);
    const button = screen.getByText("Send");
    fireEvent.click(button);
  });

  it("checks anonymous posting", () => {
    renderWithClient(<AddCommentForm issueId="1" onCommentAdded={jest.fn()} />);

    const checkbox = screen.getByLabelText("Post anonymously");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
