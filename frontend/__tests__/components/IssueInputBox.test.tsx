import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { useToast } from "@/components/ui/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import mockUser from "@/data/mockUser";

jest.mock("@/lib/globals");
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

const mockUseToast = useToast as jest.Mock;

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn().mockReturnValue({
    user_id: "1",
    email_address: "test@example.com",
    username: "testuser",
    fullname: "Test User",
    image_url: "https://via.placeholder.com/150",
    bio: "",
    is_owner: false,
    total_issues: 0,
    resolved_issues: 0,
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
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("IssueInputBox Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockUseToast.mockReturnValue({ toast: jest.fn() });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("renders IssueInputBox component", () => {
    renderWithClient(<IssueInputBox onAddIssue={() => {}}/>);

    expect(
      screen.getByPlaceholderText("What's going on!?"),
    ).toBeInTheDocument();
  });

  test("handles input change", () => {
    renderWithClient(<IssueInputBox onAddIssue={() => {}}/>);

    const textarea = screen.getByPlaceholderText("What's going on!?");
    fireEvent.change(textarea, { target: { value: "New Issue Content" } });
    expect(textarea).toHaveValue("New Issue Content");
  });

  test("handles category and mood selection", () => {
    renderWithClient(<IssueInputBox onAddIssue={() => {}}/>);

    fireEvent.change(screen.getByText("Select category...").closest("button")!, {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByText("Mood").closest("button")!, {
      target: { value: "Happy" }
    });
    expect(screen.getByText("Select category...").closest("button")!).toHaveValue("1");
    expect(screen.getByText("Mood").closest("button")!).toHaveValue("Happy");
  });

  test("handles issue submission", async () => {
    renderWithClient(<IssueInputBox onAddIssue={() => {}}/>);

    fireEvent.change(screen.getByPlaceholderText("What's going on!?"), {
      target: { value: "New Issue Content" },
    });
    fireEvent.change(screen.getByText("Select category...").closest("button")!, {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByText("Mood").closest("button")!, { target: { value: "Happy" } });

    fireEvent.click(screen.getByText("Post"));
    await new Promise((r) => setTimeout(r, 1000));

    expect(mockUseToast().toast).not.toBe(null);
  });
});
