import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";
import { useUser } from "@/lib/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/lib/api/updateProfile", () => ({
  changePassword: jest.fn(),
}));

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({
      user: {
        user_id: "user123",
        email_address: "user@example.com",
        username: "user123",
        fullname: "User Fullname",
        image_url: "http://example.com/image.jpg",
        bio: "User biography",
        is_owner: true,
        total_issues: 10,
        resolved_issues: 5,
        access_token: "access_token_value",
      },
    });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the form correctly", () => {
    renderWithClient(<ChangePasswordForm />);

    expect(screen.getByRole("heading", { name: "Change Password" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change Password" })).toBeInTheDocument();
  });

  it("displays an error when passwords don't match", async () => {
    renderWithClient(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "oldpass" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpass" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "differentpass" } });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(screen.getByText("New passwords do not match.")).toBeInTheDocument();
    });
  });

  it("displays an error when new password is too short", async () => {
    renderWithClient(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "oldpass" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "short" } });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters long.")).toBeInTheDocument();
    });
  });

  it("calls changePassword function when form is submitted correctly", async () => {
    const { changePassword } = require("@/lib/api/updateProfile");
    changePassword.mockResolvedValue({});
    renderWithClient(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "oldpass" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpassword" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newpassword" } });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({ currentPassword: "oldpass", newPassword: "newpassword" });
    });
  });

  it("displays success message when password is changed successfully", async () => {
    const { changePassword } = require("@/lib/api/updateProfile");
    changePassword.mockResolvedValue({});
    renderWithClient(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "oldpass" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpassword" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newpassword" } });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(screen.getByText("Password changed successfully! You will need to log in again.")).toBeInTheDocument();
    });
  });

  it("displays error message when changePassword function fails", async () => {
    const { changePassword } = require("@/lib/api/updateProfile");
    changePassword.mockRejectedValue({ message: "Current password is incorrect" });
    renderWithClient(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "wrongpass" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpassword" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newpassword" } });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(screen.getByText("Current password is incorrect")).toBeInTheDocument();
    });
  });
});