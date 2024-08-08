import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import Feed from "@/components/Feed/Feed";
import { IssueProps } from "@/lib/types";

// Mock the necessary dependencies
jest.mock('@/lib/globals', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
}));

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

jest.mock("@/components/RightSidebar/RightSidebar", () => () => (
  <div>RightSidebar</div>
));

jest.mock("@/components/Issue/Issue", () => (props: IssueProps) => (
  <div>Issue: {props.issue.content}</div>
));

jest.mock("@/components/LazyList/LazyList", () => ({
  LazyList: ({ Item, Empty }) => (
    <>
      <Empty />
      <Item data={{ issue_id: "1", title: "Mocked Issue" }} />
    </>
  ),
  LazyListRef: () => ({ current: null }),
}));

jest.mock("@/lib/api/fetchUserLocation", () => ({
  fetchUserLocation: jest.fn().mockResolvedValue({
    value: {
      location_id: "1",
      province: "Province",
      city: "City",
      suburb: "Suburb",
      district: "District",
    },
  }),
}));

jest.mock("@/lib/useMediaQuery", () => ({
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

jest.mock("@/components/FilterModal/FilterModal", () => () => (
  <div>FilterModal</div>
));

jest.mock("@/components/MobileIssueInput/MobileIssueInput", () => () => (
  <div>MobileIssueInput</div>
));

describe("Feed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Feed />);
    expect(screen.getByText("No issues")).toBeInTheDocument();
  });

  // it("shows loading indicator while fetching data", async () => {
  //   const { rerender } = render(<Feed />);
  //   expect(screen.getByText("Spinner")).toBeInTheDocument();

  //   // Simulate the location data being loaded
  //   await waitFor(() => {
  //     expect(fetchUserLocation).toHaveBeenCalled();
  //   });

  //   rerender(<Feed />);
  //   expect(screen.queryByText("Spinner")).not.toBeInTheDocument();
  // });

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
