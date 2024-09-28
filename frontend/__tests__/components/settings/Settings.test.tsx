import React from "react";
import { describe, expect, beforeEach } from "@jest/globals";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SettingsPage from "@/components/Settings/Settings";
import { useToast } from "@/components/ui/use-toast";
import { signOutWithToast } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchUserData } from "@/lib/api/fetchUserData";
import { useUser } from "@/lib/contexts/UserContext";
import mockCurrentUser from "@/data/mockUser";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

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

jest.mock("@/lib/api/fetchUserData", () => ({
  fetchUserData: jest.fn(),
}));

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("SettingsPage", () => {
  beforeEach(() => {
    useToast.mockImplementation(() => ({ toast: jest.fn() }));
    (fetchUserData as jest.Mock).mockResolvedValue({ username: "testuser" });
    (useUser as jest.Mock).mockReturnValue({
      user: mockCurrentUser,
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly", async () => {
    renderWithClient(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(screen.getByText("Profile Settings")).toBeInTheDocument();
      expect(screen.getByText("Notification Settings")).toBeInTheDocument();
    });
  });

  it("toggles dropdowns", async () => {
    
    renderWithClient(
      <SettingsPage />
    );
  
    
    const profileSettingsButton = await screen.findByText(/profile settings/i);
    fireEvent.click(profileSettingsButton);
  
    expect(screen.getByText("Current Username")).toBeInTheDocument();
  });
  
  

  it("calls signOutWithToast on sign out click", async () => {
    renderWithClient(<SettingsPage />);
    await waitFor(() => {
      const signOutButton = screen.getByText("Sign out");
      fireEvent.click(signOutButton);
      expect(signOutWithToast).toHaveBeenCalled();
    });
  });
});
