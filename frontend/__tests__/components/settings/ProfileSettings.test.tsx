import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import ProfileSettings from "@/components/Settings/ProfileSettings";

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

describe("ProfileSettings", () => {
  it("renders profile fields correctly", () => {
    const { getByLabelText, getByText } = render(<ProfileSettings />);

    expect(getByLabelText(/Your Role/i)).toBeInTheDocument();
    expect(getByLabelText(/Change Password/i)).toBeInTheDocument();
    expect(getByText(/Save Changes/i)).toBeInTheDocument();
  });

  it("handles role input change", () => {
    const { getByLabelText } = render(<ProfileSettings />);

    const roleInput = getByLabelText(/Your Role/i);
    fireEvent.change(roleInput, { target: { value: "City Planner" } });
    expect(roleInput.value).toBe("City Planner");
  });

  it("handles password input change", () => {
    const { getByLabelText } = render(<ProfileSettings />);

    const passwordInput = getByLabelText(/Change Password/i);
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    expect(passwordInput.value).toBe("newpassword");
  });

  it("saves profile changes", () => {
    const { getByText } = render(<ProfileSettings />);
    const saveButton = getByText(/Save Changes/i);
    fireEvent.click(saveButton);
  });
});
