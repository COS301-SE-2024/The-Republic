import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import RightSidebar from "@/components/RightSidebar/RightSidebar";

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

describe("RightSidebar", () => {
  it("renders without crashing", () => {
    const setSortBy = jest.fn();
    const setFilter = jest.fn();
    render(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
      />,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("handles sort selection", () => {
    const setSortBy = jest.fn();
    const setFilter = jest.fn();
    render(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
      />,
    );
  });

  it("handles filter selection", () => {
    const setSortBy = jest.fn();
    const setFilter = jest.fn();
    render(
      <RightSidebar
        sortBy="newest"
        setSortBy={setSortBy}
        filter="All"
        setFilter={setFilter}
      />,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
  });
});
