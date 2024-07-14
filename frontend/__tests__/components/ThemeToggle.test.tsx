import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { ModeToggle } from "@/components/ThemeToggle/ModeToggle";
import * as nextThemes from "next-themes";

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

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ModeToggle", () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (nextThemes.useTheme as jest.Mock).mockImplementation(() => ({
      setTheme: setThemeMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<ModeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it('calls setTheme with "light" when Light is clicked', async () => {
    render(<ModeToggle />);
    const lightButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });
    fireEvent.click(lightButton);

    await waitFor(() => {
      expect(setThemeMock).not.toBe("light");
    });
  });

  it('calls setTheme with "dark" when Dark is clicked', async () => {
    render(<ModeToggle />);
    const darkButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });
    fireEvent.click(darkButton);

    await waitFor(() => {
      expect(setThemeMock).not.toBe("dark");
    });
  });

  it('calls setTheme with "system" when System is clicked', async () => {
    render(<ModeToggle />);
    const systemButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });
    fireEvent.click(systemButton);

    await waitFor(() => {
      expect(setThemeMock).not.toBe("system");
    });
  });
});
