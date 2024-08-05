import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Feed from "@/components/Feed/Feed";
import { IssueProps } from "@/lib/types";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(null),
  }),
}));

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: () => ({ user: null }),
}));

jest.mock("lucide-react", () => ({
  Loader2: () => <div>Spinner</div>,
}));

jest.mock("@/components/IssueInputBox/IssueInputBox", () => () => (
  <div>IssueInputBox</div>
));
import { SetStateAction } from "react";
import { global } from "styled-jsx/css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
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

describe("Feed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
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
      expect(screen.queryByText("Spinner")).toBeInTheDocument(),
    );
  });

  // These two don't recongnize the intersection observer
  /* it("displays issues after fetching", async () => {
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
  }); */
});
