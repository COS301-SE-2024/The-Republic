import React from "react";
import { describe, expect, beforeEach } from "@jest/globals";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SettingsPage from "@/components/Settings/Settings";
import { useToast } from "@/components/ui/use-toast";
import { signOutWithToast } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchUserData } from "@/lib/api/fetchUserData";


const queryClient = new QueryClient();

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

describe("SettingsPage", () => {
  beforeEach(() => {
    useToast.mockImplementation(() => ({ toast: jest.fn() }));
    (fetchUserData as jest.Mock).mockResolvedValue({ username: "testuser" });
  });

  it("renders correctly", async () => {
    render(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText("Account Settings")).toBeInTheDocument();
      expect(screen.getByText("Profile Settings")).toBeInTheDocument();
      expect(screen.getByText("Notification Settings")).toBeInTheDocument();
    });
  });

  it("toggles dropdowns", async () => {
    
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsPage />
      </QueryClientProvider>
    );
  
    
    const profileSettingsButton = await screen.findByText(/profile settings/i);
    fireEvent.click(profileSettingsButton);
  
    expect(screen.getByText("Current Username")).toBeInTheDocument();
  });
  
  

  it("calls signOutWithToast on sign out click", async () => {
    render(<SettingsPage />);
    await waitFor(() => {
      const signOutButton = screen.getByText("Sign out");
      fireEvent.click(signOutButton);
      expect(signOutWithToast).toHaveBeenCalled();
    });
  });
});
