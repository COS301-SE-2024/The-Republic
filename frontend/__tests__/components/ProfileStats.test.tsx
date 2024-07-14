import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileStats from "@/components/ProfileStats/ProfileStats";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest
        .fn()
        .mockResolvedValue({
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

describe("ProfileStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders profile stats correctly", () => {
    render(
      <ProfileStats
        userId="1"
        totalIssues={10}
        resolvedIssues={5}
        selectedTab="issues"
        setSelectedTab={() => {}}
      />,
    );

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/Issues/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/Resolved/)).toBeInTheDocument();
  });

  it("handles tab click correctly", () => {
    const setSelectedTab = jest.fn();
    render(
      <ProfileStats
        userId="1"
        totalIssues={10}
        resolvedIssues={5}
        selectedTab="issues"
        setSelectedTab={setSelectedTab}
      />,
    );

    fireEvent.click(screen.getByText(/Resolved/));
    expect(setSelectedTab).toHaveBeenCalledWith("resolved");
  });
});
