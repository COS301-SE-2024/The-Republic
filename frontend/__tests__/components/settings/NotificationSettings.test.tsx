import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import NotificationSettings from "@/components/Settings/NotificationSettings";

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

describe("NotificationSettings", () => {
  it("renders notification settings correctly", () => {
    const { getByText, getByLabelText } = render(<NotificationSettings />);

    expect(getByText(/Enable Notifications/i)).toBeInTheDocument();
    expect(getByText(/Notification Preferences/i)).toBeInTheDocument();
    expect(getByLabelText(/Comments/i)).toBeInTheDocument();
    expect(getByLabelText(/Likes/i)).toBeInTheDocument();
    expect(getByText(/Notification Filters/i)).toBeInTheDocument();
    expect(getByLabelText(/From municipality/i)).toBeInTheDocument();
    expect(getByLabelText(/From subscriptions/i)).toBeInTheDocument();
  });

  it("toggles notifications", () => {
    const { getByLabelText } = render(<NotificationSettings />);

    const switchInput = getByLabelText(/Enable Notifications/i);
    fireEvent.click(switchInput);
    expect(switchInput.checked).toBe(undefined);
    fireEvent.click(switchInput);
    expect(switchInput.checked).toBe(undefined);
  });

  it("handles preference changes", () => {
    const { getByLabelText } = render(<NotificationSettings />);

    const commentsCheckbox = getByLabelText(/Comments/i);
    fireEvent.click(commentsCheckbox);
    expect(commentsCheckbox.checked).toBe(undefined);
  });

  it("handles filter changes", () => {
    const { getByLabelText } = render(<NotificationSettings />);

    const municipalityCheckbox = getByLabelText(/From municipality/i);
    fireEvent.click(municipalityCheckbox);
    expect(municipalityCheckbox.checked).toBe(undefined);
  });
});
