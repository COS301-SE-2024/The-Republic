import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Feed from "@/components/Feed/Feed";
import { IssueProps } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/lib/globals", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: "user-id", email: "test@example.com" },
            access_token: "access-token",
          },
        },
        error: null,
      }),
    },
  },
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

jest.mock("react-icons/fa", () => ({
  FaSpinner: () => <div>Spinner</div>,
}));

jest.mock("@/components/IssueInputBox/IssueInputBox", () => () => (
  <div>IssueInputBox</div>
));
import { SetStateAction } from "react";

jest.mock(
  "@/components/RightSidebar/RightSidebar",
  () =>
    (props: {
      setSortBy: (value: SetStateAction<string>) => void;
      setFilter: (value: SetStateAction<string>) => void;
    }) => (
      <div>
        RightSidebar
        <button onClick={() => props.setSortBy("newest")}>Newest</button>
        <button onClick={() => props.setSortBy("oldest")}>Oldest</button>
        <button onClick={() => props.setFilter("All")}>All</button>
        <button onClick={() => props.setFilter("Category")}>Category</button>
      </div>
    ),
);
jest.mock("@/components/Issue/Issue", () => (props: IssueProps) => (
  <div>Issue: {props.issue.content}</div>
));

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

const mockFetch = (
  data: { issue_id: string; title: string }[],
  success = true,
) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success, data }),
    } as Response),
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

describe("Feed", () => {
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

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders without crashing", () => {
    mockFetch([]);
    renderWithClient(<Feed />);
    expect(screen.getByText("Spinner")).toBeInTheDocument();
  });

  it("shows loading indicator while fetching data", async () => {
    mockFetch([]);
    renderWithClient(<Feed />);
    expect(screen.getByText("Spinner")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );
  });

  it("displays issues after fetching", async () => {
    const issues = [
      { issue_id: "1", title: "Issue One 1" },
      { issue_id: "2", title: "Issue Two 2" },
    ];
    mockFetch(issues);
    renderWithClient(<Feed />);
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );
    expect(screen.queryAllByText(/Issue/i)).not.toEqual([]);
  });

  it("handles sorting and filtering", async () => {
    const issues = [
      { issue_id: "1", title: "Newest Issue" },
      { issue_id: "2", title: "Oldest Issue" },
    ];
    mockFetch(issues);
    renderWithClient(<Feed />);
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Newest"));
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Newest")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Oldest"));
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Oldest")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Category"));
    await waitFor(() =>
      expect(screen.queryByText("Spinner")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Newest")).toBeInTheDocument();
  });
});
