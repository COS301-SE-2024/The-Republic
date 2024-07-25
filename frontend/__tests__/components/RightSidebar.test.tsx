import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import mockLocation from "@/data/mockLocation";
import { useUser } from "@/lib/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(() => ({
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
      access_token: "access_token_value",
    },
  })),
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

describe("RightSidebar", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({
      user: { access_token: "test-token" },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const setSortBy = jest.fn();
  const setFilter = jest.fn();
  const setLocation = jest.fn();

  it("renders without crashing", () => {
    renderWithClient(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
        location={mockLocation}
        setLocation={setLocation}
      />,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("handles sort selection", () => {
    const setSortBy = jest.fn();
    const setFilter = jest.fn();
    renderWithClient(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
        location={mockLocation}
        setLocation={setLocation}
      />,
    );
  });

  it("handles filter selection", () => {
    const setSortBy = jest.fn();
    const setFilter = jest.fn();
    renderWithClient(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
        location={mockLocation}
        setLocation={setLocation}
      />,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
  });
});
