import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import mockLocation from "@/data/mockLocation";

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
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const setSortBy = jest.fn();
  const setFilter = jest.fn();
  const setLocation = jest.fn();

  it("renders without crashing", () => {
    render(
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
    render(
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
    render(
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
