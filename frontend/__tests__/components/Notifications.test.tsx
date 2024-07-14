import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Notifications from "@/components/Notifications/Notifications";

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

describe("Notifications", () => {
  it("renders without crashing", () => {
    render(<Notifications />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});
