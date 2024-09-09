import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


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


jest.mock("@/lib/api/updateProfile", () => ({
  updateUsername: jest.fn(),
}));

const queryClient = new QueryClient();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe("ProfileSettings", () => {
  it("renders profile fields correctly", () => {
    render(
      <TestWrapper>
        <ProfileSettings currentUsername="testuser" />
      </TestWrapper>
    );
    expect(screen.getByText("Change Username")).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Username/i)).toBeInTheDocument();
  });

  it("handles role input change", () => {
    render(
      <TestWrapper>
        <ProfileSettings currentUsername="testuser" />
      </TestWrapper>
    );
    const usernameInput = screen.getByLabelText(/New Username/i);
    fireEvent.change(usernameInput, { target: { value: "newusername" } });
    expect(usernameInput).toHaveValue("newusername");
  });

  it("handles password input change", () => {
    render(
      <TestWrapper>
        <ProfileSettings currentUsername="testuser" />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/Change Password/i);
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    expect(passwordInput.value).toBe("newpassword");
  });

  it("saves profile changes", () => {
    render(
      <TestWrapper>
        <ProfileSettings currentUsername="testuser" />
      </TestWrapper>
    );
    const saveButton = screen.getByText(/Save Username/i);
    fireEvent.click(saveButton);
  });
});
