import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import SettingsPage from "@/components/Settings/Settings";
import { useToast } from "@/components/ui/use-toast";
import { signOutWithToast } from "@/lib/utils";

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  cn: (...classes: string[]) => classes.join(" "),
  signOutWithToast: jest.fn(),
}));

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

describe("SettingsPage", () => {
  beforeEach(() => {
    useToast.mockImplementation(() => ({ toast: jest.fn() }));
  });

  it("renders correctly", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getAllByText("Profile Settings")).not.toBe(null);
    expect(screen.getByText("Request Verifications")).toBeInTheDocument();
    expect(screen.getByText("Notification Settings")).toBeInTheDocument();
  });

  it("toggles dropdowns", () => {
    render(<SettingsPage />);
    const profileSettingsButton = screen.getByText("Profile Settings");
    fireEvent.click(profileSettingsButton);

    fireEvent.click(profileSettingsButton);
    expect(
      screen
        .getByText("Profile Settings")
        .parentNode.querySelector(".dropdown-content"),
    ).toBeNull();
  });

  it("calls signOutWithToast on sign out click", () => {
    render(<SettingsPage />);
    const signOutButton = screen.getByText("Sign out");
    fireEvent.click(signOutButton);
    expect(signOutWithToast).toHaveBeenCalled();
  });
});
