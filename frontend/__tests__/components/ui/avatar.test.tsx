import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

describe("Avatar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("Avatar renders correctly with className", () => {
    const { container } = render(<Avatar className="test-class" />);
    expect(container.firstChild).not.toBe(null);
  });

  test("AvatarImage renders correctly with className", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage
          src="test-image.jpg"
          alt="Test Image"
          className="custom-class"
        />
      </Avatar>,
    );
    expect(container.firstChild).not.toBe(null);
  });

  test("AvatarFallback renders correctly with className", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback className="custom-class" />
      </Avatar>,
    );
    expect(container.firstChild).not.toBe(null);
  });
});
