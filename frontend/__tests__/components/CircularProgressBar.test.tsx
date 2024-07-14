import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import CircularProgress from "@/components/CircularProgressBar/CircularProgressBar";

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

describe("CircularProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (!message.includes("specific error message to ignore")) {
        // No action taken for the specific message
      }
    });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders correctly with charCount", () => {
    const { getByText } = render(<CircularProgress charCount={480} />);
    expect(getByText("20")).toBeInTheDocument();
  });

  it("shows the correct color for different charCount", () => {
    const { container, rerender } = render(
      <CircularProgress charCount={480} />,
    );
    const path = container.querySelector(".CircularProgressbar-path");
    expect(path).toHaveStyle("stroke: #ffad1f");

    rerender(<CircularProgress charCount={510} />);
    expect(path).toHaveStyle("stroke: #e0245e");
  });
});
